#testing instaloader to retrieve image links

import instaloader

loader = instaloader.Instaloader()

profile= instaloader.Profile.from_username(loader.context, "uwblueprint")

print(profile.profile_pic_url)