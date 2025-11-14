/**
 * PROOF: Canvas ctx.rotate() direction and coordinate system behavior
 *
 * This demonstrates WHY the wheel rotation is backwards
 */

console.log('=== CANVAS ROTATION DIRECTION ANALYSIS ===\n');

console.log('FACT 1: Canvas ctx.rotate() rotates the COORDINATE SYSTEM');
console.log('  - Not the visual content directly');
console.log('  - It rotates the axes that you draw on\n');

console.log('FACT 2: ctx.rotate(positive_angle) rotates COUNTER-CLOCKWISE');
console.log('  - This is standard mathematical convention');
console.log('  - In math: positive angles go counter-clockwise from +X axis\n');

console.log('FACT 3: Coordinate system rotation is OPPOSITE to visual rotation');
console.log('  - When axes rotate CCW, content APPEARS to rotate CW');
console.log('  - Example: If you rotate paper CCW, writing on it appears to rotate CW\n');

console.log('=== THE BUG IN WHEEL.TSX ===\n');

console.log('Line 217: ctx.rotate((rotation * Math.PI) / 180);');
console.log('');
console.log('When rotation = -60° (to win segment 1):');
console.log('  1. We calculate: "need to rotate -60° to align David with pointer"');
console.log('  2. We call: ctx.rotate(-60° in radians)');
console.log('  3. Canvas rotates coordinate system CLOCKWISE by 60°');
console.log('  4. Segments drawn at positive angles now appear MORE COUNTER-CLOCKWISE');
console.log('  5. David (at +30° in segments) moves AWAY from pointer, not toward it!');
console.log('');

console.log('=== VISUAL EXAMPLE ===\n');

// Simulate the current (buggy) behavior
function simulateCurrentBehavior() {
    console.log('Current Implementation:');
    console.log('  Target: Win segment 1 (David at 30° in segment space)');
    console.log('  Calculation: rotation = -60°');
    console.log('  Canvas: ctx.rotate(-60° in radians) → rotate coord system CW 60°');
    console.log('  Result: David at 30° - 60° = -30° (WRONG! Should be -90°)');
    console.log('');

    const davidSegmentAngle = 30; // Where David's center is drawn
    const rotation = -60; // What we calculated
    // Current code applies rotation directly to coordinate system
    // This makes segments APPEAR at: segmentAngle - rotation
    const visualAngle = davidSegmentAngle - rotation; // = 30 - (-60) = 90°!

    console.log(`  Visual angle: ${davidSegmentAngle} - (${rotation}) = ${visualAngle}°`);
    console.log(`  Target was: -90°`);
    console.log(`  ERROR: ${visualAngle - (-90)}° off!\n`);
}

// Simulate the fixed behavior
function simulateFixedBehavior() {
    console.log('Fixed Implementation:');
    console.log('  Target: Win segment 1 (David at 30° in segment space)');
    console.log('  Calculation: rotation = -60°');
    console.log('  Canvas: ctx.rotate(-(-60°) in radians) → rotate coord system CCW 60°');
    console.log('  Result: David at 30° + 60° = 90°... wait that\'s also wrong!');
    console.log('');
    console.log('  Let me recalculate...');
    console.log('');

    const davidSegmentAngle = -30; // Actually David is at -30° (60° from segment 0 at -90°)
    const rotation = -60; // What we calculated
    // Fixed code inverts the rotation sign
    const appliedRotation = -rotation; // = 60°

    // When we rotate coord system CCW by 60°, segments appear to rotate CW by 60°
    // But that's not quite right either...
    console.log('  Hmm, let me think about this more carefully...\n');
}

simulateCurrentBehavior();

console.log('=== THE REAL ISSUE ===\n');

console.log('Let\'s trace through what ACTUALLY happens:');
console.log('');
console.log('Segment drawing (line 224): startAngle = index * anglePerSegment - π/2 - anglePerSegment/2');
console.log('For 6 segments:');
console.log('  Segment 0: starts at -120°, center at -90°');
console.log('  Segment 1: starts at -60°, center at -30°');
console.log('');
console.log('When rotation = -60° and we call ctx.rotate(rotation):');
console.log('  1. Canvas coordinate system rotates CW by 60°');
console.log('  2. Segment drawn at -30° (David) APPEARS at: -30° - 60° = -90° ??? Let me verify...');
console.log('');
console.log('Wait, I need to think about coordinate system rotation more carefully.');
console.log('');
console.log('When you rotate the coordinate system by angle R:');
console.log('  - A point drawn at angle θ in the rotated system');
console.log('  - Appears at angle (θ + R) in the original system');
console.log('');
console.log('So:');
console.log('  - David drawn at -30° in segment space');
console.log('  - With ctx.rotate(-60° in radians), coord system rotated by -60°');
console.log('  - David appears at: -30° + (-60°) = -90° ✓');
console.log('');
console.log('WAIT! That means the MATH IS CORRECT!');
console.log('');
console.log('Let me check the test output again...\n');

// Verify with test data
console.log('From test-rotation.js output:');
console.log('  Segment 1 (David) center: -30°');
console.log('  Rotation needed: -60°');
console.log('  Final position: -30° + (-60°) = -90° ✓');
console.log('');

console.log('=== CONFUSION RESOLVED ===\n');
console.log('The coordinate system math says:');
console.log('  appearanceAngle = drawnAngle + rotationAngle');
console.log('  -90 = -30 + (-60) ✓');
console.log('');
console.log('But if the test shows the math is correct, why do screenshots show wrong winners?');
console.log('');
console.log('HYPOTHESIS: Maybe the bug is NOT in the rotation direction, but in:');
console.log('  A) How we identify which segment won');
console.log('  B) The pointer position interpretation');
console.log('  C) Some other transformation in the rendering pipeline');
console.log('');
