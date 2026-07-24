import urllib.request
import re

url = "https://voxcreatorshop.vercel.app"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    print("HTML Length:", len(html))
    
    # Extract scripts
    scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\'][^>]*>', html)
    print("\n--- Script Srcs ---")
    for s in scripts:
        print(s)
        
    # Extract links
    links = re.findall(r'<link[^>]*href=["\']([^"\']+)["\'][^>]*>', html)
    print("\n--- Link Hrefs ---")
    for l in links:
        print(l)
        
    # Extract any script bodies
    script_bodies = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    print(f"\nFound {len(script_bodies)} script bodies:")
    for i, body in enumerate(script_bodies):
        if body.strip():
            print(f"[{i}]:", body.strip()[:200], "...")
            
except Exception as e:
    print("Error:", e)
