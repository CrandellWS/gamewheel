# UX Improvements - Pointer Alignment & Winner Confirmation

## Issues Fixed

### 1. ✅ Pointer Not Aligned with Winner Name
**Problem**: The pointer was landing at segment boundaries, but winner names were drawn at segment centers, causing a visual misalignment of ~half a segment width.

**Root Cause**:
- Segments started at `-Math.PI/2` (top position)
- Text was drawn at segment center: `startAngle + anglePerSegment/2`
- Pointer pointed at segment START, not CENTER

**Solution**:
Modified segment drawing to offset by half a segment so segment CENTERS align with the pointer.

**Result**: The pointer now points directly at the winner's NAME.

---

### 2. ✅ Winner Stays On Screen Until User Chooses Action

**New User Flow**:
1. Wheel spins and lands on winner → Winner highlighted with gold glow
2. Winner card appears with TWO buttons:
   - **"✓ Confirm & Remove"** - Accepts winner and removes them (if setting enabled)
   - **"🔄 Spin Again"** - Dismisses winner, keeps in pool, allows respin
3. Winner stays on screen until user makes a choice

---

## Benefits

✅ Pointer always points at winner's name exactly
✅ Users can verify the winner is correct  
✅ Users can reject outcome and spin again if needed
✅ No accidental winner removal
✅ Winner display persists for confirmation
✅ Full user control over the process

---

## Build Status

✅ TypeScript: No errors
✅ Build: Successful  
✅ Bundle: 56.4 kB
✅ Ready to test!
