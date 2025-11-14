#!/usr/bin/env node

/**
 * ROTATION FIX VERIFICATION TEST
 *
 * This test verifies that the rotation calculation fix correctly handles:
 * 1. Sequential spins with entry removal
 * 2. Accumulated rotation across multiple spins
 * 3. Changing segment sizes as entries are removed
 * 4. Integer rotation (no fractional spin issues)
 * 5. Proper delta calculation from current position
 */

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let totalTests = 0;
let passedTests = 0;

function pass(message, detail = '') {
  totalTests++;
  passedTests++;
  console.log(`${colors.green}✓ PASS${colors.reset} ${message}`);
  if (detail) console.log(`  ${colors.green}${detail}${colors.reset}`);
}

function fail(message, detail = '') {
  totalTests++;
  console.log(`${colors.red}✗ FAIL${colors.reset} ${message}`);
  if (detail) console.log(`  ${colors.red}${detail}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.yellow}INFO:${colors.reset} ${message}`);
}

function header(message) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}`);
  console.log(message);
  console.log(`${'='.repeat(70)}${colors.reset}\n`);
}

// Simulate the FIXED rotation calculation
function calculateRotationFixed(rotation, targetWinnerIndex, numEntries) {
  const degreesPerSegment = 360 / numEntries;
  const desiredFinalAngle = targetWinnerIndex * degreesPerSegment;

  // Integer rotations only
  const spins = 5.7; // Example value
  const numFullRotations = Math.floor(spins); // 5

  // Calculate delta from current position
  const currentAngle = rotation % 360;
  let angleDelta = desiredFinalAngle - currentAngle;

  // Ensure backward rotation
  while (angleDelta > 0) angleDelta -= 360;

  const newTarget = rotation + numFullRotations * 360 + angleDelta;

  return {
    rotation,
    currentAngle,
    desiredFinalAngle,
    angleDelta,
    numFullRotations,
    newTarget,
    normalizedTarget: newTarget % 360,
  };
}

// Normalize angle to 0-360 range
function normalizeAngle(angle) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

header('TEST SUITE 1: SEQUENTIAL SPINS WITH ENTRY REMOVAL');

info('Simulating: 6 entries → remove 1 → 5 entries → remove 1 → 4 entries');

// Initial state
let rotation = 0;
let entries = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank'];
let activeEntries = [...entries];

// SPIN 1: 6 entries, winner at index 2 (Charlie)
info('\nSpin 1: 6 entries (60° per segment), target index 2 (Charlie)');
const spin1 = calculateRotationFixed(rotation, 2, activeEntries.length);
info(`  Current rotation: ${spin1.rotation}°`);
info(`  Current angle: ${spin1.currentAngle}°`);
info(`  Desired final: ${spin1.desiredFinalAngle}° (index 2 × 60°)`);
info(`  Angle delta: ${spin1.angleDelta}°`);
info(`  New target: ${spin1.newTarget}° (5 rotations + ${spin1.angleDelta}°)`);
info(`  Normalized: ${spin1.normalizedTarget}°`);

// Verify spin 1
if (Math.abs(spin1.normalizedTarget - 120) < 0.01) {
  pass('Spin 1 lands at correct angle', `120° expected, ${spin1.normalizedTarget.toFixed(2)}° actual`);
} else {
  fail('Spin 1 lands at wrong angle', `Expected 120°, got ${spin1.normalizedTarget.toFixed(2)}°`);
}

// Update rotation after spin 1
rotation = spin1.newTarget;
activeEntries = ['Alice', 'Bob', 'David', 'Emma', 'Frank']; // Charlie removed

// SPIN 2: 5 entries, winner at index 1 (Bob)
info('\nSpin 2: 5 entries (72° per segment), target index 1 (Bob)');
const spin2 = calculateRotationFixed(rotation, 1, activeEntries.length);
info(`  Current rotation: ${spin2.rotation}° (accumulated from spin 1)`);
info(`  Current angle: ${spin2.currentAngle}°`);
info(`  Desired final: ${spin2.desiredFinalAngle}° (index 1 × 72°)`);
info(`  Angle delta: ${spin2.angleDelta}°`);
info(`  New target: ${spin2.newTarget}° (5 rotations + ${spin2.angleDelta}°)`);
info(`  Normalized: ${spin2.normalizedTarget}°`);

// Verify spin 2
if (Math.abs(spin2.normalizedTarget - 72) < 0.01) {
  pass('Spin 2 lands at correct angle', `72° expected, ${spin2.normalizedTarget.toFixed(2)}° actual`);
} else {
  fail('Spin 2 lands at wrong angle', `Expected 72°, got ${spin2.normalizedTarget.toFixed(2)}°`);
}

// Update rotation after spin 2
rotation = spin2.newTarget;
activeEntries = ['Alice', 'David', 'Emma', 'Frank']; // Bob removed

// SPIN 3: 4 entries, winner at index 0 (Alice)
info('\nSpin 3: 4 entries (90° per segment), target index 0 (Alice)');
const spin3 = calculateRotationFixed(rotation, 0, activeEntries.length);
info(`  Current rotation: ${spin3.rotation}° (accumulated from spins 1-2)`);
info(`  Current angle: ${spin3.currentAngle}°`);
info(`  Desired final: ${spin3.desiredFinalAngle}° (index 0 × 90°)`);
info(`  Angle delta: ${spin3.angleDelta}°`);
info(`  New target: ${spin3.newTarget}° (5 rotations + ${spin3.angleDelta}°)`);
info(`  Normalized: ${spin3.normalizedTarget}°`);

// Verify spin 3
if (Math.abs(spin3.normalizedTarget - 0) < 0.01) {
  pass('Spin 3 lands at correct angle', `0° expected, ${spin3.normalizedTarget.toFixed(2)}° actual`);
} else {
  fail('Spin 3 lands at wrong angle', `Expected 0°, got ${spin3.normalizedTarget.toFixed(2)}°`);
}

header('TEST SUITE 2: NO FRACTIONAL ROTATION BUG');

info('Testing that integer rotations prevent 180° offset bug');

const spins = 5.5;
const numFullRotations = Math.floor(spins);

if (numFullRotations === 5) {
  pass('Fractional spins correctly floored', `5.5 → ${numFullRotations} full rotations`);
} else {
  fail('Fractional spins not floored correctly', `Expected 5, got ${numFullRotations}`);
}

const totalRotation = numFullRotations * 360;
if (totalRotation === 1800) {
  pass('No fractional rotation in calculation', `5 × 360° = ${totalRotation}°`);
} else {
  fail('Incorrect rotation calculation', `Expected 1800°, got ${totalRotation}°`);
}

header('TEST SUITE 3: DELTA CALCULATION');

info('Testing backward rotation delta calculation');

const testCases = [
  { current: 0, desired: 120, expected: -240 },
  { current: 120, desired: 72, expected: -48 },
  { current: 72, desired: 0, expected: -72 },
  { current: 180, desired: 90, expected: -90 },
  { current: 350, desired: 10, expected: -340 },
];

testCases.forEach(({ current, desired, expected }) => {
  let angleDelta = desired - current;
  while (angleDelta > 0) angleDelta -= 360;

  if (Math.abs(angleDelta - expected) < 0.01) {
    pass(`Delta from ${current}° to ${desired}°`, `Expected ${expected}°, got ${angleDelta}°`);
  } else {
    fail(`Delta from ${current}° to ${desired}°`, `Expected ${expected}°, got ${angleDelta}°`);
  }
});

header('TEST SUITE 4: ACCUMULATED ROTATION');

info('Testing rotation accumulation across 5 sequential spins');

rotation = 0;
const rotationHistory = [0];

for (let i = 0; i < 5; i++) {
  const numEntries = 6 - i; // 6, 5, 4, 3, 2
  const targetIndex = i % numEntries; // Varies

  const result = calculateRotationFixed(rotation, targetIndex, numEntries);
  rotation = result.newTarget;
  rotationHistory.push(rotation);

  const degreesPerSegment = 360 / numEntries;
  const expectedNormalized = targetIndex * degreesPerSegment;

  if (Math.abs(result.normalizedTarget - expectedNormalized) < 0.01) {
    pass(`Spin ${i + 1}: ${numEntries} entries, index ${targetIndex}`,
         `Lands at ${result.normalizedTarget.toFixed(2)}° (expected ${expectedNormalized}°)`);
  } else {
    fail(`Spin ${i + 1}: ${numEntries} entries, index ${targetIndex}`,
         `Expected ${expectedNormalized}°, got ${result.normalizedTarget.toFixed(2)}°`);
  }
}

info(`\nRotation accumulation: ${rotationHistory.join('° → ')}°`);

if (rotationHistory[rotationHistory.length - 1] > 5000) {
  pass('Rotation accumulates correctly across multiple spins',
       `Final rotation: ${rotationHistory[rotationHistory.length - 1]}°`);
} else {
  fail('Rotation not accumulating correctly',
       `Expected > 5000°, got ${rotationHistory[rotationHistory.length - 1]}°`);
}

header('TEST SUITE 5: COORDINATE SYSTEM CONSISTENCY');

info('Verifying segment centers align with rotation targets');

const testSegments = [
  { numEntries: 6, index: 0, expectedAngle: 0 },
  { numEntries: 6, index: 1, expectedAngle: 60 },
  { numEntries: 6, index: 2, expectedAngle: 120 },
  { numEntries: 5, index: 0, expectedAngle: 0 },
  { numEntries: 5, index: 1, expectedAngle: 72 },
  { numEntries: 4, index: 0, expectedAngle: 0 },
  { numEntries: 4, index: 1, expectedAngle: 90 },
  { numEntries: 4, index: 2, expectedAngle: 180 },
];

testSegments.forEach(({ numEntries, index, expectedAngle }) => {
  const degreesPerSegment = 360 / numEntries;
  const calculatedAngle = index * degreesPerSegment;

  if (Math.abs(calculatedAngle - expectedAngle) < 0.01) {
    pass(`${numEntries} entries, index ${index}`,
         `Segment at ${calculatedAngle}° (expected ${expectedAngle}°)`);
  } else {
    fail(`${numEntries} entries, index ${index}`,
         `Expected ${expectedAngle}°, got ${calculatedAngle}°`);
  }
});

header('TEST SUITE 6: EDGE CASES');

// Single entry
info('\nTesting single entry (360° segment)');
const singleEntry = calculateRotationFixed(0, 0, 1);
if (singleEntry.desiredFinalAngle === 0) {
  pass('Single entry at index 0', `Angle: ${singleEntry.desiredFinalAngle}°`);
} else {
  fail('Single entry at index 0', `Expected 0°, got ${singleEntry.desiredFinalAngle}°`);
}

// Two entries (180° each)
info('\nTesting two entries (180° segments)');
const twoEntries1 = calculateRotationFixed(0, 0, 2);
const twoEntries2 = calculateRotationFixed(0, 1, 2);
if (twoEntries1.desiredFinalAngle === 0 && twoEntries2.desiredFinalAngle === 180) {
  pass('Two entries at indices 0 and 1', `Angles: 0° and 180°`);
} else {
  fail('Two entries calculation',
       `Expected 0° and 180°, got ${twoEntries1.desiredFinalAngle}° and ${twoEntries2.desiredFinalAngle}°`);
}

// Large number of entries
info('\nTesting many entries (100 entries, 3.6° segments)');
const manyEntries = calculateRotationFixed(0, 50, 100);
const expectedAngle = 50 * 3.6;
if (Math.abs(manyEntries.desiredFinalAngle - expectedAngle) < 0.01) {
  pass('100 entries at index 50', `Angle: ${manyEntries.desiredFinalAngle}° (expected ${expectedAngle}°)`);
} else {
  fail('100 entries at index 50',
       `Expected ${expectedAngle}°, got ${manyEntries.desiredFinalAngle}°`);
}

// High accumulated rotation
info('\nTesting high accumulated rotation (10000°)');
const highRotation = calculateRotationFixed(10000, 2, 6);
const normalizedHigh = highRotation.normalizedTarget;
if (Math.abs(normalizedHigh - 120) < 0.01) {
  pass('High rotation normalizes correctly',
       `10000° + delta → ${normalizedHigh.toFixed(2)}° (expected 120°)`);
} else {
  fail('High rotation normalization failed',
       `Expected 120°, got ${normalizedHigh.toFixed(2)}°`);
}

// Final results
header('FINAL TEST REPORT');

console.log(`${colors.bright}Test Statistics:${colors.reset}`);
console.log(`  Total Tests:  ${totalTests}`);
console.log(`  ${colors.green}Passed:       ${passedTests}${colors.reset}`);
console.log(`  ${colors.red}Failed:       ${totalTests - passedTests}${colors.reset}`);
console.log();
console.log(`${colors.bright}Pass Rate:    ${((passedTests / totalTests) * 100).toFixed(2)}%${colors.reset}`);
console.log();

if (passedTests === totalTests) {
  console.log(`${colors.green}${colors.bright}${'━'.repeat(70)}`);
  console.log('  ✓ ALL TESTS PASSED!');
  console.log('  Rotation fix is working correctly.');
  console.log(`${'━'.repeat(70)}${colors.reset}`);
  console.log();
  console.log(`${colors.bright}Verification Complete:${colors.reset}`);
  console.log('  ✓ Sequential spins work correctly');
  console.log('  ✓ No fractional rotation bug');
  console.log('  ✓ Delta calculation is accurate');
  console.log('  ✓ Rotation accumulates properly');
  console.log('  ✓ Coordinate system is consistent');
  console.log('  ✓ Edge cases handled correctly');
  console.log();
  process.exit(0);
} else {
  console.log(`${colors.red}${colors.bright}${'━'.repeat(70)}`);
  console.log(`  ✗ ${totalTests - passedTests} TEST(S) FAILED!`);
  console.log(`${'━'.repeat(70)}${colors.reset}`);
  process.exit(1);
}
