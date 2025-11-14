/**
 * CRITICAL BUG TEST: Sequential Spin Accuracy
 *
 * This test simulates the EXACT rotation calculation logic from Wheel.tsx
 * to verify that the wheel lands correctly after multiple sequential spins
 * with entry removal between each spin.
 */

// Helper function to normalize angles to -180 to 180 range
function normalizeAngle(angle) {
  while (angle > 180) angle -= 360;
  while (angle <= -180) angle += 360;
  return angle;
}

// Helper function to get the segment index at a specific rotation angle
function getSegmentAtPointer(rotation, numSegments) {
  // The pointer is at the top (270° or -90° in our coordinate system)
  // We need to find which segment is aligned with it

  // Normalize rotation to 0-360
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  // The drawing starts at -anglePerSegment/2 offset
  // Each segment center is at (i + 0.5) * anglePerSegment
  const degreesPerSegment = 360 / numSegments;

  // Account for the -anglePerSegment/2 offset in drawing
  const adjustedRotation = normalizedRotation + (degreesPerSegment / 2);

  // Find which segment the pointer (at 270°/top) is pointing at
  // The pointer is at 270° in normal coords, but we're rotating the wheel
  const pointerAngle = 270; // Top position
  const relativeAngle = (pointerAngle - adjustedRotation + 360) % 360;

  const segmentIndex = Math.floor(relativeAngle / degreesPerSegment);
  return segmentIndex % numSegments;
}

// Simulate the EXACT rotation calculation from Wheel.tsx lines 128-151
function calculateSpinRotation(currentRotation, targetWinnerIndex, numEntries, spins) {
  // Calculate the angle to land on the winner
  const degreesPerSegment = 360 / numEntries;
  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;

  // Account for the half-segment offset applied in drawing (line 225 in Wheel.tsx)
  const offsetAdjustment = degreesPerSegment / 2;

  // Calculate how much to rotate to align winner with pointer
  const targetAngle = -winnerCenterAngle + offsetAdjustment;

  // Add full rotations for dramatic effect
  const newTarget = currentRotation + spins * 360 + targetAngle;

  return newTarget;
}

// Verify that a rotation actually lands on the target winner
function verifyRotationLandsOnWinner(rotation, targetWinnerIndex, numEntries) {
  // The key insight: we need to determine which segment is at the pointer position
  // The pointer is at the top (270° or -90°)

  // Normalize rotation to 0-360
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  // Calculate degrees per segment
  const degreesPerSegment = 360 / numEntries;

  // The segments are drawn with offset: startAngle = index * anglePerSegment - PI/2 - anglePerSegment/2
  // In degrees: startAngle = index * degreesPerSegment - 90 - degreesPerSegment/2
  // This means segment i spans from [i*deg - 90 - deg/2] to [(i+1)*deg - 90 - deg/2]
  // The center is at i*deg - 90 (since -deg/2 + deg/2 = 0)

  // When the wheel rotates by `rotation`, the segment angles rotate by -rotation (opposite direction)
  // So segment i's center moves to: i*degreesPerSegment - 90 - rotation

  // We want to find which segment center is closest to the pointer at 270° (or -90°)
  // This means: i*degreesPerSegment - 90 - rotation ≈ -90 (mod 360)
  // Simplifying: i*degreesPerSegment ≈ rotation (mod 360)

  const targetSegmentCenterAfterRotation = (targetWinnerIndex * degreesPerSegment - rotation) % 360;

  // Calculate where each segment center ends up after rotation
  let actualWinnerIndex = -1;
  let minDistance = Infinity;

  for (let i = 0; i < numEntries; i++) {
    // Segment i's center in the unrotated coordinate system is at i*degreesPerSegment - 90
    // After rotating by `rotation`, it's at i*degreesPerSegment - 90 - rotation
    // We want this to be at -90° (the pointer position)

    const segmentCenterAfterRotation = (i * degreesPerSegment - rotation) % 360;

    // The pointer is at -90° (or 270°)
    const pointerAngle = -90;

    // Calculate angular distance (considering wrap-around)
    let distance = Math.abs(normalizeAngle(segmentCenterAfterRotation - pointerAngle));

    if (distance < minDistance) {
      minDistance = distance;
      actualWinnerIndex = i;
    }
  }

  const tolerance = degreesPerSegment / 2 + 0.1; // Half segment + small tolerance
  const isCorrect = actualWinnerIndex === targetWinnerIndex;

  return {
    isCorrect,
    actualWinnerIndex,
    expectedWinnerIndex: targetWinnerIndex,
    minDistance,
    tolerance
  };
}

