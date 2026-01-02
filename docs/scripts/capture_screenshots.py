#!/usr/bin/env python3
"""
Capture full-page screenshots of Solely Art platform pages for copyright documentation.
"""

import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL = "https://3000-ismw4r56ghxjg647vetcg-a6f21cbd.manusvm.computer"
OUTPUT_DIR = "/home/ubuntu/solely-art-copyright/screenshots"

PAGES = [
    ("home", "/"),
    ("about", "/about"),
    ("browse", "/browse"),
    ("terms", "/terms"),
    ("privacy", "/privacy"),
    ("contact", "/contact"),
]

async def capture_page(page, name, path):
    """Capture a full-page screenshot as PDF."""
    url = f"{BASE_URL}{path}"
    print(f"Capturing {name}: {url}")
    
    await page.goto(url, wait_until="networkidle")
    await page.wait_for_timeout(2000)  # Wait for animations
    
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

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900}
        )
        page = await context.new_page()
        
        for name, path in PAGES:
            try:
                await capture_page(page, name, path)
            except Exception as e:
                print(f"  Error capturing {name}: {e}")
        
        await browser.close()
    
    print(f"\nAll screenshots saved to {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
