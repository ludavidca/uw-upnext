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
import json
import pandas as pd
from enum import Enum, auto
import re
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import random
import requests

load_dotenv()

webpage = requests.get("https://wusa.ca/events/")
jsonscript =str(webpage.content)
isolatedinformation=jsonscript.split('<script type="application/ld+json">')[1].split("</script>")[0][4:-4].encode("utf16", errors="surrogatepass").decode("utf16").encode().decode('unicode_escape')

json = json.loads(isolatedinformation.replace('&lt;p&gt;',"").replace("[&hellip;]&lt;/p&gt;\\\\n",""))

wusaDf ={}
postscolumns = ['account','date','caption',"display_photo",'event_details']
wusaDf = pd.DataFrame(columns = postscolumns)

import time

time_now = int(time.time())
for event in json:
    if int(datetime.datetime.fromisoformat(event["startDate"]).timestamp()) >= time_now:
        try: 
            location = event["location"]["address"]["streetAddress"]
        except Exception as err:
            print(str(err))
            location = None
        
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

together_api_key = os.getenv('TOGETHER_API')


#code for embedding
embedding_model_string = 'WhereIsAI/UAE-Large-V1' # model API string from Together.

def generate_embedding(input_texts: List[str], model_api_string: str) -> List[List[float]]:
  together_client = Together(api_key=together_api_key)
  outputs = together_client.embeddings.create(
      input=input_texts,
      model=model_api_string,
  )
  return [x.embedding for x in outputs.data]

insertObjectIds = []

uri = os.getenv('DATABASE_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Instagram']
collection = db["Events"]

# Remove all documents with these IDs
result = collection.delete_many({'account': "WUSA"})

# Print the number of documents deleted
print(f"Documents removed: {result.deleted_count}")

for index, row in wusaDf.iterrows():
    info = f'"id": "{int(index)}"|* "account": "{row["account"]}"|* "date": "{row["date"]}"|* "caption": "{row["caption"]}"|*'
    embbededtext = ',\n'.join(x for x in info.replace('\n','\\n').split('|*')) 

    row_dict = {}
    for column in wusaDf.columns.tolist():
        row_dict[column] = row[column]
    row_dict["embedded"] = generate_embedding([embbededtext], embedding_model_string)  
    result = collection.insert_one(row_dict)
    print(f"Inserted document ID: {result.inserted_id}")
    insertObjectIds.append(result.inserted_id)
    time.sleep(1)


def scrape_handle(L, handle, cutoffdate):
    max_retries = 3
    retry_count = 0
    posts_data = []

    while retry_count < max_retries:
        try:
            profile = instaloader.Profile.from_username(L.context, handle)
            for post in profile.get_posts():
                if post.date > cutoffdate:
                    photo_caption = post.accessibility_caption if post.accessibility_caption is not None else ""
                    caption = post.caption if post.caption is not None else ""
                    posts_data.append({
                        'url': post.shortcode,
                        'likes': post.likes,
                        'display_photo': post.url,
                        'account': handle.replace('\"','\\\"'),
                        'date': post.date,
                        'caption': caption.replace("\n",""),
                        'accessibility_caption': photo_caption.replace("\n",""),
                    })
                else:
                    break
            return posts_data
        except (instaloader.exceptions.InstaloaderException, RequestException) as e:
            retry_count += 1
            logging.error(f"Error scraping {handle} (attempt {retry_count}/{max_retries}): {str(e)}")
            if retry_count < max_retries:
                logging.info(f"Retrying {handle}...")
                time.sleep(random.randrange(300, 400))  # Wait for 5 seconds before retrying
            else:
                logging.error(f"Max retries reached for {handle}. Moving to next handle.")
    return []

