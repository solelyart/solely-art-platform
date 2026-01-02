#!/usr/bin/env python3
"""
Process and optimize new Solely Art logos for web use.
Creates multiple sizes and formats for different use cases.
"""

from PIL import Image
import os

INPUT_DIR = "/home/ubuntu/new-logo"
OUTPUT_DIR = "/home/ubuntu/solely-art-platform/client/public/brand"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_background_and_crop(img):
    """Remove white/light background and crop to content."""
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get image data
    data = img.getdata()
    new_data = []
    
    for item in data:
        # If pixel is close to white/light gray, make transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Add some padding
        padding = 20
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(img.width, bbox[2] + padding)
        bottom = min(img.height, bbox[3] + padding)
        img = img.crop((left, top, right, bottom))
    
    return img

def create_logo_variants():
    """Create various logo sizes and formats."""
    
    # Process the full logo (Sample 1) - for header with text
    print("Processing full logo (Sample 1)...")
    full_logo = Image.open(os.path.join(INPUT_DIR, "solelyart_Logo_Sample_1.jpg"))
    full_logo_transparent = remove_background_and_crop(full_logo)
    
    # Save full logo in different sizes
    sizes = {
        "logo-full": (400, None),  # Width 400, height auto
        "logo-full-sm": (200, None),  # Width 200, height auto
    }
    
    for name, (width, height) in sizes.items():
        if height is None:
            ratio = width / full_logo_transparent.width
            height = int(full_logo_transparent.height * ratio)
        
        resized = full_logo_transparent.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(os.path.join(OUTPUT_DIR, f"{name}.png"), "PNG", optimize=True)
        print(f"  Created {name}.png ({width}x{height})")
    
    # Process SA icon (SA-01) - teal on white for light backgrounds
    print("\nProcessing SA icon (SA-01)...")
    sa_icon = Image.open(os.path.join(INPUT_DIR, "SA-01.jpg"))
    sa_icon_transparent = remove_background_and_crop(sa_icon)
    
    # Create icon sizes
    icon_sizes = [512, 256, 128, 64, 48, 32, 16]
    for size in icon_sizes:
        # Make square by fitting in square canvas
        max_dim = max(sa_icon_transparent.width, sa_icon_transparent.height)
        ratio = (size - 10) / max_dim  # Leave some padding
        new_w = int(sa_icon_transparent.width * ratio)
        new_h = int(sa_icon_transparent.height * ratio)
        
        resized = sa_icon_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Create square canvas
        square = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        paste_x = (size - new_w) // 2
        paste_y = (size - new_h) // 2
        square.paste(resized, (paste_x, paste_y), resized)
        
        square.save(os.path.join(OUTPUT_DIR, f"logo-icon-{size}.png"), "PNG", optimize=True)
        print(f"  Created logo-icon-{size}.png")
    
    # Process SA-03 for alternate icon style
    print("\nProcessing SA-03 icon variant...")
    sa_03 = Image.open(os.path.join(INPUT_DIR, "SA-03.jpg"))
    sa_03_transparent = remove_background_and_crop(sa_03)
    
    # Create header-sized icon
    max_dim = max(sa_03_transparent.width, sa_03_transparent.height)
    ratio = 60 / max_dim
    new_w = int(sa_03_transparent.width * ratio)
    new_h = int(sa_03_transparent.height * ratio)
    resized = sa_03_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
    resized.save(os.path.join(OUTPUT_DIR, "logo-header-icon.png"), "PNG", optimize=True)
    print(f"  Created logo-header-icon.png ({new_w}x{new_h})")
    
    # Process Sample 4 - elegant text logo for footer
    print("\nProcessing text logo (Sample 4)...")
    text_logo = Image.open(os.path.join(INPUT_DIR, "solelyart_Logo_Sample_4.jpg"))
    text_logo_transparent = remove_background_and_crop(text_logo)
    
    # Resize for footer use
    ratio = 180 / text_logo_transparent.width
    new_h = int(text_logo_transparent.height * ratio)
    resized = text_logo_transparent.resize((180, new_h), Image.Resampling.LANCZOS)
    resized.save(os.path.join(OUTPUT_DIR, "logo-text.png"), "PNG", optimize=True)
    print(f"  Created logo-text.png (180x{new_h})")
    
    # Create favicon from SA-01
    print("\nCreating favicon...")
    favicon_sizes = [16, 32, 48]
    favicon_images = []
    
    for size in favicon_sizes:
        max_dim = max(sa_icon_transparent.width, sa_icon_transparent.height)
        ratio = (size - 4) / max_dim
        new_w = int(sa_icon_transparent.width * ratio)
        new_h = int(sa_icon_transparent.height * ratio)
        
        resized = sa_icon_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        square = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        paste_x = (size - new_w) // 2
        paste_y = (size - new_h) // 2
        square.paste(resized, (paste_x, paste_y), resized)
        favicon_images.append(square)
    
    # Save as ICO
    favicon_images[0].save(
        os.path.join(OUTPUT_DIR, "../favicon.ico"),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=favicon_images[1:]
    )
    print("  Created favicon.ico")
    
    print("\n✓ All logo variants created successfully!")

if __name__ == "__main__":
    create_logo_variants()
