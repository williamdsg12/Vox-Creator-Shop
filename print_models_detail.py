import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request("https://voxcreatorshop.vercel.app/api/models", headers=headers)
try:
    with urllib.request.urlopen(req) as r:
        data = r.read().decode('utf-8')
        parsed = json.loads(data)
        print(json.dumps(parsed, indent=2))
except Exception as e:
    print(e)
