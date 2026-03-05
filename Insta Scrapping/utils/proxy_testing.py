from dotenv import load_dotenv
import os
import requests

load_dotenv()

PROXY_SERVER = os.getenv("PROXY_SERVER")  # Optional

# Test proxy by making a request
try:
    response = requests.get(
        "https://ipinfo.io/json/",
        proxies={
            "http": PROXY_SERVER,
            "https": PROXY_SERVER
        },
        timeout=10
    )

    if response.status_code == 200:
        print("✅ Proxy SUCCESS")
        print("IP returned:", response.text.strip())
    else:
        print("⚠️ Proxy connected but returned status:", response.status_code)

except requests.exceptions.ProxyError as e:
    print("❌ Proxy ERROR (invalid / auth failed)")
    print(e)

except requests.exceptions.ConnectTimeout:
    print("❌ Proxy TIMEOUT (cannot reach proxy)")

except requests.exceptions.ConnectionError:
    print("❌ Connection ERROR (proxy unreachable)")

except Exception as e:
    print("❌ Unknown error")
    print(e)