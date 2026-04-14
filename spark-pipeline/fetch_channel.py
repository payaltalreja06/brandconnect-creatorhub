

import argparse
import json
import logging
import os
import re
import sys
from pathlib import Path

import urllib.request
import urllib.parse
import urllib.error
from dotenv import load_dotenv

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("yt-fetch")

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
RAW_BASE   = SCRIPT_DIR / "data" / "yt" / "raw"

YT_API_BASE = "https://www.googleapis.com/youtube/v3"


# ==============================================================================
# YouTube API helpers  (pure stdlib — no extra dependencies)
# ==============================================================================

def yt_get(endpoint: str, params: dict, api_key: str) -> dict:
    """Make a GET request to the YouTube Data API v3 and return parsed JSON."""
    params["key"] = api_key
    url = f"{YT_API_BASE}/{endpoint}?{urllib.parse.urlencode(params)}"
    log.debug(f"GET {url}")
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        log.error(f"YouTube API error {e.code}: {body}")
        raise


def sanitize_folder_name(name: str) -> str:
    """Convert a channel name to a safe folder name (no spaces/special chars)."""
    # Remove leading @ (handles like @MrBeast)
    name = name.lstrip("@")
    # Replace spaces with nothing, remove chars that are bad in paths
    name = re.sub(r"[^\w\-.]", "", name.replace(" ", ""))
    return name or "UnknownChannel"


def resolve_channel_id(query: str, api_key: str) -> tuple[str, str]:
    """
    Given a channel name, handle (@MrBeast), or ID (UCxxx...), return (channelId, channelName).
    Strategy:
      - If it looks like a channel ID (starts with UC, 24 chars) → use directly
      - If it starts with @ → search by handle
      - Otherwise → search by keyword
    """
    query = query.strip()

    # ── Already a channel ID ───────────────────────────────────────────────────
    if re.match(r"^UC[\w-]{22}$", query):
        log.info(f"'{query}' looks like a channel ID — looking up directly.")
        data = yt_get("channels", {
            "part": "snippet,statistics",
            "id":   query,
        }, api_key)
        items = data.get("items", [])
        if not items:
            raise ValueError(f"No channel found for ID: {query}")
        item = items[0]
        avatar_url = item["snippet"].get("thumbnails", {}).get("high", {}).get("url") or \
                     item["snippet"].get("thumbnails", {}).get("default", {}).get("url")
        return item["id"], item["snippet"]["title"], avatar_url

    # ── Handle or name search ──────────────────────────────────────────────────
    search_query = query.lstrip("@")
    log.info(f"Searching YouTube for channel: '{search_query}'")
    data = yt_get("search", {
        "part":       "snippet",
        "q":          search_query,
        "type":       "channel",
        "maxResults": "5",
    }, api_key)

    items = data.get("items", [])
    if not items:
        raise ValueError(f"No channel found for query: '{query}'")

    # Pick the first result
    item      = items[0]
    channel_id   = item["snippet"]["channelId"]
    channel_name = item["snippet"]["channelTitle"]
    avatar_url   = item["snippet"].get("thumbnails", {}).get("high", {}).get("url") or \
                   item["snippet"].get("thumbnails", {}).get("default", {}).get("url")
    
    log.info(f"Matched channel: '{channel_name}' ({channel_id})")
    return channel_id, channel_name, avatar_url


def fetch_channel_stats(channel_id: str, api_key: str) -> dict:
    """Fetch subscribers, total views, total video count for a channel."""
    data = yt_get("channels", {
        "part": "snippet,statistics",
        "id":   channel_id,
    }, api_key)
    items = data.get("items", [])
    if not items:
        raise ValueError(f"Could not fetch stats for channel ID: {channel_id}")
    stats = items[0]["statistics"]
    return {
        "subscribers": int(stats.get("subscriberCount", 0)),
        "totalViews":  int(stats.get("viewCount", 0)),
        "totalVideos": int(stats.get("videoCount", 0)),
    }


