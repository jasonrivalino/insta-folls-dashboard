import requests
import re

# PK ID Getter (For Public Instagram Only)

username = "lorem_ipsum"  # Replace with actual username
url = f"https://www.instagram.com/{username}/"

headers = {"User-Agent": "Mozilla/5.0"}
res = requests.get(url, headers=headers)

match = re.search(r'"profilePage_(\d+)"', res.text)

if match:
    print("User ID:", match.group(1))