# Winner Alignment Fix - ID-Based Tracking

## The Problem

The pointer was pointing at the WRONG winner even after rotation fixes.

**Example from screenshot:**
- Pointer pointed at: Emma (pink segment)
- Winner announced: David (teal segment)

## Root Cause Discovered

The issue was **array timing inconsistency**:

1. **Winner selection** happened in `wheelStore.ts`:
   - Created `activeEntries` array at time T1
   - Selected winner and stored `targetWinnerIndex`

2. **Rotation calculation** happened in `Wheel.tsx`:
   - Created DIFFERENT `activeEntries` array at time T2
   - Used the stored index, but arrays might differ!

Even though both used the same filter, if entries changed between T1 and T2 (due to React re-renders or state updates), the index would point to the wrong entry.

## The Solution

**Store winner ID instead of index**, then calculate index fresh each time:

### Changes Made:

**1. Store winner ID** (wheelStore.ts):
```typescript
// OLD: Store index
set({ targetWinnerIndex: winnerIndex })

// NEW: Store ID
set({ targetWinnerId: winner.id })
```

**2. Calculate index on-demand** (Wheel.tsx):
```typescript
// Calculate index from ID using CURRENT activeEntries
const targetWinnerIndex = activeEntries.findIndex(e => e.id === targetWinnerId);
```

This ensures the winner identity is preserved via unique ID, and the index is always calculated from the current array.

## Files Modified

- `app/types/index.ts` - Changed `targetWinnerIndex` to `targetWinnerId`
- `app/stores/wheelStore.ts` - Store winner ID instead of index
- `app/components/Wheel.tsx` - Calculate index from ID dynamically

## Build Status

✅ Build successful
✅ No TypeScript errors
✅ Bundle: 56.5 kB

## Test at http://localhost:3000

The pointer should now ALWAYS point at the correct winner!
