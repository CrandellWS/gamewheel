/**
 * CORRECT FORMULA TEST
 *
 * Based on geometric analysis:
 * - Segment i center is at: i * deg - 90°
 * - After rotation R, center is at: (i * deg - 90) - R
 * - Pointer is at: -90°
 * - We want: (i * deg - 90) - R = -90
 * - Solving: R = i * deg - 90 + 90 = i * deg
 * - So targetAngle for accumulated rotation = -(i * deg - current_rotation)
 *
 * BUT the current code adds to existing rotation:
 * newTarget = rotation + spins*360 + targetAngle
 *
 * For the math to work:
 * newTarget = i * deg + spins*360  (mod 360)
 * rotation + targetAngle = i * deg (mod 360)
 * targetAngle = i * deg - (rotation mod 360)
 *
 * But we need to be careful about the modulo and ensuring we spin forward...
 */

function normalizeAngleTo360(angle) {
  return ((angle % 360) + 360) % 360;
}

function getWinnerAtRotation(rotation, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  const pointerAngle = -90; // Top position in canvas coords

  let closestIndex = -1;
  let minDistance = Infinity;

  for (let i = 0; i < numEntries; i++) {
    const segmentCenter = i * degreesPerSegment - 90;
    const segmentCenterAfterRotation = segmentCenter - rotation;

    // Calculate distance to pointer
    let distance = Math.abs(segmentCenterAfterRotation - pointerAngle);
    // Handle wraparound
    while (distance > 180) distance = Math.abs(distance - 360);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return { index: closestIndex, distance: minDistance };
}

function testFormula(formulaName, calculateTargetAngle) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${formulaName}`);
  console.log('='.repeat(80));

  const testCases = [
    { name: '6 segments, target 0, from 0°', entries: 6, target: 0, startRot: 0, spins: 5 },
    { name: '6 segments, target 1, from 0°', entries: 6, target: 1, startRot: 0, spins: 5 },
    { name: '6 segments, target 2, from 0°', entries: 6, target: 2, startRot: 0, spins: 5 },
    { name: '6 segments, target 3, from 0°', entries: 6, target: 3, startRot: 0, spins: 5 },
    { name: '6 segments, target 4, from 0°', entries: 6, target: 4, startRot: 0, spins: 5 },
    { name: '6 segments, target 5, from 0°', entries: 6, target: 5, startRot: 0, spins: 5 },
    { name: '5 segments, target 1, from 1800°', entries: 5, target: 1, startRot: 1800, spins: 5 },
    { name: '4 segments, target 0, from 3600°', entries: 4, target: 0, startRot: 3600, spins: 5 },
    { name: '4 segments, target 2, from 0°', entries: 4, target: 2, startRot: 0, spins: 6 },
    { name: '8 segments, target 7, from 0°', entries: 8, target: 7, startRot: 0, spins: 5 },
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    const degreesPerSegment = 360 / tc.entries;
    const targetAngle = calculateTargetAngle(tc.target, degreesPerSegment, tc.startRot);
    const newRotation = tc.startRot + tc.spins * 360 + targetAngle;
    const result = getWinnerAtRotation(newRotation, tc.entries);

    const success = result.index === tc.target && result.distance < 1;
    const icon = success ? '✅' : '❌';

    console.log(`${icon} ${tc.name}`);
    console.log(`   Target angle: ${targetAngle.toFixed(2)}°, New rotation: ${newRotation.toFixed(2)}°`);
    console.log(`   Expected: ${tc.target}, Got: ${result.index}, Distance: ${result.distance.toFixed(2)}°`);

    if (success) passed++;
    else failed++;
  }

  console.log(`\nResults: ${passed}/${testCases.length} passed`);
  return { passed, failed, total: testCases.length };
}

console.log('CORRECT FORMULA TEST');
console.log('='.repeat(80));

const results = [];

// Current buggy formula
results.push({
  name: 'Current (BUGGY)',
  result: testFormula(
    'Current: -(index + 0.5) * deg + deg/2',
    (index, deg, _startRot) => -(index + 0.5) * deg + deg / 2
  )
});

// Correct formula based on geometry
// We want: (index * deg - 90) - newRotation = -90
// newRotation = index * deg
// newRotation = startRot + spins*360 + targetAngle
// So: targetAngle = index * deg - startRot - spins*360
// But we add spins*360 separately, so:
// targetAngle = index * deg - (startRot % 360)
// To ensure forward motion, we need: targetAngle in range [-360, 0]

results.push({
  name: 'Correct Formula v1',
  result: testFormula(
    'targetAngle = -(index * deg - (startRot % 360))',
    (index, deg, startRot) => {
      const targetFinalAngle = (index * deg) % 360;
      const currentAngle = startRot % 360;
      let targetAngle = targetFinalAngle - currentAngle;

      // Normalize to range (-360, 0] for backward rotation
      while (targetAngle > 0) targetAngle -= 360;
      while (targetAngle <= -360) targetAngle += 360;

      return targetAngle;
    }
  )
});

// Alternative: directly calculate how far to rotate from current position
results.push({
  name: 'Correct Formula v2',
  result: testFormula(
    'targetAngle = index * deg - startRot (mod 360, range -360 to 0)',
    (index, deg, startRot) => {
      // Target final rotation (mod 360): index * deg
      // Current rotation (mod 360): startRot % 360
      // We want to rotate from current to target

      const targetPos = index * deg;
      const currentPos = startRot % 360;

      // Calculate shortest rotation (allowing negative for backward)
      let delta = targetPos - currentPos;

      // Normalize to (-360, 0] to ensure we rotate backward (visual forward)
      while (delta > 0) delta -= 360;

      return delta;
    }
  )
});

// Test what happens if we just use index * deg directly (ignoring accumulated rotation)
results.push({
  name: 'Naive: always use index * deg',
  result: testFormula(
    'targetAngle = -(index * deg)',
    (index, deg, _startRot) => -(index * deg)
  )
});

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

results.forEach(r => {
  const pct = ((r.result.passed / r.result.total) * 100).toFixed(0);
  const icon = r.result.passed === r.result.total ? '✅' : '❌';
  console.log(`${icon} ${r.name}: ${r.result.passed}/${r.result.total} (${pct}%)`);
});

const winner = results.find(r => r.result.passed === r.result.total);
if (winner) {
  console.log(`\n🎯 WINNING FORMULA: ${winner.name}`);
  console.log('\n📝 CODE FIX for Wheel.tsx line ~141-147:');
  console.log('\nReplace:');
  console.log('  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;');
  console.log('  const offsetAdjustment = degreesPerSegment / 2;');
  console.log('  const targetAngle = -winnerCenterAngle + offsetAdjustment;');
  console.log('\nWith:');
  console.log('  const targetPosition = targetWinnerIndex * degreesPerSegment;');
  console.log('  const currentPosition = rotation % 360;');
  console.log('  let targetAngle = targetPosition - currentPosition;');
  console.log('  while (targetAngle > 0) targetAngle -= 360;  // Ensure backward rotation');
} else {
  console.log(`\n⚠️  No formula achieved 100% success. More investigation needed.`);
}
