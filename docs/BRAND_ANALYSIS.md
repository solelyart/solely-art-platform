# SolelyArt Brand Analysis & Asset Inventory

## Executive Summary

This document provides a comprehensive analysis of the SolelyArt brand assets and guidelines, establishing the foundation for marketplace application integration.

---

## 1. Brand Identity Overview

### Brand Name
- **Primary**: SOLELYART (all caps, spaced letters)
- **Logo Mark**: SLA monogram (intertwined S, L, A letters)

### Brand Personality
- Elegant and sophisticated
- Artistic and creative
- Premium marketplace positioning
- Modern yet timeless aesthetic

---

## 2. Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Teal/Brand Primary** | `#4A7C85` | rgb(74, 124, 133) | Logo, primary buttons, accents, links |
| **Cream/Light Background** | `#F5F2ED` | rgb(245, 242, 237) | Light backgrounds, cards, sections |
| **Charcoal/Dark** | `#333333` | rgb(51, 51, 51) | Dark backgrounds, text, dark mode |

### Color Application Rules
- **Light backgrounds**: Use teal logo with charcoal text
- **Dark backgrounds**: Use cream/white logo with light text
- **Teal backgrounds**: Use white/cream logo
- **Cream backgrounds**: Use teal or charcoal logo

### Extended Palette (Derived)

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#F5F2ED` | `#333333` |
| Surface/Card | `#FFFFFF` | `#404040` |
| Primary | `#4A7C85` | `#4A7C85` |
| Primary Hover | `#3D6970` | `#5A8C95` |
| Text Primary | `#333333` | `#F5F2ED` |
| Text Secondary | `#666666` | `#CCCCCC` |
| Border | `#E0DDD8` | `#555555` |
| Accent | `#4A7C85` | `#6A9CA5` |

---

## 3. Typography

### Primary Font
- **Font Name**: Wondershine
- **Style**: Serif, elegant, high legibility
- **Base Size**: 23.92pt (approximately 24px for web)
- **Character**: Classic, refined, artistic

### Typography Scale (Web Implementation)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 48-64px | 400 | 1.2 |
| H2 (Section) | 36-42px | 400 | 1.25 |
| H3 (Subsection) | 28-32px | 400 | 1.3 |
| H4 (Card Title) | 22-24px | 400 | 1.35 |
| Body | 16-18px | 400 | 1.6 |
| Small/Caption | 14px | 400 | 1.5 |

### Font Fallback Stack
```css
font-family: 'Wondershine', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
```

**Note**: Wondershine is a custom font. For web implementation, consider:
1. Self-hosting the font if license permits
2. Using Google Fonts alternatives: **Cormorant Garamond** or **Playfair Display** as fallbacks

---

## 4. Logo Assets Inventory

### Available Formats

| File | Format | Background | Usage |
|------|--------|------------|-------|
| `solelyartLogo(1)-01.png` | PNG | Transparent | Light backgrounds |
| `solelyartLogo(1)-01.jpg` | JPG | White | Print, email |
| `solelyartLogo(1)-02.png` | PNG | Transparent | Dark backgrounds |
| `solelyartLogo(1)-02.jpg` | JPG | Dark | Print, dark contexts |
| `solelyartLogo(1)-03.png` | PNG | Transparent | Alternative version |
| `solelyartLogo(1)-03.jpg` | JPG | Solid | Alternative version |
| `solelyartLogo(1)-04.png` | PNG | Transparent | Monochrome/white |
| `solelyartLogo(1)-04.jpg` | JPG | Solid | Monochrome/white |
| `solelyartLogo(1).ai` | AI | Vector | Source file |
| `solelyartLogo(1).eps` | EPS | Vector | Print production |
| `solelyartLogo(1).pdf` | PDF | Vector | Universal vector |
| `solelyartLogo(1)-01.psd` | PSD | Layered | Editing |
| `solelyartLogo(1)-02.psd` | PSD | Layered | Editing |
| `solelyartLogo(1)-03.psd` | PSD | Layered | Editing |
| `solelyartLogo(1)-04.psd` | PSD | Layered | Editing |

### Logo Variants

1. **Full Logo (Vertical Stack)**
   - SLA monogram on top
   - "SOLELYART" wordmark below
   - Use: Headers, splash screens, about pages

2. **Monogram Only (SLA)**
   - Compact mark without wordmark
   - Use: Favicons, app icons, small spaces, watermarks

