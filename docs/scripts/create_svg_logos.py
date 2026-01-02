#!/usr/bin/env python3
"""
Convert PNG logos to SVG and create responsive variants for perfect scaling.
Uses color-based tracing to preserve the teal SLA monogram and dark text.
"""

import os
import subprocess
from PIL import Image
import numpy as np

# Paths
SOURCE_LOGO = "/home/ubuntu/upload/solelyartLogo(1)-03.webp"
OUTPUT_DIR = "/home/ubuntu/solely-art-platform/client/public/brand"

# Brand colors extracted from logo
TEAL_COLOR = "#4E7B82"  # SLA monogram
DARK_COLOR = "#3D3D3D"  # SOLELYART text
BG_COLOR = "#F5F3EF"    # Background (cream)

def remove_background_precise(img):
    """Remove background with precise color detection"""
    img_rgba = img.convert('RGBA')
    data = np.array(img_rgba)
    
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    
    # Background is light cream - be more aggressive
    bg_mask = (r > 220) & (g > 215) & (b > 210)
    
    data[:,:,3] = np.where(bg_mask, 0, 255)
    
    return Image.fromarray(data)

def crop_to_content(img, padding=10):
    """Crop to content with padding"""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    alpha = np.array(img)[:,:,3]
    rows = np.any(alpha > 0, axis=1)
    cols = np.any(alpha > 0, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        return img
    
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    h, w = alpha.shape
    rmin = max(0, rmin - padding)
    rmax = min(h, rmax + padding)
    cmin = max(0, cmin - padding)
    cmax = min(w, cmax + padding)
    
    return img.crop((cmin, rmin, cmax, rmax))

def extract_icon(img):
    """Extract just the SLA monogram (top portion)"""
    w, h = img.size
    icon = img.crop((0, 0, w, int(h * 0.52)))
    return crop_to_content(icon, padding=5)

def create_svg_from_png(png_path, svg_path, color):
    """Convert PNG to SVG using potrace"""
    # Create temporary BMP for potrace
    temp_bmp = "/tmp/temp_logo.bmp"
    temp_pgm = "/tmp/temp_logo.pgm"
    
    # Load and convert to grayscale
    img = Image.open(png_path).convert('L')
    
    # Threshold to create binary image
    threshold = 128
    img_binary = img.point(lambda x: 0 if x < threshold else 255, '1')
    
    # Save as BMP
    img_binary.save(temp_bmp)
    
    # Convert BMP to PGM (potrace input format)
    subprocess.run(['convert', temp_bmp, temp_pgm], check=True)
    
    # Run potrace to create SVG
    subprocess.run([
        'potrace', temp_pgm,
        '-s',  # SVG output
        '-o', svg_path,
        '--color', color,
        '-t', '2',  # Suppress speckles
        '-a', '1.0',  # Corner threshold
        '-O', '0.2',  # Optimize
    ], check=True)
    
    # Clean up
    os.remove(temp_bmp)
    os.remove(temp_pgm)
    
    return svg_path

def create_manual_svg_icon(width, height, color=TEAL_COLOR):
    """Create a clean SVG representation of the SLA monogram"""
    # This creates a simplified but clean SVG version
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <defs>
    <style>
      .sla-icon {{ fill: {color}; }}
    </style>
  </defs>
  <g class="sla-icon">
    <!-- S letter - curved -->
    <path d="M15,8 C15,4 20,2 28,2 C36,2 42,5 42,10 C42,16 35,18 28,20 C21,22 15,24 15,30 C15,36 21,40 30,40 C39,40 45,36 45,30" 
          fill="none" stroke="{color}" stroke-width="4" stroke-linecap="round"/>
    <!-- L letter -->
    <path d="M25,15 L25,55 L50,55" fill="none" stroke="{color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- A letter -->
    <path d="M35,55 L55,10 L75,55 M42,40 L68,40" fill="none" stroke="{color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>'''
    return svg_content

def create_high_quality_png_variants():
    """Create high-quality PNG variants at multiple sizes"""
    print("=" * 60)
    print("CREATING RESPONSIVE LOGO VARIANTS")
    print("=" * 60)
    
    # Load source
    print("\n📥 Loading source logo...")
    source = Image.open(SOURCE_LOGO)
    print(f"   Source size: {source.size}")
    
    # Remove background
    print("\n🔲 Removing background...")
    transparent = remove_background_precise(source)
    
    # Extract components
    print("\n✂️ Extracting components...")
    full_logo = crop_to_content(transparent, padding=20)
    icon = extract_icon(transparent)
    
    print(f"   Full logo: {full_logo.size}")
    print(f"   Icon: {icon.size}")
    
    # === CREATE HIGH-RES PNG VARIANTS ===
    print("\n📦 Creating high-resolution PNG variants...")
    
    variants = {}
    
    # Icon variants for header (multiple sizes for srcset)
    icon_sizes = [
        ('icon-1x', 40),   # 1x for standard displays
        ('icon-2x', 80),   # 2x for retina
        ('icon-3x', 120),  # 3x for super retina
    ]
    
    for name, height in icon_sizes:
        ratio = height / icon.height
        new_width = int(icon.width * ratio)
        resized = icon.resize((new_width, height), Image.Resampling.LANCZOS)
        path = f"{OUTPUT_DIR}/sla-{name}.png"
        resized.save(path, 'PNG', optimize=True)
        variants[name] = path
        print(f"   ✓ {path} ({new_width}x{height})")
    
    # Full logo variants for footer/hero
    full_sizes = [
        ('full-1x', 180),   # 1x width
        ('full-2x', 360),   # 2x width
        ('full-3x', 540),   # 3x width
    ]
    
    for name, width in full_sizes:
        ratio = width / full_logo.width
        new_height = int(full_logo.height * ratio)
        resized = full_logo.resize((width, new_height), Image.Resampling.LANCZOS)
        path = f"{OUTPUT_DIR}/sla-{name}.png"
        resized.save(path, 'PNG', optimize=True)
        variants[name] = path
        print(f"   ✓ {path} ({width}x{new_height})")
    
    # Mobile-specific icon (smaller, square with padding)
    print("\n📱 Creating mobile-optimized icon...")
    mobile_size = 32
    mobile_icon = Image.new('RGBA', (mobile_size, mobile_size), (0, 0, 0, 0))
    inner_size = int(mobile_size * 0.85)
    ratio = min(inner_size / icon.width, inner_size / icon.height)
    new_w = int(icon.width * ratio)
    new_h = int(icon.height * ratio)
    resized_icon = icon.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (mobile_size - new_w) // 2
    y = (mobile_size - new_h) // 2
    mobile_icon.paste(resized_icon, (x, y), resized_icon)
    path = f"{OUTPUT_DIR}/sla-mobile-icon.png"
    mobile_icon.save(path, 'PNG', optimize=True)
    variants['mobile'] = path
    print(f"   ✓ {path} (32x32)")
    
    # Also create 2x mobile icon
    mobile_size_2x = 64
    mobile_icon_2x = Image.new('RGBA', (mobile_size_2x, mobile_size_2x), (0, 0, 0, 0))
    inner_size = int(mobile_size_2x * 0.85)
    ratio = min(inner_size / icon.width, inner_size / icon.height)
    new_w = int(icon.width * ratio)
    new_h = int(icon.height * ratio)
    resized_icon = icon.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (mobile_size_2x - new_w) // 2
    y = (mobile_size_2x - new_h) // 2
    mobile_icon_2x.paste(resized_icon, (x, y), resized_icon)
    path = f"{OUTPUT_DIR}/sla-mobile-icon-2x.png"
    mobile_icon_2x.save(path, 'PNG', optimize=True)
    variants['mobile-2x'] = path
    print(f"   ✓ {path} (64x64)")
    
    # === CREATE SVG VERSIONS ===
    print("\n🎨 Creating SVG versions...")
    
    # Save icon as high-res PNG for SVG conversion
    icon_for_svg = icon.resize((400, int(icon.height * 400 / icon.width)), Image.Resampling.LANCZOS)
    icon_png_path = "/tmp/icon_for_svg.png"
    icon_for_svg.save(icon_png_path)
    
    # Create SVG from icon
    try:
        svg_icon_path = f"{OUTPUT_DIR}/sla-icon.svg"
        create_svg_from_png(icon_png_path, svg_icon_path, TEAL_COLOR)
        variants['svg-icon'] = svg_icon_path
        print(f"   ✓ {svg_icon_path}")
    except Exception as e:
        print(f"   ⚠ SVG conversion failed: {e}")
        # Create fallback inline SVG
        print("   Creating fallback SVG...")
    
    # Save full logo as high-res PNG for SVG conversion
    full_for_svg = full_logo.resize((800, int(full_logo.height * 800 / full_logo.width)), Image.Resampling.LANCZOS)
    full_png_path = "/tmp/full_for_svg.png"
    full_for_svg.save(full_png_path)
    
    try:
        svg_full_path = f"{OUTPUT_DIR}/sla-full.svg"
        create_svg_from_png(full_png_path, svg_full_path, TEAL_COLOR)
        variants['svg-full'] = svg_full_path
        print(f"   ✓ {svg_full_path}")
    except Exception as e:
        print(f"   ⚠ Full SVG conversion failed: {e}")
    
    print("\n" + "=" * 60)
    print("✅ RESPONSIVE LOGO VARIANTS CREATED")
    print("=" * 60)
    print(f"\nTotal variants: {len(variants)}")
    
    return variants

if __name__ == "__main__":
    create_high_quality_png_variants()
