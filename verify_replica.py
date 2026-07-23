from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os

artifact_dir = r"C:\Users\willi\.gemini\antigravity-ide\brain\e82f099b-160a-4bf1-9607-c0af4a7ff44a"
os.makedirs(artifact_dir, exist_ok=True)

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print("Starting driver for local replica verification...")
driver = webdriver.Chrome(options=chrome_options)
driver.set_page_load_timeout(15)

def save_replica_page(name):
    screenshot_path = os.path.join(artifact_dir, f"replica_{name}.png")
    driver.save_screenshot(screenshot_path)
    print(f"Captured replica_{name}.png")

try:
    local_url = "file:///d:/fake/saas do TIKTOK SHOP/index.html"
    print("Loading local file:", local_url)
    driver.get(local_url)
    time.sleep(2)
    save_replica_page("landing")

    # Click Entrar
    print("Clicking login on landing...")
    driver.find_element(By.XPATH, "//*[contains(text(), 'Entrar')]").click()
    time.sleep(1)
    save_replica_page("login_view")

    # Enter credentials
    print("Filling in credentials...")
    driver.find_element(By.ID, "login-email").send_keys("williamdev36@gmail.com")
    driver.find_element(By.ID, "login-pass").send_keys("Caverna12@")
    save_replica_page("login_filled")

    # Submit form
    print("Submitting login...")
    driver.find_element(By.XPATH, "//button[@type='submit']").click()
    time.sleep(2)
    save_replica_page("dashboard_lives")

    # Click lives tab to show the script cards
    print("Clicking lives tab...")
    driver.find_element(By.XPATH, "//button[contains(., 'Roteiros de Lives')]").click()
    time.sleep(1)

    # Check username in profile
    username = driver.find_element(By.ID, "profile-display-name").text
    credits_text = driver.find_element(By.ID, "profile-display-credits").text
    print(f"Profile Loaded. User: '{username}', Stats: '{credits_text}'")

    # Click first script card
    print("Opening first script card...")
    card = driver.find_element(By.XPATH, "//*[contains(text(), 'MARTELETE ROTATIVO')]")
    card.click()
    time.sleep(1)
    save_replica_page("teleprompter_loading")

    # Wait for teleprompter load
    time.sleep(2.5)
    save_replica_page("teleprompter_loaded")

    # Toggle play
    print("Toggling teleprompter play...")
    driver.find_element(By.ID, "playbook-play-toggle-btn").click()
    time.sleep(3.5) # Wait for text scroll simulation
    save_replica_page("teleprompter_scrolling")

    # Close playbook
    print("Closing teleprompter...")
    driver.find_element(By.XPATH, "//button[contains(@title, 'Voltar')]").click()
    time.sleep(1)

    # Click discover tab
    print("Clicking discover tab...")
    driver.find_element(By.XPATH, "//button[contains(., 'Descobrir produtos')]").click()
    time.sleep(1.5)
    save_replica_page("dashboard_discover")

    # Open Settings Modal
    print("Opening settings modal...")
    driver.find_element(By.XPATH, "//button[contains(@title, 'Minha Conta')]").click()
    time.sleep(1)
    driver.find_element(By.XPATH, "//*[contains(text(), 'Configurações')]").click()
    time.sleep(1)
    save_replica_page("settings_modal")

    print("\n--- Verification Completed Successfully ---")

except Exception as e:
    print("Verification error:", e)
finally:
    driver.quit()
    print("Driver closed.")
