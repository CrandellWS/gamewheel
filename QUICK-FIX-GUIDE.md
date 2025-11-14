# Quick Fix Guide: Wheel Rotation Bug

## The Problem

The wheel doesn't land on the correct segment after spins, especially on sequential spins.

## The Solution

Edit `/home/aiuser/projects/wheel-of-names/app/components/Wheel.tsx`

### Find This Code (lines ~140-151):

```typescript
const degreesPerSegment = 360 / numEntries;
const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;

// Account for the half-segment offset applied in drawing
const offsetAdjustment = degreesPerSegment / 2;

// Calculate how much to rotate to align winner with pointer
const targetAngle = -winnerCenterAngle + offsetAdjustment;

// Add 5-8 full rotations for dramatic effect
const spins = 5 + Math.random() * 3;
const newTarget = rotation + spins * 360 + targetAngle;
```

### Replace With This Code:

```typescript
const degreesPerSegment = 360 / numEntries;
const desiredFinalAngle = targetWinnerIndex * degreesPerSegment;

// Add 5-8 full rotations for dramatic effect
const spins = 5 + Math.random() * 3;
const numFullRotations = Math.floor(spins);

// Calculate how far to rotate from current position
const currentAngle = rotation % 360;
let angleDelta = desiredFinalAngle - currentAngle;

// Ensure backward rotation (negative angle) for visual forward spin
while (angleDelta > 0) angleDelta -= 360;

const newTarget = rotation + numFullRotations * 360 + angleDelta;
```

## What Changed

1. **Removed**: `winnerCenterAngle` and `offsetAdjustment` (incorrect geometry)
2. **Added**: `desiredFinalAngle = targetWinnerIndex * degreesPerSegment` (correct geometry)
3. **Added**: `numFullRotations = Math.floor(spins)` (fixes fractional spin bug)
4. **Added**: `currentAngle = rotation % 360` (fixes accumulated rotation bug)
5. **Added**: Loop to ensure backward rotation (correct direction)

## Test It

Run the comprehensive test to verify:

```bash
node test-comprehensive-final.js
```

You should see: `✅ ALL TESTS PASSED`

## Why This Works

- Segments are drawn with centers at `index * degreesPerSegment - 90°`
- Pointer is at `-90°` (top of wheel)
- After rotation R, segment center is at `(index * deg - 90) - R`
- We want: `(index * deg - 90) - R = -90`
- Solving: `R = index * degreesPerSegment` (mod 360)
- The fix implements this exact formula, accounting for fractional spins and accumulated rotation

## Impact

- ✅ Wheel lands accurately on intended segment
- ✅ Sequential spins work correctly
- ✅ Removing entries between spins doesn't cause drift
- ✅ Works with any number of segments
- ✅ Works with fractional random spins (5.5, 6.8, etc.)
