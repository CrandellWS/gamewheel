/**
 * DEEP GEOMETRY ANALYSIS
 *
 * Let's trace through exactly what's happening step by step
 */

console.log('DEEP GEOMETRY ANALYSIS');
console.log('='.repeat(80));

console.log('\n📚 Understanding the coordinate system:');
console.log('   1. Canvas drawing uses standard canvas coords: 0° = right (3 o\'clock)');
console.log('   2. Angles increase clockwise in canvas (opposite of math convention)');
console.log('   3. Pointer is at TOP of wheel');
console.log('   4. In canvas coords, TOP = -90° or 270° (depends on convention)');
console.log('   5. Canvas rotation: ctx.rotate(angle) rotates COUNTER-clockwise');
console.log('   6. Code uses: ctx.rotate((-rotation * PI) / 180) - NEGATIVE rotation!');
console.log('   7. So positive rotation value → clockwise visual rotation');

console.log('\n📐 Segment drawing (from Wheel.tsx line 225):');
console.log('   startAngle = index * anglePerSegment - PI/2 - anglePerSegment/2');
console.log('   In degrees: startAngle = index * deg - 90 - deg/2');
console.log('   Center angle: startAngle + deg/2 = index * deg - 90');

console.log('\n🎯 Example with 6 segments (60° each):');
for (let i = 0; i < 6; i++) {
  const deg = 60;
  const centerAngle = i * deg - 90;
  console.log(`   Segment ${i}: center at ${centerAngle}° (visual position: ${['right-bottom', 'right-top', 'top', 'left-top', 'left-bottom', 'bottom'][i]})`);
}

console.log('\n🔄 After rotation:');
console.log('   ctx.rotate applies to the ENTIRE wheel');
console.log('   With ctx.rotate(-rotation), segment centers move to: (i*deg - 90) - rotation');
console.log('   Or equivalently, they rotate by -rotation');

console.log('\n🎯 Pointer position analysis:');
console.log('   The pointer is drawn at the TOP of the canvas');
console.log('   In canvas coordinates before any rotation: (centerX, 10) = top of circle');
console.log('   This corresponds to angle -90° in the coordinate system');
console.log('   Or 270° if using 0-360 range');

console.log('\n📊 Let\'s manually trace segment 2 in 6-segment wheel:');
const targetIndex = 2;
const numSegments = 6;
const deg = 360 / numSegments;

console.log(`   Segment ${targetIndex} center (before rotation): ${targetIndex * deg - 90}° = 30°`);
console.log(`   Pointer position: -90° (or 270° in 0-360 range)`);
console.log(`   After rotation by R, segment center is at: 30° - R`);
console.log(`   We want: 30° - R ≡ -90° (mod 360)`);
console.log(`   Solving: R ≡ 30° - (-90°) = 120° (mod 360)`);
console.log(`   With 5 full spins: R = 1800° + 120° = 1920°`);

// Wait, let me reconsider. The pointer is at -90° but after we rotate, what happens?
console.log('\n🤔 Wait, let me reconsider the coordinate system...');
console.log('   The pointer is FIXED at the top of the canvas (doesn\'t rotate)');
console.log('   The wheel rotates beneath it');
console.log('   So we\'re asking: after rotation R, which segment is at the top?');

console.log('\n💡 Correct analysis:');
console.log('   Initial: Segment i center is at angle (i*deg - 90)');
console.log('   After ctx.rotate(-R * PI/180): angle becomes (i*deg - 90) - R');
console.log('   In the ROTATED coordinate system, top is still at -90°');
console.log('   So we want: (i*deg - 90) - R = -90°');
console.log('   Solving: R = i*deg - 90 - (-90) = i*deg');

console.log('\n✨ EUREKA! The formula should be:');
console.log('   targetAngle = -(targetWinnerIndex * degreesPerSegment)');
console.log('   Wait, that\'s what we tested and it partially failed...');

console.log('\n🔍 Let me check the canvas arc drawing direction:');
console.log('   ctx.arc(x, y, radius, startAngle, endAngle)');
console.log('   Draws arc CLOCKWISE from startAngle to endAngle');
console.log('   So if startAngle = 0, endAngle = PI/2, it goes from right to bottom');

