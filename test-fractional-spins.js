/**
 * FRACTIONAL SPINS TEST
 *
 * The issue seems to be with fractional spins (like 5.5)
 * Let's investigate what's happening
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

function calculateRotation(currentRotation, targetIndex, numEntries, spins) {
  const degreesPerSegment = 360 / numEntries;
  const targetPosition = targetIndex * degreesPerSegment;
  const currentPosition = currentRotation % 360;
  let targetAngle = targetPosition - currentPosition;

  while (targetAngle > 0) targetAngle -= 360;

  const newRotation = currentRotation + spins * 360 + targetAngle;

  return { newRotation, targetAngle, targetPosition, currentPosition };
}

console.log('FRACTIONAL SPINS INVESTIGATION');
console.log('='.repeat(80));

// Test with integer spins
console.log('\n📊 Test 1: 6 segments, target 2, with INTEGER spins (5)');
let result = calculateRotation(0, 2, 6, 5);
console.log(`  Target position: ${result.targetPosition}°`);
console.log(`  Current position: ${result.currentPosition}°`);
console.log(`  Target angle: ${result.targetAngle}°`);
console.log(`  New rotation: ${result.newRotation}°`);

let verify = verifyRotation(result.newRotation, 2, 6);
console.log(`  Expected: 2, Got: ${verify.actualIndex}, Distance: ${verify.minDistance.toFixed(2)}°`);
console.log(`  Result: ${verify.actualIndex === 2 ? '✅ PASS' : '❌ FAIL'}`);

// Test with fractional spins
console.log('\n📊 Test 2: 6 segments, target 2, with FRACTIONAL spins (5.5)');
result = calculateRotation(0, 2, 6, 5.5);
console.log(`  Target position: ${result.targetPosition}°`);
console.log(`  Current position: ${result.currentPosition}°`);
console.log(`  Target angle: ${result.targetAngle}°`);
console.log(`  New rotation: ${result.newRotation}°`);
console.log(`  Which is: 5.5 * 360 + ${result.targetAngle}° = ${5.5 * 360}° + ${result.targetAngle}° = ${result.newRotation}°`);

verify = verifyRotation(result.newRotation, 2, 6);
console.log(`  Expected: 2, Got: ${verify.actualIndex}, Distance: ${verify.minDistance.toFixed(2)}°`);
console.log(`  Result: ${verify.actualIndex === 2 ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n💡 Analysis:');
console.log('   With fractional spins, we\'re adding 1980° (5.5 * 360°)');
console.log('   This is equivalent to 5 full rotations + 180°');
console.log('   Adding 180° flips everything to the opposite side!');

console.log('\n🔍 Let\'s check what segment DOES land at the pointer:');
for (let i = 0; i < 6; i++) {
  verify = verifyRotation(result.newRotation, i, 6);
  if (verify.minDistance < 1) {
    console.log(`   Segment ${i} is at the pointer`);
  }
}

console.log('\n📐 The math:');
console.log('   Segment 2 position: 2 * 60 = 120°');
console.log('   Segment 5 position: 5 * 60 = 300°');
console.log('   Difference: 300° - 120° = 180°');
console.log('   So segment 5 is exactly opposite to segment 2!');

console.log('\n💡 ROOT CAUSE:');
console.log('   The rotation calculation assumes integer rotations');
console.log('   But the code uses random fractional spins: 5 + Math.random() * 3');
console.log('   This can give values like 5.5, 6.3, 7.8, etc.');
console.log('   The fractional part (0.5 * 360° = 180°) throws off the calculation!');

console.log('\n✨ SOLUTION:');
console.log('   The targetAngle calculation must account for the TOTAL rotation');
console.log('   including the fractional part of spins.');
console.log('');
console.log('   Instead of:');
console.log('     newRotation = currentRotation + spins * 360 + targetAngle');
console.log('');
console.log('   We need to calculate the final target rotation directly:');
console.log('     finalTargetRotation = targetWinnerIndex * degreesPerSegment');
console.log('     We want to end at finalTargetRotation (mod 360)');
console.log('     But we also want to spin at least "spins" full rotations');
console.log('');
console.log('   So:');
console.log('     desiredFinalAngle = targetWinnerIndex * degreesPerSegment');
console.log('     numFullRotations = Math.floor(spins)');
console.log('     currentAngle = currentRotation % 360');
console.log('     angleDelta = desiredFinalAngle - currentAngle');
console.log('     if (angleDelta > 0) angleDelta -= 360;  // Go backward');
console.log('     newRotation = currentRotation + numFullRotations * 360 + angleDelta');

console.log('\n🧪 Testing the corrected approach:');

function calculateRotationCorrected(currentRotation, targetIndex, numEntries, spins) {
  const degreesPerSegment = 360 / numEntries;
  const desiredFinalAngle = targetIndex * degreesPerSegment;

  // Only use the INTEGER part of spins for full rotations
  const numFullRotations = Math.floor(spins);

  const currentAngle = currentRotation % 360;
  let angleDelta = desiredFinalAngle - currentAngle;

  // Ensure backward rotation (negative)
  while (angleDelta > 0) angleDelta -= 360;

  const newRotation = currentRotation + numFullRotations * 360 + angleDelta;

  return { newRotation, angleDelta, numFullRotations };
}

console.log('\n✅ Test with corrected formula: 6 segments, target 2, spins 5.5');
result = calculateRotationCorrected(0, 2, 6, 5.5);
console.log(`  Full rotations: ${result.numFullRotations}`);
console.log(`  Angle delta: ${result.angleDelta}°`);
console.log(`  New rotation: ${result.newRotation}°`);

verify = verifyRotation(result.newRotation, 2, 6);
console.log(`  Expected: 2, Got: ${verify.actualIndex}, Distance: ${verify.minDistance.toFixed(2)}°`);
console.log(`  Result: ${verify.actualIndex === 2 ? '✅ PASS' : '❌ FAIL'}`);

// Test multiple cases
console.log('\n📊 Testing multiple scenarios with corrected formula:');
const testCases = [
  { entries: 6, target: 2, start: 0, spins: 5.5 },
  { entries: 6, target: 1, start: 0, spins: 6.8 },
  { entries: 5, target: 3, start: 1560, spins: 7.2 },
  { entries: 4, target: 1, start: 0, spins: 5.1 },
];

let allPass = true;
for (const tc of testCases) {
  result = calculateRotationCorrected(tc.start, tc.target, tc.entries, tc.spins);
  verify = verifyRotation(result.newRotation, tc.target, tc.entries);
  const pass = verify.actualIndex === tc.target && verify.minDistance < 1;
  console.log(`  ${pass ? '✅' : '❌'} ${tc.entries} segs, target ${tc.target}, spins ${tc.spins}: Got ${verify.actualIndex} (dist: ${verify.minDistance.toFixed(2)}°)`);
  if (!pass) allPass = false;
}

console.log('\n' + '='.repeat(80));
if (allPass) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('\n📝 CORRECT FIX for Wheel.tsx (lines ~140-151):');
  console.log('\nReplace:');
  console.log('  const degreesPerSegment = 360 / numEntries;');
  console.log('  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;');
  console.log('  const offsetAdjustment = degreesPerSegment / 2;');
  console.log('  const targetAngle = -winnerCenterAngle + offsetAdjustment;');
  console.log('  const spins = 5 + Math.random() * 3;');
  console.log('  const newTarget = rotation + spins * 360 + targetAngle;');
  console.log('\nWith:');
  console.log('  const degreesPerSegment = 360 / numEntries;');
  console.log('  const desiredFinalAngle = targetWinnerIndex * degreesPerSegment;');
  console.log('  const spins = 5 + Math.random() * 3;');
  console.log('  const numFullRotations = Math.floor(spins);');
  console.log('  const currentAngle = rotation % 360;');
  console.log('  let angleDelta = desiredFinalAngle - currentAngle;');
  console.log('  while (angleDelta > 0) angleDelta -= 360;');
  console.log('  const newTarget = rotation + numFullRotations * 360 + angleDelta;');
} else {
  console.log('❌ Some tests still failing');
}
