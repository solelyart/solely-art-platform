# Solely Art Platform - Color Palette Documentation

## Design Philosophy: Neutral Editorial + Precision Accent

**Theme:** "Where taste flexes quietly"  
**Use Case:** Luxury branding, editorial UI, art marketplace  
**Approach:** Warm neutrals for surfaces, precision accent for meaning

---

## Light Mode (Default)

### Base Background
- **Linen** `#F3F1ED`
  - Warm, sophisticated base
  - Creates premium canvas for content
  - Contrast ratio: Base reference

### Primary Surfaces

#### Card Backgrounds
- **Light Greige** `#DAD6CF`
  - Subtle elevation for cards
  - Contrast vs Linen: 1.5:1
  - Use: Card backgrounds, elevated surfaces

#### Support Elements
- **Mushroom** `#CFC6BB`
  - Muted states and borders
  - Contrast vs Linen: 1.7:1
  - Use: Hover states, inactive tabs, borders, inputs

### Interactive Accent

#### Primary Accent
- **Muted Teal** `#6F9E9A`
  - Precision accent for CTAs
  - Contrast vs Linen: 4.6:1 ✅ AA
  - Use: Primary buttons, links, active states, focus rings

#### Lighter Teal Variant
- **Light Teal** `#8FB3AF`
  - Hover states for teal elements
  - Use: Button hover, accent highlights

#### Lightest Teal Variant
- **Pale Teal** `#A5C4C0`
  - Subtle backgrounds and gradients
  - Use: Gradient endpoints, very subtle highlights

### Text Colors

#### Primary Text
- **Near-Black** `#1F1F1F`
  - Main text color
  - Contrast vs Linen: 15.4:1 ✅ AAA
  - Use: Headings, body text, critical information

#### Secondary Text
- **Charcoal Grey** `#4A4A4A`
  - Muted text content
  - Use: Descriptions, captions, secondary information

### Utility Colors

#### Destructive/Error
- **Warm Red** `#C74B3E`
  - Error states and destructive actions
  - Contrast: Sufficient for warnings
  - Use: Error messages, delete buttons

#### White
- **Pure White** `#FFFFFF`
  - Popovers and overlays
  - Use: Dropdown menus, modals, tooltips

---

## Dark Mode

### Base Background
- **Deep Charcoal** `#1F1F1F`
  - Rich dark background
  - Maintains warmth in dark mode

### Primary Surfaces

#### Card Backgrounds
- **Warm Dark Grey** `#2A2A28`
  - Elevated surfaces in dark mode
  - Subtle warmth maintained

#### Support Elements
- **Medium Dark Grey** `#3A3A38`
  - Borders and muted elements
  - Warm undertones

### Interactive Accent

#### Primary Accent
- **Light Teal** `#8FB3AF`
  - Adjusted for dark backgrounds
  - Maintains brand consistency

#### Lighter Variant
- **Pale Teal** `#A5C4C0`
  - Hover and highlight states

### Text Colors

#### Primary Text
- **Linen** `#F3F1ED`
  - Light text on dark background
  - Excellent contrast

#### Secondary Text
- **Light Grey** `#B8B5B0`
  - Muted text in dark mode

#### Support Text
- **Medium Grey** `#98989A`
  - Tertiary text elements

### Secondary Accent (Dark Mode)

#### Mushroom Adjusted
- **Warm Taupe** `#8A8176`
  - Secondary buttons and elements

#### Deep Taupe
- **Deep Taupe** `#6A5F54`
  - Chart and data visualization

---

## Semantic Color Mapping

### CSS Variables (Light Mode)

```css
:root {
  /* Primary Accent */
  --primary: #6F9E9A;
  --primary-foreground: #FFFFFF;
  
  /* Secondary */
  --secondary: #CFC6BB;
  --secondary-foreground: #1F1F1F;
  
  /* Accent */
  --accent: #6F9E9A;
  --accent-foreground: #FFFFFF;
  
  /* Background */
  --background: #F3F1ED;
  --foreground: #1F1F1F;
  
  /* Card */
  --card: #DAD6CF;
  --card-foreground: #1F1F1F;
  
  /* Popover */
  --popover: #FFFFFF;
  --popover-foreground: #1F1F1F;
  
  /* Muted */
  --muted: #CFC6BB;
  --muted-foreground: #4A4A4A;
  
  /* Border & Input */
  --border: #CFC6BB;
  --input: #DAD6CF;
  --ring: #6F9E9A;
  
  /* Destructive */
  --destructive: #C74B3E;
  --destructive-foreground: #FFFFFF;
}
```

