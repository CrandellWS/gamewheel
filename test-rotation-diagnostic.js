/**
 * DIAGNOSTIC TEST: Deep dive into rotation calculation
 *
 * This test examines the exact coordinate system and rotation logic
 * to identify the root cause of the inaccuracy.
 */

function normalizeAngle(angle) {
  while (angle > 180) angle -= 360;
  while (angle <= -180) angle += 360;
  return angle;
}

// Current implementation from Wheel.tsx (lines 136-151)
function currentImplementation(rotation, targetWinnerIndex, numEntries, spins) {
  const degreesPerSegment = 360 / numEntries;
  const winnerCenterAngle = (targetWinnerIndex + 0.5) * degreesPerSegment;
  const offsetAdjustment = degreesPerSegment / 2;
  const targetAngle = -winnerCenterAngle + offsetAdjustment;
  const newTarget = rotation + spins * 360 + targetAngle;

  return {
    newTarget,
    degreesPerSegment,
    winnerCenterAngle,
    offsetAdjustment,
    targetAngle
  };
}

// Verify where each segment actually ends up after rotation
function analyzeRotation(rotation, numEntries) {
  const degreesPerSegment = 360 / numEntries;

  console.log(`\n📊 Analysis for rotation=${rotation.toFixed(2)}° with ${numEntries} segments:`);
  console.log(`   Degrees per segment: ${degreesPerSegment}°`);
  console.log(`   Normalized rotation: ${(rotation % 360).toFixed(2)}°`);
  console.log();

  // The drawing logic (Wheel.tsx line 225):
  // startAngle = index * anglePerSegment - Math.PI / 2 - anglePerSegment / 2
  // In degrees: startAngle = index * degreesPerSegment - 90 - degreesPerSegment / 2

  console.log('   Segment positions in CANVAS coordinate system (before rotation):');
  for (let i = 0; i < numEntries; i++) {
    const startAngleDeg = i * degreesPerSegment - 90 - degreesPerSegment / 2;
    const centerAngleDeg = i * degreesPerSegment - 90;
    const endAngleDeg = (i + 1) * degreesPerSegment - 90 - degreesPerSegment / 2;

    console.log(`   Segment ${i}: center at ${centerAngleDeg.toFixed(1)}° (range: ${startAngleDeg.toFixed(1)}° to ${endAngleDeg.toFixed(1)}°)`);
  }

  // After rotation, canvas rotates by -rotation (line 218: ctx.rotate((-rotation * Math.PI) / 180))
  // So segment centers move to: (i * degreesPerSegment - 90) - rotation

  console.log();
  console.log('   Segment positions AFTER rotation by ' + rotation.toFixed(2) + '°:');

  let closestToPointer = { index: -1, distance: Infinity, centerPos: 0 };

  for (let i = 0; i < numEntries; i++) {
    const centerBeforeRotation = i * degreesPerSegment - 90;
    const centerAfterRotation = centerBeforeRotation - rotation;
    const normalizedCenter = ((centerAfterRotation % 360) + 360) % 360;

    // Pointer is at top: 270° (or -90°)
    const pointerAngle = 270;
    let distance = Math.abs(normalizedCenter - pointerAngle);
    if (distance > 180) distance = 360 - distance;

    console.log(`   Segment ${i}: center at ${normalizedCenter.toFixed(1)}° (distance from pointer: ${distance.toFixed(1)}°)`);

    if (distance < closestToPointer.distance) {
      closestToPointer = { index: i, distance, centerPos: normalizedCenter };
    }
  }

  console.log();
  console.log(`   🎯 Closest segment to pointer (270°): Segment ${closestToPointer.index} at ${closestToPointer.centerPos.toFixed(1)}° (distance: ${closestToPointer.distance.toFixed(1)}°)`);

  return closestToPointer.index;
}

// Test the coordinate system
console.log('='.repeat(80));
console.log('DIAGNOSTIC: Understanding the Coordinate System');
console.log('='.repeat(80));

console.log('\n🔍 Key facts about the drawing:');
console.log('   1. Canvas rotation: ctx.rotate((-rotation * PI) / 180)');
console.log('   2. Segment start angle: index * anglePerSegment - PI/2 - anglePerSegment/2');
console.log('   3. Pointer position: top of wheel (270° in standard coords, or -90°)');
console.log('   4. Rotation direction: Counter-clockwise for positive rotation values');

// Test case 1: Simple case with 6 segments
console.log('\n' + '='.repeat(80));
console.log('TEST CASE 1: 6 segments, target index 2');
console.log('='.repeat(80));

const numEntries1 = 6;
const targetIndex1 = 2;
const startRotation1 = 0;
const spins1 = 5;

const result1 = currentImplementation(startRotation1, targetIndex1, numEntries1, spins1);

console.log('\n📐 Current implementation calculation:');
console.log(`   Degrees per segment: ${result1.degreesPerSegment}°`);
console.log(`   Winner center angle: (${targetIndex1} + 0.5) * ${result1.degreesPerSegment} = ${result1.winnerCenterAngle}°`);
console.log(`   Offset adjustment: ${result1.offsetAdjustment}°`);
console.log(`   Target angle: -${result1.winnerCenterAngle} + ${result1.offsetAdjustment} = ${result1.targetAngle}°`);
console.log(`   New rotation: ${startRotation1} + ${spins1}*360 + ${result1.targetAngle} = ${result1.newTarget}°`);

