#!/usr/bin/env python3
"""
Capture PDF exports of key Solely Art website pages for copyright registration.
"""

import asyncio
from playwright.async_api import async_playwright
import os

BASE_URL = "https://3000-ismw4r56ghxjg647vetcg-a6f21cbd.manusvm.computer"
OUTPUT_DIR = "/home/ubuntu/solely-art-copyright-v2/01_Screenshots_or_PDF"

PAGES = [
    ("", "01_Home"),
    ("/about", "02_About"),
    ("/browse", "03_Browse_Artists"),
    ("/contact", "04_Contact"),
    ("/terms", "05_Terms_of_Service"),
    ("/privacy", "06_Privacy_Policy"),
    ("/artist/jane-doe", "07_Artist_Profile_JaneDoe"),
    ("/artist/elena-martinez", "08_Artist_Profile_ElenaMartinez"),
    ("/book/jane-doe", "09_Book_Artist_Flow"),
]

async def capture_page_pdf(page, url, filename):
    """Capture a single page as PDF."""
    full_url = f"{BASE_URL}{url}"
    print(f"Capturing: {full_url}")
    
    try:
        await page.goto(full_url, wait_until="networkidle", timeout=30000)
        await asyncio.sleep(2)  # Wait for animations
        
        # Scroll to load lazy content
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(1)
        await page.evaluate("window.scrollTo(0, 0)")
        await asyncio.sleep(0.5)
        
        # Save as PDF
        pdf_path = os.path.join(OUTPUT_DIR, f"{filename}.pdf")
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "0.5in", "bottom": "0.5in", "left": "0.5in", "right": "0.5in"}
        )
        print(f"  Saved: {pdf_path}")
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

async def main():
    """Main function to capture all pages."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900}
        )
        page = await context.new_page()
        
        success_count = 0
        for url, filename in PAGES:
            if await capture_page_pdf(page, url, filename):
                success_count += 1
        
        await browser.close()
        
    print(f"\nCompleted: {success_count}/{len(PAGES)} pages captured")

if __name__ == "__main__":
    asyncio.run(main())
