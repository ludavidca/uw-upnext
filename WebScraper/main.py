import instaloader
import pandas as pd
import datetime
import time
import logging
from requests.exceptions import RequestException
from typing import List
import json
from together import Together
import os
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from enum import Enum, auto
import re
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import random
import requests

# Load environment variables
load_dotenv()

# Fetch event data from WUSA webpage
webpage = requests.get("https://wusa.ca/events/")
jsonscript = str(webpage.content)
isolated_information = jsonscript.split('<script type="application/ld+json">')[1].split("</script>")[0][4:-4].encode("utf16", errors="surrogatepass").decode("utf16").encode().decode('unicode_escape')
event_json = json.loads(isolated_information.replace('&lt;p&gt;', "").replace("[&hellip;]&lt;/p&gt;\\\\n", ""))

# Initialize DataFrame
posts_columns = ['account', 'date', 'caption', 'display_photo', 'event_details']
wusa_df = pd.DataFrame(columns=posts_columns)

# Filter and process events
time_now = int(time.time())
for event in event_json:
    if int(datetime.datetime.fromisoformat(event["startDate"]).timestamp()) >= time_now:
        try:
            location = event["location"]["address"]["streetAddress"]
        except KeyError as e:
            logging.error(f"Location not found: {str(e)}")
            location = None
        
        new_row = pd.DataFrame({
            "account": ["WUSA"],
            "date": [time_now],
            "caption": f"{event['description']} [For More Information, Click View Post]",
            "display_photo": event["image"],
            "url": [event['url']],
            "likes": [0],
            "event_details": [{
                "is_event": True,
                "event_name": event["name"],
                "event_description": f"{event['description']} ...",
                "categories": ["Social"],
                "start_time": int(datetime.datetime.fromisoformat(event["startDate"]).timestamp()),
                "end_time": int(datetime.datetime.fromisoformat(event["endDate"]).timestamp()),
                "location": location,
            }]
        })
        wusa_df = pd.concat([wusa_df, new_row], ignore_index=True)

# Setup Together API and MongoDB
together_api_key = os.getenv('TOGETHER_API')
uri = os.getenv('DATABASE_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Instagram']
collection = db["Events"]

# Remove previous documents for WUSA
result = collection.delete_many({'account': "WUSA"})
logging.info(f"Documents removed: {result.deleted_count}")

# Function to generate embeddings
def generate_embedding(input_texts: List[str], model_api_string: str) -> List[List[float]]:
    together_client = Together(api_key=together_api_key)
    outputs = together_client.embeddings.create(
        input=input_texts,
        model=model_api_string,
    )
    return [x.embedding for x in outputs.data]

# Insert new events into MongoDB
for index, row in wusa_df.iterrows():
    info = f'"id": "{int(index)}"|* "account": "{row["account"]}"|* "date": "{row["date"]}"|* "caption": "{row["caption"]}"|*'
    embedded_text = ',\n'.join(x for x in info.replace('\n', '\\n').split('|*'))
    
    embedding_model_string = 'WhereIsAI/UAE-Large-V1'
    row_dict = row.to_dict()
    row_dict["embedded"] = generate_embedding([embedded_text], embedding_model_string)
    result = collection.insert_one(row_dict)
    logging.info(f"Inserted document ID: {result.inserted_id}")
    time.sleep(1)

# Function to scrape Instagram handle
def scrape_handle(L, handle, cutoffdate):
    max_retries = 3
    retry_count = 0
    posts_data = []

    while retry_count < max_retries:
        try:
            profile = instaloader.Profile.from_username(L.context, handle)
            for post in profile.get_posts():
                if post.date > cutoffdate:
                    photo_caption = post.accessibility_caption if post.accessibility_caption else ""
                    caption = post.caption if post.caption else ""
                    posts_data.append({
                        'url': post.shortcode,
                        'likes': post.likes,
                        'display_photo': post.url,
                        'account': handle.replace('\"', '\\\"'),
                        'date': post.date,
                        'caption': caption.replace("\n", ""),
                        'accessibility_caption': photo_caption.replace("\n", ""),
                    })
                else:
                    break
            return posts_data
        except (instaloader.exceptions.InstaloaderException, RequestException) as e:
            retry_count += 1
            logging.error(f"Error scraping {handle} (attempt {retry_count}/{max_retries}): {str(e)}")
            if retry_count < max_retries:
                logging.info(f"Retrying {handle}...")
                sleep_time = random.randrange(300, 400)
                time.sleep(sleep_time)  # Wait before retrying
            else:
                logging.error(f"Max retries reached for {handle}. Moving to next handle.")
    return []

