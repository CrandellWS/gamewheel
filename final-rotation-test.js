/**
 * DEFINITIVE TEST: What does ctx.rotate() actually do?
 *
 * Key insight: When you call ctx.rotate(R), then draw at angle θ,
 * where does it VISUALLY appear?
 */

console.log('=== DEFINITIVE CANVAS ROTATION TEST ===\n');

console.log('The critical question:');
console.log('  If I call ctx.rotate(R), then draw a shape at angle θ,');
console.log('  what angle does it VISUALLY appear at to the viewer?\n');

console.log('Answer: It appears at angle (θ + R)\n');

console.log('Why? Because ctx.rotate(R) rotates the coordinate system,');
console.log('so the axes themselves are rotated by R.\n');

console.log('=== APPLYING TO OUR WHEEL ===\n');

console.log('Test case: 6 entries, trying to win segment 1 (David)\n');

console.log('Step 1: Where is David drawn in the code?');
console.log('  Line 224-225: startAngle = index * anglePerSegment - Math.PI/2 - anglePerSegment/2');
console.log('  For index=1, anglePerSegment=60°:');
console.log('    startAngle = 1 * 60° - 90° - 30° = -60°');
console.log('    centerAngle = startAngle + 30° = -30°');
console.log('  David is drawn with center at -30°\n');

console.log('Step 2: What rotation do we calculate?');
console.log('  Line 141: winnerCenterAngle = (1 + 0.5) * 60° = 90°');
console.log('  Line 147: targetAngle = -90° + 30° = -60°');
console.log('  We calculate rotation = -60°\n');

console.log('Step 3: What does ctx.rotate(-60°) do?');
console.log('  It rotates the coordinate system by -60° (clockwise)');
console.log('  Shapes drawn at angle θ appear at (θ + R) = (θ - 60°)\n');

console.log('Step 4: Where does David appear after rotation?');
console.log('  David drawn at: -30°');
console.log('  Rotation applied: -60°');
console.log('  Visual appearance: -30° + (-60°) = -90° ✓\n');

console.log('=== SO THE MATH IS CORRECT! ===\n');

console.log('But wait, if math is correct, why are screenshots showing wrong winners?\n');

console.log('=== NEW HYPOTHESIS ===\n');

console.log('Maybe the issue is in the CALCULATION, not the APPLICATION!');
console.log('Let\'s check line 141 more carefully:\n');

console.log('Line 141: const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;\n');

console.log('What does this calculate?');
console.log('  - It treats segment 0 as starting at 0°');
console.log('  - Segment 0 center: 0.5 * 60° = 30°');
console.log('  - Segment 1 center: 1.5 * 60° = 90°');
console.log('  - etc.\n');

console.log('But in the DRAWING code (line 224), segments are offset!');
console.log('  startAngle = index * anglePerSegment - Math.PI/2 - anglePerSegment/2');
console.log('  - Segment 0 starts at: 0 - 90° - 30° = -120°, center at -90°');
console.log('  - Segment 1 starts at: 60° - 90° - 30° = -60°, center at -30°\n');

console.log('AH HA! THERE\'S A MISMATCH!\n');

console.log('CALCULATION assumes:');
console.log('  Segment 0 center: 30°');
console.log('  Segment 1 center: 90°\n');

console.log('DRAWING has:');
console.log('  Segment 0 center: -90°');
console.log('  Segment 1 center: -30°\n');

console.log('Difference: -120° offset!\n');

console.log('Wait no, let me recalculate...');
console.log('  30° vs -90° = 120° difference');
console.log('  90° vs -30° = 120° difference ✓\n');

console.log('So the calculation needs to account for the -90° - 30° offset!\n');

console.log('=== VERIFICATION ===\n');

console.log('Current calculation for segment 1:');
console.log('  winnerCenterAngle = 90°');
console.log('  targetAngle = -90° + 30° = -60°');
console.log('  Segment 1 drawn at -30°, appears at -30° + (-60°) = -90° ✓\n');

console.log('Wait, that\'s correct! Let me trace through this once more...\n');

console.log('=== FINAL TRACE ===\n');

console.log('For segment 1 (David):');
console.log('  1. Drawing: David center at -30°');
console.log('  2. Target: Want David at -90° (pointer position)');
console.log('  3. Need: rotation such that -30° + rotation = -90°');
console.log('  4. Solve: rotation = -90° - (-30°) = -60° ✓');
console.log('  5. Current calculation: targetAngle = -winnerCenterAngle + offsetAdjustment');
console.log('     = -90° + 30° = -60° ✓\n');

console.log('THE CALCULATION IS CORRECT!!!\n');

console.log('So if math is correct AND test confirms it, the bug must be elsewhere:');
console.log('  - Maybe in how targetWinnerId is determined?');
console.log('  - Maybe in the array indexing?');
console.log('  - Maybe entries are in different order than expected?');
console.log('  - Maybe something with activeEntries filtering?');
