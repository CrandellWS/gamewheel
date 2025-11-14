/**
 * FINAL VERIFICATION TEST
 *
 * Re-run the original comprehensive test scenarios with the CORRECT formula
 */

function normalizeAngle(angle) {
  while (angle > 180) angle -= 360;
  while (angle <= -180) angle += 360;
  return angle;
}

function verifyRotationLandsOnWinner(rotation, targetWinnerIndex, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  const pointerAngle = -90;

  let actualWinnerIndex = -1;
  let minDistance = Infinity;

  for (let i = 0; i < numEntries; i++) {
    const segmentCenter = i * degreesPerSegment - 90;
    const segmentCenterAfterRotation = segmentCenter - rotation;

    let distance = Math.abs(segmentCenterAfterRotation - pointerAngle);
    while (distance > 180) distance = Math.abs(distance - 360);

    if (distance < minDistance) {
      minDistance = distance;
      actualWinnerIndex = i;
    }
  }

  const tolerance = degreesPerSegment / 2 + 0.1;
  const isCorrect = actualWinnerIndex === targetWinnerIndex;

  return {
    isCorrect,
    actualWinnerIndex,
    expectedWinnerIndex: targetWinnerIndex,
    minDistance,
    tolerance
  };
}

// CORRECTED rotation calculation
function calculateSpinRotation(currentRotation, targetWinnerIndex, numEntries, spins) {
  const degreesPerSegment = 360 / numEntries;

  // CORRECT FORMULA:
  const targetPosition = targetWinnerIndex * degreesPerSegment;
  const currentPosition = currentRotation % 360;
  let targetAngle = targetPosition - currentPosition;

  // Ensure backward rotation (negative angle) for visual forward spin
  while (targetAngle > 0) targetAngle -= 360;

  const newTarget = currentRotation + spins * 360 + targetAngle;

  return newTarget;
}

