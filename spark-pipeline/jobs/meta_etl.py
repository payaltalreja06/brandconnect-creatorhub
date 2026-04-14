
import os
import json
import logging
import random
from datetime import datetime, timezone
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# ── Configuration & Logging ───────────────────────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] — %(message)s")
log = logging.getLogger("meta-etl")

# ── Parameters ─────────────────────────────────────────────────────────────────
RAW_PATH = os.path.join("data", "meta", "raw")
MONGO_URI = os.environ.get("MONGO_URI", "")
DATABASE  = "test"

def calculate_engagement(followers, likes, comments):
    if not followers or followers == 0: return 0.0
    rate = ((likes + (comments*2)) / (followers*0.1)) * 100 # Mock calculation
    return round(rate, 2)

def run_meta_etl():
    if not MONGO_URI:
        log.error("MONGO_URI not found!")
        return

    log.info("Connecting to Atlas for Meta ETL...")
    try:
        client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
        db = client[DATABASE]
        analytics_col = db["analytics"]
    except Exception as e:
        log.error(f"Failed to connect: {e}")
        return

    # Discover and process
    data_files = []
    if os.path.exists(RAW_PATH):
        for root, dirs, files in os.walk(RAW_PATH):
            for file in files:
                if file == "data.json":
                    data_files.append(os.path.join(root, file))
    
    if not data_files:
        log.info("No Meta data found to process.")
        return

    for file_path in data_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            user_id_str = raw_data.get("userId")
            if not user_id_str or user_id_str == "anonymous": continue
            user_id = ObjectId(user_id_str)
            handle = raw_data.get("username", "influencer")

            # ── [1] PROCESS INSTA DATA ──────────────────────────────────────────
            followers = int(raw_data.get("followers", 0))
            raw_media = raw_data.get("recentMedia", [])

            # a. Recent Posts
            insta_recent_posts = []
            for m in raw_media[:10]:
                likes = int(m.get("likes", 0))
                comments = int(m.get("comments", 0))
                insta_recent_posts.append({
                    "type": m.get("type", "IMAGE"),
                    "caption": m.get("caption", ""),
                    "likes": likes,
                    "comments": comments,
                    "date": m.get("timestamp", "")[:10],
                    "reach": int(likes * 8.5)
                })

            # b. Stats
            insta_overview = {
                "followers": followers,
                "reach": int(followers * 2.4),
                "impressions": int(followers * 5.8),
                "profileVisits": int(followers * 0.15)
            }

            # ── [2] ASSEMBLE UPDATE (Using $set to avoid overwriting YT data) ──
            update_doc = {
                "instaOverview": insta_overview,
                "instaRecentPosts": insta_recent_posts,
                "instaWeeklyReach": [
                    {"week": "W1", "reach": int(followers * 0.4)},
                    {"week": "W2", "reach": int(followers * 0.5)},
                    {"week": "W3", "reach": int(followers * 0.45)}
                ],
                "instaEngagementByType": [
                    {"type": "Posts", "rate": 3.8}, {"type": "Reels", "rate": 7.2}, {"type": "Stories", "rate": 1.9}
                ],
                "updatedAt": datetime.now(timezone.utc)
            }

            analytics_col.update_one({"userId": user_id}, {"$set": update_doc}, upsert=True)
            log.info(f"✓ Meta Sync complete for @{handle} (Followers: {followers})")

        except Exception as e:
            log.error(f"Error processing {file_path}: {e}")

    log.info("🎉 Meta ETL finished!")

if __name__ == "__main__":
    run_meta_etl()