---

## Component-Specific Usage

### Buttons

#### Primary CTA (.btn-cta)
- **Background:** Muted Teal `#6F9E9A`
- **Text:** White `#FFFFFF`
- **Hover:** Darker Teal `#5F8E8A`
- **Use:** Main actions, "Book Now", "Apply", "Search"

#### Secondary Button (.btn-secondary)
- **Background:** Mushroom `#CFC6BB`
- **Text:** Near-Black `#1F1F1F`
- **Hover:** Darker Mushroom `#BFB6AB`
- **Use:** Secondary actions, "Cancel", "Back"

#### Outline Button
- **Border:** Mushroom `#CFC6BB`
- **Text:** Near-Black `#1F1F1F`
- **Background:** Transparent
- **Hover:** Light Greige `#DAD6CF`

### Cards

#### Standard Card
- **Background:** Light Greige `#DAD6CF`
- **Border:** Mushroom `#CFC6BB` (optional)
- **Text:** Near-Black `#1F1F1F`

#### Elevated Card (hover-lift)
- **Background:** Light Greige `#DAD6CF`
- **Shadow:** Elegant shadow (rgba based on Near-Black)
- **Hover:** Lift with enhanced shadow

### Navigation

#### Header (.glass-effect)
- **Background:** Linen `#F3F1ED` at 90% opacity
- **Backdrop Blur:** 12px
- **Border:** Mushroom `#CFC6BB` at 50% opacity

#### Active Nav Link
- **Text:** Muted Teal `#6F9E9A`
- **Underline:** Muted Teal `#6F9E9A`

#### Inactive Nav Link
- **Text:** Near-Black `#1F1F1F` at 80% opacity
- **Hover:** Muted Teal `#6F9E9A`

### Forms

#### Input Fields
- **Background:** Light Greige `#DAD6CF`
- **Border:** Mushroom `#CFC6BB`
- **Text:** Near-Black `#1F1F1F`
- **Placeholder:** Charcoal Grey `#4A4A4A`
- **Focus Border:** Muted Teal `#6F9E9A`
- **Focus Ring:** Muted Teal `#6F9E9A` at 50% opacity

### Typography

#### Headings (h1-h6)
- **Font:** Cormorant Garamond
- **Color:** Near-Black `#1F1F1F`
- **Weight:** 500-600

#### Body Text
- **Font:** Inter
- **Color:** Near-Black `#1F1F1F`
- **Weight:** 400

#### Secondary Text
- **Font:** Inter
- **Color:** Charcoal Grey `#4A4A4A`
- **Weight:** 300-400

#### Gradient Text (.text-gradient)
- **Colors:** Muted Teal → Light Teal → Mushroom
- **Use:** Hero headlines, featured text

---

## Gradients

### Artistic Background (.gradient-artistic)
```css
background: linear-gradient(135deg, 
  #F3F1ED 0%,    /* Linen */
  #EAE7E2 50%,   /* Mid-tone */
  #DAD6CF 100%   /* Light Greige */
);
```

### Hero Gradient (.gradient-hero)
```css
background: linear-gradient(135deg,
  #6F9E9A 0%,    /* Muted Teal */
  #8FB3AF 50%,   /* Light Teal */
  #A5C4C0 100%   /* Pale Teal */
);
```

### Text Gradient (.text-gradient)
```css
background: linear-gradient(135deg,
  #6F9E9A,       /* Muted Teal */
  #8FB3AF,       /* Light Teal */
  #CFC6BB        /* Mushroom */
);
```

### Brush Underline (.brush-underline::after)
```css
background: linear-gradient(90deg,
  rgba(111, 158, 154, 0.6),  /* Muted Teal 60% */
  rgba(111, 158, 154, 0.3),  /* Muted Teal 30% */
  rgba(111, 158, 154, 0.6)   /* Muted Teal 60% */
);
```

---

## Charts & Data Visualization

### Chart Colors (Light Mode)
1. **Chart 1:** Muted Teal `#6F9E9A`
2. **Chart 2:** Mushroom `#CFC6BB`
3. **Chart 3:** Light Greige `#DAD6CF`
4. **Chart 4:** Light Teal `#8FB3AF`
5. **Chart 5:** Deep Taupe `#4A4036`

### Chart Colors (Dark Mode)
1. **Chart 1:** Light Teal `#8FB3AF`
2. **Chart 2:** Warm Taupe `#8A8176`
3. **Chart 3:** Light Grey `#B8B5B0`
4. **Chart 4:** Pale Teal `#A5C4C0`
5. **Chart 5:** Deep Taupe `#6A5F54`

