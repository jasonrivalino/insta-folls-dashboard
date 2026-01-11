# WARNING: Don't use your main Instagram Account for scrapping.
# Create a dummy Instagram account for scrapping purposes to avoid potential bans.

from instagrapi import Client
from dotenv import load_dotenv
from openpyxl import Workbook
import json
import time
import os
import csv
import random

load_dotenv()

ACCOUNT_USERNAME = os.getenv("ACCOUNT_USERNAME")
ACCOUNT_PASSWORD = os.getenv("ACCOUNT_PASSWORD")
INSTA_TARGET_PK = os.getenv("INSTA_TARGET_PK")

# Login first to Instagram
cl = Client()
cl.load_settings("session.json") # Load previous session if exists
cl.login(ACCOUNT_USERNAME, ACCOUNT_PASSWORD)
cl.dump_settings("session.json")

# Print logged in user if successful
if cl.user_id:
    print(f"Logged in as: {cl.username}")
else:
    print("Login failed")
    exit(1)

# Option 1: Use own account
# Get user ID from username
user_id = cl.user_id_from_username(ACCOUNT_USERNAME)

# Option 2: Use another profile
# Get user ID use from another profile
# user_id = int(INSTA_TARGET_PK)

# Get user followers and following
followers_users = cl.user_followers(user_id)
following_users = cl.user_following(user_id)

# Get mutual followers by checking intersection pk
followers_pks = set(followers_users.keys())
print("Followers PKs collected.")
following_pks = set(following_users.keys())
print("Following PKs collected.")

# Find mutual followers by pk intersection
mutual_pks = followers_pks.intersection(following_pks)
# Find followers who you are not following back
not_followed_back_pks = followers_pks - following_pks
# Find followers who are not following back
not_following_back_pks = following_pks - followers_pks

find_condition = input("Choose data to fetch (1: mutual, 2: not following back, 3: not followed back) [1]: ") or "1"

# While loop to ensure valid input
while find_condition not in ["1", "2", "3"]:
    find_condition = input("Invalid choice. Please choose (1: mutual, 2: not following back, 3: not followed back) [1]: ") or "1"
    
# Set condition pks based on user choice
if find_condition == "2":
    condition_pks = not_following_back_pks
    print("Fetching users who are not following back...")
elif find_condition == "3":
    condition_pks = not_followed_back_pks
    print("Fetching users who you are not following back...")
else:
    condition_pks = mutual_pks
    print("Fetching mutual followers...")

# Add the target user to the list
condition_pks.add(user_id)

# Print summary
print(f"Total followers : {len(followers_pks)}")
print(f"Total following : {len(following_pks)}")
print(f"Total mutual    : {len(mutual_pks)}")
print(f"Total not follow back : {len(not_following_back_pks)}")
print(f"Total not followed back : {len(not_followed_back_pks)}")
print(f"Total to fetch  : {len(condition_pks)}")

# Fetch for each mutual user details
mutual_list = []
for i, pk in enumerate(condition_pks, start=1):
    try:
        # Fetch user info
        user = cl.user_info_v1(pk)
        
        # Print user fetched and data collected for debugging
        # print(f"Fetched data for {user.username}:")
        # print(user.model_dump())

        # Handle empty strings to None
        def empty_to_none(value):
            return value if value != "" else None
        
        # Append to mutual list
        mutual_list.append({
            "id": i,
            "pk": empty_to_none(user.pk),
            "username": empty_to_none(user.username),
            "full_name": empty_to_none(user.full_name),
            "is_private": empty_to_none(user.is_private),
            "media_count": empty_to_none(user.media_count),
            "follower_count": empty_to_none(user.follower_count),
            "following_count": empty_to_none(user.following_count),
            "biography": empty_to_none(user.biography),
        })

        # Print progress
        print(f"[{i}/{len(mutual_pks)}] OK → {user.username}")
        
        # Random sleep to avoid rate limiting
        time.sleep(random.uniform(7, 15))

    except Exception as e:
        print(f"[{i}] FAILED → {pk} | {e}")
        time.sleep(20)
        continue

# JSON Saving
json_file = f"{ACCOUNT_USERNAME}_mutuals.json"
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(mutual_list, f, indent=4, ensure_ascii=False)
    
# CSV Saving
csv_file = f"{ACCOUNT_USERNAME}_mutuals.csv"
with open(csv_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=mutual_list[0].keys())
    writer.writeheader()
    writer.writerows(mutual_list)
    
# Excel Saving
xlsx_file = f"{ACCOUNT_USERNAME}_mutuals.xlsx"
wb = Workbook()
ws = wb.active
ws.title = "Mutual Followers"
# Header
headers = mutual_list[0].keys()
ws.append(list(headers))
# Rows
for item in mutual_list:
    ws.append(list(item.values()))
wb.save(xlsx_file)

# Final output
print("\nData berhasil disimpan:")
print(f"- JSON : {json_file}")
print(f"- CSV  : {csv_file}")
print(f"- XLSX : {xlsx_file}")