const actualWinner1 = analyzeRotation(result1.newTarget, numEntries1);

console.log('\n' + (actualWinner1 === targetIndex1 ? '✅' : '❌') + ` Result: Expected index ${targetIndex1}, got index ${actualWinner1}`);

// Let's manually calculate what the rotation SHOULD be
console.log('\n🧮 Manual calculation of correct rotation:');
console.log('   Goal: Align segment 2 center with pointer at 270°');
console.log('   Segment 2 center (before rotation): 2 * 60 - 90 = 30°');
console.log('   We want: 30° - rotation = 270° (mod 360)');
console.log('   Solving: rotation = 30° - 270° = -240°');
console.log('   With 5 full spins: rotation = 5*360 + (-240°) = 1560°');

console.log('\n✅ Testing manually calculated rotation (1560°):');
const manualWinner1 = analyzeRotation(1560, numEntries1);
console.log('   Result: ' + (manualWinner1 === targetIndex1 ? '✅ CORRECT' : '❌ WRONG'));

// Test case 2: After first spin with accumulated rotation
console.log('\n' + '='.repeat(80));
console.log('TEST CASE 2: After previous spin (5 segments, target index 1)');
console.log('='.repeat(80));

const numEntries2 = 5;
const targetIndex2 = 1;
const startRotation2 = 1560; // Use the corrected rotation from test 1
const spins2 = 5;

const result2 = currentImplementation(startRotation2, targetIndex2, numEntries2, spins2);

console.log('\n📐 Current implementation calculation:');
console.log(`   Previous rotation: ${startRotation2}°`);
console.log(`   Degrees per segment: ${result2.degreesPerSegment}°`);
console.log(`   Winner center angle: ${result2.winnerCenterAngle}°`);
console.log(`   Target angle: ${result2.targetAngle}°`);
console.log(`   New rotation: ${result2.newTarget}°`);

const actualWinner2 = analyzeRotation(result2.newTarget, numEntries2);
console.log('\n' + (actualWinner2 === targetIndex2 ? '✅' : '❌') + ` Result: Expected index ${targetIndex2}, got index ${actualWinner2}`);

console.log('\n🧮 Manual calculation:');
console.log('   Segment 1 center (before rotation): 1 * 72 - 90 = -18°');
console.log('   We want: -18° - rotation = 270° (mod 360)');
console.log('   Solving: rotation = -18° - 270° = -288° ≡ 72° (mod 360)');
console.log('   With accumulated 1560° + 5 spins: 1560 + 5*360 + 72° = 3432°');

console.log('\n✅ Testing manually calculated rotation (3432°):');
const manualWinner2 = analyzeRotation(3432, numEntries2);
console.log('   Result: ' + (manualWinner2 === targetIndex2 ? '✅ CORRECT' : '❌ WRONG'));

// Final diagnosis
console.log('\n' + '='.repeat(80));
console.log('DIAGNOSIS');
console.log('='.repeat(80));

console.log('\n🔍 The problem is in the calculation logic:');
console.log();
console.log('❌ CURRENT FORMULA:');
console.log('   targetAngle = -winnerCenterAngle + offsetAdjustment');
console.log('   where winnerCenterAngle = (index + 0.5) * degreesPerSegment');
console.log('   and offsetAdjustment = degreesPerSegment / 2');
console.log();
console.log('   This simplifies to:');
console.log('   targetAngle = -(index + 0.5) * deg + deg/2');
console.log('   targetAngle = -index * deg - deg/2 + deg/2');
console.log('   targetAngle = -index * deg');
console.log();
console.log('✅ CORRECT FORMULA should be:');
console.log('   Segment i center is at: i * degreesPerSegment - 90°');
console.log('   We want: (i * deg - 90) - rotation ≡ 270° (mod 360)');
console.log('   Solving: rotation ≡ i * deg - 90 - 270');
console.log('   rotation ≡ i * deg - 360');
console.log('   rotation ≡ i * deg (mod 360)  [since -360 ≡ 0 mod 360]');
console.log();
console.log('🎯 ROOT CAUSE:');
console.log('   The current formula calculates: targetAngle = -index * degreesPerSegment');
console.log('   But it should be: targetAngle = -index * degreesPerSegment + 360');
console.log('   OR equivalently: targetAngle = -(index * degreesPerSegment - 90) - 270');
console.log();
console.log('   The issue is that the offset adjustment cancels out the +0.5,');
console.log('   but it doesn\'t account for the -90° initial offset in drawing');
console.log('   and the 270° pointer position (which is -90° in rotated coords).');
console.log();
console.log('💡 SOLUTION:');
console.log('   Change line 147 in Wheel.tsx from:');
console.log('   const targetAngle = -winnerCenterAngle + offsetAdjustment;');
console.log();
console.log('   To:');
console.log('   const targetAngle = -(targetWinnerIndex * degreesPerSegment - 90) - 270;');
console.log();
console.log('   Or simplified:');
console.log('   const targetAngle = -targetWinnerIndex * degreesPerSegment + 180;');
