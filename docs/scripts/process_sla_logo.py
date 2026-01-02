#!/usr/bin/env python3
"""
Process the SLA logo using the Logo Processor Toolkit
Extracts colors, separates components, and generates optimized variants
"""

import sys
import os

# Add toolkit to path
sys.path.insert(0, "/home/ubuntu/logo_processor_toolkit_repo")

import numpy as np
from PIL import Image
import cv2

# Import toolkit modules
from logo_processor_toolkit import (
    KMeansColorDetector, 
    ColorPalette,
    rgb_to_name,
    BackgroundRemover,
    ContourDetector
)

# Paths
LOGO_PATH = "/home/ubuntu/upload/solelyartLogo(1)-03.webp"
OUTPUT_DIR = "/home/ubuntu/solely-art-platform/client/public/brand"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_logo():
    """Load the logo image"""
    print("📥 Loading logo...")
    img = Image.open(LOGO_PATH)
    print(f"   Original size: {img.size}")
    print(f"   Mode: {img.mode}")
    return img

def extract_colors(img):
    """Extract dominant colors using K-means"""
    print("\n🎨 Extracting colors with K-means...")
    
    # Convert to numpy array
    img_array = np.array(img.convert('RGB'))
    
    # Initialize detector
    detector = KMeansColorDetector(n_colors=5)
    colors = detector.detect(img_array)
    
    print("   Detected colors:")
    for i, c in enumerate(colors):
        name = rgb_to_name(c.rgb) if hasattr(c, 'rgb') else "Unknown"
        hex_val = c.hex if hasattr(c, 'hex') else f"#{c.rgb[0]:02x}{c.rgb[1]:02x}{c.rgb[2]:02x}"
        pct = c.percentage if hasattr(c, 'percentage') else 0
        print(f"   {i+1}. {hex_val} - {name} ({pct:.1f}%)")
    
    return colors

def remove_background(img):
    """Remove background from logo"""
    print("\n🔲 Removing background...")
    
    img_array = np.array(img.convert('RGBA'))
    
    # Use the toolkit's background remover
    try:
        remover = BackgroundRemover()
        result = remover.remove(img_array)
        print("   Background removed successfully")
        return Image.fromarray(result)
    except Exception as e:
        print(f"   Using fallback method: {e}")
        # Fallback: Simple color-based removal
        return remove_background_simple(img)

def remove_background_simple(img):
    """Simple background removal based on dominant background color"""
    img_rgba = img.convert('RGBA')
    data = np.array(img_rgba)
    
    # The background is a light cream/beige color (~#F5F3EF)
    # Find pixels close to this color
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Background color threshold (light colors)
    bg_mask = (r > 230) & (g > 225) & (b > 220)
    
    # Make background transparent
    data[:,:,3] = np.where(bg_mask, 0, 255)
    
    return Image.fromarray(data)

def segment_components(img):
    """Segment logo into icon and text components"""
    print("\n✂️ Segmenting logo components...")
    
    # Convert to numpy for OpenCV processing
    img_rgba = img.convert('RGBA')
    img_array = np.array(img_rgba)
    
    # Get alpha channel or create mask from non-background pixels
    if img_array.shape[2] == 4:
        alpha = img_array[:,:,3]
    else:
        # Create mask from non-white pixels
        gray = cv2.cvtColor(img_array[:,:,:3], cv2.COLOR_RGB2GRAY)
        _, alpha = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(alpha, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"   Found {len(contours)} contour regions")
    
    # Analyze contours to find icon vs text
    components = []
    for i, cnt in enumerate(contours):
        x, y, w, h = cv2.boundingRect(cnt)
        area = cv2.contourArea(cnt)
        aspect_ratio = w / h if h > 0 else 0
        
        components.append({
            'index': i,
            'bbox': (x, y, w, h),
            'area': area,
            'aspect_ratio': aspect_ratio
        })
    
    # Sort by y-position (top to bottom)
    components.sort(key=lambda c: c['bbox'][1])
    
    # The SLA icon is at the top, SOLELYART text is at the bottom
    # Icon typically has aspect ratio closer to 1, text is wider
    
    icon_region = None
    text_region = None
    
    for comp in components:
        x, y, w, h = comp['bbox']
        if comp['aspect_ratio'] < 1.5 and comp['area'] > 1000:
            # Likely the icon (more square-ish)
            if icon_region is None or comp['bbox'][1] < icon_region['bbox'][1]:
                icon_region = comp
        elif comp['aspect_ratio'] > 2:
            # Likely the text (wider)
            text_region = comp
    
    return components, icon_region, text_region

