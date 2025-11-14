# DEFINITIVE BUG DIAGNOSIS

## Summary
The rotation math is mathematically correct, but there's a subtle interaction between `ctx.arc()` and `ctx.rotate()` that causes the wrong visual result.

## The Two Canvas Methods

### ctx.arc() - Draws arcs
- Angles measured from positive X-axis (pointing RIGHT)
- **Angles increase CLOCKWISE** (unlike standard math where they go counter-clockwise)
- `-Math.PI/2` (-90°) points UP
- `0` points RIGHT
- `Math.PI/2` (90°) points DOWN

### ctx.rotate() - Rotates coordinate system
- Follows **standard mathematical convention**
- **Positive angles rotate COUNTER-CLOCKWISE**
- `ctx.rotate(Math.PI/2)` rotates axes CCW by 90°
- This is a coordinate system transformation, not a visual rotation

## The Fundamental Conflict

When you combine these two:

```javascript
ctx.rotate((rotation * Math.PI) / 180);  // Rotates coord system by rotation
ctx.arc(0, 0, radius, startAngle, endAngle);  // Draws in rotated system
```

**The coordinate system rotation follows math convention (CCW positive), but the arc drawing follows canvas convention (CW positive).**

## What Actually Happens

Test case: 6 entries, trying to win segment 1 (David)

1. **Segment 1 is drawn at**: -30° (in canvas arc coordinates)
2. **We calculate rotation**: -60° (to move it to -90°)
3. **We call**: `ctx.rotate(-60° in radians)`
4. **Coordinate system rotates**: CLOCKWISE by 60° (because rotation is negative)
5. **Arc drawn at -30° now appears at**: ???

## The Problem

Here's where it gets tricky. When the coordinate system rotates:
- The AXES rotate by R
- Shapes drawn at angle θ in the rotated system...
- Appear at angle (θ + R) in the original viewer's frame

BUT:
- `ctx.arc()` uses **clockwise** angle measurement
- `ctx.rotate()` uses **counter-clockwise** system rotation

**These two conventions don't compose the way we expect!**

## The Actual Bug

The math **assumes** that:
```
final_visual_angle = drawn_angle + rotation_angle
```

But because `ctx.arc()` uses clockwise angles and `ctx.rotate()` uses CCW rotation:
```
final_visual_angle = drawn_angle - rotation_angle  (possibly, need to verify)
```

## Verification Needed

To confirm, we need to:
1. Actually render to canvas (not just calculate)
2. Check which segment visually appears at the pointer
3. Compare calculated vs actual result

## Possible Fixes

### Option 1: Invert the rotation sign
```javascript
ctx.rotate((-rotation * Math.PI) / 180);  // Add negative sign
```

### Option 2: Keep rotation, but invert the calculation
```javascript
const targetAngle = winnerCenterAngle - offsetAdjustment;  // Remove negative
```

### Option 3: Use anticlockwise arc parameter
```javascript
ctx.arc(0, 0, radius, startAngle, endAngle, true);  // Use anticlockwise=true
```

## My Conclusion

The issue is that **`ctx.rotate()` and `ctx.arc()` use opposite angular conventions**, and our formula doesn't account for this mismatch.

**The fix is most likely Option 1: Negate the rotation** when applying it to the canvas.

Change line 217 from:
```typescript
ctx.rotate((rotation * Math.PI) / 180);
```

To:
```typescript
ctx.rotate((-rotation * Math.PI) / 180);
```

This inverts the rotation direction to compensate for the canvas arc/rotate convention mismatch.