function testWithExactGeometry(index, numEntries, startRotation, spins) {
  const deg = 360 / numEntries;

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Test: ${numEntries} segments, target index ${index}, from rotation ${startRotation}°`);
  console.log('='.repeat(80));

  console.log(`\n📐 Segment ${index} center (before any rotation): ${index * deg - 90}°`);

  // What rotation makes segment i land at -90° (the pointer)?
  // Segment center after rotation: (i*deg - 90) - R
  // We want this to equal -90°:
  // (i*deg - 90) - R = -90
  // -R = -90 - (i*deg - 90)
  // -R = -i*deg
  // R = i*deg

  const targetAngleSimple = -(index * deg);
  const rotationSimple = startRotation + spins * 360 + targetAngleSimple;

  console.log(`\n🧮 Formula: R = i * deg`);
  console.log(`   Target angle: ${targetAngleSimple}°`);
  console.log(`   New rotation: ${startRotation}° + ${spins}*360° + ${targetAngleSimple}° = ${rotationSimple}°`);

  const segmentCenterAfter = (index * deg - 90) - rotationSimple;
  const normalizedAfter = ((segmentCenterAfter % 360) + 360) % 360;

  console.log(`\n📊 Verification:`);
  console.log(`   Segment ${index} center after rotation: (${index * deg - 90})° - ${rotationSimple}° = ${segmentCenterAfter}°`);
  console.log(`   Normalized to 0-360: ${normalizedAfter}°`);
  console.log(`   Pointer is at 270° (top)`);
  console.log(`   Distance: ${Math.abs(normalizedAfter - 270)}°`);

  // Hmm, that doesn't work either. Let me reconsider the canvas drawing system
  console.log(`\n🤔 Reconsidering... In canvas arc():`)
  console.log(`   startAngle = index * anglePerSegment - PI/2 - anglePerSegment/2`);
  console.log(`   This uses PI/2 which is 90°`);
  console.log(`   So: startAngle = index * deg - 90° - deg/2`);
  console.log(`   Arc draws from startAngle to endAngle`);
  console.log(`   The "center" of the arc is at startAngle + deg/2 = index * deg - 90°`);

  console.log(`\n   BUT WAIT - arc() angles are in the canvas coordinate system!`);
  console.log(`   In canvas: 0 = right, PI/2 = bottom, PI = left, 3*PI/2 = top`);
  console.log(`   So -PI/2 (which is -90°) = top!`);
  console.log(`   The pointer is at position (centerX, 10) which is TOP`);
  console.log(`   In arc angle terms, top = -PI/2 = -90°`);

  console.log(`\n✨ So the pointer is at -90° in arc coordinates`);
  console.log(`   Segment ${index} center: ${index * deg - 90}°`);
  console.log(`   After rotation R: center is at (${index * deg - 90})° - R in arc coords`);
  console.log(`   We want: ${index * deg - 90} - R = -90`);
  console.log(`   So: R = ${index * deg - 90} - (-90) = ${index * deg}`);

  return { rotation: rotationSimple, normalized: normalizedAfter };
}

// Test this theory
const results = [];
results.push(testWithExactGeometry(2, 6, 0, 5));
results.push(testWithExactGeometry(1, 5, 1800, 5)); // Using 1800 instead of 1920 to test

console.log(`\n\n${'='.repeat(80)}`);
console.log('WAIT - I think I found the issue!');
console.log('='.repeat(80));

console.log('\nThe problem might be that segment 0 is drawn starting at -90° - deg/2');
console.log('This means segment 0 is centered around the TOP by default!');
console.log('');
console.log('Let me verify by checking which segment should be at top with 0 rotation:');

for (let numSegs of [4, 6, 8]) {
  const deg = 360 / numSegs;
  console.log(`\n${numSegs} segments (${deg}° each):`);

  for (let i = 0; i < numSegs; i++) {
    const center = i * deg - 90;
    const dist = Math.abs(center - (-90));
    console.log(`   Segment ${i}: center at ${center}°, distance from -90°: ${dist}°`);
  }

  // The segment with center closest to -90° should be selected at 0 rotation
  // For 6 segments: seg 0 at -90°, seg 1 at -30°, seg 2 at 30°
  // Segment 0 is at -90° - EXACTLY at the pointer!
}

console.log('\n\n💡 INSIGHT:');
console.log('At rotation = 0°, segment 0 is at the pointer (center = -90°)');
console.log('At rotation = 60° (for 6 segs), segment 1 should be at pointer');
console.log('Because seg 1 center moves from -30° to -30° - 60° = -90°');
console.log('');
console.log('So the formula R = index * deg IS CORRECT!');
console.log('But our test might be wrong... let me check the test logic');