def extract_icon(img, icon_region):
    """Extract just the SLA icon"""
    if icon_region is None:
        print("   No icon region detected, using top portion")
        # Fallback: use top 60% of image
        w, h = img.size
        return img.crop((0, 0, w, int(h * 0.6)))
    
    x, y, w, h = icon_region['bbox']
    # Add padding
    pad = 20
    x = max(0, x - pad)
    y = max(0, y - pad)
    
    return img.crop((x, y, x + w + pad*2, y + h + pad*2))

def extract_text(img, text_region):
    """Extract just the SOLELYART text"""
    if text_region is None:
        print("   No text region detected, using bottom portion")
        # Fallback: use bottom 40% of image
        w, h = img.size
        return img.crop((0, int(h * 0.6), w, h))
    
    x, y, w, h = text_region['bbox']
    # Add padding
    pad = 10
    x = max(0, x - pad)
    y = max(0, y - pad)
    
    return img.crop((x, y, x + w + pad*2, y + h + pad*2))

def create_variants(img, icon, text):
    """Create all logo variants for web use"""
    print("\n📦 Creating logo variants...")
    
    variants = {}
    
    # 1. Full logo with transparent background
    print("   Creating full logo variants...")
    full_transparent = remove_background_simple(img)
    
    # Full logo at different sizes
    for size_name, width in [('lg', 400), ('md', 224), ('sm', 120)]:
        ratio = width / full_transparent.width
        new_height = int(full_transparent.height * ratio)
        resized = full_transparent.resize((width, new_height), Image.Resampling.LANCZOS)
        path = f"{OUTPUT_DIR}/sla-logo-full-{size_name}.png"
        resized.save(path, 'PNG')
        variants[f'full_{size_name}'] = path
        print(f"   ✓ {path} ({width}x{new_height})")
    
    # 2. Icon only variants
    print("   Creating icon variants...")
    icon_transparent = remove_background_simple(icon)
    
    # Icon at different sizes
    for size_name, size in [('lg', 120), ('md', 64), ('sm', 44), ('xs', 32)]:
        # Make square by fitting to size
        icon_square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        # Resize icon maintaining aspect ratio
        ratio = min(size / icon_transparent.width, size / icon_transparent.height)
        new_w = int(icon_transparent.width * ratio)
        new_h = int(icon_transparent.height * ratio)
        resized_icon = icon_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
        # Center in square
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        icon_square.paste(resized_icon, (x, y), resized_icon)
        
        path = f"{OUTPUT_DIR}/sla-icon-{size_name}.png"
        icon_square.save(path, 'PNG')
        variants[f'icon_{size_name}'] = path
        print(f"   ✓ {path} ({size}x{size})")
    
    # 3. Favicon variants
    print("   Creating favicon variants...")
    for size in [16, 32, 48, 64, 128, 180, 192, 512]:
        favicon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        ratio = min(size / icon_transparent.width, size / icon_transparent.height) * 0.85  # 85% to add padding
        new_w = int(icon_transparent.width * ratio)
        new_h = int(icon_transparent.height * ratio)
        resized_icon = icon_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        favicon.paste(resized_icon, (x, y), resized_icon)
        
        path = f"{OUTPUT_DIR}/favicon-{size}x{size}.png"
        favicon.save(path, 'PNG')
        variants[f'favicon_{size}'] = path
        print(f"   ✓ {path}")
    
    # 4. Apple touch icon
    apple_icon = Image.new('RGBA', (180, 180), (245, 243, 239, 255))  # Light background
    ratio = min(180 / icon_transparent.width, 180 / icon_transparent.height) * 0.7
    new_w = int(icon_transparent.width * ratio)
    new_h = int(icon_transparent.height * ratio)
    resized_icon = icon_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (180 - new_w) // 2
    y = (180 - new_h) // 2
    apple_icon.paste(resized_icon, (x, y), resized_icon)
    path = f"{OUTPUT_DIR}/apple-touch-icon.png"
    apple_icon.save(path, 'PNG')
    variants['apple_touch'] = path
    print(f"   ✓ {path}")
    
    # 5. OG Image (social sharing)
    print("   Creating social sharing image...")
    og_image = Image.new('RGBA', (1200, 630), (245, 243, 239, 255))
    # Place full logo centered
    ratio = min(800 / full_transparent.width, 400 / full_transparent.height)
    new_w = int(full_transparent.width * ratio)
    new_h = int(full_transparent.height * ratio)
    resized_full = full_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (1200 - new_w) // 2
    y = (630 - new_h) // 2
    og_image.paste(resized_full, (x, y), resized_full)
    path = f"{OUTPUT_DIR}/og-image.png"
    og_image.save(path, 'PNG')
    variants['og_image'] = path
    print(f"   ✓ {path}")
    
    # 6. Header logo (icon + clear space)
    print("   Creating header logo...")
    header_height = 44
    ratio = header_height / icon_transparent.height
    new_w = int(icon_transparent.width * ratio)
    header_logo = icon_transparent.resize((new_w, header_height), Image.Resampling.LANCZOS)
    path = f"{OUTPUT_DIR}/sla-header-logo.png"
    header_logo.save(path, 'PNG')
    variants['header'] = path
    print(f"   ✓ {path} ({new_w}x{header_height})")
    
    return variants

