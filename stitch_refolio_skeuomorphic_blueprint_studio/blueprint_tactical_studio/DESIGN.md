---
name: Blueprint Tactical Studio
colors:
  surface: '#f9faf2'
  surface-dim: '#d9dbd3'
  surface-bright: '#f9faf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4ed'
  surface-container: '#edefe7'
  surface-container-high: '#e7e9e1'
  surface-container-highest: '#e2e3dc'
  on-surface: '#191c18'
  on-surface-variant: '#42493e'
  inverse-surface: '#2e312c'
  inverse-on-surface: '#f0f1ea'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#45645e'
  on-secondary: '#ffffff'
  secondary-container: '#c4e7de'
  on-secondary-container: '#496962'
  tertiary: '#493700'
  on-tertiary: '#ffffff'
  tertiary-container: '#654d00'
  on-tertiary-container: '#e3bf65'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#c7eae1'
  secondary-fixed-dim: '#abcec5'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#2d4d46'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#e7c268'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4400'
  background: '#f9faf2'
  on-background: '#191c18'
  surface-variant: '#e2e3dc'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  card-gap: 32px
---

## Brand & Style
The design system is built on the narrative of a master architect’s drafting table. It evokes a sense of tactile precision, blending the organized chaos of a physical workspace with the pristine execution of high-end digital interfaces. The target audience includes creative professionals and collectors who value craftsmanship, depth, and "object-oriented" UI.

The style is **Tactile Skeuomorphism**. Unlike early digital skeuomorphism, this design system focuses on material honesty: the weight of cardstock, the tooth of blueprint paper, and the subtle specularity of polished plastic. The atmosphere is professional yet imaginative, moving away from flat design toward a "spatial" interface where every element occupies a specific physical layer.

## Colors
The palette is grounded in **Forest Green (#2D5A27)**, used for primary branding and key structural elements. The background is not a flat color but a layered texture: a base of **Neutral Paper (#F5F5F0)** or a **Blueprint Blue (#2A4B5D)** gradient featuring a subtle 5mm grid.

Accents are derived from physical drafting tools:
- **Brass/Gold:** Used for metal fasteners and thumb tacks.
- **Red Ink:** Reserved for "Beta" stamps, errors, or high-priority alerts.
- **Canary Yellow:** Used exclusively for interactive sticky notes and temporary inputs.
- **Drafting Tape:** A semi-transparent off-white used for headers or "attached" UI elements.

## Typography
This design system employs a dual-font strategy to balance legibility with thematic flair. **Inter** serves as the primary engine for communication, providing a clean, neutral balance to the rich textures of the UI. It is used for all primary navigation, body copy, and descriptive headers.

**JetBrains Mono** acts as the "engineered" layer. It is used for technical data, serial numbers, labels on blueprint grids, and any metadata that feels "drafted." To maintain a high-end feel, monospaced text should often be set in uppercase with slightly wider letter spacing to mimic architectural lettering.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, mimicking a drafting board. Content is centered within a wide container (max-width: 1440px) to allow for "desk space" on the periphery where tools and secondary cards can live.

- **Desktop:** A 12-column grid with generous 32px gaps. Elements often "overlap" slightly to emphasize the physical stacking of paper and cards.
- **Mobile:** A single-column flow where the background texture remains fixed, and cards slide vertically. Margins are reduced to 20px, but the "physicality" is maintained through scale-down animations.
- **Rhythm:** All spacing is derived from an 8px base unit. Component padding is intentionally large (24px+) to accommodate the highly rounded corners.

## Elevation & Depth
Depth is the core of this design system. It is achieved through **Multi-layered Ambient Shadows** rather than simple drop shadows.

1.  **Level 0 (Surface):** The blueprint or paper desk surface.
2.  **Level 1 (Drafting Tape/Sticky Notes):** Minimal elevation (2px shadow), appearing flush with the surface.
3.  **Level 2 (Playing Cards/Project Cards):** Medium elevation (12px soft shadow) with a slight "tilt" (1-2 degrees) to mimic objects tossed on a table.
4.  **Level 3 (ID Cards/Modals):** High elevation (32px diffused shadow) with a subtle inner-glow to simulate plastic thickness.

Shadows should use a tint of the background color (e.g., deep blue-green shadows on the blueprint background) to maintain a realistic, expensive look.

## Shapes
The shape language contrasts organic curves with rigid lines.
- **Main Components:** Project and ID cards use a signature **24px radius**, giving them a friendly yet premium "object" feel.
- **Technical Elements:** Buttons and input fields use a more controlled **12px radius**.
- **Specialized Elements:** Sticky notes use a near-sharp **2px radius** on three corners, with a "curled" bottom-right corner effect achieved through CSS masking or assets.
- **Accents:** Thumb tacks and fasteners are perfect circles with 3D radial gradients to suggest volume.

## Components
- **ID Cards (Identity):** Used for user profiles. Features a vertical orientation, a high-gloss "plastic" overlay, a punch-hole at the top, and a monospaced "Serial Number."
- **Playing Cards (Projects):** Standard card ratio. Includes a "suit" icon in the corner (representing project category) and uses a linen texture overlay.
- **Stacked Cards (Experience):** A component where cards are offset by 4px and 8px behind the lead card, creating a physical "deck" of history.
- **Sticky Note Inputs:** Text areas styled as yellow squares. The font switches to a slightly more casual weight of Inter to mimic handwriting, and the focus state includes a "tack" appearing at the top.
- **Drafting Tape Headers:** Section titles contained within a semi-transparent, textured strip that looks like masking tape holding the content down.
- **Brass Toggle:** A physical-looking switch made of "metal" that slides with a heavy, dampened animation.
- **Stamp Badges:** Status indicators (e.g., "Complete," "In Progress") appear as ink-stamped textures with slight opacity variations and distressed edges.