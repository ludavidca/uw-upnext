import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import time

def download_future_events_to_json(output_file):
    # Get current Unix timestamp
    current_timestamp = int(time.time())

    # Connect to MongoDB
    load_dotenv()
    uri = os.getenv('DATABASE_URI')
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client['Instagram']
    collection = db["Events"]

    future_events = list(collection.find({}))

    # Convert ObjectId to string for JSON serialization
    for event in future_events:
        event['_id'] = str(event['_id'])
        event['embedded'] = ""

    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(future_events, f, indent=2)

    # Close the MongoDB connection
    client.close()

    return future_events

# Usage
output_file = "public/events.json"  # Name of the output JSON file

future_events = download_future_events_to_json(output_file)

# Process the events further
for event in future_events:
    event_id = event.get('_id', 'No ID')
    event_details = event.get('events_details', {})
    start_time = event_details.get('start_time', 'No start time')
    
    print(f"Event ID: {event_id}, Start Time: {start_time}")

