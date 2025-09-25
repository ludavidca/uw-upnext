import pandas as pd
import datetime 
import time
from requests.exceptions import RequestException
from typing import List
import json
from together import Together
import os
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import json
import pandas as pd
from enum import Enum, auto
import re
from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

basePrompt = open("WebScraper/Data/basePrompt.in","r", encoding = "utf-8").read()

load_dotenv()
togetherAPI = os.getenv('TOGETHER_API')
#Updating WUSA Events
webpage = requests.get("https://wusa.ca/events/")
jsonscript =str(webpage.content)
isolatedinformation=jsonscript.split('<script type="application/ld+json">')[1].split("</script>")[0][4:-4].encode("utf16", errors="surrogatepass").decode("utf16").encode().decode('unicode_escape')

WUSAjson = json.loads(isolatedinformation.replace('&lt;p&gt;',"").replace("[&hellip;]&lt;/p&gt;\\\\n",""))

wusaDf ={}
postscolumns = ['account','date','caption',"display_photo",'event_details']
wusaDf = pd.DataFrame(columns = postscolumns)

import time

time_now = int(time.time())
for event in WUSAjson:
    if int(datetime.datetime.fromisoformat(event["startDate"]).timestamp()) >= time_now:
        try: 
            location = event["location"]["address"]["streetAddress"]
        except Exception as err:
            print(str(err))
            location = None
        try:
            new_row = pd.DataFrame({
                    "account": ["WUSA"],
                    "date": [time_now],
                    "caption": str(event["description"])+" [For More Information, Click View Post] ",
                    "display_photo": event["image"],
                    "url": [event['url']],
                    "likes": [0],
                    "event_details": [{
                        "is_event": True,
                        "event_name": event["name"],
                        "event_description": str(event["description"])+" ... ",
                        "categories": ["Social"],
                        "start_time": int(datetime.datetime.fromisoformat(event["startDate"]).timestamp()),
                        "end_time": int(datetime.datetime.fromisoformat(event["endDate"]).timestamp()),
                        "location": location,
                    }]
            })
            wusaDf = pd.concat([wusaDf, new_row])
        except:
            print("failed row")

together_api_key = os.getenv('TOGETHER_API')


#code for embedding
embedding_model_string = 'BAAI/bge-large-en-v1.5' # model API string from Together.

def generate_embedding(input_texts: List[str], model_api_string: str) -> List[List[float]]:
  together_client = Together(api_key=together_api_key)
  outputs = together_client.embeddings.create(
      input=input_texts,
      model=model_api_string,
  )
  return [x.embedding for x in outputs.data]

insertObjectIds = []

# Set up MongoDB client
uri = os.getenv('DATABASE_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Instagram']
collection = db["Events"]

# Remove all documents with 'account': "WUSA"
try:
    result = collection.delete_many({'account': "WUSA"})
    print(f"Documents removed: {result.deleted_count}")
except errors.PyMongoError as e:
    print(f"Error deleting documents: {e}")

# Check and remove '_id' column if present
if '_id' in wusaDf.columns:
    print("DataFrame contains an '_id' column. It will be removed to prevent duplication.")
    wusaDf = wusaDf.drop(columns=['_id'])

for index, row in wusaDf.iterrows():
    # Construct the info string
    info = f'"id": "{int(index)}"|* "account": "{row["account"]}"|* "date": "{row["date"]}"|* "caption": "{row["caption"]}"|*'
    embeddedtext = ',\n'.join(x for x in info.replace('\n','\\n').split('|*')) 

    # Create the document dictionary
    row_dict = {column: row[column] for column in wusaDf.columns.tolist()}
    
    # Add the embedded field
    row_dict["embedded"] = generate_embedding([embeddedtext], embedding_model_string)
    
    # Remove '_id' if present to let MongoDB generate it
    row_dict.pop('_id', None)
    
    try:
        result = collection.insert_one(row_dict)
        print(f"Inserted document ID: {result.inserted_id}")
        insertObjectIds.append(result.inserted_id)
    except errors.DuplicateKeyError as e:
        print(f"DuplicateKeyError: {e}. Document skipped.")
    except errors.PyMongoError as e:
        print(f"An error occurred: {e}. Document skipped.")
    
    time.sleep(0.5)  # Adjust or remove delay as needed

# Optionally, print all inserted ObjectIds
print(f"All inserted document IDs: {insertObjectIds}")


#Validating if it is an event
load_dotenv()
togetherAPI = os.getenv('TOGETHER_API')
client = Together(api_key=togetherAPI)

postsDf = pd.read_csv("WebScraper\Data\instagram_raw.csv").replace('"','', regex=True)
postsDf["is_event"] = pd.NA
postsDf["processed_json"]=pd.NA

def check_string(input_string):
    if any(word in input_string for word in ['yes', 'Yes', 'True', 'true']):
        return True
    elif any(word in input_string for word in ['no', 'No', 'False', 'false']):
        return False
    else:
        return False  # This handles cases where none of the words are found


cnt=0
for index, row in postsDf.iterrows():
    currentjson = f"'account': '{row['account']}'; 'caption': '{row['caption']}'; 'photo_caption': '{row['accessibility_caption']}'"
    postsDf.at[index, "processed_json"] = currentjson
    response = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages=[{"role": "user", "content": f'Does the following instagram post contain a club event with a specified time. RETURN Yes or No only: {currentjson}'}],
        max_tokens=2
    )
    print(response.choices[0].message.content)
    is_event = check_string(response.choices[0].message.content)
    postsDf.at[index, "is_event"] = is_event


#Functions to Aid in LLM JSON data extraction


client = Together(api_key=togetherAPI)


