import instaloader
import pandas as pd
import datetime 
import time
import logging
from requests.exceptions import RequestException
from concurrent.futures import ThreadPoolExecutor, as_completed

dayssincescrape = 3

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
                time.sleep(10)  # Wait for 10 seconds before retrying
            else:
                logging.error(f"Max retries reached for {handle}. Moving to next handle.")
    return []

def scrape_instagram(handles, cutoffdate):
    L = instaloader.Instaloader()
    postsDf = pd.DataFrame()

    # Use ThreadPoolExecutor to parallelize the scraping
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Start the load operations and mark each future with its handle
        future_to_handle = {executor.submit(scrape_handle, L, handle, cutoffdate): handle for handle in handles}
        for future in as_completed(future_to_handle):
            handle = future_to_handle[future]
            try:
                handle_data = future.result()
                if handle_data:
                    postsDf = pd.concat([postsDf, pd.DataFrame(handle_data)], ignore_index=True)
            except Exception as e:
                logging.error(f"Error processing handle {handle}: {e}")
            time.sleep(1)  # Small delay to prevent rate limiting

    return postsDf

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    cutoffdate = datetime.datetime.today() - datetime.timedelta(days=dayssincescrape)
    handles = ['uwengsoc','uwcsa','uw_ux','uwblueprint','uwaterlooeng','uwaterloottc','uwaterloodsc',
               'uwaterloopm','uwmcc','gdscwaterloo','uwsmileclub','socratica.info','yourwusa','wataiteam',
               'uwawscloud','techplusuw','itshera.co','uwstartups','electriummobility','uwhiphop','uwaterloo_ksa',
               'uw_aviation','uwaterloopm','uwmcc','uwmsa','gdscwaterloo','waterloo_ultimate','uwcheeseclub','uwstreetdance',
               'uwmidsun','watolink_uw','uwaterlooeng','uwpokerclub','uwaterloocycling','uwaterloobsa','uw_phys_club','uw.gsa',
               'uwcsclub','uwfintech','uwaterloosc','uwactsciclub','uwstatsclub','waterloo.frosh','wat.street','waterlooblockchain',
               'waterloo.ai','uw_watsam','uwrealitylabs','uwafow','uwmuaythai','uw.farmsa','uw_bmsa','uwtsa','uwmariokart','uwhiphop',
               'uw.movie.watchers','uwbeautyclub','uwteaclub','uw_urc','uw.dhamaka']

    try:
        result = scrape_instagram(handles, cutoffdate)
        print(result)
        logging.info("Scraping completed successfully.")
        return result
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    postsDf = main()

postsDf.reset_index(drop=True) 
postsDf.to_csv("WebScraper\Data\instagram_raw.csv")