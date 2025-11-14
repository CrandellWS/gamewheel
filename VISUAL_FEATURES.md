# Visual Features - Technical Documentation

## Overview

GameWheel implements a dramatic 4-tier visual hierarchy system that transforms the spinning wheel into an engaging, premium experience. The system is based on compass positions and applies progressively more impressive visual effects to create clear visual distinction between prize tiers.

### Design Philosophy

The visual tier system is designed to:
- Create immediate visual hierarchy without configuration
- Make premium positions (especially North) unmistakably special
- Maintain 60fps performance with all effects active
- Enhance engagement during the spin animation
- Keep the idle state clean and professional

## Tier Hierarchy

### Tier 1 - Grand Prize (North Position)

**Position**: 0 degrees (top/north of wheel)

**Visual Effects**:
- **Size Multiplier**: 2.0x (double the normal slice size)
- **Text Scale**: 2.0x for maximum readability
- **Background**: Multi-stop gold gradient with intelligent color manipulation
  - Base color lightened by 20%
  - Mid-point uses original color
  - Dark edge created by darkening 25%
- **Pattern Overlay**: Radial ray pattern
  - 16 rays emanating from center
  - Semi-transparent overlay (opacity 0.15)
  - Creates premium shimmer effect
- **Corner Markers**: Gold star symbols (★)
  - Positioned at outer corners of slice
  - 24px size for visibility
- **Shadow**: Large, prominent shadow for depth
  - offsetY: 8px
  - blur: 15px
  - color: rgba(0, 0, 0, 0.5)
- **Glow**: Strong outer glow
  - blur: 25px
  - color: rgba(255, 215, 0, 0.6) - gold
- **Animation**: Pulsing glow during spin (0.8 to 1.0 scale)

**Purpose**: The grand prize position - unmistakable, prestigious, and visually dominant.

### Tier 2 - Major Prizes (Cardinal Directions)

**Positions**: 90°, 180°, 270° (East, South, West)

**Visual Effects**:
- **Size Multiplier**: 1.6x
- **Text Scale**: 1.6x
- **Background**: Multi-stop silver/platinum gradient
  - Lightened by 15%
  - Original color mid-point
  - Darkened by 20%
- **Pattern Overlay**: Diagonal stripe pattern
  - 45-degree angle stripes
  - 12px spacing
  - Semi-transparent (opacity 0.12)
  - Creates subtle metallic shimmer
- **Corner Markers**: Silver circles (●)
  - 20px size
  - Clean, professional appearance
- **Shadow**: Medium shadow
  - offsetY: 6px
  - blur: 12px
  - color: rgba(0, 0, 0, 0.4)
- **Glow**: Moderate silver glow
  - blur: 20px
  - color: rgba(192, 192, 192, 0.5)
- **Animation**: Subtle pulsing during spin (0.85 to 1.0 scale)

**Purpose**: Premium prizes that stand out clearly but don't compete with the grand prize.

### Tier 3 - Minor Prizes (Intercardinal Directions)

**Positions**: 45°, 135°, 225°, 315° (NE, SE, SW, NW)

**Visual Effects**:
- **Size Multiplier**: 1.3x
- **Text Scale**: 1.4x
- **Background**: Enhanced gradient
  - Lightened by 10%
  - Original mid-point
  - Darkened by 15%
- **Pattern Overlay**: None (clean appearance)
- **Corner Markers**: None
- **Shadow**: Subtle shadow
  - offsetY: 4px
  - blur: 8px
  - color: rgba(0, 0, 0, 0.3)
- **Glow**: Gentle glow
  - blur: 15px
  - color: white with 0.3 opacity
- **Animation**: Very subtle pulsing (0.9 to 1.0 scale)

**Purpose**: Noticeable upgrade from standard positions without overwhelming the design.

### Tier 4 - Standard Positions

**Positions**: All other angles (non-compass positions)

**Visual Effects**:
- **Size Multiplier**: 1.0x (normal)
- **Text Scale**: 1.0x
- **Background**: Original entry color (no gradient)
- **Pattern Overlay**: None
- **Corner Markers**: None
- **Shadow**: Minimal
  - offsetY: 2px
  - blur: 4px
  - color: rgba(0, 0, 0, 0.2)
