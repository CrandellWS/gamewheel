# Full Tilt Mode - Test Suite

## Manual Testing Checklist

### Basic Functionality Tests

#### 1. Mode Selection
- [ ] Open Settings
- [ ] Select "Full Tilt (Ladder Climb)" mode
- [ ] Verify ladder height dropdown appears
- [ ] Test all ladder heights (3, 5, 7, 10 rungs)
- [ ] Verify settings persist after page reload

#### 2. Ladder Display
- [ ] Verify LadderDisplay component appears only in Full Tilt mode
- [ ] Verify ladder shows correct number of rungs based on setting
- [ ] Verify top rung has gold/yellow highlight and trophy icon
- [ ] Verify all empty rungs show "Empty" placeholder
- [ ] Verify "Waiting to Climb" section shows all players initially

#### 3. Ladder Climbing Mechanics
- [ ] Add at least 5 players to the wheel
- [ ] Spin the wheel
- [ ] Verify selected player moves from "Waiting to Climb" to rung 1
- [ ] Spin again
- [ ] Verify selected player climbs one rung (or new player starts at rung 1)
- [ ] Continue spinning until a player reaches the top
- [ ] Verify player position updates are animated smoothly

#### 4. Winning Condition
- [ ] Continue spins until a player reaches the configured ladder height
- [ ] Verify confetti animation plays
- [ ] Verify "CHAMPION!" message appears in ladder display
- [ ] Verify winner celebration shows in main UI
- [ ] Verify fullTiltWinner state is set correctly

#### 5. History Tracking
- [ ] Perform multiple spins in Full Tilt mode
- [ ] Open History Panel
- [ ] Verify each spin shows ladder climb data (📈 X → Y)
- [ ] Verify final winner shows "Champion" badge and trophy icon
- [ ] Export history to CSV
- [ ] Verify CSV contains ladder climb columns
- [ ] Verify "Full Tilt Winner" column shows "Yes" for champion

#### 6. Reset Functionality
- [ ] With players on various ladder rungs, click "Reset Wheel"
- [ ] Verify all players return to "Waiting to Climb" section
- [ ] Verify ladder positions reset to 0
- [ ] Verify fullTiltWinner state clears

### Edge Cases

#### 7. Single Player
- [ ] Test Full Tilt mode with only 1 player
- [ ] Verify player climbs ladder normally
- [ ] Verify player can win after reaching top

#### 8. Mode Switching
- [ ] Start in Full Tilt mode with players on ladder
- [ ] Switch to First Win mode
- [ ] Verify ladder display disappears
- [ ] Switch back to Full Tilt
- [ ] Verify ladder positions are preserved (or reset - check expected behavior)

#### 9. Import/Export
- [ ] Set up Full Tilt mode with specific ladder height
- [ ] Export wheel configuration
- [ ] Import configuration
- [ ] Verify ladder height setting is restored
- [ ] Verify ladder positions are restored (if in export)

#### 10. Dark Mode
- [ ] Toggle dark mode
- [ ] Verify ladder display renders correctly in dark mode
- [ ] Verify all colors, borders, and gradients are visible
- [ ] Verify trophy and progress indicators are visible

### Performance Tests

#### 11. Large Player Count
- [ ] Add 20+ players
- [ ] Perform rapid spins (multiple times quickly)
- [ ] Verify no lag in ladder position updates
- [ ] Verify animations remain smooth
- [ ] Verify no console errors

#### 12. Long Game Duration
- [ ] Set ladder height to 10 rungs
- [ ] Add 10 players
- [ ] Perform 50+ spins
- [ ] Verify history tracks all climbs correctly
- [ ] Verify no memory leaks or performance degradation

### Mobile/Responsive Tests

#### 13. Mobile Display
- [ ] Open on mobile device or resize browser to mobile width
- [ ] Verify ladder display is responsive
- [ ] Verify rungs stack properly
- [ ] Verify player badges don't overflow
- [ ] Verify trophy icons are visible

#### 14. Touch Interactions
- [ ] Test on touchscreen device
- [ ] Verify spin button works
- [ ] Verify settings modal opens
- [ ] Verify ladder scrolls if needed

### Integration Tests

#### 15. Chat Integration
- [ ] Enable chat integration
- [ ] Simulate chat submission webhook
- [ ] Verify new player appears in "Waiting to Climb"
- [ ] Spin and verify chat-added player can climb

#### 16. Multi-Winner Mode
- [ ] Set numberOfWinners to 3, 4, or 8
- [ ] Verify only primary winner climbs ladder (not all selected)
- [ ] Verify ladder logic uses primaryWinner.id correctly

