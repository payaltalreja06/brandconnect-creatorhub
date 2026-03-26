import os
import json
import logging
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.models import Variable
from pymongo import MongoClient
from googleapiclient.discovery import build
import certifi

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configuration ---
MONGO_URI = os.getenv("MONGO_URI")
YT_API_KEY = os.getenv("YT_API_KEY")
BASE_DATA_DIR = "/opt/airflow/data/yt/raw"

def fetch_youtube_data():
    """Fetches YouTube channel statistics and videos for non-dummy users."""
    if not MONGO_URI or not YT_API_KEY:
        logger.error("Missing MONGO_URI or YT_API_KEY environment variables.")
        return

    # 1. Connected to MongoDB to find influencers
    # Bypassing SSL verification for the prototype demo to ensure connection
    client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
    db = client.get_database() # or get_database("test") 
    
    # Filter influencers: role is 'influencer' and email does not contain @collabrix.com
    # Also ensure they have a 'youtube' channel handle or ID
    influencers = list(db.influencerprofiles.aggregate([
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$match": {
                "user.email": {"$regex": "@gmail\.com$"},
                "youtube": {"$ne": ""}
            }
        }
    ]))

    if not influencers:
        logger.info("No real influencers found for synchronization.")
        return

    logger.info(f"Found {len(influencers)} influencers to fetch data for.")

    # 2. Build YouTube Service
    youtube = build("youtube", "v3", developerKey=YT_API_KEY)

    # 3. Iterate and Fetch Data
    for infl in influencers:
        channel_query = infl.get("youtube") # Handle like @TechnicalGuruji or ID UC...
        channel_name = infl.get("name", "Unknown")
        user_id = infl.get("userId")
        
        logger.info(f"Fetching data for: {channel_name} ({channel_query})")

        try:
            # A. Resolve Channel ID
            if channel_query.startswith("@"):
                # Search by handle
                search_res = youtube.search().list(
                    q=channel_query, part="id", type="channel", maxResults=1
                ).execute()
                if not search_res.get("items"):
                    logger.warning(f"Could not find channel for handle: {channel_query}")
                    continue
                channel_id = search_res["items"][0]["id"]["channelId"]
            else:
                channel_id = channel_query

            # B. Get Channel Stats
            ch_res = youtube.channels().list(
                part="snippet,statistics,brandingSettings", id=channel_id
            ).execute()
            if not ch_res.get("items"):
                logger.warning(f"No result found for channel ID: {channel_id}")
                continue
            
            ch_data = ch_res["items"][0]

            # C. Get Recent Videos
            vid_res = youtube.search().list(
                channelId=channel_id, part="id,snippet", order="date", type="video", maxResults=10
            ).execute()
            
            video_ids = [item["id"]["videoId"] for item in vid_res.get("items", [])]
            
            video_details = []
            if video_ids:
                v_res = youtube.videos().list(
                    part="snippet,statistics,contentDetails", id=",".join(video_ids)
                ).execute()
                video_details = v_res.get("items", [])

            # D. Output Structure
            payload = {
                "userId": str(user_id),
                "channelId": channel_id,
                "channelName": ch_data["snippet"]["title"],
                "description": ch_data["snippet"]["description"],
                "subscribers": int(ch_data["statistics"]["subscriberCount"]),
                "totalViews": int(ch_data["statistics"]["viewCount"]),
                "totalVideos": int(ch_data["statistics"]["videoCount"]),
                "avatar": ch_data["snippet"]["thumbnails"]["default"]["url"],
                "videos": [
                    {
                        "videoId": v["id"],
                        "title": v["snippet"]["title"],
                        "publishedAt": v["snippet"]["publishedAt"],
                        "views": int(v["statistics"].get("viewCount", 0)),
                        "likes": int(v["statistics"].get("likeCount", 0)),
                        "comments": int(v["statistics"].get("commentCount", 0)),
                        "duration": v["contentDetails"]["duration"]
                    } for v in video_details
                ],
                "fetchedAt": datetime.now().isoformat()
            }

            # E. Save locally: data/yt/raw/{channelName}/{YYYY-MM-DD}/data.json
            date_str = datetime.now().strftime("%Y-%m-%d")
            save_dir = os.path.join(BASE_DATA_DIR, channel_name.replace(" ", "_"), date_str)
            os.makedirs(save_dir, exist_ok=True)
            
            with open(os.path.join(save_dir, "data.json"), "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=4)
                
            logger.info(f"✓ Data saved for {channel_name} in {save_dir}")

        except Exception as e:
            logger.error(f"Error fetching data for {channel_name}: {str(e)}")

    client.close()

# --- DAG Definition ---
default_args = {
    'owner': 'brandconnect',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'youtube_fetcher',
    default_args=default_args,
    description='Fetches YouTube stats for registered influencers every 24h',
    schedule_interval=timedelta(days=1),
    catchup=False,
    tags=['youtube', 'extraction'],
) as dag:

    fetch_task = PythonOperator(
        task_id='fetch_youtube_data_task',
        python_callable=fetch_youtube_data,
    )

    fetch_task