def remove_emojis(text):
    # Unicode ranges for emojis
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

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
    event_description: str = Field(description='Concise 20 word summary of the event without time or location')
    event_categories: list[str] = Field(description='Categorize the Event into at least one or more of the following: TECH, DESIGN, SOCIAL, MUSIC, CULTURE, SPORTS, NETWORK, GAMING')
    start_time: str = Field(description="The Start time of Event in the format: yyyy-mm-ddTHH:MM:SS+00:00")
    end_time: str = Field(description="The End time of Event in the format: yyyy-mm-ddTHH:MM:SS+00:00")
    location: str = Field(description= "The location of event")

def return_event_details(inputJson : str):
    chat_completion = client.chat.completions.create(
    model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    response_format={"type": "json_object", "schema": Event.model_json_schema()},
    messages=[
        {
            "role": "system",
            "content": basePrompt,
        },
        {
            "role": "user",
            "content": "\n\n Input " + remove_emojis(inputJson) + "\n\n" + "Output",
        },
    ])
    
    created_event = json.loads(chat_completion.choices[0].message.content)
    return created_event

def extract_details_with_error_handling(inputJson, index):
        try: 
            created_event = return_event_details(inputJson)
            return created_event
        except Exception as err:
            print(str(err))
            return {'is_event': False, 'event_name': None, 'start_time': None, 'end_time': None, 'location': None}

postsDf["event_details"] = pd.NA

def download_instagram_image(url, folder_path):
    # Send a GET request to the Instagram post URL
    response = requests.get(url)
    
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the image URL (this may change if Instagram updates their HTML structure)
        image_url = soup.find('meta', property='og:image')['content']
        
        if image_url:
            # Download the image
            image_response = requests.get(image_url)
            
            if image_response.status_code == 200:
                # Create the folder if it doesn't exist
                os.makedirs(folder_path, exist_ok=True)
                
                # Generate a filename from the URL
                filename = os.path.basename(urlparse(image_url).path)
                file_path = os.path.join(folder_path, filename)
                
                # Save the image
                with open(file_path, 'wb') as file:
                    file.write(image_response.content)
                
                print(f"Image saved successfully: {file_path}")
            else:
                print("Failed to download the image.")
        else:
            print("Could not find the image URL in the Instagram post.")
    else:
        print("Failed to access the Instagram post.")


for index, row in postsDf.iterrows():
    if postsDf.at[index, "is_event"]== True:
        event_details = return_event_details(str(postsDf.at[index, "processed_json"]))
        print(index, event_details)
        if event_details["event_name"] == None or event_details["start_time"] == None or event_details["end_time"] == None:
            postsDf.at[index, "is_event"] = False
            postsDf.at[index, "event_details"] = None
        else:
            postsDf.at[index, "event_details"] = event_details
            imageurl = row["display_photo"]
            postID = row["url"]
            filepath = f'./public/InstagramImages/{postID}'
            download_instagram_image(imageurl, postID)
            break
    else: print(index, "no event detected")

#RAG Processing
import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import pandas as pd

load_dotenv()
uri = os.getenv('DATABASE_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Instagram']
collection = db["Events"]

#time conversion and edit formats
from datetime import datetime
import time

postsDf.reset_index(drop=True)
postsDf = postsDf.fillna(value="None")
postsDf.drop(postsDf.columns[postsDf.columns.str.contains(
    'unnamed', case=False)], axis=1, inplace=True)

for index, row in postsDf.iterrows():
    if row["is_event"] == True:
      row_dict = row["event_details"]
      try:
        conStart = datetime.fromisoformat(row_dict["start_time"])
        unixStart = time.mktime(conStart.timetuple()) + 7200
        try:
          conEnd = datetime.fromisoformat(row_dict["end_time"])
          unixEnd = time.mktime(conEnd.timetuple()) + 7200
        except:
          unixEnd = None
        row_dict["start_time"]=unixStart
        row_dict["end_time"]=unixEnd
      except:
        postsDf.at[index, "is_event"] = False
        err = f'Start failed {row_dict["start_time"]}'
        print(index, err)
      postsDf.at[index, "event_details"] = row_dict
      print(unixStart,unixEnd)

together_api_key = os.getenv('TOGETHER_API')


#code for embedding
embedding_model_string = 'BAAI/bge-large-en-v1.5' # model API string from Together.

def generate_embedding(input_texts: List[str], model_api_string: str) -> List[List[float]]:
  together_client = Together(api_key=together_api_key)
  outputs = together_client.embeddings.create(
      input=input_texts,
      model=model_api_string,
  )
  return [x.embedding for x in outputs.data]

for index, row in postsDf.iterrows():
    if row["is_event"] == True:
      row_dict = {}
      for column in postsDf.columns.tolist():
        if column in ['account','date','caption','accessibility_caption','url','likes','display_photo']:
          row_dict[column] = row[column]
      row_dict["embedded"] = generate_embedding([row["processed_json"]], embedding_model_string)  
      row_dict["event_details"] = row["event_details"]
      result = collection.insert_one(row_dict)
      print(f"Inserted document ID: {result.inserted_id}")
      time.sleep(1)

#Updating Events.json

def download_future_events_to_json(output_file):
    # Get current Unix timestamp
    current_timestamp = int(time.time())

    # Connect to MongoDB
    load_dotenv()
    uri = os.getenv('DATABASE_URI')
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client['Instagram']
    collection = db["Events"]

    # Query for future events
    query = {}
    future_events = list(collection.find(query))

    # Convert ObjectId to string for JSON serialization
    for event in future_events:
        event['_id'] = str(event['_id'])

    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(future_events, f, indent=2)

    # Close the MongoDB connection
    client.close()

    return future_events

# Usage
output_file = "../public/events.json"  # Name of the output JSON file

future_events = download_future_events_to_json(output_file)