### Accessibility Tests

#### 17. Keyboard Navigation
- [ ] Navigate to ladder display with keyboard
- [ ] Verify screen reader can read ladder state
- [ ] Verify all interactive elements are keyboard accessible

#### 18. Color Contrast
- [ ] Verify all text on ladder rungs meets WCAG AA standards
- [ ] Verify trophy and indicators have sufficient contrast

### Bug Reproduction Tests

#### 19. State Persistence
- [ ] Set up Full Tilt mode with players on ladder
- [ ] Reload page (hard refresh)
- [ ] Verify ladder positions persist
- [ ] Verify ladder height setting persists

#### 20. Concurrent Spins Prevention
- [ ] Start a spin
- [ ] Immediately click spin again during animation
- [ ] Verify second spin is blocked
- [ ] Verify no duplicate climbs occur

## Automated Test Suite (For Future Implementation)

### Unit Tests
```typescript
// Test ladder position updates
test('should increment player ladder position on spin', () => {
  // Setup store with Full Tilt mode
  // Spin wheel
  // Assert player position increased by 1
});

// Test winner detection
test('should set fullTiltWinner when player reaches ladder height', () => {
  // Setup store with player at ladderHeight - 1
  // Spin wheel to trigger win
  // Assert fullTiltWinner is set
});

// Test ladder reset
test('should reset all ladder positions on resetWheel', () => {
  // Setup store with players on various rungs
  // Call resetWheel
  // Assert all positions are 0
  // Assert fullTiltWinner is null
});
```

### Integration Tests
```typescript
// Test component integration
test('LadderDisplay renders correctly in Full Tilt mode', () => {
  // Render page with Full Tilt mode
  // Assert LadderDisplay is visible
  // Assert correct number of rungs
  // Assert top rung has trophy
});

// Test history tracking
test('History panel shows ladder climb data', () => {
  // Perform spin in Full Tilt mode
  // Assert history entry has ladderClimb data
  // Assert CSV export contains ladder columns
});
```

### End-to-End Tests
```typescript
// Complete game flow
test('full game from start to champion', () => {
  // Add players
  // Switch to Full Tilt mode
  // Perform spins until winner
  // Assert champion celebration
  // Assert history is correct
  // Reset and verify clean state
});
```

## Expected Results Summary

### Success Criteria
- ✅ All ladder climbs tracked correctly
- ✅ Winner detected when reaching configured height
- ✅ Smooth animations throughout
- ✅ No TypeScript errors
- ✅ Production build succeeds
- ✅ Bundle size increase < 10 kB
- ✅ 60fps performance maintained
- ✅ Works on mobile and desktop
- ✅ Dark mode fully supported
- ✅ Accessibility standards met
- ✅ CSV export includes ladder data
- ✅ Settings persist across sessions
- ✅ History tracks all game modes correctly

### Known Limitations
- Ladder positions reset when switching game modes (expected behavior)
- Multi-winner mode only climbs primary winner (design decision)

## Test Results

### Test Date: [To be filled during testing]
### Tester: [To be filled]
### Browser/Device: [To be filled]

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Mode Selection | ⬜ | |
| 2 | Ladder Display | ⬜ | |
| 3 | Ladder Climbing | ⬜ | |
| 4 | Winning Condition | ⬜ | |
| 5 | History Tracking | ⬜ | |
| 6 | Reset Functionality | ⬜ | |
| 7 | Single Player | ⬜ | |
| 8 | Mode Switching | ⬜ | |
| 9 | Import/Export | ⬜ | |
| 10 | Dark Mode | ⬜ | |
| 11 | Large Player Count | ⬜ | |
| 12 | Long Game Duration | ⬜ | |
| 13 | Mobile Display | ⬜ | |
| 14 | Touch Interactions | ⬜ | |
| 15 | Chat Integration | ⬜ | |
| 16 | Multi-Winner Mode | ⬜ | |
| 17 | Keyboard Navigation | ⬜ | |
| 18 | Color Contrast | ⬜ | |
| 19 | State Persistence | ⬜ | |
| 20 | Concurrent Spins | ⬜ | |

## Bug Tracking

### Issues Found
1. [Issue #] - [Description] - [Severity] - [Status]

### Resolved Issues
1. [Issue #] - [Description] - [Resolution]

## Performance Metrics

- Initial Load Time: [ms]
- Time to Interactive: [ms]
- Bundle Size Increase: [kB]
- FPS During Animations: [fps]
- Memory Usage: [MB]
