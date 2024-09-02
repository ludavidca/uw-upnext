import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import pandas as pd
import time
import json
from datetime import datetime

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
    query = {"events_details.start_time": {"$gte": int(current_timestamp/1000)}}
    future_events = list(collection.find(query))

    # Convert ObjectId to string for JSON serialization
    for event in future_events:
        event['_id'] = str(event['_id'])

    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(future_events, f, indent=2)

    # Print summary
    print(f"Downloaded {len(future_events)} events")
    print(f"Data saved to {output_file}")

    # Close the MongoDB connection
    client.close()

    return future_events

# Usage
output_file = "events.json"  # Name of the output JSON file

future_events = download_future_events_to_json(output_file)

# You can process the events further if needed
for event in future_events:
    print(f"Event ID: {event['_id']}, Start Time: {event['events_details']['start_time']}")
