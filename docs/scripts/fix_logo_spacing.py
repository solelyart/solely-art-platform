#!/usr/bin/env python3
"""
Fix logo spacing and create properly sized variants for responsive design
Based on UI/UX best practices:
- Header logo: 32-48px height (we'll use 40px for optimal clarity)
- Footer logo: 120-200px width
- Mobile: smaller variants
- Proper padding/clear space built in
"""

import os
from PIL import Image
import numpy as np

# Paths
SOURCE_LOGO = "/home/ubuntu/upload/solelyartLogo(1)-03.webp"
OUTPUT_DIR = "/home/ubuntu/solely-art-platform/client/public/brand"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_background(img):
    """Remove the cream/beige background"""
    img_rgba = img.convert('RGBA')
    data = np.array(img_rgba)
    
    # Background is light cream (#F5F3EF area)
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    
    # More precise background detection
    bg_mask = (r > 225) & (g > 220) & (b > 215)
    
    # Make background transparent
    data[:,:,3] = np.where(bg_mask, 0, 255)
    
    return Image.fromarray(data)

def crop_to_content(img, padding_percent=5):
    """Crop image to content with padding"""
    # Get alpha channel
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    alpha = np.array(img)[:,:,3]
    
    # Find bounding box of non-transparent pixels
    rows = np.any(alpha > 0, axis=1)
    cols = np.any(alpha > 0, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        return img
    
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    # Add padding
    h, w = alpha.shape
    pad_h = int((rmax - rmin) * padding_percent / 100)
    pad_w = int((cmax - cmin) * padding_percent / 100)
    
    rmin = max(0, rmin - pad_h)
    rmax = min(h, rmax + pad_h)
    cmin = max(0, cmin - pad_w)
    cmax = min(w, cmax + pad_w)
    
    return img.crop((cmin, rmin, cmax, rmax))

def extract_icon_region(img):
    """Extract just the SLA monogram icon (top portion)"""
    w, h = img.size
    # The icon is roughly the top 50-55% of the image
    icon = img.crop((0, 0, w, int(h * 0.52)))
    return crop_to_content(icon, padding_percent=8)

def extract_full_logo(img):
    """Extract the full logo with icon + text"""
    return crop_to_content(img, padding_percent=5)

def create_header_logo(icon, target_height=40):
    """Create header logo optimized for navigation bar"""
    # Calculate width maintaining aspect ratio
    ratio = target_height / icon.height
    new_width = int(icon.width * ratio)
    
    # Use high-quality resampling
    resized = icon.resize((new_width, target_height), Image.Resampling.LANCZOS)
    
    return resized

def create_responsive_variants():
    """Create all responsive logo variants"""
    print("=" * 60)
    print("LOGO SPACING & RESPONSIVE FIX")
    print("=" * 60)
    
    # Load source
    print("\n📥 Loading source logo...")
    source = Image.open(SOURCE_LOGO)
    print(f"   Source size: {source.size}")
    
    # Remove background
    print("\n🔲 Removing background...")
    transparent = remove_background(source)
    
    # Extract components
    print("\n✂️ Extracting components...")
    icon = extract_icon_region(transparent)
    full_logo = extract_full_logo(transparent)
    
    print(f"   Icon size: {icon.size}")
    print(f"   Full logo size: {full_logo.size}")
    
    variants = {}
    
    # === HEADER LOGOS (for navigation) ===
    print("\n📦 Creating header logo variants...")
    
    # Standard header (40px - optimal for most navbars)
    header_40 = create_header_logo(icon, 40)
    path = f"{OUTPUT_DIR}/sla-header-logo.png"
    header_40.save(path, 'PNG', optimize=True)
    variants['header_40'] = path
    print(f"   ✓ {path} ({header_40.size[0]}x{header_40.size[1]})")
    
    # Larger header for pages with h-20 (80px) headers
    header_48 = create_header_logo(icon, 48)
    path = f"{OUTPUT_DIR}/sla-header-logo-lg.png"
    header_48.save(path, 'PNG', optimize=True)
    variants['header_48'] = path
    print(f"   ✓ {path} ({header_48.size[0]}x{header_48.size[1]})")
    
    # Mobile header (smaller)
    header_32 = create_header_logo(icon, 32)
    path = f"{OUTPUT_DIR}/sla-header-logo-sm.png"
    header_32.save(path, 'PNG', optimize=True)
    variants['header_32'] = path
    print(f"   ✓ {path} ({header_32.size[0]}x{header_32.size[1]})")
    
    # === FULL LOGO VARIANTS (for footer, hero, etc.) ===
    print("\n📦 Creating full logo variants...")
    
    # Large (for hero sections)
    ratio = 320 / full_logo.width
    full_lg = full_logo.resize((320, int(full_logo.height * ratio)), Image.Resampling.LANCZOS)
    path = f"{OUTPUT_DIR}/sla-logo-full-lg.png"
    full_lg.save(path, 'PNG', optimize=True)
    variants['full_lg'] = path
    print(f"   ✓ {path} ({full_lg.size[0]}x{full_lg.size[1]})")
    
    # Medium (for footer)
    ratio = 180 / full_logo.width
    full_md = full_logo.resize((180, int(full_logo.height * ratio)), Image.Resampling.LANCZOS)
    path = f"{OUTPUT_DIR}/sla-logo-full-md.png"
    full_md.save(path, 'PNG', optimize=True)
    variants['full_md'] = path
    print(f"   ✓ {path} ({full_md.size[0]}x{full_md.size[1]})")
    
    # Small (for mobile footer)
    ratio = 120 / full_logo.width
    full_sm = full_logo.resize((120, int(full_logo.height * ratio)), Image.Resampling.LANCZOS)
    path = f"{OUTPUT_DIR}/sla-logo-full-sm.png"
    full_sm.save(path, 'PNG', optimize=True)
    variants['full_sm'] = path
    print(f"   ✓ {path} ({full_sm.size[0]}x{full_sm.size[1]})")
    
    # === ICON VARIANTS (square, for favicons and small spaces) ===
    print("\n📦 Creating icon variants...")
    
    for size_name, size in [('xl', 128), ('lg', 96), ('md', 64), ('sm', 48), ('xs', 32)]:
        # Create square canvas with padding
        icon_square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Resize icon to fit with 10% padding
        inner_size = int(size * 0.85)
        ratio = min(inner_size / icon.width, inner_size / icon.height)
        new_w = int(icon.width * ratio)
        new_h = int(icon.height * ratio)
        resized_icon = icon.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center in square
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        icon_square.paste(resized_icon, (x, y), resized_icon)
        
        path = f"{OUTPUT_DIR}/sla-icon-{size_name}.png"
        icon_square.save(path, 'PNG', optimize=True)
        variants[f'icon_{size_name}'] = path
        print(f"   ✓ {path} ({size}x{size})")
    
    # === FAVICONS ===
    print("\n📦 Creating favicon variants...")
    
    for size in [16, 32, 48, 64, 128, 180, 192, 512]:
        favicon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Resize icon with padding
        inner_size = int(size * 0.80)
        ratio = min(inner_size / icon.width, inner_size / icon.height)
        new_w = int(icon.width * ratio)
        new_h = int(icon.height * ratio)
        resized_icon = icon.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        favicon.paste(resized_icon, (x, y), resized_icon)
        
        path = f"{OUTPUT_DIR}/favicon-{size}x{size}.png"
        favicon.save(path, 'PNG', optimize=True)
        variants[f'favicon_{size}'] = path
        print(f"   ✓ {path}")
    
    # === APPLE TOUCH ICON ===
    print("\n📦 Creating apple touch icon...")
    apple_icon = Image.new('RGBA', (180, 180), (245, 243, 239, 255))  # Light background
    inner_size = int(180 * 0.65)
    ratio = min(inner_size / icon.width, inner_size / icon.height)
    new_w = int(icon.width * ratio)
    new_h = int(icon.height * ratio)
    resized_icon = icon.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (180 - new_w) // 2
    y = (180 - new_h) // 2
    apple_icon.paste(resized_icon, (x, y), resized_icon)
    path = f"{OUTPUT_DIR}/apple-touch-icon.png"
    apple_icon.save(path, 'PNG', optimize=True)
    variants['apple_touch'] = path
    print(f"   ✓ {path}")
    
    # === OG IMAGE ===
    print("\n📦 Creating OG image for social sharing...")
    og_image = Image.new('RGBA', (1200, 630), (245, 243, 239, 255))
    # Place full logo centered
    ratio = min(600 / full_logo.width, 350 / full_logo.height)
    new_w = int(full_logo.width * ratio)
    new_h = int(full_logo.height * ratio)
    resized_full = full_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (1200 - new_w) // 2
    y = (630 - new_h) // 2
    og_image.paste(resized_full, (x, y), resized_full)
    path = f"{OUTPUT_DIR}/og-image.png"
    og_image.save(path, 'PNG', optimize=True)
    variants['og_image'] = path
    print(f"   ✓ {path}")
    
    print("\n" + "=" * 60)
    print("✅ LOGO VARIANTS CREATED SUCCESSFULLY")
    print("=" * 60)
    print(f"\nTotal variants: {len(variants)}")
    
    return variants

if __name__ == "__main__":
    create_responsive_variants()
