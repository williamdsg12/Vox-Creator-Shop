from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

artifact_dir = r"C:\Users\willi\.gemini\antigravity-ide\brain\775eb378-7306-40dd-8b73-396fa1f8a27f"
os.makedirs(artifact_dir, exist_ok=True)

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print("Starting driver...")
driver = webdriver.Chrome(options=chrome_options)
driver.set_page_load_timeout(30)

try:
    print("Navigating to https://topcreator.app...")
    driver.get("https://topcreator.app")
    time.sleep(5)
    
    # Capture landing page
    landing_path = os.path.join(artifact_dir, "landing.png")
    driver.save_screenshot(landing_path)
    print("Landing page screenshot saved to:", landing_path)
    print("Landing page Title:", driver.title)
    print("Landing page URL:", driver.current_url)

    # Click Entrar (Login)
    print("Searching for Entrar button...")
    clicked = False
    
    # Let's print all buttons/links on the page to find the right one if click fails
    elements = driver.find_elements(By.XPATH, "//a | //button")
    print("Elements found:")
    for el in elements:
        try:
            text = el.text.strip()
            if text:
                print(f" - {el.tag_name}: {text}")
        except:
            pass

    # Try clicking buttons with 'Entrar' or similar text
    for el in elements:
        try:
            text = el.text.strip().lower()
            if "entrar" in text:
                el.click()
                print(f"Clicked element with text: {el.text}")
                clicked = True
                break
        except Exception as e:
            pass

    if not clicked:
        # Fallback to direct navigation or generic XPATH click
        try:
            entrar_btn = driver.find_element(By.XPATH, "//*[contains(text(), 'Entrar')]")
            entrar_btn.click()
            print("Clicked Entrar via fallback XPATH")
            clicked = True
        except Exception as e:
            print("Fallback click failed:", e)

    time.sleep(3)
    login_view_path = os.path.join(artifact_dir, "login_view.png")
    driver.save_screenshot(login_view_path)
    print("Login view screenshot saved. URL:", driver.current_url)

    # Now let's find input fields for email and password
    print("Finding email and password inputs...")
    email_field = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
    pass_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
    
    email_field.send_keys("williamdev36@gmail.com")
    pass_field.send_keys("Caverna12@")
    print("Filled credentials.")
    
    login_submit_path = os.path.join(artifact_dir, "login_filled.png")
    driver.save_screenshot(login_submit_path)
    
    # Find submit button
    submit_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar') or @type='submit']")
    submit_btn.click()
    print("Clicked submit button.")
    
    # Wait for dashboard to load (e.g. 8 seconds)
    time.sleep(8)
    
    dashboard_path = os.path.join(artifact_dir, "dashboard.png")
    driver.save_screenshot(dashboard_path)
    print("Dashboard screenshot saved. URL:", driver.current_url)
    print("Dashboard Title:", driver.title)
    
    # Print page source to see structure of dashboard
    dashboard_src = driver.page_source
    src_path = os.path.join(artifact_dir, "dashboard_source.html")
    with open(src_path, "w", encoding="utf-8") as f:
        f.write(dashboard_src)
    print("Dashboard source saved to:", src_path)

    # Let's try to explore all menus/navigation buttons
    print("Searching for menu items in dashboard...")
    dashboard_elements = driver.find_elements(By.XPATH, "//a | //button")
    print("Dashboard links/buttons:")
    for el in dashboard_elements:
        try:
            text = el.text.strip()
            if text:
                print(f" - {el.tag_name}: {text}")
        except:
            pass

except Exception as e:
    print("An error occurred during Selenium execution:", e)
finally:
    driver.quit()
    print("Driver closed.")