def fetch_videos(channel_id: str, api_key: str, max_videos: int = 30) -> list[dict]:
    """
    Fetch the most recent videos for a channel, with their stats.
    Returns a list of dicts matching the ETL schema.
    """
    # Step 1: get video IDs via search
    search_data = yt_get("search", {
        "part":       "snippet",
        "channelId":  channel_id,
        "maxResults": str(min(max_videos, 50)),
        "order":      "date",
        "type":       "video",
    }, api_key)

    items = search_data.get("items", [])
    if not items:
        log.warning(f"No videos found for channel {channel_id}")
        return []

    video_ids = [item["id"]["videoId"] for item in items]
    log.info(f"Found {len(video_ids)} video(s). Fetching stats...")

    # Step 2: get stats for all video IDs in one request
    stats_data = yt_get("videos", {
        "part": "snippet,statistics,contentDetails",
        "id":   ",".join(video_ids),
    }, api_key)

    videos = []
    for v in stats_data.get("items", []):
        stats   = v.get("statistics", {})
        snippet = v.get("snippet", {})
        details = v.get("contentDetails", {})
        videos.append({
            "videoId":     v["id"],
            "title":       snippet.get("title", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "views":       int(stats.get("viewCount",    0)),
            "likes":       int(stats.get("likeCount",    0)),
            "comments":    int(stats.get("commentCount", 0)),
            "duration":    details.get("duration", "PT0S"),   # ISO 8601 e.g. PT12M30S
        })

    return videos


# ==============================================================================
# Main — fetch one channel and write data.json
# ==============================================================================

def fetch_and_write(query: str, api_key: str, max_videos: int) -> Path:
    """
    Resolve query → fetch stats + videos → write data/yt/raw/{channelName}/data.json
    Returns the path of the written file.
    """
    # 1. Resolve channel
    channel_id, channel_name, avatar_url = resolve_channel_id(query, api_key)

    # 2. Fetch stats
    log.info(f"Fetching stats for '{channel_name}'...")
    stats = fetch_channel_stats(channel_id, api_key)

    # 3. Fetch videos
    videos = fetch_videos(channel_id, api_key, max_videos)

    # 4. Assemble payload
    payload = {
        "channelId":   channel_id,
        "channelName": channel_name,
        "avatar":      avatar_url,
        **stats,      # subscribers, totalViews, totalVideos
        "videos":     videos,
    }

    # 5. Write to data/yt/raw/{folderName}/data.json
    folder_name = sanitize_folder_name(channel_name)
    out_dir     = RAW_BASE / folder_name
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "data.json"

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    log.info(f"✓ Written: {out_file}  ({len(videos)} videos)")
    return out_file


# ==============================================================================
# 2.  MongoDB Discovery (Bulk Sync Mode)
# ==============================================================================

def discover_influencers(mongo_uri: str) -> list[str]:
    """
    Connect to MongoDB and find all influencers.
    Returns a list of YouTube channel IDs/handles.
    """
    try:
        from pymongo import MongoClient
    except ImportError:
        log.error("Sync Mode requires 'pymongo'. Install it: pip install pymongo")
        return []

    log.info("Connecting to MongoDB Atlas for discovery...")
    client = MongoClient(mongo_uri)
    db     = client["brandconnect"]

    # Get all influencers with @gmail.com emails
    users = list(db.users.find({
        "role": "influencer",
        "email": {"$regex": "@gmail\\.com$"}
    }, {"_id": 1}))

    user_ids = [u["_id"] for u in users]
    log.info(f"Found {len(user_ids)} influencers in database.")

    # 2. Find YouTube channels for these users
    profiles = db.influencerprofiles.find({
        "userId": {"$in": user_ids},
        "youtube": {"$ne": ""}
    }, {"youtube": 1, "name": 1})

    channels = []
    for p in profiles:
        yt = p.get("youtube", "").strip()
        if yt:
            channels.append(yt)

    log.info(f"Extracted {len(channels)} YouTube channels to sync.")
    return channels


# ==============================================================================
# CLI Entry Point
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Fetch YouTube channel data → data/yt/raw/{channelName}/data.json",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python fetch_channel.py --channel "MrBeast"
  python fetch_channel.py --sync  # Discovers channels from MongoDB Atlas
        """,
    )
    parser.add_argument(
        "--channel", "-c",
        action="append",
        metavar="NAME_OR_ID",
        help="YouTube channel name, @handle, or ID. Repeatable.",
    )
    parser.add_argument(
        "--sync", "-s",
        action="store_true",
        help="Bulk Sync Mode: Read influencer list from MongoDB Atlas.",
    )
    parser.add_argument(
        "--api-key", "-k",
        dest="api_key",
        default=os.environ.get("YT_API_KEY", ""),
        help="YouTube Data API v3 key. Defaults to $YT_API_KEY env variable.",
    )
    parser.add_argument(
        "--mongo-uri", "-m",
        dest="mongo_uri",
        default=os.environ.get("MONGO_URI", ""),
        help="MongoDB Connection URI. Defaults to $MONGO_URI.",
    )
    parser.add_argument(
        "--max-videos", "-n",
        type=int,
        default=30,
        help="Max number of videos to fetch per channel.",
    )

    args = parser.parse_args()

    # Try loading from .env if not provided or in env vars
    if not args.api_key:
        load_dotenv()
        args.api_key = os.environ.get("YT_API_KEY", "")

    if not args.api_key:
        log.error("No API key provided! Set $YT_API_KEY in environment or .env file.")
        sys.exit(1)

    # ── Resolve channels to fetch ──────────────────────────────────────────────
    queries = args.channel or []

    if args.sync:
        if not args.mongo_uri:
            log.error("Sync Mode requires $MONGO_URI or --mongo-uri.")
            sys.exit(1)
        queries.extend(discover_influencers(args.mongo_uri))

    if not queries:
        log.error("No channels to fetch! Use --channel or --sync.")
        sys.exit(1)

    success, failed = [], []
    for query in queries:
        try:
            path = fetch_and_write(query, args.api_key, args.max_videos)
            success.append((query, path))
        except Exception as exc:
            log.error(f"Failed to fetch '{query}': {exc}")
            failed.append(query)

    print("\n" + "═" * 60)
    print(f"✓ Success ({len(success)}): {[q for q, _ in success]}")
    if failed:
        print(f"✗ Failed  ({len(failed)}): {failed}")
    print("═" * 60)
    print(f"\nNext step → run the ETL:")
    print("  docker exec spark spark-submit /opt/spark/jobs/etl.py")
    print("  OR trigger via Airflow at http://localhost:8080\n")

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
