# Country Card Design Reference 🎨

## Visual Examples

### Card Anatomy (Default State)

```
┌─────────────────────────────────────┐
│  🇵🇭 PH                    🌅      │ ← Row 1: Flag (1.5rem), Code, Time Icon
│                                     │
│  Philippines                        │ ← Row 2: Country Name (0.875rem, white)
│                                     │
│  🏛️ Manila                         │ ← Row 3: Capital Icon + Name (0.7rem, white/50)
│                                     │
│  ┌─────────────┐ ┌──────────┐     │
│  │ 🌴 Tropical │ │ Morning  │     │ ← Row 4: Info Badges (0.65rem)
│  └─────────────┘ └──────────┘     │
└─────────────────────────────────────┘
   Height: 140px
   Background: rgba(255, 255, 255, 0.05)
   Border: 1px solid rgba(255, 255, 255, 0.1)
```

### Card Anatomy (Hover State)

```
┌─────────────────────────────────────┐
│  🇵🇭 PH                    🌅      │ ← Flag larger (2.5rem)
│                                     │
│  Philippines                        │ ← Name larger (1.125rem, brighter)
│                                     │
│  🏛️ Manila                         │ ← Capital larger (0.875rem)
│                                     │
│  ┌─────────────┐ ┌──────────┐     │
│  │ 🌴 Tropical │ │ Morning  │     │ ← Badges same
│  └─────────────┘ └──────────┘     │
├─────────────────────────────────────┤ ← Divider appears
│  📍 14.60°, 120.98°                │ ← Coordinates (0.75rem)
│  ✨ Click to explore weather       │ ← CTA (0.75rem, purple-300)
└─────────────────────────────────────┘
   Height: 200px (expanded +60px)
   Background: Country-themed gradient
   Border: 1px solid purple-400 (glowing)
   Shadow: 2xl with purple-500/40
```

## Component Breakdown

### 1. Header Section (Always Visible)
```tsx
<div className="flex items-center justify-between mb-2">
  <div className="flex items-center gap-2">
    <span style={{ fontSize: '1.5rem' }}>🇵🇭</span>  // Flag
    <span className="text-xs text-white/40">PH</span> // Code
  </div>
  <div className="text-lg">🌅</div>  // Time icon
</div>
```

**Purpose:** Quick identification and context
**Size:** ~40px height

### 2. Country Name (Always Visible)
```tsx
<div style={{
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'white'
}}>
  Philippines
</div>
```

**Purpose:** Primary identifier
**Size:** ~20px height

### 3. Capital Section (Always Visible)
```tsx
<div className="flex items-center gap-1 mb-2">
  <span className="text-xs">🏛️</span>
  <div style={{ fontSize: '0.7rem' }}>Manila</div>
</div>
```

**Purpose:** Secondary location info
**Size:** ~18px height

### 4. Info Badges (Always Visible)
```tsx
<div className="flex flex-wrap gap-1.5 mt-auto">
  {/* Climate Zone Badge */}
  <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
    <span>🌴</span>
    <span className="text-[0.65rem]">Tropical</span>
  </div>

  {/* Time Badge */}
  <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
    <span className="text-[0.65rem]">Morning</span>
  </div>
</div>
```

**Purpose:** Contextual information at a glance
**Size:** ~24px height each badge

### 5. Hover Panel (On Hover Only)
```tsx
<div style={{
  maxHeight: isHovered ? '100px' : '0px',
  opacity: isHovered ? 1 : 0,
  marginTop: isHovered ? '12px' : '0px'
}}>
  <div className="pt-3 border-t border-white/20 space-y-2">
    {/* Coordinates */}
    <div className="flex items-center gap-1.5 text-xs">
      <span>📍</span>
      <span>14.60°, 120.98°</span>
    </div>

    {/* Call to Action */}
    <div className="text-purple-300 text-xs">
      <span>✨</span>
      <span>Click to explore weather</span>
    </div>
  </div>
</div>
```

**Purpose:** Additional details and interaction prompt
**Size:** 0px → 60px on hover

## Color Palette

### Text Colors
| Element | Color | Opacity | Usage |
|---------|-------|---------|-------|
| Country Name | white | 100% | Primary text |
| Country Name (Hover) | rgb(233, 213, 255) | 100% | Highlighted state |
| Capital | white | 50% | Secondary text |
| Code | white | 40% | Tertiary text |
| Badge Text | white | 70% | Info badges |
| Coordinates | white | 60% | Hover details |
| CTA | purple-300 | 100% | Call-to-action |

