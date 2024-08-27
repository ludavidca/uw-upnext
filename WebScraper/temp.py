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

postsDf = pd.read_csv("WebScraper\instagram_raw.csv")
postsDf["is_event"] = pd.NA

processedjson = []

def check_string(input_string):
    if any(word in input_string for word in ['yes', 'Yes', 'True', 'true']):
        return True
    elif any(word in input_string for word in ['no', 'No', 'False', 'false']):
        return False
    else:
        return False  # This handles cases where none of the words are found


cnt=0
for index, row in postsDf.iterrows():
    currentjson = f'"account": "{row["account"]}"|* "caption": "{row["caption"]}"|* "photo_caption": "{row["accessibility_caption"]}"'
    post = "{" + ',\n'.join(x for x in currentjson.replace('\n','\\n').split('|*')) + '}' 
    postsDf.at[index, "processedjson"] = post
    response = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages=[{"role": "user", "content": f'Does the following instagram post contain a club event attended by the public with start time and end time. RETURN Yes or No: {post}'}],
        max_tokens=2
    )
    is_event = check_string(response.choices[0].message.content)
    postsDf.at[index, "is_event"] = is_event
    if index >2: break

postsDf.reset_index(drop=True) 
postsDf.to_csv("Webscraper\preliminaryProcessedInformation.csv")


print(postsDf)