// Run test scenarios
function runTests() {
  console.log('='.repeat(80));
  console.log('SEQUENTIAL SPIN ACCURACY TEST');
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

  // Update rotation and remove winner
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
  console.log(`  Total spins: ${spins}`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
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

  // Spin 3: 4 entries (90° segments), winner at index 0
  console.log('\n🎯 Spin 3: 4 entries (90° segments), target winner at index 0');
  targetWinnerIndex = 0;
  spins = 7.8;
  newRotation = calculateSpinRotation(rotation, targetWinnerIndex, activeEntries.length, spins);

  console.log(`  Active entries: ${activeEntries.length}`);
  console.log(`  Degrees per segment: ${360 / activeEntries.length}°`);
  console.log(`  Previous rotation: ${rotation.toFixed(2)}°`);
  console.log(`  New rotation: ${newRotation.toFixed(2)}°`);
  console.log(`  Total spins: ${spins}`);

  verification = verifyRotationLandsOnWinner(newRotation, targetWinnerIndex, activeEntries.length);
  console.log(`  ✓ Expected winner: Index ${verification.expectedWinnerIndex} (${activeEntries[verification.expectedWinnerIndex].name})`);
  console.log(`  ${verification.isCorrect ? '✓' : '✗'} Actual winner: Index ${verification.actualWinnerIndex} (${activeEntries[verification.actualWinnerIndex].name})`);
  console.log(`  Distance from pointer: ${verification.minDistance.toFixed(2)}°`);

  if (!verification.isCorrect) {
    console.log(`  ❌ FAIL: Rotation did not land on expected winner!`);
    allTestsPassed = false;
  } else {
    console.log(`  ✅ PASS: Rotation landed correctly`);
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

  // Spin 1: Large rotation
  console.log('\n🎯 Spin 1: Start from 0°, spin to ~1890°');
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

  // Spin 2: Even larger accumulated rotation
  console.log('\n🎯 Spin 2: Continue from ~1890°, spin to ~3780°');
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

  // SCENARIO 3: Test index shifts when entries are removed
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

  // Remove index 2
  const removedEntry = activeEntries[2];
  activeEntries = activeEntries.filter((_, idx) => idx !== 2);

  console.log(`📋 After removal: [${activeEntries.map(e => e.name).join(',')}]`);
  console.log('   Indices are now: [0,1,2,3,4] (what was "Three" is now at index 2)');

  // Now target the "new index 2" which is the old "Three"
  console.log('\n🎯 Spin: Target winner at new index 2 (entry "Three")');
  targetWinnerIndex = 2; // This should be "Three" now
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
  } else {
    console.log('❌ SOME TESTS FAILED - There are issues with rotation accuracy!');
    console.log('\nPOSSIBLE ROOT CAUSES:');
    console.log('1. Rotation calculation logic may not account for accumulated rotation correctly');
    console.log('2. The offset adjustment may be incorrect for the drawing coordinate system');
    console.log('3. There may be a mismatch between how segments are drawn vs how rotation is calculated');
    console.log('4. Index shifts after removal may not be handled properly');
  }

  console.log();

  return allTestsPassed;
}

// Run the tests
const passed = runTests();
process.exit(passed ? 0 : 1);