### Background Colors
| Element | Color | Usage |
|---------|-------|-------|
| Card (Default) | rgba(255, 255, 255, 0.05) | Subtle presence |
| Card (Hover) | Country gradient | Themed highlight |
| Badges | rgba(255, 255, 255, 0.1) | Semi-transparent |
| Gradient Overlay | purple-900/40 → indigo-900/40 | Hover effect |

### Border & Shadow
```css
/* Default */
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Hover */
border: 1px solid rgb(192, 132, 252); // purple-400
box-shadow: 0 25px 50px -12px rgba(168, 85, 247, 0.4);
```

## Spacing System

```
Card Padding: 16px (p-4)
Section Margins:
  - Header → Name: 8px (mb-2)
  - Name → Capital: 4px (mb-1)
  - Capital → Badges: 8px (mb-2)
  - Badges → Hover: 12px (mt-3)

Badge Spacing:
  - Gap between badges: 6px (gap-1.5)
  - Badge padding: 8px 8px (px-2 py-1)

Icon Spacing:
  - Icon → Text: 4px (gap-1)
```

## Typography Scale

```
Flag:        1.5rem (default) → 2.5rem (hover)
Country:     0.875rem (default) → 1.125rem (hover)
Capital:     0.7rem (default) → 0.875rem (hover)
Code:        0.75rem (fixed)
Time Icon:   1rem (fixed)
Badge Text:  0.65rem (fixed)
Coordinates: 0.75rem (fixed)
CTA:         0.75rem (fixed)
```

## Animation Timings

```css
/* Height expansion */
transition: height 500ms ease-in-out;

/* All other transitions */
transition-duration: 500ms;
transition-timing-function: ease;

/* Hover panel */
transition: all 500ms ease;
```

## Responsive Behavior

### Grid Layout
```css
/* Mobile (< 768px) */
grid-cols-2  /* 2 cards per row */

/* Tablet (768px - 1024px) */
grid-cols-3  /* 3 cards per row */

/* Desktop (1024px - 1280px) */
grid-cols-4  /* 4 cards per row */

/* Large Desktop (> 1280px) */
grid-cols-5  /* 5 cards per row */
```

### Card Sizing
- Min width: ~180px
- Max width: ~250px
- Height (default): 140px
- Height (hover): 200px
- Gap between cards: 16px

## Accessibility

### Interactive States
```css
/* Default */
cursor: pointer

/* Hover */
box-shadow: enlarged
border: highlighted
background: gradient

/* Focus */
outline: 2px solid purple-400
outline-offset: 2px
```

### Screen Reader Text
```tsx
aria-label={`${country.name}, ${country.capital}.
             Climate: ${climateZone}.
             Local time: ${timeOfDay}.
             Click for weather details.`}
```

## Icon Reference

| Icon | Unicode | Purpose |
|------|---------|---------|
| 🌅 | U+1F305 | Morning |
| ☀️ | U+2600 | Afternoon |
| 🌆 | U+1F306 | Evening |
| 🌙 | U+1F319 | Night |
| 🧊 | U+1F9CA | Polar climate |
| ❄️ | U+2744 | Subarctic |
| 🍂 | U+1F342 | Temperate |
| 🌡️ | U+1F321 | Subtropical |
| 🌴 | U+1F334 | Tropical |
| 🏛️ | U+1F3DB | Capital city |
| 📍 | U+1F4CD | Coordinates |
| ✨ | U+2728 | Call-to-action |

## CSS Classes Used

```css
/* Layout */
.relative, .absolute, .fixed
.flex, .grid
.items-center, .justify-between
.gap-1, .gap-1.5, .gap-2

/* Sizing */
.w-full, .h-full
.p-4, .px-2, .py-1
.mb-1, .mb-2, .mt-auto

/* Styling */
.bg-white/10, .backdrop-blur-sm
.rounded-xl, .rounded-full
.border, .border-white/10
.text-white, .text-white/40
.shadow-lg, .shadow-2xl

/* Effects */
.transition-all, .duration-500
.hover:shadow-purple-500/40
.overflow-hidden
```

## Summary

This card design provides:
✅ **Rich information** without clicking
✅ **Beautiful aesthetics** with glassmorphism
✅ **Smooth animations** for hover states
✅ **Contextual icons** for quick scanning
✅ **Responsive layout** for all devices
✅ **Accessible interactions** for all users

The design balances **information density** with **visual clarity**, ensuring users can quickly scan through countries while getting meaningful context about each location.

---

**Design System:** Glassmorphism + Gradient overlays
**Primary Colors:** Purple/Indigo accents on dark background
**Typography:** Inter/System fonts, varying sizes
**Icons:** Emoji for universal recognition
