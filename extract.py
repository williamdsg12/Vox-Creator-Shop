import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

js_path = r"C:\Users\willi\.gemini\antigravity-ide\brain\775eb378-7306-40dd-8b73-396fa1f8a27f\.system_generated\steps\15\content.md"

with open(js_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = "".join(lines[8:])

# Search for obkavukyuvzqxvrslbyd
print("--- Matches for Supabase subdomain 'obkavukyuvzqxvrslbyd' ---")
for m in re.finditer(r'obkavukyuvzqxvrslbyd', content):
    idx = m.start()
    print(f"Match at {idx}:")
    print(content[max(0, idx-100):min(len(content), idx+400)])
    print("-" * 50)

# Search for sixth-rhythm-hjlsj
print("\n--- Matches for Firebase Project ID 'sixth-rhythm-hjlsj' ---")
for m in re.finditer(r'sixth-rhythm-hjlsj', content):
    idx = m.start()
    print(f"Match at {idx}:")
    print(content[max(0, idx-100):min(len(content), idx+400)])
    print("-" * 50)