3. **Color Versions**
   - Teal on light (#4A7C85 on #F5F2ED/white)
   - White/cream on dark (#F5F2ED on #333333/black)
   - White on teal (#FFFFFF on #4A7C85)
   - Charcoal on cream (#333333 on #F5F2ED)

---

## 5. Social Media Assets

| Asset | Dimensions | Platform |
|-------|------------|----------|
| `SALinkdinBanner(1).jpg` | 1584×396px | LinkedIn Banner |
| `SALinkdinDP(1).jpg` | 400×400px | LinkedIn Profile |
| `SAXBnner(1).jpg` | 1500×500px | X/Twitter Banner |
| `SAXDP(1).jpg` | 400×400px | X/Twitter Profile |
| `SAFBBanner(1).jpg` | 820×312px | Facebook Banner |
| `SAFBDP(1).jpg` | 170×170px | Facebook Profile |
| `SAInstaDP(1).jpg` | 320×320px | Instagram Profile |

---

## 6. Logo Usage Guidelines

### Exclusion Zone
- Maintain clear space around logo equal to the height of the "S" in the monogram
- No text or design elements should encroach on this space

### Minimum Sizes
| Context | Full Logo | Monogram Only |
|---------|-----------|---------------|
| Web | 120px width | 32px |
| Mobile | 100px width | 24px |
| Print | 1 inch | 0.5 inch |
| Favicon | N/A | 16px, 32px, 48px |

### Do's
- Use approved color combinations
- Maintain aspect ratio
- Use on appropriate backgrounds
- Keep logo upright and horizontal

### Don'ts
- Don't rotate or skew the logo
- Don't change colors outside palette
- Don't add effects (shadows, gradients, outlines)
- Don't stretch or distort
- Don't place on busy backgrounds
- Don't separate monogram from wordmark incorrectly

---

## 7. Web Implementation Specifications

### Favicon Set Required
```
favicon.ico (16x16, 32x32, 48x48)
apple-touch-icon.png (180x180)
icon-192.png (192x192)
icon-512.png (512x512)
```

### Logo Sizes for Web

| Location | Width | Format |
|----------|-------|--------|
| Header (Desktop) | 140-160px | SVG/PNG |
| Header (Mobile) | 100-120px | SVG/PNG |
| Footer | 120-140px | SVG/PNG |
| Loading Screen | 200-240px | SVG/PNG |
| Email Header | 200px | PNG |
| OG Image | Include in 1200x630px | PNG |

---

## 8. UI Component Styling

### Buttons

**Primary Button**
```css
background: #4A7C85;
color: #FFFFFF;
border-radius: 4px;
padding: 12px 24px;
font-family: 'Wondershine', serif;
letter-spacing: 0.05em;
```

**Secondary Button**
```css
background: transparent;
color: #4A7C85;
border: 1px solid #4A7C85;
border-radius: 4px;
```

### Cards
```css
background: #FFFFFF;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(51, 51, 51, 0.08);
```

### Input Fields
```css
border: 1px solid #E0DDD8;
border-radius: 4px;
padding: 12px 16px;
font-family: 'Wondershine', serif;
```

### Accent Elements
- Underlines: `#4A7C85` (teal)
- Dividers: `#E0DDD8` (light) or `#555555` (dark)
- Highlights: `rgba(74, 124, 133, 0.1)`

---

## 9. Accessibility Considerations

### Color Contrast Ratios

| Combination | Ratio | WCAG AA | WCAG AAA |
|-------------|-------|---------|----------|
| #333333 on #F5F2ED | 10.5:1 | ✅ Pass | ✅ Pass |
| #4A7C85 on #FFFFFF | 4.6:1 | ✅ Pass | ❌ Fail |
| #4A7C85 on #F5F2ED | 4.2:1 | ✅ Pass (Large) | ❌ Fail |
| #FFFFFF on #4A7C85 | 4.6:1 | ✅ Pass | ❌ Fail |
| #F5F2ED on #333333 | 10.5:1 | ✅ Pass | ✅ Pass |

### Recommendations
- Use #333333 for body text on light backgrounds
- Teal (#4A7C85) is suitable for large text and interactive elements
- Ensure sufficient contrast for all interactive elements
- Provide focus states with visible outlines

---

## 10. Dark Mode Implementation

### Color Mapping

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | #F5F2ED | #1A1A1A |
| Surface | #FFFFFF | #333333 |
| Primary | #4A7C85 | #5A8C95 |
| Text | #333333 | #F5F2ED |
| Border | #E0DDD8 | #444444 |
| Logo | Teal version | White/cream version |

---

## Next Steps

1. Process and optimize logo files for web use
2. Create SVG versions of logos for scalability
3. Generate favicon set from monogram
4. Update CSS variables in the application
5. Implement typography with font fallbacks
6. Apply color palette across all components
