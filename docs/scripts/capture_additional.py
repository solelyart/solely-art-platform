#!/usr/bin/env python3
"""
Capture additional pages that require authentication or dynamic content.
"""

import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
OUTPUT_DIR = "/home/ubuntu/solely-art-copyright/screenshots"

# Pages that can be captured without auth
ADDITIONAL_PAGES = [
    ("artist-profile-elena", "/artist/1"),  # Elena Martinez
    ("artist-profile-marcus", "/artist/2"),  # Marcus Chen
    ("artist-profile-jane", "/artist/7"),   # Jane Doe
    ("book-artist", "/book/1"),             # Book Elena
]

async def capture_page(page, name, path):
    """Capture a full-page screenshot as PDF."""
    url = f"{BASE_URL}{path}"
    print(f"Capturing {name}: {url}")
    
    try:
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(3000)  # Wait for animations and data loading
        
        # Save as PDF
        pdf_path = os.path.join(OUTPUT_DIR, f"{name}.pdf")
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "0.5in", "bottom": "0.5in", "left": "0.5in", "right": "0.5in"}
        )
        print(f"  Saved: {pdf_path}")
        
        # Also save as PNG screenshot
        png_path = os.path.join(OUTPUT_DIR, f"{name}.png")
        await page.screenshot(path=png_path, full_page=True)
        print(f"  Saved: {png_path}")
    except Exception as e:
        print(f"  Error capturing {name}: {e}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900}
        )
        page = await context.new_page()
        
        for name, path in ADDITIONAL_PAGES:
            await capture_page(page, name, path)
        
        await browser.close()
    
    print(f"\nAdditional screenshots saved to {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
