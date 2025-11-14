/**
 * BEFORE/AFTER COMPARISON TEST
 *
 * Visual side-by-side comparison of buggy vs corrected formula
 */

function verifyRotation(rotation, targetIndex, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  const pointerAngle = -90;

  let actualIndex = -1;
  let minDistance = Infinity;

  for (let i = 0; i < numEntries; i++) {
    const segmentCenter = i * degreesPerSegment - 90;
    const segmentCenterAfterRotation = segmentCenter - rotation;

    let distance = Math.abs(segmentCenterAfterRotation - pointerAngle);
    while (distance > 180) distance = Math.abs(distance - 360);

    if (distance < minDistance) {
      minDistance = distance;
      actualIndex = i;
    }
  }

  return { actualIndex, minDistance };
}

// BUGGY: Current implementation
function calculateBuggy(currentRotation, targetIndex, numEntries, spins) {
  const degreesPerSegment = 360 / numEntries;
  const winnerCenterAngle = (targetIndex + 0.5) * degreesPerSegment;
  const offsetAdjustment = degreesPerSegment / 2;
  const targetAngle = -winnerCenterAngle + offsetAdjustment;
  const newTarget = currentRotation + spins * 360 + targetAngle;

  return newTarget;
}

// FIXED: Corrected implementation
function calculateFixed(currentRotation, targetIndex, numEntries, spins) {
  const degreesPerSegment = 360 / numEntries;
  const desiredFinalAngle = targetIndex * degreesPerSegment;
  const numFullRotations = Math.floor(spins);
  const currentAngle = currentRotation % 360;
  let angleDelta = desiredFinalAngle - currentAngle;
  while (angleDelta > 0) angleDelta -= 360;
  const newTarget = currentRotation + numFullRotations * 360 + angleDelta;

  return newTarget;
}

console.log('='.repeat(90));
console.log('BEFORE/AFTER COMPARISON TEST');
console.log('='.repeat(90));
console.log();

const testCases = [
  { desc: '6 entries, target 2, from 0°, spins 5.5', entries: 6, target: 2, start: 0, spins: 5.5 },
  { desc: '6 entries, target 1, from 0°, spins 6.3', entries: 6, target: 1, start: 0, spins: 6.3 },
  { desc: '5 entries, target 3, from 1560°, spins 7.2', entries: 5, target: 3, start: 1560, spins: 7.2 },
  { desc: '4 entries, target 1, from 3600°, spins 5.8', entries: 4, target: 1, start: 3600, spins: 5.8 },
  { desc: '8 entries, target 7, from 0°, spins 6.9', entries: 8, target: 7, start: 0, spins: 6.9 },
];

let buggyFailed = 0;
let fixedFailed = 0;

for (const tc of testCases) {
  console.log(`📊 ${tc.desc}`);
  console.log('-'.repeat(90));

  // Test buggy version
  const buggyRotation = calculateBuggy(tc.start, tc.target, tc.entries, tc.spins);
  const buggyResult = verifyRotation(buggyRotation, tc.target, tc.entries);
  const buggyPass = buggyResult.actualIndex === tc.target && buggyResult.minDistance < 1;

  // Test fixed version
  const fixedRotation = calculateFixed(tc.start, tc.target, tc.entries, tc.spins);
  const fixedResult = verifyRotation(fixedRotation, tc.target, tc.entries);
  const fixedPass = fixedResult.actualIndex === tc.target && fixedResult.minDistance < 1;

  console.log(`  Target: Index ${tc.target}`);
  console.log();
  console.log(`  ❌ BUGGY VERSION:`);
  console.log(`     Rotation: ${buggyRotation.toFixed(2)}°`);
  console.log(`     Result: Index ${buggyResult.actualIndex} (distance: ${buggyResult.minDistance.toFixed(2)}°)`);
  console.log(`     Status: ${buggyPass ? '✅ PASS' : '❌ FAIL'}`);
  console.log();
  console.log(`  ✅ FIXED VERSION:`);
  console.log(`     Rotation: ${fixedRotation.toFixed(2)}°`);
  console.log(`     Result: Index ${fixedResult.actualIndex} (distance: ${fixedResult.minDistance.toFixed(2)}°)`);
  console.log(`     Status: ${fixedPass ? '✅ PASS' : '❌ FAIL'}`);
  console.log();

  if (!buggyPass) buggyFailed++;
  if (!fixedPass) fixedFailed++;
}

console.log('='.repeat(90));
console.log('SUMMARY');
console.log('='.repeat(90));
console.log();
console.log(`❌ BUGGY VERSION: ${buggyFailed}/${testCases.length} tests FAILED`);
console.log(`✅ FIXED VERSION: ${fixedFailed}/${testCases.length} tests FAILED`);
console.log();

if (fixedFailed === 0 && buggyFailed > 0) {
  console.log('🎉 SUCCESS! The fix resolves all rotation accuracy issues.');
  console.log();
  console.log('📝 Next Steps:');
  console.log('   1. Apply the fix to Wheel.tsx (see QUICK-FIX-GUIDE.md)');
  console.log('   2. Test the application manually');
  console.log('   3. Verify multiple sequential spins work correctly');
} else if (fixedFailed > 0) {
  console.log('⚠️  Warning: Fixed version still has issues. Further investigation needed.');
} else {
  console.log('ℹ️  Note: Both versions passed. This test set may need more challenging cases.');
}

console.log();
