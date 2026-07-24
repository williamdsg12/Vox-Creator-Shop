from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import json

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Enable Performance Logging
chrome_options.set_capability("goog:loggingPrefs", {"performance": "ALL"})

print("Starting driver with network logs enabled...")
driver = webdriver.Chrome(options=chrome_options)
driver.set_page_load_timeout(30)

try:
    print("Navigating to voxcreatorshop.vercel.app...")
    driver.get("https://voxcreatorshop.vercel.app")
    time.sleep(5)
    
    # Click Entrar
    driver.find_element(By.XPATH, "//*[contains(text(), 'Entrar')]").click()
    time.sleep(2)
    
    # Fill login details
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("williamdev36@gmail.com")
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("Caverna12@")
    
    # Click login submit
    driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar') or @type='submit']").click()
    print("Submitted login. Waiting for dashboard to load...")
    time.sleep(8)
    
    # Retrieve performance logs
    logs = driver.get_log("performance")
    
    print("\n--- Network Requests Found ---")
    requests = []
    for entry in logs:
        log_data = json.loads(entry["message"])
        message = log_data.get("message", {})
        method = message.get("method")
        
        # We look for Network.requestWillBeSent to get all requested URLs
        if method == "Network.requestWillBeSent":
            params = message.get("params", {})
            request = params.get("request", {})
            url = request.get("url")
            req_method = request.get("method")
            if "google" not in url and "gstatic" not in url and not url.endswith((".png", ".jpg", ".css", ".js", ".ico", ".woff", ".woff2")):
                requests.append((req_method, url))
                
    # Deduplicate and print
    for rm, url in sorted(list(set(requests))):
        print(f"[{rm}] {url}")

except Exception as e:
    print("An error occurred:", e)
finally:
    driver.quit()
    print("Driver closed.")
