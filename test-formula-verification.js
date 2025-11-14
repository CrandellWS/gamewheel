/**
 * FORMULA VERIFICATION TEST
 *
 * Tests different formulas to find the exact correct one
 */

function normalizeAngleTo360(angle) {
  return ((angle % 360) + 360) % 360;
}

function getWinnerAtRotation(rotation, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  const pointerAngle = 270; // Top position

  let closestIndex = -1;
  let minDistance = Infinity;

  for (let i = 0; i < numEntries; i++) {
    const segmentCenter = i * degreesPerSegment - 90;
    const segmentCenterAfterRotation = segmentCenter - rotation;
    const normalizedCenter = normalizeAngleTo360(segmentCenterAfterRotation);

    let distance = Math.abs(normalizedCenter - pointerAngle);
    if (distance > 180) distance = 360 - distance;

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
    { name: '6 segments, target 2, from 0°', entries: 6, target: 2, startRot: 0, spins: 5 },
    { name: '6 segments, target 0, from 0°', entries: 6, target: 0, startRot: 0, spins: 5 },
    { name: '6 segments, target 5, from 0°', entries: 6, target: 5, startRot: 0, spins: 5 },
    { name: '5 segments, target 1, from 1560°', entries: 5, target: 1, startRot: 1560, spins: 5 },
    { name: '4 segments, target 0, from 0°', entries: 4, target: 0, startRot: 0, spins: 5 },
    { name: '4 segments, target 3, from 0°', entries: 4, target: 3, startRot: 0, spins: 5 },
    { name: '8 segments, target 7, from 0°', entries: 8, target: 7, startRot: 0, spins: 5 },
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    const degreesPerSegment = 360 / tc.entries;
    const targetAngle = calculateTargetAngle(tc.target, degreesPerSegment);
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

// Test different formulas
console.log('FORMULA VERIFICATION TEST');
console.log('='.repeat(80));

const results = [];

// Formula 1: Current implementation
results.push({
  name: 'Current (BUGGY)',
  result: testFormula(
    'Current: -winnerCenterAngle + offsetAdjustment',
    (index, deg) => -(index + 0.5) * deg + deg / 2
  )
});

// Formula 2: Based on geometric analysis
results.push({
  name: 'Fix v1: -index * deg + 180',
  result: testFormula(
    'Proposed fix: -index * degreesPerSegment + 180',
    (index, deg) => -index * deg + 180
  )
});

// Formula 3: Alternative calculation
results.push({
  name: 'Fix v2: -(index * deg - 90) - 270',
  result: testFormula(
    'Alternative: -(index * deg - 90) - 270',
    (index, deg) => -(index * deg - 90) - 270
  )
});

// Formula 4: Direct calculation to align with pointer
results.push({
  name: 'Fix v3: -(index * deg) + 360 - 90 - 270',
  result: testFormula(
    'Direct: -(index * deg) + 360 - 90 - 270',
    (index, deg) => -(index * deg) + 360 - 90 - 270
  )
});

// Formula 5: Even simpler
results.push({
  name: 'Fix v4: -index * deg',
  result: testFormula(
    'Simplest: -index * deg',
    (index, deg) => -index * deg
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
} else {
  console.log(`\n⚠️  No formula achieved 100% success. More investigation needed.`);
}
