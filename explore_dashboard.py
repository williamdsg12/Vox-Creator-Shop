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
    
    # We are on the main Dashboard page. Let's open the first script card.
    print("Opening first script card...")
    try:
        card = driver.find_element(By.XPATH, "//*[contains(text(), 'MARTELETE ROTATIVO')]")
        card.click()
        print("Clicked script card.")
        time.sleep(4)
        save_page("script_detail")
        
        # Click back button in script detail if any (e.g. Voltar aos vídeos or similar)
        # Looking at our HTML trace: action:"Voltar aos vídeos"
        try:
            back_btn = driver.find_element(By.XPATH, "//*[contains(text(), 'Voltar')]")
            back_btn.click()
            print("Clicked back button.")
            time.sleep(3)
        except Exception as e:
            print("Failed to click back button, reloading page...", e)
            driver.get("https://voxcreatorshop.vercel.app")
            time.sleep(5)
    except Exception as e:
        print("Failed to find/click script card:", e)
        
    # Explore "Roteiros de Vídeo" tab
    print("Exploring 'Roteiros de Vídeo'...")
    try:
        tab_video = driver.find_element(By.XPATH, "//button[span[contains(text(), 'Roteiros de Vídeo')]]")
        tab_video.click()
        print("Clicked Roteiros de Vídeo.")
        time.sleep(3)
        save_page("tab_video")
    except Exception as e:
        print("Failed to open Roteiros de Vídeo:", e)

    # Explore "Fixar Produto na Live" tab
    print("Exploring 'Fixar Produto na Live'...")
    try:
        tab_fixar = driver.find_element(By.XPATH, "//button[span[contains(text(), 'Fixar Produto na Live')]]")
        tab_fixar.click()
        print("Clicked Fixar Produto na Live.")
        time.sleep(3)
        save_page("tab_fixar")
    except Exception as e:
        print("Failed to open Fixar Produto na Live:", e)

    # Explore "Descobrir produtos" tab
    print("Exploring 'Descobrir produtos'...")
    try:
        tab_descobrir = driver.find_element(By.XPATH, "//button[span[contains(text(), 'Descobrir produtos')]]")
        tab_descobrir.click()
        print("Clicked Descobrir produtos.")
        time.sleep(3)
        save_page("tab_descobrir")
    except Exception as e:
        print("Failed to open Descobrir produtos:", e)

    # Open User Account menu
    print("Opening user account menu...")
    try:
        account_btn = driver.find_element(By.XPATH, "//button[contains(@title, 'Minha Conta')]")
        account_btn.click()
        print("Clicked Minha Conta button.")
        time.sleep(2)
        save_page("account_menu_opened")
        
        # Check if there is an "Assinatura" or "Planos" or similar option in the menu and click it
        menu_items = driver.find_elements(By.XPATH, "//div[@role='menuitem'] | //button[@role='menuitem'] | //a[@role='menuitem'] | //div[contains(@class, 'menu')]//button")
        print("Found menu items:")
        for item in menu_items:
            try:
                print(f" - {item.text}")
            except:
                pass
    except Exception as e:
        print("Failed to open account menu:", e)

except Exception as e:
    print("An error occurred:", e)
finally:
    driver.quit()
    print("Driver closed.")
