# Design Updates Needed Based on Mood Board & Color Palette

## Current vs. Specified Colors

### ✅ Already Correct
- **Linen Background**: #F3F1ED ✓
- **Light Greige (Cards)**: #DAD6CF ✓
- **Mushroom (Support)**: #CFC6BB ✓
- **Muted Teal (Primary)**: #6F9E9A ✓
- **Near-Black (Text)**: #1F1F1F ✓
- **Charcoal Grey (Secondary Text)**: #4A4A4A ✓

### 🔄 Need to Add/Update

#### Missing Teal Variants
- **Light Teal**: #8FB3AF (for hover states)
- **Pale Teal**: #A5C4C0 (for subtle backgrounds/gradients)

#### Missing Utility Colors
- **Warm Red (Error)**: #C74B3E (currently using generic red)
- **Pure White**: #FFFFFF (for popovers/overlays)

#### Dark Mode Colors (Not Yet Implemented)
- **Deep Charcoal**: #1F1F1F (background)
- **Warm Dark Grey**: #2A2A28 (cards)
- **Medium Dark Grey**: #3A3A38 (support)
- **Light Grey**: #B8B5B0 (secondary text)
- **Medium Grey**: #98989A (support text)
- **Warm Taupe**: #8A8176 (secondary buttons)
- **Deep Taupe**: #6A5F54 (data viz)

## Design Standards to Implement

### Accessibility
- ✅ WCAG AAA: 15.4:1 contrast (Near-Black on Linen) - Already met
- ✅ WCAG AA: 4.6:1 contrast (Muted Teal on Linen) - Already met
- 🔄 Focus States: Need 2px ring with 2px offset in Muted Teal at 50% opacity
- 🔄 Keyboard Navigation: Ensure visible focus indicators everywhere

### Spacing (Need to Standardize)
- Mobile: 1rem (16px) padding
- Tablet: 1.5rem (24px) padding
- Desktop: 2rem (32px) padding
- Philosophy: Generous whitespace throughout

### Border Radius (Need to Standardize)
- Small: 0.375rem (6px)
- Default: 0.5rem (8px)
- Large: 0.75rem (12px)
- XL: 1rem (16px)

### Shadows (Need to Refine)
- Elegant Shadow: Multi-layer subtle shadow for refinement
- Hover Lift: Enhanced shadow on interaction
- Philosophy: Soft, sophisticated depth (not heavy or dramatic)

### Component-Specific Updates Needed

#### Buttons
**Primary CTA:**
- Background: Muted Teal #6F9E9A
- Hover: Light Teal #8FB3AF
- Text: White #FFFFFF
- Border radius: 0.5rem (8px)

**Secondary:**
- Background: Mushroom #CFC6BB
- Hover: Slightly darker
- Text: Near-Black #1F1F1F

#### Forms
- Input Background: Light Greige #DAD6CF
- Border: Mushroom #CFC6BB
- Focus Border: Muted Teal #6F9E9A
- Focus Ring: Muted Teal at 50% opacity
- Placeholder: Charcoal Grey #4A4A4A

#### Navigation
- Background: Linen #F3F1ED with 90% opacity + 12px blur
- Active Link: Muted Teal #6F9E9A with underline
- Inactive Link: Near-Black at 80% opacity
- Hover: Transition to Muted Teal

## Design Philosophy Reminders

### Do's ✓
1. Use Muted Teal for all primary CTAs and important actions
2. Maintain generous whitespace with warm neutral backgrounds
3. Use Near-Black for all text requiring high readability
4. Apply subtle elevation with Light Greige cards
5. Use Mushroom for borders and inactive states
6. Leverage glass effect for navigation overlays
7. Combine serif and sans-serif typography for hierarchy
8. Test accessibility at every stage

### Don'ts ✗
1. Don't use Light Greige or Mushroom for text (insufficient contrast)
2. Don't use bright, saturated colors that clash with the editorial palette
3. Don't apply heavy shadows that contradict the refined aesthetic
4. Don't use pure black #000000 (use Near-Black #1F1F1F instead)
5. Don't mix this palette with other color systems without careful consideration
6. Don't overcrowd layouts — embrace whitespace
7. Don't ignore accessibility standards

## Typography (Already Implemented)
- **Headings**: Cormorant Garamond (serif) ✓
- **Body**: Inter (sans-serif) ✓
- **Hierarchy**: Combine serif and sans-serif ✓

## Priority Changes

### High Priority
1. ✅ Add Light Teal (#8FB3AF) and Pale Teal (#A5C4C0) variants
2. ✅ Update error states to use Warm Red (#C74B3E)
3. ✅ Implement proper focus rings (2px Muted Teal at 50% opacity)
4. ✅ Standardize border radius across all components
5. ✅ Refine shadows to be softer and more sophisticated

### Medium Priority
6. Add Pure White (#FFFFFF) for popovers/modals
7. Standardize spacing system (1rem/1.5rem/2rem)
8. Implement glass effect for navigation (90% opacity + 12px blur)

### Low Priority (Future)
9. Implement full dark mode with specified colors
10. Add data visualization colors (Deep Taupe #6A5F54)

## Color Psychology Alignment

The palette conveys:
- **Muted Teal**: Trust, reliability, sophistication, refinement, calm, balance, premium quality, artistic sensibility
- **Linen & Neutrals**: Warmth, approachability, elegance, luxury, natural authenticity, comfort, timeless quality
- **Near-Black**: Authority, confidence, clarity, precision, professionalism, seriousness, editorial credibility

This aligns perfectly with the "Luxury Art Marketplace" positioning.
