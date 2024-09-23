import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import pandas as pd

postsDf = pd.read_csv("WebScraper\Data\instagram_raw.csv").replace('"','', regex=True)


import requests
import os
import pandas as pd
from urllib.parse import urlparse

def download_instagram_image(url, folder_path, postID):
    try:
        # Send a GET request to the image URL directly
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Create the folder if it doesn't exist
        os.makedirs(folder_path, exist_ok=True)
        
        # Generate a filename from the URL
        filename = postID + ".jpg"
        file_path = os.path.join(folder_path, filename)
        
        # Save the image
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        
        print(f"Image saved successfully: {file_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download the image: {e}")

# Use raw string for file path
postsDf = pd.read_csv(r"WebScraper\Data\instagram_raw.csv").replace('"','', regex=True)
cnt = 0
for index, post in postsDf.iterrows():
    if cnt <= 5:
        imageurl = str(post.display_photo)
        postID = str(post.url)
        filepath = os.path.join('public', 'InstagramImages')
        print(f"Downloading: {imageurl}")
        download_instagram_image(imageurl, filepath, postID)
        # Remove the break statement to process all rows
        cnt +=1
    else:
        break