- **Glow**: None
- **Animation**: None

**Purpose**: Clean, standard appearance that serves as the baseline for comparison.

## Technical Implementation

### Color Manipulation System

The tier system includes sophisticated color manipulation utilities:

#### Hex to RGB Conversion
```javascript
function hexToRgb(hex: string): { r: number; g: number; b: number } | null
```
- Converts hex color codes (#RRGGBB) to RGB objects
- Handles both 3-digit and 6-digit hex codes
- Returns null for invalid inputs

#### Color Lightening
```javascript
function lightenColor(hex: string, percent: number): string
```
- Lightens a color by moving RGB values toward 255
- Percent value: 0.0 to 1.0 (0% to 100%)
- Example: lightenColor('#FF0000', 0.2) makes red 20% lighter
- Preserves color hue while increasing brightness

#### Color Darkening
```javascript
function darkenColor(hex: string, percent: number): string
```
- Darkens a color by moving RGB values toward 0
- Percent value: 0.0 to 1.0 (0% to 100%)
- Example: darkenColor('#FF0000', 0.25) makes red 25% darker
- Maintains color saturation while decreasing brightness

### Tier Detection Logic

The system determines tier based on normalized angle:

```javascript
function getTierForAngle(normalizedAngle: number): 1 | 2 | 3 | 4
```

**Detection Algorithm**:
1. Normalize angle to 0-360 range
2. Check exact compass positions (with 0.01 degree tolerance):
   - 0° = Tier 1 (North)
   - 90°, 180°, 270° = Tier 2 (Cardinals)
   - 45°, 135°, 225°, 315° = Tier 3 (Intercardinals)
3. Default to Tier 4 for all other angles

**Tolerance Handling**: Uses floating-point comparison with small epsilon (0.01) to handle minor calculation variations.

### Gradient Rendering

Multi-stop radial gradients are created dynamically:

```javascript
const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
gradient.addColorStop(0, lightenedColor);    // Center: lighter
gradient.addColorStop(0.5, originalColor);   // Middle: original
gradient.addColorStop(1, darkenedColor);     // Edge: darker
```

**Benefits**:
- Creates depth and dimension
- Enhances the premium feel
- Provides visual polish

### Pattern Overlay System

#### Radial Ray Pattern (Tier 1)
```javascript
// 16 rays from center to edge
for (let i = 0; i < 16; i++) {
  const rayAngle = (i / 16) * Math.PI * 2;
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(rayAngle) * radius,
    centerY + Math.sin(rayAngle) * radius
  );
}
```

**Characteristics**:
- 16 evenly spaced rays
- Drawn with semi-transparent white
- Creates burst/sunburst effect
- Symbolizes importance and celebration

#### Diagonal Stripe Pattern (Tier 2)
```javascript
// 45-degree diagonal stripes across slice
for (let x = -radius; x < radius * 2; x += 12) {
  const adjustedX = x * Math.cos(Math.PI / 4);
  ctx.moveTo(adjustedX, -radius);
  ctx.lineTo(adjustedX, radius * 2);
}
```

**Characteristics**:
- 45-degree angle for dynamic appearance
- 12px spacing for subtle effect
- Clipped to slice boundaries
- Creates premium metallic shimmer

### Animation System

Pulsing animations apply during spin state only:

```javascript
const pulseProgress = (Date.now() % 1000) / 1000; // 0 to 1
const pulseValue = 0.8 + Math.sin(pulseProgress * Math.PI * 2) * 0.1; // 0.8-1.0
```

**Animation Properties**:
- **Duration**: 1 second per pulse cycle
- **Range**: Varies by tier (e.g., Tier 1: 0.8-1.0, Tier 2: 0.85-1.0)
- **Trigger**: Only active when `isSpinning === true`
- **Clean Idle**: No animation when wheel is stopped

### Canvas Rendering Optimization

All tier effects use proper canvas save/restore:

```javascript
ctx.save();
// Apply all tier effects: gradients, patterns, shadows, glows
// Clip to slice boundaries
// Render text with appropriate scaling
ctx.restore();
```

**Performance Techniques**:
- Clip regions prevent overdraw
- Effects only render for visible slices
- Single pass rendering for all effects
- RequestAnimationFrame for smooth 60fps
- Device pixel ratio handling for sharp rendering

## Performance Considerations

### Benchmarks

With all tier effects enabled:
- **Frame Rate**: Consistent 60fps on modern devices
- **Memory**: Minimal impact (patterns cached in render loop)
- **CPU**: Slight increase during spin animation, negligible at idle

### Optimization Strategies

1. **Conditional Rendering**: Animations only run during spin
2. **Effect Caching**: Color calculations done once per slice
3. **Efficient Patterns**: Simple geometric patterns (rays, stripes)
4. **Canvas Optimization**: Proper use of save/restore, clipping regions
5. **Minimal Redraws**: Only animate when necessary

### Browser Compatibility

Tested and optimized for:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

All effects use standard Canvas 2D API features with wide support.

## Customization Options

### Current System

The tier system is position-based and automatic. No user configuration required.

### Future Extensibility

The architecture supports future customization:

**Potential Settings**:
- Enable/disable tier system entirely
- Adjust size multipliers per tier
- Choose different color themes (gold, rainbow, custom)
- Toggle individual effects (patterns, glows, markers)
- Custom tier assignments (not just compass-based)

**Implementation Ready**:
- Effects are modular and can be toggled independently
- Tier detection can be extended to support custom rules
- Settings could be added to `WheelSettings` interface
- UI controls could be added to Settings panel

### Example Customization Code

```typescript
// Future settings structure
interface VisualTierSettings {
  enabled: boolean;
  tier1: {
    sizeMultiplier: number;
    textScale: number;
    pattern: 'rays' | 'stripes' | 'none';
    markerStyle: 'star' | 'circle' | 'diamond' | 'none';
    // ... other customizations
  };
  // ... tiers 2-4
}
```

## Visual Design Rationale

### Why 4 Tiers?

- **Clear Hierarchy**: 4 distinct levels create obvious visual progression
- **Not Too Many**: More than 4 becomes cluttered and confusing
- **Mathematical Elegance**: Maps perfectly to compass positions
- **Engagement Balance**: Enough variety without overwhelming users

### Why Compass Positions?

- **Universal Understanding**: North = top = best (cultural norm)
- **Symmetry**: Even distribution around the wheel
- **No Configuration**: Automatic, no user setup required
- **Fair Distribution**: As wheel rotates, all entries get equal chance

### Why Gold/Silver/Bronze Metaphor?

- **Familiar**: Matches Olympic medals, gaming achievements
- **Instantly Recognizable**: Users immediately understand hierarchy
- **Prestigious Feel**: Creates aspirational value for prizes
- **Cross-Cultural**: Works across different languages and cultures

## Usage Recommendations

### Best Practices

1. **Prize Placement**: Put your best prize in the North position for maximum impact
2. **Second-Tier Prizes**: Use cardinal directions (E, S, W) for runner-up prizes
3. **Consolation Prizes**: Intercardinal positions (NE, SE, SW, NW) for smaller prizes
4. **Filler Items**: Standard positions for common or baseline entries

### Example Wheel Setup

**Giveaway Wheel**:
- North: Grand Prize ($500 value)
- E/S/W: Major Prizes ($100-200 value)
- NE/SE/SW/NW: Minor Prizes ($20-50 value)
- Others: Consolation prizes ($5-10 value)

**Tournament Bracket**:
- North: Championship seed
- Cardinals: Top seeds (2-4)
- Intercardinals: Mid seeds (5-8)
- Others: Wild card entries

### Visual Impact Tips

- Use the tier system during live streams for dramatic reveals
- The pulsing animation creates tension during spins
- Winner display benefits from tier enhancements
- Consider wheel rotation to showcase top prizes

## Conclusion

The visual tier system transforms GameWheel from a simple random selector into a premium, engaging experience. By combining intelligent position-based detection, sophisticated visual effects, and performance-optimized rendering, the system delivers maximum impact without configuration complexity.

The modular architecture ensures the system can evolve with user needs while maintaining the current zero-configuration simplicity that makes it accessible to all users.
