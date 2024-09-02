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
    future_events = list(collection.find())

    # Filter and clean the events
    cleaned_events = []
    for event in future_events:
        # Convert ObjectId to string for JSON serialization
        event['_id'] = str(event['_id'])

        # Remove the "embedded" field if it exists
        if 'embedded' in event:
            del event['embedded']

        # Convert event_details.start_time to Unix timestamp if it's in a different format
        start_time = event['event_details']['start_time']
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time).timestamp()

        # Only include events that have a start_time greater than the current timestamp
        if start_time > current_timestamp:
            cleaned_events.append(event)

    # Write the cleaned events to a JSON file
    with open(output_file, 'w') as f:
        json.dump(cleaned_events, f, indent=2)

    # Print summary
    print(f"Downloaded {len(cleaned_events)} future events")
    print(f"Data saved to {output_file}")

    # Close the MongoDB connection
    client.close()

    return cleaned_events

# Usage
output_file = "public/events.json"  # Name of the output JSON file

future_events = download_future_events_to_json(output_file)
