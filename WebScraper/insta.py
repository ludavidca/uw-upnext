import instaloader
import pandas as pd
import datetime 
import time
import logging
import random
from requests.exceptions import RequestException

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
                time.sleep(random.randrange(300, 400))  # Wait for a few minutes before retrying
            else:
                logging.error(f"Max retries reached for {handle}. Moving to next handle.")
    return []

def scrape_instagram():
    cutoffdate = datetime.datetime.today() - datetime.timedelta(days=1)
    handles = ['uwengsoc','uwcsa','uw_ux','uwblueprint','uwaterlooeng','uwaterloottc','uwaterloodsc','uwaterloopm','uwmcc','gdscwaterloo','uwsmileclub','socratica.info','yourwusa','wataiteam','uwawscloud','techplusuw','itshera.co','uwstartups','electriummobility','uwhiphop','uwaterloo_ksa','uw_aviation','uwaterloopm','uwmcc','uwmsa','gdscwaterloo','waterloo_ultimate','uwcheeseclub','uwstreetdance','uwmidsun','watolink_uw','uwaterlooeng','uwpokerclub','uwaterloocycling','uwaterloobsa','uw_phys_club','uw.gsa','uwcsclub','uwfintech','uwaterloosc','uwactsciclub','uwstatsclub','waterloo.frosh','wat.street','waterlooblockchain','waterloo.ai','uw_watsam','uwrealitylabs','uwafow','uwmuaythai','uw.farmsa','uw_bmsa','uwtsa','uwmariokart','uwhiphop','uw.movie.watchers','uwbeautyclub','uwteaclub','uw_urc','uw.dhamaka']
    random.shuffle(handles)
    postsDf = pd.DataFrame()

    L = instaloader.Instaloader()
    
    for handle in handles:
        logging.info(f"Scraping {handle}")
        handle_data = scrape_handle(L, handle, cutoffdate)
        if handle_data:
            postsDf = pd.concat([postsDf, pd.DataFrame(handle_data)], ignore_index=True)
        time.sleep(4)  # Delay between handles to avoid rate limiting
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

postsDf.reset_index(drop=True) 
postsDf.to_csv("WebScraper\Data\instagram_raw.csv")