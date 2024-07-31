from together import Together
import os
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import json
import pandas as pd
from enum import Enum, auto
import re

load_dotenv()
togetherAPI = os.getenv('TOGETHER_API')
client = Together(api_key=togetherAPI)

basePrompt = open("C:/Users/david/Desktop/uw-upnext/WebScraper/basePrompt.in","r", encoding = "utf-8").read()

postsDf = pd.read_csv("C:/Users/david/Desktop/uw-upnext/WebScraper/instagram_raw.csv")

processedjson = []

for index, row in postsDf.iterrows():
    currentjson = f'"id": "{int(row["id"])}"|* "account": "{row["account"]}"|* "date": "{row["date"]}"|* "caption": "{row["caption"]}"|* "photo_caption": "{row["accessibility_caption"]}"'
    post = "{" + ',\n'.join(x for x in currentjson.replace('\n','\\n').split('|*')) + '}' 
    processedjson.append(post)

print("info loaded")


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
    MUSIC = auto()
    ENTERTAINMENT = auto()
    CULTURE = auto()
    SPORTS = auto()
    WELLNESS = auto()
    GAMING = auto()

class Event(BaseModel):
    return_id: str = Field(description="return id of event")
    is_event: bool = Field(description="if the post contains an event")
    event_name: str = Field(description="name of event")
    event_description: str = Field(description='concise 20 word summary of what the event is, skip time or location')
    event_categories: Category = Field(description='Categorize into one of the following: TECH, DESIGN, MUSIC, ENTERTAINMENT, CULTURE, SPORTS, WELLNESS, GAMING')
    start_time: str = Field(description="start time of event")
    end_time: str = Field(description="end time of event")
    location: str = Field(description= "location of event")



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
        ],
    )
    created_event = json.loads(chat_completion.choices[0].message.content)
    return created_event


print(return_event_details(processedjson[35]))