#!/usr/bin/env python3
"""
Optimize SolelyArt logo based on UI/UX research findings:

Research Summary:
- Header logo height: 32-48px (within 64px navbar)
- Full logo width: 200-400px
- Clear space: minimum 1/4 of logo height
- Favicon: 16, 32, 48px
- Responsive: icon-only for mobile, full for desktop

Logo Components:
- SLA monogram (teal): for headers, favicon, mobile
- SOLELYART text (dark): combined with icon for full logo
"""

from PIL import Image
import os

INPUT_FILE = "/home/ubuntu/upload/solelyartLogo(1)-03.webp"
OUTPUT_DIR = "/home/ubuntu/solely-art-platform/client/public/brand"

def remove_background(img, bg_threshold=225):
    """Remove light background and make transparent."""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    data = list(img.getdata())
    new_data = []
    
    for item in data:
        # Light beige/cream background
        if item[0] > bg_threshold and item[1] > bg_threshold - 15 and item[2] > bg_threshold - 25:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    return img

def crop_to_content(img, padding=0):
    """Crop to content bounding box with optional padding."""
    bbox = img.getbbox()
    if bbox:
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(img.width, bbox[2] + padding)
        bottom = min(img.height, bbox[3] + padding)
        return img.crop((left, top, right, bottom))
    return img

def resize_to_height(img, target_height):
    """Resize image to target height maintaining aspect ratio."""
    ratio = target_height / img.height
    new_width = int(img.width * ratio)
    return img.resize((new_width, target_height), Image.Resampling.LANCZOS)

def resize_to_width(img, target_width):
    """Resize image to target width maintaining aspect ratio."""
    ratio = target_width / img.width
    new_height = int(img.height * ratio)
    return img.resize((target_width, new_height), Image.Resampling.LANCZOS)

def create_square_icon(img, size, padding_ratio=0.1):
    """Create square icon with padding for clear space."""
    # Calculate padding
    inner_size = int(size * (1 - 2 * padding_ratio))
    
    # Resize to fit inner area
    max_dim = max(img.width, img.height)
    ratio = inner_size / max_dim
    new_w = int(img.width * ratio)
    new_h = int(img.height * ratio)
    
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center on square canvas with clear space
    square = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    paste_x = (size - new_w) // 2
    paste_y = (size - new_h) // 2
    square.paste(resized, (paste_x, paste_y), resized)
    
    return square

