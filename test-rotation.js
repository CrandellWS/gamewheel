/**
 * Test file to debug wheel rotation math
 * Run with: node test-rotation.js
 */

// Simulate the current rotation formula
function calculateRotation(targetWinnerIndex, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;
  const offsetAdjustment = degreesPerSegment / 2;
  const targetAngle = -winnerCenterAngle + offsetAdjustment;

  return {
    degreesPerSegment,
    winnerCenterAngle,
    offsetAdjustment,
    targetAngle,
    normalizedTarget: ((targetAngle % 360) + 360) % 360
  };
}

// Simulate segment drawing positions
function getSegmentPosition(index, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  // This matches line 224 in Wheel.tsx:
  // const startAngle = index * anglePerSegment - Math.PI / 2 - anglePerSegment / 2;
  const startAngleDegrees = index * degreesPerSegment - 90 - (degreesPerSegment / 2);
  const endAngleDegrees = startAngleDegrees + degreesPerSegment;
  const centerAngleDegrees = startAngleDegrees + (degreesPerSegment / 2);

  return {
    startAngle: startAngleDegrees,
    centerAngle: centerAngleDegrees,
    endAngle: endAngleDegrees
  };
}

// Test with 6 entries (like in screenshots)
console.log('=== TESTING WITH 6 ENTRIES ===\n');

const numEntries = 6;
const entries = ['Charlie', 'David', 'Emma', 'Bob', 'Charlie2', 'David2'];

console.log('Segment positions when rotation = 0:');
console.log('(Pointer is at -90° / 270° at the TOP)\n');

for (let i = 0; i < numEntries; i++) {
  const pos = getSegmentPosition(i, numEntries);
  console.log(`Segment ${i} (${entries[i]}):`);
  console.log(`  Start: ${pos.startAngle.toFixed(1)}°`);
  console.log(`  Center: ${pos.centerAngle.toFixed(1)}°`);
  console.log(`  End: ${pos.endAngle.toFixed(1)}°`);
  console.log(`  At pointer? ${pos.centerAngle === -90 ? 'YES ✓' : 'NO'}`);
  console.log();
}

console.log('\n=== ROTATION CALCULATIONS ===\n');

for (let targetIndex = 0; targetIndex < numEntries; targetIndex++) {
  const calc = calculateRotation(targetIndex, numEntries);
  const segmentPos = getSegmentPosition(targetIndex, numEntries);

  // After rotation, where will this segment's center be?
  const finalPosition = segmentPos.centerAngle + calc.targetAngle;

  console.log(`To win on ${entries[targetIndex]} (index ${targetIndex}):`);
  console.log(`  Segment center is at: ${segmentPos.centerAngle.toFixed(1)}°`);
  console.log(`  Rotation needed: ${calc.targetAngle.toFixed(1)}°`);
  console.log(`  Final position: ${finalPosition.toFixed(1)}°`);
  console.log(`  Should be -90°? ${Math.abs(finalPosition - (-90)) < 0.1 ? 'YES ✓' : `NO ✗ (off by ${(finalPosition - (-90)).toFixed(1)}°)`}`);
  console.log();
}

console.log('\n=== VERIFICATION ===\n');
console.log('The pointer should always land at -90° (top of wheel)');
console.log('If "Final position" is not -90°, the formula is WRONG!\n');
