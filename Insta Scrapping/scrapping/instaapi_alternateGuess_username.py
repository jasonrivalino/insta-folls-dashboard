import os
import json
import csv
import requests
from openpyxl import Workbook
from dotenv import load_dotenv
import time
import random

load_dotenv()

# =============================
# Configuration
# =============================
ACCOUNT_USERNAME = os.getenv("ACCOUNT_USERNAME")
PROXY_SERVER = os.getenv("PROXY_SERVER")
MUTUAL_FILE = os.getenv("MUTUAL_FILE")
print(f"Using mutual file: {MUTUAL_FILE}")

# Fallback usernames if file doesn't exist
FALLBACK_USERNAMES = [
    "lorem_ipsum",
    "dolor_sit_amet"
]

# =============================
# Load Usernames
# =============================
if os.path.exists(MUTUAL_FILE):
    with open(MUTUAL_FILE, "r", encoding="utf-8") as f:
        usernames = json.load(f)

    print(f"Loaded {len(usernames)} usernames from {MUTUAL_FILE}")

else:
    usernames = FALLBACK_USERNAMES
    print("File not found. Using fallback usernames.")

# =============================
# API Configuration
# =============================
url = "https://i.instagram.com/api/v1/users/web_profile_info/"

headers = {
    "User-Agent": "Mozilla/5.0",
    "X-IG-App-ID": "936619743392459"
}

all_users_data = []
valid_id = 1

# =============================
# Saving Function
# =============================
def save_data():
    if not all_users_data:
        return

    # JSON Saving
    json_file = f"{ACCOUNT_USERNAME}_users.json"

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(
            all_users_data,
            f,
            indent=4,
            ensure_ascii=False
        )

    # CSV Saving
    csv_file = f"{ACCOUNT_USERNAME}_users.csv"

    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=all_users_data[0].keys()
        )

        writer.writeheader()
        writer.writerows(all_users_data)

    # Excel Saving
    xlsx_file = f"{ACCOUNT_USERNAME}_users.xlsx"

    wb = Workbook()
    ws = wb.active
    ws.title = "Instagram Users"

    headers_excel = list(all_users_data[0].keys())
    ws.append(headers_excel)

    for item in all_users_data:
        ws.append(list(item.values()))

    wb.save(xlsx_file)

    print("\nData successfully saved:")
    print(f"- JSON : {json_file}")
    print(f"- CSV  : {csv_file}")
    print(f"- XLSX : {xlsx_file}")


# =============================
# Fetching Data
# =============================
try:
    for idx, username in enumerate(usernames, start=1):
        params = {"username": username}

        try:
            res = requests.get(
                url,
                headers=headers,
                params=params,
                timeout=15
            )

            print(
                f"Fetching [{idx}/{len(usernames)}]: "
                f"{username} -> {res.status_code}"
            )

            if res.status_code != 200:
                print(f"Response URL: {res.url}")
                print(f"Response body: {res.text[:1000]}")
                print(f"Response headers: {dict(res.headers)}")

            if res.status_code == 429:
                print("Rate limited, waiting 30 seconds...")
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
                successful_fetch_count += 1

                # Save immediately
                save_data()
                print(f"Successfully fetched and saved: {username}")

                # Sleep every 100 successful fetches
                if successful_fetch_count % 100 == 0:
                    print("\nReached 100 successful fetches.")
                    print("Sleeping for 60 seconds...")
                    time.sleep(60)
                    print("Resuming fetching...\n")

            elif res.status_code == 404:
                print(f"Username '{username}' not found (404). Skipped.")

            else:
                print(f"Failed to fetch {username} -> {res.status_code}")

            time.sleep(random.uniform(8, 15))

        except requests.exceptions.RequestException as e:
            print(f"Request error fetching {username}: {str(e)}")

        except (KeyError, ValueError, TypeError) as e:
            print(f"Invalid response for {username}: {str(e)}")

        except Exception as e:
            print(f"Error fetching {username}: {str(e)}")

except KeyboardInterrupt:
    print("\nProcess interrupted by user (Ctrl+C).")

finally:
    # Final backup save
    if all_users_data:
        print("\nPerforming final save...")
        save_data()

    print("\nFetching process finished.")