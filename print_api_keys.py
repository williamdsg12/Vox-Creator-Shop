import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def summarize_api(url, name):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            parsed = json.loads(data)
            print(f"\n=== Summary of {name} ({url}) ===")
            if isinstance(parsed, dict):
                print("Keys:", list(parsed.keys()))
                for k, v in parsed.items():
                    if isinstance(v, (dict, list)):
                        print(f"  {k}: Type={type(v).__name__}, Size={len(v)}")
                    else:
                        print(f"  {k}: Value={v}")
            elif isinstance(parsed, list):
                print(f"List of {len(parsed)} items")
                if parsed:
                    print("Sample item keys:", list(parsed[0].keys()) if isinstance(parsed[0], dict) else type(parsed[0]))
    except Exception as e:
        print(f"Error for {name}: {e}")

summarize_api("https://voxcreatorshop.vercel.app/api/models", "models")
summarize_api("https://voxcreatorshop.vercel.app/api/presets", "presets")
