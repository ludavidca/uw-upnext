import requests
import os
import sys
from pathlib import Path

def download_image(url: str, save_path: str) -> bool:
    """
    Download an image from a URL and save it to the specified path.
    
    Args:
        url (str): The URL of the image to download
        save_path (str): The path where the image should be saved
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Convert to Path object for better path handling
        save_path = Path(save_path)
        
        # Ensure the filename has a valid extension
        if not save_path.suffix:
            save_path = save_path.with_suffix('.jpg')
            
        # Create the directory if it doesn't exist
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Check write permissions for the directory
        if not os.access(str(save_path.parent), os.W_OK):
            print(f"Error: No write permission for directory: {save_path.parent}")
            return False
            
        # Check if file already exists
        if save_path.exists():
            print(f"Warning: File already exists at {save_path}")
            # You might want to implement a strategy here (skip, overwrite, rename)
            return False
            
        # Download the image
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # Raises an HTTPError for bad responses
        except requests.exceptions.RequestException as e:
            print(f"Error downloading image: {e}")
            return False
            
        # Verify the content type is an image
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            print(f"Error: URL does not point to an image (content-type: {content_type})")
            return False
            
        # Save the image
        try:
            save_path.write_bytes(response.content)
            print(f"Image successfully downloaded to {save_path}")
            return True
        except IOError as e:
            print(f"Error saving image: {e}")
            return False
            
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def main():
    # Example usage
    url = " https://instagram.fyzd1-2.fna.fbcdn.net/v/t51.29350-15/465055906_902458111474933_6164465882353648756_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=T0ljfmBSthIQ7kNvgEBhHZr&_nc_gid=b792f632cacb4e168875ff5ce92cc14a&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AYAia7i0YTe-V41i0JH8gw_4UIh_UswVd-46hqUwmytNlQ&oe=672CA32B&_nc_sid=d885a2 "
    save_path = "../public/InstagramImages/DB4Ll3zR5jQ.jpg"
    
    # Try to download with elevated permissions if needed
    success = download_image(url, save_path)
    
    if not success:
        print("\nTroubleshooting tips:")
        print("1. Ensure you have write permissions for the target directory")
        print("2. Try using an absolute path instead of a relative path")
        print("3. Run the script with appropriate permissions")
        print(f"4. Current working directory: {os.getcwd()}")
        
        # Suggest alternative directory
        alt_path = str(Path.home() / "Downloads" / Path(save_path).name)
        print(f"\nTry saving to your Downloads folder instead:")
        print(f"download_image(url, r'{alt_path}')")

main()