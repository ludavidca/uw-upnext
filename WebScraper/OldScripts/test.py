import requests
import os
import pandas as pd
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

def download_instagram_image(url, folder_path, postID):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        os.makedirs(folder_path, exist_ok=True)
        
        filename = postID + ".jpg"
        file_path = os.path.join(folder_path, filename)
        
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        
        print(f"Image saved successfully: {file_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download the image: {e}")

def process_row(row):
    imageurl = str(row.display_photo)
    postID = str(row.url)
    filepath = os.path.join('public', 'InstagramImages')
    print(f"Downloading: {imageurl}")
    download_instagram_image(imageurl, filepath, postID)

# Use raw string for file path
postsDf = pd.read_csv(r"/Users/madhavmalik/VSC Projects/uw-upnext/WebScraper/Data/instagram_raw.csv").replace('"','', regex=True)

# Use ThreadPoolExecutor to download images in parallel
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(process_row, row) for _, row in postsDf.iterrows()]
    
    for future in as_completed(futures):
        future.result()  # This will raise any exceptions that occurred during execution

print("All downloads completed.")