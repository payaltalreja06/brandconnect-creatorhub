
import os
import json
import logging
import argparse
from datetime import datetime
from pathlib import Path
import urllib.request
import urllib.parse
from dotenv import load_dotenv

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("meta-fetch")

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
META_RAW_BASE = SCRIPT_DIR / "data" / "meta" / "raw"

FB_API_BASE = "https://graph.facebook.com/v19.0"

def fb_get(endpoint: str, params: dict, access_token: str) -> dict:
    params["access_token"] = access_token
    url = f"{FB_API_BASE}/{endpoint}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        log.error(f"Meta API error: {e}")
        return {}

def get_instagram_accounts(access_token: str):
    log.info("Fetching linked Instagram Business Accounts...")
    data = fb_get("me/accounts", {"fields": "name,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}"}, access_token)
    
    accounts = []
    for page in data.get("data", []):
        insta = page.get("instagram_business_account")
        if insta:
            accounts.append(insta)
            log.info(f"Found IG Account: @{insta.get('username')} (ID: {insta.get('id')})")
    return accounts

def fetch_media_insights(insta_id: str, access_token: str):
    log.info(f"Fetching recent media for IG ID: {insta_id}...")
    endpoint = f"{insta_id}/media"
    data = fb_get(endpoint, {"fields": "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count", "limit": "10"}, access_token)
    
    media = []
    for item in data.get("data", []):
        media.append({
            "id": item.get("id"),
            "caption": item.get("caption", ""),
            "type": item.get("media_type"),
            "likes": item.get("like_count", 0),
            "comments": item.get("comments_count", 0),
            "timestamp": item.get("timestamp"),
            "url": item.get("permalink")
        })
    return media

def discover_influencers(mongo_uri: str) -> list[dict]:
    try:
        from pymongo import MongoClient
    except ImportError:
        return []
    client = MongoClient(mongo_uri)
    db = client.get_database() 
    users = list(db.users.find({"role": "influencer", "email": {"$regex": "@gmail\\.com$"}}, {"_id": 1}))
    user_ids = [u["_id"] for u in users]
    profiles = list(db.influencerprofiles.find({"userId": {"$in": user_ids}, "instagram": {"$ne": ""}}, {"userId": 1, "instagram": 1, "name": 1}))
    return profiles

def main():
    load_dotenv()
    token = os.getenv("FB_ACCESS_TOKEN")
    mongo_uri = os.getenv("MONGO_URI")

    if not token:
        log.error("No FB_ACCESS_TOKEN found in .env!")
        return

    ig_accounts = get_instagram_accounts(token)
    if not ig_accounts:
        log.warning("No linked Instagram accounts found. Using mock data for demo if handle exists.")
    
    influencers = discover_influencers(mongo_uri)
    date_str = datetime.now().strftime("%Y-%m-%d")

    for influencer in influencers:
        handle = influencer.get("instagram", "").strip().lower().lstrip("@")
        user_id = str(influencer.get("userId"))
        name = influencer.get("name")

        # Try to find real account
        acc = next((a for a in ig_accounts if a.get("username", "").lower() == handle), None)
        
        if acc:
            media = fetch_media_insights(acc["id"], token)
            payload = {
                "userId": user_id,
                "platform": "instagram",
                "username": acc.get("username"),
                "name": acc.get("name"),
                "followers": acc.get("followers_count", 0),
                "mediaCount": acc.get("media_count", 0),
                "recentMedia": media,
                "fetchedAt": datetime.now().isoformat()
            }
        else:
           
            payload = {
                "userId": user_id,
                "platform": "instagram",
                "username": handle,
                "name": name,
                "followers": 12500, # Mock
                "mediaCount": 42,
                "recentMedia": [],
                "fetchedAt": datetime.now().isoformat(),
                "is_mock": True
            }

        save_dir = META_RAW_BASE / handle / date_str
        save_dir.mkdir(parents=True, exist_ok=True)
        with open(save_dir / "data.json", "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=4)
        log.info(f"💾 Saved data for @{handle} in {save_dir}")

if __name__ == "__main__":
    main()