def generate_color_report(colors):
    """Generate a color palette report"""
    print("\n📊 Generating color report...")
    
    report = """# SLA Logo Color Palette

## Extracted Colors (K-means Analysis)

| Color | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
"""
    
    for i, c in enumerate(colors):
        rgb = c.rgb if hasattr(c, 'rgb') else (0, 0, 0)
        hex_val = c.hex if hasattr(c, 'hex') else f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
        name = rgb_to_name(rgb) if hasattr(c, 'rgb') else "Unknown"
        pct = c.percentage if hasattr(c, 'percentage') else 0
        
        usage = "Background" if pct > 50 else ("Primary" if i == 1 else ("Secondary" if i == 2 else "Accent"))
        report += f"| ![{hex_val}](https://via.placeholder.com/20/{hex_val[1:]}/{hex_val[1:]}) | `{hex_val}` | `rgb({rgb[0]}, {rgb[1]}, {rgb[2]})` | {name} | {usage} ({pct:.1f}%) |\n"
    
    report += """
## Recommended Usage

- **Teal (#4A7C72)**: SLA monogram icon, primary accent
- **Dark Brown (#2C2420)**: SOLELYART text, headings
- **Cream (#F5F3EF)**: Backgrounds, cards
- **Light Teal (#8FB3AF)**: Hover states, secondary elements
"""
    
    path = f"{OUTPUT_DIR}/color-palette.md"
    with open(path, 'w') as f:
        f.write(report)
    print(f"   ✓ {path}")
    
    return path

def main():
    print("="*60)
    print("🎨 SLA LOGO PROCESSOR")
    print("   Using Logo Processor Toolkit v2.1")
    print("="*60)
    
    # Load logo
    img = load_logo()
    
    # Extract colors
    colors = extract_colors(img)
    
    # Segment components
    components, icon_region, text_region = segment_components(img)
    
    # Extract icon and text separately
    # For the SLA logo, we'll use a simpler approach based on image analysis
    # The icon is in the top portion, text in the bottom
    h = img.height
    w = img.width
    
    # Top 55% is the SLA icon
    icon = img.crop((0, 0, w, int(h * 0.55)))
    # Bottom 45% is the SOLELYART text
    text = img.crop((0, int(h * 0.55), w, h))
    
    print(f"   Icon region: {icon.size}")
    print(f"   Text region: {text.size}")
    
    # Create all variants
    variants = create_variants(img, icon, text)
    
    # Generate color report
    color_report = generate_color_report(colors)
    
    print("\n" + "="*60)
    print("✅ LOGO PROCESSING COMPLETE")
    print("="*60)
    print(f"\nGenerated {len(variants)} logo variants:")
    for name, path in variants.items():
        print(f"   • {name}: {os.path.basename(path)}")
    
    print(f"\nColor palette saved to: {color_report}")
    print(f"\nAll files saved to: {OUTPUT_DIR}")
    
    return variants

if __name__ == "__main__":
    main()
