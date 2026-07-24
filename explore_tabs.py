from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
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

def save_page(name):
    screenshot_path = os.path.join(artifact_dir, f"{name}.png")
    source_path = os.path.join(artifact_dir, f"{name}_source.html")
    driver.save_screenshot(screenshot_path)
    with open(source_path, "w", encoding="utf-8") as f:
        f.write(driver.page_source)
    print(f"Saved {name} screenshot and source. URL: {driver.current_url}")

try:
    print("Navigating to login...")
    driver.get("https://voxcreatorshop.vercel.app")
    time.sleep(4)
    
    # Click Login
    driver.find_element(By.XPATH, "//*[contains(text(), 'Entrar')]").click()
    time.sleep(2)
    
    # Login
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("williamdev36@gmail.com")
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("Caverna12@")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar') or @type='submit']").click()
    print("Logged in, waiting for dashboard...")
    time.sleep(6)
    
    # We are on the main Dashboard page.
    # 1. Roteiros de Vídeo
    print("Clicking Roteiros de Vídeo...")
    try:
        # Let's find button that contains 'Roteiros de Vídeo' or has that text
        btn = driver.find_element(By.XPATH, "//button[contains(., 'Roteiros de Vídeo')]")
        btn.click()
        time.sleep(3)
        save_page("tab_video")
    except Exception as e:
        print("Failed to open Roteiros de Vídeo:", e)
        
    # 2. Fixar Produto na Live
    print("Clicking Fixar Produto na Live...")
    try:
        btn = driver.find_element(By.XPATH, "//button[contains(., 'Fixar Produto na Live')]")
        btn.click()
        time.sleep(3)
        save_page("tab_fixar")
    except Exception as e:
        print("Failed to open Fixar Produto na Live:", e)

    # 3. Descobrir produtos
    print("Clicking Descobrir produtos...")
    try:
        btn = driver.find_element(By.XPATH, "//button[contains(., 'Descobrir produtos')]")
        btn.click()
        time.sleep(3)
        save_page("tab_descobrir")
    except Exception as e:
        print("Failed to open Descobrir produtos:", e)

    # 4. Open User Account menu and click Configurações
    print("Opening account dropdown...")
    try:
        account_btn = driver.find_element(By.XPATH, "//button[contains(@title, 'Minha Conta')]")
        account_btn.click()
        time.sleep(2)
        
        print("Clicking Configurações...")
        # Search for element containing "Configurações"
        config_btn = driver.find_element(By.XPATH, "//*[contains(text(), 'Configurações')]")
        config_btn.click()
        time.sleep(3)
        save_page("settings_modal")
    except Exception as e:
        print("Failed to open settings:", e)

except Exception as e:
    print("An error occurred:", e)
finally:
    driver.quit()
    print("Driver closed.")
