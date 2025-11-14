# CRITICAL BUG REPORT: Wheel Inaccurate After First Spin

## Executive Summary

**Status**: ✅ ROOT CAUSE IDENTIFIED AND VERIFIED

The wheel rotation calculation contains **three critical bugs** that cause the wheel to land on incorrect segments after spins, especially on sequential spins with entry removal.

## Test Results

All comprehensive tests have been created and executed:

- `/home/aiuser/projects/wheel-of-names/test-sequential-spin-accuracy.js` - Initial test identifying the bug
- `/home/aiuser/projects/wheel-of-names/test-rotation-diagnostic.js` - Deep coordinate system analysis
- `/home/aiuser/projects/wheel-of-names/test-formula-verification.js` - Testing candidate formulas
- `/home/aiuser/projects/wheel-of-names/test-deep-geometry.js` - Geometric analysis
- `/home/aiuser/projects/wheel-of-names/test-fractional-spins.js` - Identifying fractional spin issue
- `/home/aiuser/projects/wheel-of-names/test-correct-formula.js` - Formula verification
- `/home/aiuser/projects/wheel-of-names/test-final-verification.js` - Intermediate verification
- `/home/aiuser/projects/wheel-of-names/test-comprehensive-final.js` - ✅ **ALL TESTS PASS**

## Root Cause Analysis

### Location
`/home/aiuser/projects/wheel-of-names/app/components/Wheel.tsx` lines 140-151

### Current Buggy Code

```typescript
const degreesPerSegment = 360 / numEntries;
const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;
const offsetAdjustment = degreesPerSegment / 2;
const targetAngle = -winnerCenterAngle + offsetAdjustment;

// Add 5-8 full rotations for dramatic effect
const spins = 5 + Math.random() * 3;
const newTarget = rotation + spins * 360 + targetAngle;
```

### Three Critical Bugs

#### Bug #1: Incorrect Geometric Calculation
**Problem**: Uses `(targetWinnerIndex + 0.5) * degreesPerSegment` when it should use `targetWinnerIndex * degreesPerSegment`

**Why**:
- Segments are drawn with centers at `i * degreesPerSegment - 90°` (see line 225 in Wheel.tsx)
- The `+0.5` offset and subsequent `offsetAdjustment` subtraction mathematically cancel out incorrectly
- This causes the calculation to work only for certain indices (like 0 and half-circle positions)

**Impact**: Wheel lands on wrong segment, typically off by 1-2 positions

#### Bug #2: Fractional Spins Bug
**Problem**: Multiplies fractional `spins` value by 360

```typescript
const spins = 5 + Math.random() * 3;  // e.g., 5.5, 6.8, 7.3
const newTarget = rotation + spins * 360 + targetAngle;
```

**Why**:
- When spins = 5.5, this adds 1980° (5.5 × 360°)
- The 0.5 fraction contributes 180° extra rotation
- 180° is exactly half a circle, flipping the wheel to the opposite side
- This completely breaks the intended landing position

**Impact**: Massive rotation errors, wheel can land on the opposite side of intended segment

#### Bug #3: Ignores Accumulated Rotation
**Problem**: Doesn't account for current rotational position modulo 360

**Why**:
- The calculation treats each spin as starting from 0°
- Doesn't consider that after first spin, wheel is at (e.g.) 1560° which is 120° in normalized terms
- The `targetAngle` calculation should factor in `rotation % 360`

**Impact**: Sequential spins compound errors, increasing inaccuracy with each spin

## The Fix

### Corrected Code

Replace lines 140-151 in `/home/aiuser/projects/wheel-of-names/app/components/Wheel.tsx`:

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

### Why This Works

1. **Correct Geometry**: Uses `targetWinnerIndex * degreesPerSegment` matching how segments are actually drawn
2. **Integer Rotations**: Uses `Math.floor(spins)` to only count full 360° rotations
3. **Accounts for Position**: Calculates `currentAngle = rotation % 360` and adjusts delta accordingly
4. **Backward Rotation**: Ensures `angleDelta` is negative (wheel rotates backward/clockwise in canvas coords, which appears as forward/counterclockwise visually)

## Test Scenarios Verified

### ✅ Scenario 1: Sequential Spins with Removal
- Spin 1: 6 entries, target index 2, spins 5.5 → **PASS** (lands on index 2)
- Spin 2: 5 entries, target index 1, spins 6.2 → **PASS** (lands on index 1)
- Spin 3: 4 entries, target index 0, spins 7.8 → **PASS** (lands on index 0)

### ✅ Scenario 2: Accumulated Rotation Drift
- Spin 1: 4 entries, from 0°, target index 1 → **PASS** (no drift)
- Spin 2: 4 entries, from 1530°, target index 2 → **PASS** (no drift)

### ✅ Scenario 3: Index Shifts After Removal
- Remove index 2 from [0,1,2,3,4,5]
- Result: [0,1,3,4,5] where index 2 is now "Three" (was index 3)
- Spin to target new index 2 → **PASS** (correctly lands on "Three")

## Mathematical Proof

Given:
- Segment `i` center is drawn at angle: `i * degreesPerSegment - 90°` (in canvas coordinates)
- Pointer is at angle: `-90°` (top of wheel in canvas coordinates)
- Canvas rotation: `ctx.rotate((-rotation * PI) / 180)` (line 218)

After rotation `R`, segment `i` center moves to: `(i * deg - 90) - R`

We want this to equal `-90` (pointer position):
```
(i * deg - 90) - R = -90
-R = -90 - i * deg + 90
-R = -i * deg
R = i * deg (mod 360)
```

Therefore, to land on segment with `targetWinnerIndex = i`:
```
finalRotation ≡ i * degreesPerSegment (mod 360)
```

The corrected code implements exactly this formula.

## Recommendation

**IMMEDIATE ACTION REQUIRED**: Apply the fix to Wheel.tsx lines 140-151

This is a critical bug affecting core functionality. Every spin after the first is likely to be inaccurate without this fix.

## Verification Command

To verify the fix works:
```bash
node /home/aiuser/projects/wheel-of-names/test-comprehensive-final.js
```

Expected output: `✅ ALL TESTS PASSED`