def scrape_instagram():
    cutoffdate = datetime.datetime.today() - datetime.timedelta(days=30)
    handles = ['uwengsoc','uwcsa','uw_ux','uwblueprint','uwaterlooeng','uwaterloottc','uwaterloodsc','uwaterloopm','uwmcc','gdscwaterloo','uwsmileclub','socratica.info','yourwusa','wataiteam','uwawscloud','techplusuw','itshera.co','uwstartups','electriummobility','uwhiphop','uwaterloo_ksa','uw_aviation','uwaterloopm','uwmcc','uwmsa','gdscwaterloo','waterloo_ultimate','uwcheeseclub','uwstreetdance','uwmidsun','watolink_uw','uwaterlooeng','uwpokerclub','uwaterloocycling','uwaterloobsa','uw_phys_club','uw.gsa','uwcsclub','uwfintech','uwaterloosc','uwactsciclub','uwstatsclub','waterloo.frosh','wat.street','waterlooblockchain','waterloo.ai','uw_watsam','uwrealitylabs','uwafow','uwmuaythai','uw.farmsa','uw_bmsa','uwtsa','uwmariokart','uwhiphop','uw.movie.watchers','uwbeautyclub','uwteaclub','uw_urc','uw.dhamaka']
    random.shuffle(handles)
    postsDf = pd.DataFrame()

    L = instaloader.Instaloader()
    
    for handle in handles:
        logging.info(f"Scraping {handle}")
        handle_data = scrape_handle(L, handle, cutoffdate)
        if handle_data:
            postsDf = pd.concat([postsDf, pd.DataFrame(handle_data)], ignore_index=True)
        time.sleep(random.randrange(12000/len(handles),18000/len(handles),18000))  # Delay between handles to avoid rate limiting
    return postsDf

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    try:
        result = scrape_instagram()
        print(result)
        logging.info("Scraping completed successfully.")
        return result
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    postsDf = main()

togetherAPI = os.getenv('TOGETHER_API')
client = Together(api_key=togetherAPI)

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
        messages=[{"role": "user", "content": f'Does the following instagram post contain a club event with a specified time. RETURN Yes or No: {currentjson}'}],
        max_tokens=2
    )
    print(response.choices[0].message.content)
    is_event = check_string(response.choices[0].message.content)
    postsDf.at[index, "is_event"] = is_event

togetherAPI = os.getenv('TOGETHER_API')
client = Together(api_key=togetherAPI)

basePrompt = open("C:/Users/david/Desktop/uw-upnext/WebScraper/basePrompt.in","r", encoding = "utf-8").read()

postsDf = pd.read_csv("C:/Users/david/Desktop/uw-upnext/WebScraper/preliminaryProcessedInformation.csv")

basePrompt = open("basePrompt.in","r", encoding = "utf-8").read()

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
    event_categories: list[str] = Field(description='Categorize the Event into one of the following: TECH, DESIGN, SOCIAL, MUSIC, CULTURE, SPORTS, NETWORK, GAMING')
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

postsDf = pd.read_csv("preliminaryProcessedInformation.csv")

postsDf["event_details"] = pd.NA


for index, row in postsDf.iterrows():
    if postsDf.at[index, "is_event"]== True:
        event_details = return_event_details(str(postsDf.at[index, "processed_json"]))
        print(index, event_details)
        if event_details["event_name"] == None or event_details["start_time"] == None or event_details["end_time"] == None:
            postsDf.at[index, "is_event"] = False
            postsDf.at[index, "event_details"] = None
        else:
            postsDf.at[index, "event_details"] = event_details
    else: print(index, "no event detected")


uri = os.getenv('DATABASE_URI')
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Instagram']
collection = db["Events"]



postsDf.reset_index(drop=True)
postsDf = postsDf.fillna(value="None")
postsDf.drop(postsDf.columns[postsDf.columns.str.contains(
    'unnamed', case=False)], axis=1, inplace=True)

for index, row in postsDf.iterrows():
    if row["is_event"] == True:
      row_dict = {}
      row_dict = eval(row["event_details"])
      try:
        conStart = datetime.datetime.fromisoformat(row_dict["start_time"])
        unixStart = time.mktime(conStart.timetuple())
        try:
          conEnd = datetime.datetime.fromisoformat(row_dict["end_time"])
          unixEnd = time.mktime(conEnd.timetuple())
        except:
          conEnd = None
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
embedding_model_string = 'WhereIsAI/UAE-Large-V1' # model API string from Together.

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