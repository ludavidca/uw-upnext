import instaloader
import pandas as pd
import datetime 
import time
import logging
import traceback
from requests.exceptions import RequestException
from concurrent.futures import ThreadPoolExecutor, as_completed

DAYS_SINCE_SCRAPE = 38
MAX_RETRIES = 3
RETRY_DELAY = 10  # seconds
MAX_WORKERS = 1   # Reduced from 5 to avoid rate limiting
DELAY_BETWEEN_HANDLES = 2  # seconds

def scrape_handle(L, handle, cutoff_date):
    """Scrape posts from a single Instagram handle"""
    retry_count = 0
    posts_data = []
    
    logging.info(f"Starting to scrape handle: {handle}")
    
    while retry_count < MAX_RETRIES:
        try:
            profile = instaloader.Profile.from_username(L.context, handle)
            post_count = 0
            print(profile.get_posts)
            for post in profile.get_posts():
                if post.date > cutoff_date:
                    photo_caption = post.accessibility_caption if post.accessibility_caption is not None else ""
                    caption = post.caption if post.caption is not None else ""
                    posts_data.append({
                        'url': f"https://www.instagram.com/p/{post.shortcode}/",
                        'shortcode': post.shortcode,
                        'likes': post.likes,
                        'display_photo': post.url,
                        'account': handle.replace('\"','\\\"'),
                        'date': post.date,
                        'caption': caption.replace("\n",""),
                        'accessibility_caption': photo_caption.replace("\n",""),
                    })
                    post_count += 1
                    # Add a small delay between post scraping to be gentle
                    time.sleep(0.5)
                    print(posts_data)
                else:
                    break  # Stop once we hit older posts
                    
            logging.info(f"Successfully scraped {post_count} posts from {handle}")
            return posts_data
            
        except Exception as e:
            retry_count += 1
            error_details = traceback.format_exc()
            logging.error(f"Error scraping {handle} (attempt {retry_count}/{MAX_RETRIES}): {str(e)}")
            logging.debug(f"Detailed error: {error_details}")
            
            if retry_count < MAX_RETRIES:
                logging.info(f"Retrying {handle} in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                logging.error(f"Max retries reached for {handle}. Moving to next handle.")
    
    return []

def scrape_instagram(handles, cutoff_date):
    """Scrape posts from multiple Instagram handles"""
    L = instaloader.Instaloader()
    
    # Optional: Login to avoid rate limits (uncomment and add credentials if needed)
    # L.login("your_username", "your_password")
    
    all_posts_data = []
    
    # Use ThreadPoolExecutor with reduced concurrency
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_handle = {executor.submit(scrape_handle, L, handle, cutoff_date): handle for handle in handles}
        
        for future in as_completed(future_to_handle):
            handle = future_to_handle[future]
            try:
                handle_data = future.result()
                if handle_data:
                    all_posts_data.extend(handle_data)
                    logging.info(f"Added {len(handle_data)} posts from {handle} to dataset")
                else:
                    logging.warning(f"No data retrieved for handle {handle}")
            except Exception as e:
                error_details = traceback.format_exc()
                logging.error(f"Error processing handle {handle}: {str(e)}")
                logging.debug(f"Detailed error: {error_details}")
                
            # Add delay between handles to prevent rate limiting
            time.sleep(DELAY_BETWEEN_HANDLES)
    
    # Create DataFrame from collected data
    if all_posts_data:
        return pd.DataFrame(all_posts_data)
    else:
        logging.warning("No posts data collected for any handles")
        return pd.DataFrame()

def main():
    # Set up logging with more detailed information
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("instagram_scraper.log"),
            logging.StreamHandler()
        ]
    )
    
    logging.info("Starting Instagram scraper")
    
    cutoff_date = datetime.datetime.today() - datetime.timedelta(days=DAYS_SINCE_SCRAPE)
    logging.info(f"Cutoff date set to: {cutoff_date}")
    
    # For testing, just use one handle
    handles = ['uwengsoc']
    # handles = ['uwengsoc','uwcsa','uw_ux','uwblueprint','uwaterlooeng','uwaterloottc','uwaterloodsc',
    #            'uwaterloopm','uwmcc','gdscwaterloo','uwsmileclub','socratica.info','yourwusa','wataiteam',
    #            'uwawscloud','techplusuw','itshera.co','uwstartups','electriummobility','uwhiphop',
    #            'uw_aviation','uwaterloopm','uwmcc','uwmsa','gdscwaterloo','waterloo_ultimate','uwcheeseclub','uwstreetdance',
    #            'uwmidsun','watolink_uw','uwaterlooeng','uwpokerclub','uwaterloocycling','uwaterloobsa','uw_phys_club','uw.gsa',
    #            'uwcsclub','uwfintech','uwaterloosc','uwactsciclub','uwstatsclub','waterloo.frosh','wat.street','waterlooblockchain',
    #            'waterloo.ai','uw_watsam','uwrealitylabs','uwafow','uwmuaythai','uw.farmsa','uw_bmsa','uwtsa','uwmariokart','uwhiphop',
    #            'uw.movie.watchers','uwbeautyclub','uwteaclub','uw_urc','uw.dhamaka']
    
    try:
        logging.info(f"Attempting to scrape {len(handles)} handles")
        result_df = scrape_instagram(handles, cutoff_date)
        
        if not result_df.empty:
            logging.info(f"Scraping completed successfully. Retrieved {len(result_df)} posts.")
            
            # Save the data
            output_path = "instagram_data.csv"
            result_df.to_csv(output_path, index=False)
            logging.info(f"Data saved to {output_path}")
            
            # Display sample of results
            print("\nSample of scraped data:")
            print(result_df.head())
            
            return result_df
        else:
            logging.error("Scraping completed but no data was retrieved")
            return pd.DataFrame()
            
    except Exception as e:
        error_details = traceback.format_exc()
        logging.error(f"An unexpected error occurred: {str(e)}")
        logging.debug(f"Detailed error: {error_details}")
        return pd.DataFrame()

if __name__ == "__main__":
    posts_df = main()


#MAKE IT SO THAT PINNED POSTS GET IGNORED!