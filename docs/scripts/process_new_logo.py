#!/usr/bin/env python3
"""
Process the new SolelyArt logo - separate SLA monogram from SOLELYART text
and create optimized variants for different website uses.
"""

from PIL import Image
import os

INPUT_FILE = "/home/ubuntu/upload/solelyartLogo(1)-03.webp"
OUTPUT_DIR = "/home/ubuntu/solely-art-platform/client/public/brand"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_background(img, bg_color_threshold=230):
    """Remove light background and make it transparent."""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    data = img.getdata()
    new_data = []
    
    for item in data:
        # If pixel is close to the beige/cream background (#F5F1EC approx)
        if item[0] > bg_color_threshold and item[1] > bg_color_threshold - 10 and item[2] > bg_color_threshold - 20:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    return img

def crop_to_content(img, padding=10):
    """Crop image to content with optional padding."""
    bbox = img.getbbox()
    if bbox:
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(img.width, bbox[2] + padding)
        bottom = min(img.height, bbox[3] + padding)
        return img.crop((left, top, right, bottom))
    return img

def main():
    print("Loading logo...")
    original = Image.open(INPUT_FILE)
    print(f"Original size: {original.width}x{original.height}")
    
    # Remove background
    transparent = remove_background(original)
    
    # Get the full logo cropped
    full_logo = crop_to_content(transparent, padding=20)
    print(f"Full logo cropped: {full_logo.width}x{full_logo.height}")
    
    # The logo has two parts:
    # Top: SLA monogram (teal color)
    # Bottom: SOLELYART text (dark color)
    # We need to separate them
    
    # Analyze the image to find the split point
    # The SLA icon is in the top portion, text is in the bottom
    height = full_logo.height
    width = full_logo.width
    
    # Find where the teal icon ends and text begins by scanning rows
    # The SLA icon is teal (~#5B8A8A), text is dark (~#3A3A3A)
    
    # Estimate: icon takes about 55% of height, text takes 45%
    split_ratio = 0.58
    split_y = int(height * split_ratio)
    
    # Extract SLA icon (top portion)
    icon_region = full_logo.crop((0, 0, width, split_y))
    icon_cropped = crop_to_content(icon_region, padding=5)
    print(f"Icon cropped: {icon_cropped.width}x{icon_cropped.height}")
    
    # Extract SOLELYART text (bottom portion)  
    text_region = full_logo.crop((0, split_y, width, height))
    text_cropped = crop_to_content(text_region, padding=5)
    print(f"Text cropped: {text_cropped.width}x{text_cropped.height}")
    
    # === CREATE LOGO VARIANTS ===
    
    # 1. Full logo (stacked) - for About page hero, footer
    print("\n1. Creating full logo variants...")
    for size_name, max_width in [("lg", 400), ("md", 250), ("sm", 150)]:
        ratio = max_width / full_logo.width
        new_h = int(full_logo.height * ratio)
        resized = full_logo.resize((max_width, new_h), Image.Resampling.LANCZOS)
        resized.save(os.path.join(OUTPUT_DIR, f"logo-full-{size_name}.png"), "PNG", optimize=True)
        print(f"  Created logo-full-{size_name}.png ({max_width}x{new_h})")
    
    # 2. Icon only (SLA monogram) - for header, favicon
    print("\n2. Creating icon variants...")
    for size in [512, 256, 128, 64, 48, 32, 16]:
        # Make it square
        max_dim = max(icon_cropped.width, icon_cropped.height)
        ratio = (size - 4) / max_dim
        new_w = int(icon_cropped.width * ratio)
        new_h = int(icon_cropped.height * ratio)
        
        resized = icon_cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center on square canvas
        square = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        paste_x = (size - new_w) // 2
        paste_y = (size - new_h) // 2
        square.paste(resized, (paste_x, paste_y), resized)
        
        square.save(os.path.join(OUTPUT_DIR, f"logo-icon-{size}.png"), "PNG", optimize=True)
        print(f"  Created logo-icon-{size}.png")
    
    # 3. Header logo (icon + text side by side or just icon with text)
    print("\n3. Creating header logo...")
    # For header, use icon at reasonable size
    header_height = 48
    icon_ratio = header_height / icon_cropped.height
    header_icon_w = int(icon_cropped.width * icon_ratio)
    header_icon = icon_cropped.resize((header_icon_w, header_height), Image.Resampling.LANCZOS)
    header_icon.save(os.path.join(OUTPUT_DIR, "logo-header.png"), "PNG", optimize=True)
    print(f"  Created logo-header.png ({header_icon_w}x{header_height})")
    
    # Also create a version with text below for larger headers
    header_full_height = 80
    full_ratio = header_full_height / full_logo.height
    header_full_w = int(full_logo.width * full_ratio)
    header_full = full_logo.resize((header_full_w, header_full_height), Image.Resampling.LANCZOS)
    header_full.save(os.path.join(OUTPUT_DIR, "logo-header-full.png"), "PNG", optimize=True)
    print(f"  Created logo-header-full.png ({header_full_w}x{header_full_height})")
    
    # 4. Text only - for certain uses
    print("\n4. Creating text-only logo...")
    text_height = 30
    text_ratio = text_height / text_cropped.height
    text_w = int(text_cropped.width * text_ratio)
    text_resized = text_cropped.resize((text_w, text_height), Image.Resampling.LANCZOS)
    text_resized.save(os.path.join(OUTPUT_DIR, "logo-text.png"), "PNG", optimize=True)
    print(f"  Created logo-text.png ({text_w}x{text_height})")
    
    # 5. Favicon (ICO format)
    print("\n5. Creating favicon...")
    favicon_sizes = [16, 32, 48]
    favicon_images = []
    
    for size in favicon_sizes:
        max_dim = max(icon_cropped.width, icon_cropped.height)
        ratio = (size - 2) / max_dim
        new_w = int(icon_cropped.width * ratio)
        new_h = int(icon_cropped.height * ratio)
        
        resized = icon_cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        square = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        paste_x = (size - new_w) // 2
        paste_y = (size - new_h) // 2
        square.paste(resized, (paste_x, paste_y), resized)
        favicon_images.append(square)
    
    favicon_images[0].save(
        os.path.join(OUTPUT_DIR, "../favicon.ico"),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=favicon_images[1:]
    )
    print("  Created favicon.ico")
    
    # 6. Apple touch icon
    print("\n6. Creating apple-touch-icon...")
    size = 180
    max_dim = max(icon_cropped.width, icon_cropped.height)
    ratio = (size - 30) / max_dim
    new_w = int(icon_cropped.width * ratio)
    new_h = int(icon_cropped.height * ratio)
    
    resized = icon_cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # White background for apple touch icon
    square = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    paste_x = (size - new_w) // 2
    paste_y = (size - new_h) // 2
    square.paste(resized, (paste_x, paste_y), resized)
    
    rgb_square = Image.new('RGB', (size, size), (255, 255, 255))
    rgb_square.paste(square, mask=square.split()[3])
    rgb_square.save(os.path.join(OUTPUT_DIR, "../apple-touch-icon.png"), 'PNG', optimize=True)
    print("  Created apple-touch-icon.png (180x180)")
    
    print("\n✓ All logo variants created successfully!")
    print("\nLogo files summary:")
    print("  - logo-full-lg/md/sm.png: Full stacked logo (icon + text)")
    print("  - logo-icon-*.png: SLA monogram icon in various sizes")
    print("  - logo-header.png: Icon for navigation header")
    print("  - logo-header-full.png: Full logo for larger headers")
    print("  - logo-text.png: SOLELYART text only")
    print("  - favicon.ico: Browser favicon")
    print("  - apple-touch-icon.png: iOS home screen icon")

if __name__ == "__main__":
    main()
