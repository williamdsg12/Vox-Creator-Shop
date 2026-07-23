import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_api(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            print(f"\n--- Output of {url} ---")
            try:
                # Pretty print JSON if possible
                parsed = json.loads(data)
                print(json.dumps(parsed, indent=2))
            except:
                print(data[:1000])
    except Exception as e:
        print(f"Error fetching {url}: {e}")

fetch_api("https://topcreator.app/api/models")
fetch_api("https://topcreator.app/api/presets")
