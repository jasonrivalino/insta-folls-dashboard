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
cl.load_settings(os.getenv("SESSION_FILE")) # Load previous session if exists
cl.login(ACCOUNT_USERNAME, ACCOUNT_PASSWORD)
# cl.dump_settings(os.getenv("SESSION_FILE"))

# Print logged in user if successful
if cl.user_id:
    print(f"Logged in as: {cl.username}")
else:
    print("Login failed")
    exit(1)


# =============================
# Configuration
# =============================
MUTUAL_FILE = os.getenv("MUTUAL_FILE")
print(f"Using mutual file: {MUTUAL_FILE}")

FALLBACK_USERNAMES = [
    "lorem_ipsum",
    "dolor_sit_amet"
]

# =============================
# Load Usernames
# =============================
if MUTUAL_FILE and os.path.isfile(MUTUAL_FILE):
    with open(MUTUAL_FILE, "r", encoding="utf-8") as f:
        target_usernames = json.load(f)

    print(f"Loaded {len(target_usernames)} usernames from {MUTUAL_FILE}")

else:
    target_usernames = FALLBACK_USERNAMES
    print("File not found. Using fallback usernames.")

target_usernames = list(dict.fromkeys(target_usernames))


# =============================
# Variables
# =============================
mutual_list = []
global_index = 1
successful_fetch_count = 0


# =============================
# Helper Functions
# =============================
def empty_to_none(value):
    return value if value != "" else None


# =============================
# Saving Function
# =============================
def save_data():
    if not mutual_list:
        return

    # JSON Saving
    json_file = f"{ACCOUNT_USERNAME}_mutuals.json"

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(mutual_list, f, indent=4, ensure_ascii=False)

    # CSV Saving
    csv_file = f"{ACCOUNT_USERNAME}_mutuals.csv"

    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=mutual_list[0].keys()
        )
        writer.writeheader()
        writer.writerows(mutual_list)

    # Excel Saving
    xlsx_file = f"{ACCOUNT_USERNAME}_mutuals.xlsx"

    wb = Workbook()
    ws = wb.active
    ws.title = "Mutual Followers"

    headers = list(mutual_list[0].keys())
    ws.append(headers)

    for item in mutual_list:
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
    for target_username in target_usernames:
        try:
            # Get target user info
            target_user = cl.user_info_by_username(target_username)
            target_user_id = target_user.pk

            print(
                f"\nFetching mutuals for @{target_username} "
                f"(PK: {target_user_id})"
            )

            # Append target user pk to followings list
            mutual_pks = [target_user_id]

            # Loop through mutual followers
            for pk in mutual_pks:
                try:
                    user = cl.user_info_v1(pk)

                    # Append to mutual list
                    mutual_list.append({
                        "id": global_index,
                        "pk": empty_to_none(user.pk),
                        "username": empty_to_none(user.username),
                        "full_name": empty_to_none(user.full_name),
                        "is_private": empty_to_none(user.is_private),
                        "media_count": empty_to_none(user.media_count),
                        "follower_count": empty_to_none(user.follower_count),
                        "following_count": empty_to_none(user.following_count),
                        "biography": empty_to_none(user.biography),
                    })

                    print(f"[{global_index}] OK → {user.username}")

                    global_index += 1
                    successful_fetch_count += 1

                    # Save immediately after every successful fetch
                    save_data()

                    # Random delay
                    time.sleep(random.uniform(8, 18))

                    # Cooldown every 100 successful fetches
                    if successful_fetch_count % 100 == 0:
                        print("\nReached 100 successful fetches.")
                        print("Sleeping for 60 seconds...")
                        time.sleep(60)
                        print("Resuming fetching...\n")

                except Exception as e:
                    print(f"[SKIP USER] {pk} → {e}")
                    time.sleep(20)
                    continue

        except Exception as e:
            print(f"[SKIP TARGET] @{target_username} → {e}")
            time.sleep(30)
            continue

except KeyboardInterrupt:
    print("\nProcess interrupted by user (Ctrl+C).")

finally:
    # Final backup save
    if mutual_list:
        print("\nPerforming final save...")
        save_data()

    print("\nFetching process finished.")
    print(f"Total targets: {len(target_usernames)}")
    print(f"Successful fetches: {successful_fetch_count}")
    print(f"Skipped targets/users: {len(target_usernames) - successful_fetch_count}")