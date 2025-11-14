/**
 * THE BUG IS FOUND!
 *
 * The issue is in HOW we calculate winnerCenterAngle
 */

console.log('=== THE ACTUAL BUG ===\n');

console.log('Current code (lines 136-147):');
console.log('  const degreesPerSegment = 360 / numEntries;');
console.log('  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;');
console.log('  const offsetAdjustment = degreesPerSegment / 2;');
console.log('  const targetAngle = -winnerCenterAngle + offsetAdjustment;\n');

console.log('Drawing code (line 224):');
console.log('  const startAngle = index * anglePerSegment - Math.PI/2 - anglePerSegment/2;\n');

console.log('The problem:');
console.log('  winnerCenterAngle assumes segments start at 0°');
console.log('  But drawing code offsets everything by: -90° - (anglePerSegment/2)\n');

console.log('=== EXAMPLE WITH 6 ENTRIES ===\n');

const numEntries = 6;
const degreesPerSegment = 360 / numEntries; // 60°

console.log(`Degrees per segment: ${degreesPerSegment}°\n`);

console.log('Where segments are ACTUALLY drawn (from line 224):');
for (let i = 0; i < numEntries; i++) {
    const startAngle = i * degreesPerSegment - 90 - (degreesPerSegment / 2);
    const centerAngle = startAngle + (degreesPerSegment / 2);
    console.log(`  Segment ${i}: center at ${centerAngle}°`);
}
console.log('');

console.log('What winnerCenterAngle CALCULATES (line 141):');
for (let i = 0; i < numEntries; i++) {
    const winnerCenterAngle = (i + 0.5) * degreesPerSegment;
    console.log(`  Segment ${i}: ${winnerCenterAngle}°`);
}
console.log('');

console.log('MISMATCH! The calculation doesn\'t match the drawing!\n');

console.log('But wait... let\'s check what targetAngle actually produces:\n');

console.log('For each segment, what rotation does the formula produce?');
for (let i = 0; i < numEntries; i++) {
    // Current calculation
    const winnerCenterAngle = (i + 0.5) * degreesPerSegment;
    const offsetAdjustment = degreesPerSegment / 2;
    const targetAngle = -winnerCenterAngle + offsetAdjustment;

    // Where segment is actually drawn
    const actualCenterAngle = i * degreesPerSegment - 90 - (degreesPerSegment / 2) + (degreesPerSegment / 2);
    const simplifiedCenter = i * degreesPerSegment - 90;

    // Where it appears after rotation
    const finalPosition = actualCenterAngle + targetAngle;

    console.log(`Segment ${i}:`);
    console.log(`  Drawn at: ${actualCenterAngle}° (${simplifiedCenter}°)`);
    console.log(`  Rotation: ${targetAngle}°`);
    console.log(`  Appears at: ${finalPosition}°`);
    console.log('');
}

console.log('Let me simplify the math:\n');

console.log('Actual center where segment i is drawn:');
console.log('  = i * degreesPerSegment - 90° - degreesPerSegment/2 + degreesPerSegment/2');
console.log('  = i * degreesPerSegment - 90°\n');

console.log('Calculated rotation (targetAngle):');
console.log('  = -(i + 0.5) * degreesPerSegment + degreesPerSegment/2');
console.log('  = -i * degreesPerSegment - 0.5 * degreesPerSegment + 0.5 * degreesPerSegment');
console.log('  = -i * degreesPerSegment\n');

console.log('Final position:');
console.log('  = (i * degreesPerSegment - 90°) + (-i * degreesPerSegment)');
console.log('  = -90° ✓\n');

console.log('SO THE MATH IS CORRECT!!\n');

console.log('=== THEN WHERE IS THE BUG??? ===\n');

console.log('If test confirms all segments land at -90°, but screenshots show wrong winners...\n');

console.log('Possibilities:');
console.log('  1. The targetWinnerId being passed is wrong');
console.log('  2. activeEntries array order doesn\'t match what we expect');
console.log('  3. There\'s a mismatch between drawing order and calculation order');
console.log('  4. The pointer isn\'t actually at -90°');
console.log('  5. Visual perception issue - maybe we\'re looking at the wrong side?\n');

console.log('KEY INSIGHT:');
console.log('  The test file only validates the MATH');
console.log('  It doesn\'t actually render to canvas');
console.log('  The bug might be in canvas coordinate system assumptions!\n');

console.log('=== CANVAS COORDINATE SYSTEM ===\n');

console.log('In canvas:');
console.log('  - Angles in ctx.arc() are measured FROM THE POSITIVE X-AXIS');
console.log('  - Positive X-axis points RIGHT (0° or 0 radians)');
console.log('  - Angles increase CLOCKWISE (not counter-clockwise like in math!)');
console.log('  - So -90° (or -π/2) points UP\n');

console.log('But ctx.rotate():');
console.log('  - STILL follows math convention');
console.log('  - Positive rotation = counter-clockwise');
console.log('  - This rotates the coordinate SYSTEM, not visual content\n');

console.log('THIS IS THE SOURCE OF CONFUSION!\n');

console.log('Canvas ctx.arc() uses clockwise angles, but ctx.rotate() uses CCW rotation!\n');
