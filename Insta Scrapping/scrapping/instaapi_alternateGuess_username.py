import os
import json
import csv
import requests
from openpyxl import Workbook
from dotenv import load_dotenv
import time
import random

load_dotenv()

# Load environment variables
ACCOUNT_USERNAME = os.getenv("ACCOUNT_USERNAME")
PROXY_SERVER = os.getenv("PROXY_SERVER")

# List of usernames to fetch
usernames = ['lorem_ipsum', 'dolor_sit_amet']  # Replace with actual target usernames

url = "https://i.instagram.com/api/v1/users/web_profile_info/"

headers = {
    "User-Agent": "Mozilla/5.0",
    "X-IG-App-ID": "936619743392459"
}

all_users_data = []
valid_id = 1 

# Loop through usernames and fetch data
for idx, username in enumerate(usernames, start=1):
    params = {"username": username}
    
    try:
        res = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=15
        )

        print(f"Fetching [{idx}/{len(usernames)}]: {username} -> {res.status_code}")
        
        if res.status_code == 429:
            print("Rate limited, waiting 30 seconds before retrying...")
            time.sleep(30)
            continue

        if res.status_code == 200:
            data = res.json()
            user = data["data"]["user"]

            user_data = {
                "id": valid_id,
                "pk": user["id"],
                "username": user["username"],
                "full_name": user["full_name"],
                "is_private": user["is_private"],
                "media_count": user["edge_owner_to_timeline_media"]["count"],
                "follower_count": user["edge_followed_by"]["count"],
                "following_count": user["edge_follow"]["count"],
                "biography": user["biography"]
            }

            all_users_data.append(user_data)
            valid_id += 1

        elif res.status_code == 404:
            print(f"Username '{username}' not found (404). Skipped.")
            continue

        else:
            print(f"Failed to fetch {username} -> {res.status_code}")
            
        time.sleep(random.uniform(8, 15))  # Delay between requests

    except Exception as e:
        print(f"Error fetching {username}: {str(e)}")


# =============================
# Saving Section
# =============================

if all_users_data:

    # JSON Saving
    json_file = f"{ACCOUNT_USERNAME}_users.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(all_users_data, f, indent=4, ensure_ascii=False)

    # CSV Saving
    csv_file = f"{ACCOUNT_USERNAME}_users.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_users_data[0].keys())
        writer.writeheader()
        writer.writerows(all_users_data)

    # Excel Saving
    xlsx_file = f"{ACCOUNT_USERNAME}_users.xlsx"
    wb = Workbook()
    ws = wb.active
    ws.title = "Instagram Users"

    headers_excel = all_users_data[0].keys()
    ws.append(list(headers_excel))

    for item in all_users_data:
        ws.append(list(item.values()))

    wb.save(xlsx_file)

    print("\nData berhasil disimpan:")
    print(f"- JSON : {json_file}")
    print(f"- CSV  : {csv_file}")
    print(f"- XLSX : {xlsx_file}")

else:
    print("Tidak ada data yang berhasil diambil.")