function runTests() {
  console.log('='.repeat(80));
  console.log('FINAL VERIFICATION TEST - WITH CORRECTED FORMULA');
  console.log('='.repeat(80));
  console.log();

  let allTestsPassed = true;

  // SCENARIO 1: 6 entries, remove after each spin
  console.log('SCENARIO 1: 6 entries, remove after each spin');
  console.log('-'.repeat(80));

  let entries = [
    { id: '1', name: 'Entry 1' },
    { id: '2', name: 'Entry 2' },
    { id: '3', name: 'Entry 3' },
    { id: '4', name: 'Entry 4' },
    { id: '5', name: 'Entry 5' },
    { id: '6', name: 'Entry 6' },
  ];

  let activeEntries = [...entries];
  let rotation = 0;

  // Spin 1: 6 entries (60° segments), winner at index 2
  console.log('\n🎯 Spin 1: 6 entries (60° segments), target winner at index 2');
  let targetWinnerIndex = 2;
  let spins = 5.5;
  let newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Active entries: ${activeEntries.length}`);
  console.log(`  Degrees per segment: ${360 / activeEntries.length}°`);
  console.log(`  Previous rotation: ${rotation.toFixed(2)}°`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);
  console.log(`  Total spins: ${spins}`);

  let verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ✓ Expected winner: Index ${verification.expectedWinnerIndex} (${activeEntries[verification.expectedWinnerIndex].name})`);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Actual winner: Index ${verification.actualWinnerIndex} (${activeEntries[verification.actualWinnerIndex].name})`);
  console.log(`  Distance from pointer: ${verification.minDistance.toFixed(2)}°`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL: Rotation did not land on expected winner!`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS: Rotation landed correctly`);
  }

  rotation = newRotation;
  activeEntries = activeEntries.filter((_, idx) => idx !== targetWinnerIndex);

  // Spin 2: 5 entries (72° segments), winner at index 1
  console.log('\n🎯 Spin 2: 5 entries (72° segments), target winner at index 1');
  targetWinnerIndex = 1;
  spins = 6.2;
  newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Active entries: ${activeEntries.length}`);
  console.log(`  Degrees per segment: ${360 / activeEntries.length}°`);
  console.log(`  Previous rotation: ${rotation.toFixed(2)}°`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ✓ Expected winner: Index ${verification.expectedWinnerIndex} (${activeEntries[verification.expectedWinnerIndex].name})`);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Actual winner: Index ${verification.actualWinnerIndex} (${activeEntries[verification.actualWinnerIndex].name})`);
  console.log(`  Distance from pointer: ${verification.minDistance.toFixed(2)}°`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS`);
  }

  rotation = newRotation;
  activeEntries = activeEntries.filter((_, idx) => idx !== targetWinnerIndex);

  // Spin 3: 4 entries (90° segments), winner at index 0
  console.log('\n🎯 Spin 3: 4 entries (90° segments), target winner at index 0');
  targetWinnerIndex = 0;
  spins = 7.8;
  newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Active entries: ${activeEntries.length}`);
  console.log(`  Degrees per segment: ${360 / activeEntries.length}°`);
  console.log(`  Previous rotation: ${rotation.toFixed(2)}°`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ✓ Expected winner: Index ${verification.expectedWinnerIndex} (${activeEntries[verification.expectedWinnerIndex].name})`);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Actual winner: Index ${verification.actualWinnerIndex} (${activeEntries[verification.actualWinnerIndex].name})`);
  console.log(`  Distance from pointer: ${verification.minDistance.toFixed(2)}°`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS`);
  }

  // SCENARIO 2: Test with accumulated rotation
  console.log('\n' + '='.repeat(80));
  console.log('SCENARIO 2: Test accumulated rotation drift');
  console.log('-'.repeat(80));

  entries = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
    { id: '3', name: 'C' },
    { id: '4', name: 'D' },
  ];

  activeEntries = [...entries];
  rotation = 0;

  console.log('\n🎯 Spin 1: Start from 0°, target index 1');
  targetWinnerIndex = 1;
  spins = 5;
  newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Previous rotation: ${rotation.toFixed(2)}°`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Landed on index ${verification.actualWinnerIndex} (expected ${verification.expectedWinnerIndex})`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS`);
  }

  rotation = newRotation;

  console.log('\n🎯 Spin 2: Continue from previous rotation, target index 2');
  targetWinnerIndex = 2;
  spins = 5;
  newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Previous rotation: ${rotation.toFixed(2)}°`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Landed on index ${verification.actualWinnerIndex} (expected ${verification.expectedWinnerIndex})`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS`);
  }

  // SCENARIO 3: Test index shifts after removal
  console.log('\n' + '='.repeat(80));
  console.log('SCENARIO 3: Test index shifts after removal');
  console.log('-'.repeat(80));

  entries = [
    { id: '0', name: 'Zero' },
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
    { id: '4', name: 'Four' },
    { id: '5', name: 'Five' },
  ];

  activeEntries = [...entries];
  rotation = 0;

  console.log('\n📋 Initial entries: [0,1,2,3,4,5]');
  console.log('   Removing index 2 (entry "Two")');

  activeEntries = activeEntries.filter((_, idx) => idx !== 2);

  console.log(`📋 After removal: [${activeEntries.map(e => e.name).join(',')}]`);
  console.log('   Indices are now: [0,1,2,3,4] (what was "Three" is now at index 2)');

  console.log('\n🎯 Spin: Target winner at new index 2 (entry "Three")');
  targetWinnerIndex = 2;
  spins = 5;
  newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Active entries: ${activeEntries.length}`);
  console.log(`  Target: Index ${targetWinnerIndex} = "${activeEntries[targetWinnerIndex].name}"`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ✓ Expected winner: Index ${verification.expectedWinnerIndex} (${activeEntries[verification.expectedWinnerIndex].name})`);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Actual winner: Index ${verification.actualWinnerIndex} (${activeEntries[verification.actualWinnerIndex].name})`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS`);
  }

  // FINAL SUMMARY
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED - Rotation calculations are accurate!');
    console.log('\n📝 APPLY THIS FIX TO Wheel.tsx:');
    console.log('\nLines 140-147, replace:');
    console.log('  const degreesPerSegment = 360 / numEntries;');
    console.log('  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;');
    console.log('  const offsetAdjustment = degreesPerSegment / 2;');
    console.log('  const targetAngle = -winnerCenterAngle + offsetAdjustment;');
    console.log('\nWith:');
    console.log('  const degreesPerSegment = 360 / numEntries;');
    console.log('  const targetPosition = targetWinnerIndex * degreesPerSegment;');
    console.log('  const currentPosition = rotation % 360;');
    console.log('  let targetAngle = targetPosition - currentPosition;');
    console.log('  while (targetAngle > 0) targetAngle -= 360;  // Ensure backward rotation');
  } else {
    console.log('❌ SOME TESTS FAILED');
  }

  console.log();

  return allTestsPassed;
}

const passed = runTests();
process.exit(passed ? 0 : 1);
