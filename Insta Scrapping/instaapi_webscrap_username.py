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

# Username that want to fetch mutual followers
target_usernames = ['lorem_ipsum', 'dolor_sit_amet']  # Replace with actual target usernames

mutual_list = []
global_index = 1  # global incremental ID

for target_username in target_usernames:
    try:
        # Get target user info
        target_user = cl.user_info_by_username(target_username)
        target_user_id = target_user.pk

        print(f"\nFetching mutuals for @{target_username} (PK: {target_user_id})")

        # Append target user pk to followings list
        mutual_pks = [target_user_id]

        # Loop through mutual followers
        for pk in mutual_pks:
            try:
                user = cl.user_info_v1(pk)

                mutual_list.append({
                    "id": global_index,
                    "target_username": target_username,
                    "pk": user.pk,
                    "username": user.username,
                    "full_name": user.full_name or None,
                    "profile_pic_url_hd": str(user.profile_pic_url_hd) if user.profile_pic_url_hd else None,
                    "is_private": user.is_private,
                    "media_count": user.media_count,
                    "follower_count": user.follower_count,
                    "following_count": user.following_count,
                    "biography": user.biography or None,
                })

                print(f"[{global_index}] OK → {user.username}")
                global_index += 1

                # Random delay (VERY important)
                time.sleep(random.uniform(8, 18))

            except Exception as e:
                print(f"[SKIP USER] {pk} → {e}")
                time.sleep(20)
                continue

    except Exception as e:
        print(f"[SKIP TARGET] @{target_username} → {e}")
        time.sleep(30)
        continue

# JSON Saving
json_file = f"{ACCOUNT_USERNAME}_mutuals_{int(time.time())}.json"
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(mutual_list, f, indent=4, ensure_ascii=False)
    
# CSV Saving
csv_file = f"{ACCOUNT_USERNAME}_mutuals_{int(time.time())}.csv"
with open(csv_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=mutual_list[0].keys())
    writer.writeheader()
    writer.writerows(mutual_list)
    
# Excel Saving
xlsx_file = f"{ACCOUNT_USERNAME}_mutuals_{int(time.time())}.xlsx"
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