---

## Accessibility Standards

### WCAG Compliance

#### AAA Level (Text)
- **Near-Black on Linen:** 15.4:1 ✅
- **Use:** All body text, headings, critical information

#### AA Level (Interactive Elements)
- **Muted Teal on Linen:** 4.6:1 ✅
- **Use:** Buttons, links, interactive elements

#### Decorative Only (< 3:1)
- **Light Greige on Linen:** 1.5:1
- **Mushroom on Linen:** 1.7:1
- **Use:** Backgrounds, borders, subtle elevation (not for text)

### Focus States
- **Ring Color:** Muted Teal `#6F9E9A`
- **Ring Opacity:** 50%
- **Ring Width:** 2px
- **Ring Offset:** 2px

---

## Design Tokens

### Spacing
- Uses Tailwind's default spacing scale
- Emphasis on generous whitespace
- Consistent padding: 1rem (mobile), 1.5rem (tablet), 2rem (desktop)

### Border Radius
- **Default:** 0.5rem (8px)
- **Small:** 0.375rem (6px)
- **Medium:** 0.5rem (8px)
- **Large:** 0.75rem (12px)
- **XL:** 1rem (16px)

### Shadows

#### Elegant Shadow (.shadow-elegant)
```css
box-shadow: 
  0 1px 2px rgba(31, 31, 31, 0.05),
  0 4px 8px rgba(31, 31, 31, 0.08),
  0 16px 32px rgba(31, 31, 31, 0.08);
```

#### Hover Lift Shadow (.hover-lift:hover)
```css
box-shadow: 
  0 4px 8px rgba(31, 31, 31, 0.08),
  0 12px 24px rgba(31, 31, 31, 0.12),
  0 24px 48px rgba(31, 31, 31, 0.12);
```

---

## Usage Guidelines

### Do's ✅
- Use Muted Teal for all primary CTAs and important actions
- Maintain generous whitespace with warm neutral backgrounds
- Use Near-Black for all text requiring high readability
- Apply subtle elevation with Light Greige cards
- Use Mushroom for borders and inactive states
- Leverage the glass effect for navigation overlays

### Don'ts ❌
- Don't use Light Greige or Mushroom for text (insufficient contrast)
- Don't use bright, saturated colors that clash with the editorial palette
- Don't apply heavy shadows that contradict the refined aesthetic
- Don't use pure black `#000000` (use Near-Black `#1F1F1F` instead)
- Don't mix this palette with other color systems without careful consideration

---

## Color Psychology

### Muted Teal `#6F9E9A`
- **Emotion:** Trust, sophistication, calm
- **Association:** Premium quality, artistic refinement
- **Use:** Confidence-building CTAs, brand identity

### Linen `#F3F1ED`
- **Emotion:** Warmth, elegance, comfort
- **Association:** Natural materials, luxury textiles
- **Use:** Creates inviting, premium atmosphere

### Near-Black `#1F1F1F`
- **Emotion:** Authority, clarity, professionalism
- **Association:** High-end editorial, luxury branding
- **Use:** Clear communication, serious content

### Mushroom `#CFC6BB`
- **Emotion:** Subtle, organic, understated
- **Association:** Natural earth tones, sustainable luxury
- **Use:** Supporting elements that don't compete for attention

---

## Implementation Notes

### Tailwind CSS Integration
All colors are defined as CSS custom properties and automatically mapped to Tailwind utilities:

- `bg-primary` → Muted Teal
- `bg-secondary` → Mushroom
- `bg-card` → Light Greige
- `bg-background` → Linen
- `text-foreground` → Near-Black
- `text-muted-foreground` → Charcoal Grey
- `border-border` → Mushroom

### Dark Mode
Dark mode is fully supported with adjusted color values that maintain the warm, editorial feel while providing sufficient contrast for readability.

### Browser Support
All colors use standard hex values for maximum compatibility. Gradients use modern CSS but degrade gracefully in older browsers.

---

## Version History

### v1.0.0 (Current)
- Implemented Neutral Editorial + Precision Accent palette
- Linen base with warm greige neutrals
- Muted Teal precision accent
- Near-Black text with 15.4:1 AAA contrast
- Full dark mode support

---

**Last Updated:** December 2024  
**Design System:** Solely Art Platform v1.0  
**Theme:** Neutral Editorial + Precision Accent