def main():
    print("=" * 60)
    print("OPTIMIZING SOLELYART LOGO BASED ON UI/UX RESEARCH")
    print("=" * 60)
    
    # Load and process original
    print("\n1. Loading and processing original logo...")
    original = Image.open(INPUT_FILE)
    print(f"   Original size: {original.width}x{original.height}")
    
    transparent = remove_background(original)
    full_logo = crop_to_content(transparent, padding=10)
    print(f"   Full logo cropped: {full_logo.width}x{full_logo.height}")
    
    # Separate icon and text
    height = full_logo.height
    width = full_logo.width
    split_ratio = 0.58  # Icon takes ~58% of height
    split_y = int(height * split_ratio)
    
    icon_region = full_logo.crop((0, 0, width, split_y))
    icon = crop_to_content(icon_region, padding=2)
    print(f"   Icon extracted: {icon.width}x{icon.height}")
    
    text_region = full_logo.crop((0, split_y, width, height))
    text = crop_to_content(text_region, padding=2)
    print(f"   Text extracted: {text.width}x{text.height}")
    
    # === HEADER LOGO (UI/UX: 32-48px height) ===
    print("\n2. Creating HEADER logos (32-48px height range)...")
    
    # Header icon only - 40px height (fits well in 64px navbar with padding)
    header_icon_40 = resize_to_height(icon, 40)
    header_icon_40.save(os.path.join(OUTPUT_DIR, "logo-header-40.png"), "PNG", optimize=True)
    print(f"   ✓ logo-header-40.png ({header_icon_40.width}x40)")
    
    # Header icon - 32px (smaller variant)
    header_icon_32 = resize_to_height(icon, 32)
    header_icon_32.save(os.path.join(OUTPUT_DIR, "logo-header-32.png"), "PNG", optimize=True)
    print(f"   ✓ logo-header-32.png ({header_icon_32.width}x32)")
    
    # Header icon - 48px (larger variant)
    header_icon_48 = resize_to_height(icon, 48)
    header_icon_48.save(os.path.join(OUTPUT_DIR, "logo-header-48.png"), "PNG", optimize=True)
    print(f"   ✓ logo-header-48.png ({header_icon_48.width}x48)")
    
    # Main header logo (replacing logo-header.png)
    header_icon_main = resize_to_height(icon, 44)
    header_icon_main.save(os.path.join(OUTPUT_DIR, "logo-header.png"), "PNG", optimize=True)
    print(f"   ✓ logo-header.png ({header_icon_main.width}x44) [MAIN HEADER]")
    
    # === FULL LOGO (UI/UX: 200-400px width) ===
    print("\n3. Creating FULL logos (200-400px width range)...")
    
    # Large - 400px width (for hero sections)
    full_lg = resize_to_width(full_logo, 400)
    full_lg.save(os.path.join(OUTPUT_DIR, "logo-full-lg.png"), "PNG", optimize=True)
    print(f"   ✓ logo-full-lg.png (400x{full_lg.height})")
    
    # Medium - 280px width (for footer)
    full_md = resize_to_width(full_logo, 280)
    full_md.save(os.path.join(OUTPUT_DIR, "logo-full-md.png"), "PNG", optimize=True)
    print(f"   ✓ logo-full-md.png (280x{full_md.height})")
    
    # Small - 180px width (for smaller contexts)
    full_sm = resize_to_width(full_logo, 180)
    full_sm.save(os.path.join(OUTPUT_DIR, "logo-full-sm.png"), "PNG", optimize=True)
    print(f"   ✓ logo-full-sm.png (180x{full_sm.height})")
    
    # === ICON VARIANTS WITH CLEAR SPACE ===
    print("\n4. Creating ICON variants with proper clear space...")
    
    # Icons with 10% padding (clear space) on each side
    for size in [512, 256, 192, 128, 96, 64, 48, 32, 24, 16]:
        icon_sq = create_square_icon(icon, size, padding_ratio=0.1)
        icon_sq.save(os.path.join(OUTPUT_DIR, f"logo-icon-{size}.png"), "PNG", optimize=True)
        print(f"   ✓ logo-icon-{size}.png ({size}x{size})")
    
    # === FAVICON (UI/UX: 16, 32, 48px) ===
    print("\n5. Creating FAVICON...")
    
    favicon_sizes = [16, 32, 48]
    favicon_images = []
    
    for size in favicon_sizes:
        fav = create_square_icon(icon, size, padding_ratio=0.08)
        favicon_images.append(fav)
    
    # Save as ICO
    favicon_images[0].save(
        os.path.join(OUTPUT_DIR, "../favicon.ico"),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=favicon_images[1:]
    )
    print("   ✓ favicon.ico (16, 32, 48px)")
    
    # === APPLE TOUCH ICON (180px with white bg) ===
    print("\n6. Creating APPLE TOUCH ICON...")
    
    apple_icon = create_square_icon(icon, 180, padding_ratio=0.15)
    # Add white background
    white_bg = Image.new('RGB', (180, 180), (255, 255, 255))
    white_bg.paste(apple_icon, mask=apple_icon.split()[3])
    white_bg.save(os.path.join(OUTPUT_DIR, "../apple-touch-icon.png"), "PNG", optimize=True)
    print("   ✓ apple-touch-icon.png (180x180)")
    
    # === OG IMAGE (1200x630 for social sharing) ===
    print("\n7. Creating OG/SOCIAL IMAGE...")
    
    og_width, og_height = 1200, 630
    og_image = Image.new('RGBA', (og_width, og_height), (245, 241, 236, 255))  # Beige background
    
    # Place full logo centered
    og_logo = resize_to_height(full_logo, 300)
    paste_x = (og_width - og_logo.width) // 2
    paste_y = (og_height - og_logo.height) // 2
    og_image.paste(og_logo, (paste_x, paste_y), og_logo)
    
    og_rgb = Image.new('RGB', (og_width, og_height), (245, 241, 236))
    og_rgb.paste(og_image, mask=og_image.split()[3] if og_image.mode == 'RGBA' else None)
    og_rgb.save(os.path.join(OUTPUT_DIR, "og-image.png"), "PNG", optimize=True)
    print(f"   ✓ og-image.png ({og_width}x{og_height})")
    
    # === TEXT ONLY LOGO ===
    print("\n8. Creating TEXT-ONLY logo...")
    
    text_logo = resize_to_height(text, 24)
    text_logo.save(os.path.join(OUTPUT_DIR, "logo-text.png"), "PNG", optimize=True)
    print(f"   ✓ logo-text.png ({text_logo.width}x24)")
    
    print("\n" + "=" * 60)
    print("OPTIMIZATION COMPLETE!")
    print("=" * 60)
    print("""
Logo Usage Guide (Based on UI/UX Research):

HEADER/NAVIGATION:
  - Use: logo-header.png (44px height)
  - Clear space: Built-in via CSS padding
  - Navbar height: 64-80px recommended

FOOTER:
  - Use: logo-full-md.png (280px width)
  - Shows full brand identity

HERO SECTIONS:
  - Use: logo-full-lg.png (400px width)
  - For About page, landing sections

FAVICON:
  - Use: favicon.ico (multi-size)
  - Includes 16, 32, 48px variants

SOCIAL SHARING:
  - Use: og-image.png (1200x630)
  - Optimized for Open Graph

MOBILE/RESPONSIVE:
  - Use icon-only variants for small screens
  - Switch to full logo on desktop (>768px)
""")

if __name__ == "__main__":
    main()