# Function to scrape Instagram
def scrape_instagram():
    cutoffdate = datetime.datetime.today() - datetime.timedelta(days=30)
    handles = ['uwengsoc', 'uwcsa', 'uw_ux', 'uwblueprint', 'uwaterlooeng', 'uwaterloottc', 'uwaterloodsc', 'uwaterloopm',
               'uwmcc', 'gdscwaterloo', 'uwsmileclub', 'socratica.info', 'yourwusa', 'wataiteam', 'uwawscloud',
               'techplusuw', 'itshera.co', 'uwstartups', 'electriummobility', 'uwhiphop', 'uwaterloo_ksa', 'uw_aviation',
               'uwaterloopm', 'uwmsa', 'waterloo_ultimate', 'uwcheeseclub', 'uwstreetdance', 'uwmidsun', 'watolink_uw',
               'uwaterlooeng', 'uwpokerclub', 'uwaterloocycling', 'uwaterloobsa', 'uw_phys_club', 'uw.gsa', 'uwcsclub',
               'uwfintech', 'uwaterloosc', 'uwactsciclub', 'uwstatsclub', 'waterloo.frosh', 'wat.street', 'waterlooblockchain',
               'waterloo.ai', 'uw_watsam', 'uwrealitylabs', 'uwafow', 'uwmuaythai', 'uw.farmsa', 'uw_bmsa', 'uwtsa',
               'uwmariokart', 'uwhiphop', 'uw.movie.watchers', 'uwbeautyclub', 'uwteaclub', 'uw_urc', 'uw.dhamaka']
    random.shuffle(handles)
    posts_df = pd.DataFrame()

    L = instaloader.Instaloader()
    
    for handle in handles:
        logging.info(f"Scraping {handle}")
        handle_data = scrape_handle(L, handle, cutoffdate)
        if handle_data:
            posts_df = pd.concat([posts_df, pd.DataFrame(handle_data)], ignore_index=True)
        sleep_time = random.randrange(12000 // len(handles), 18000 // len(handles))
        time.sleep(sleep_time)  # Delay between handles to avoid rate limiting
    return posts_df

# Main function
def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    try:
        result = scrape_instagram()
        logging.info("Scraping completed successfully.")
        return result
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    posts_df = main()

# Function to check strings for event-related words
def check_string(input_string: str) -> bool:
    return any(word in input_string for word in ['yes', 'Yes', 'True', 'true'])

# Process Instagram posts for events
for index, row in posts_df.iterrows():
    current_json = f"'account': '{row['account']}'; 'caption': '{row['caption']}'; 'photo_caption': '{row['accessibility_caption']}'"
    posts_df.at[index, "processed_json"] = current_json
    response = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages=[{"role": "user", "content": f'Does the following Instagram post contain a club event with a specified time? RETURN Yes or No: {current_json}'}],
        max_tokens=2
    )
    is_event = check_string(response.choices[0].message.content)
    posts_df.at[index, "is_event"] = is_event

# Enum and model definitions
class Category(Enum):
    TECH = auto()
    DESIGN = auto()
    SOCIAL = auto()
    ENTERTAINMENT = auto()
    CULTURE = auto()
    SPORTS = auto()
    NETWORKING = auto()
    GAMING = auto()

class Event(BaseModel):
    is_event: bool = Field(description="Whether the post contains an event")
    event_name: str = Field(description="The Name of the Event")
    event_description: str = Field(description="The Description of the Event")
    categories: List[Category] = Field(description="List of Categories")
    start_time: int = Field(description="Start Time (Unix Timestamp)")
    end_time: int = Field(description="End Time (Unix Timestamp)")
    location: str = Field(description="Location of Event")
    url: str = Field(description="Link to the Event")

class Post(BaseModel):
    account: str = Field(description="The account that made the post")
    date: int = Field(description="Date the post was made (Unix Timestamp)")
    caption: str = Field(description="The Caption on the post")
    display_photo: str = Field(description="The Link to the Display Photo")
    event_details: Event = Field(description="The Event the Post Contains")

# Save DataFrame to JSON file
posts_df.to_json("Posts.json")