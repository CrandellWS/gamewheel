# Testing Checklist - Wheel of Names

Use this checklist to systematically test all features before pushing to GitHub.

## Environment Setup
- [ ] Node.js 18+ installed and verified (`node --version`)
- [ ] Dependencies installed (`npm install` completed without errors)
- [ ] Dev server starts successfully (`npm run dev`)
- [ ] Application loads at http://localhost:3000

---

## Core Wheel Functionality

### Spinning Mechanism
- [ ] Click "SPIN" button - wheel spins smoothly
- [ ] Press `Space` key - wheel spins
- [ ] Press `Enter` key - wheel spins
- [ ] Wheel decelerates naturally (physics simulation)
- [ ] Winner is highlighted after spin completes
- [ ] Winner announcement appears with animation
- [ ] Multiple consecutive spins work correctly
- [ ] Cannot spin while already spinning

### Visual Rendering
- [ ] Wheel renders correctly with all segments
- [ ] Colors display properly for each entry
- [ ] Text is readable on all segments
- [ ] Wheel is sharp/crisp on high-DPI displays
- [ ] Pointer/indicator is visible
- [ ] Animations are smooth (60fps)

---

## Entry Management

### Adding Entries
- [ ] "Add Entry" button creates new entry
- [ ] New entry appears in entry list
- [ ] New entry appears on wheel
- [ ] Can add entry with custom name
- [ ] Default color is assigned
- [ ] Default weight is 1

### Bulk Adding
- [ ] Click "Bulk Add" button
- [ ] Paste comma-separated names: `Alice, Bob, Charlie, David`
- [ ] All names are added successfully
- [ ] Try newline-separated names:
  ```
  Eve
  Frank
  Grace
  ```
- [ ] All names are added successfully
- [ ] Empty lines are ignored
- [ ] Whitespace is trimmed correctly

### Editing Entries
- [ ] Click pencil icon - entry becomes editable
- [ ] Edit name and press `Enter` - saves successfully
- [ ] Edit name and press `Esc` - cancels edit
- [ ] Click outside input - saves edit
- [ ] Name updates on wheel immediately
- [ ] Cannot create empty name

### Deleting Entries
- [ ] Click trash icon - entry is removed
- [ ] Entry disappears from list
- [ ] Entry disappears from wheel
- [ ] Wheel recalculates segment sizes
- [ ] Can delete all but one entry (minimum 1 required)

### Color Customization
- [ ] Click color swatch - color picker opens
- [ ] Select new color - entry updates immediately
- [ ] Color appears on wheel segment
- [ ] Multiple entries can have same color
- [ ] All 8 default colors work

### Weight Adjustment
- [ ] Weight slider moves smoothly (1-10)
- [ ] Set weight to 1 - entry appears normal
- [ ] Set weight to 10 - entry is more likely to win
- [ ] Test probability: Set one entry to 10, others to 1
- [ ] Spin 10 times - weighted entry should win more often
- [ ] Weight affects segment size visually (verify in code)

---

## History Panel

### Recording History
- [ ] Spin wheel - result appears in history
- [ ] Latest result is at the top
- [ ] Result shows winner name
- [ ] Result shows timestamp ("Just now")
- [ ] Badge shows "Latest" for most recent
- [ ] Numbered badges (1, 2, 3...) display correctly

### Time Display
- [ ] Fresh spin shows "Just now"
- [ ] Wait 2 minutes - shows "2m ago"
- [ ] Older entries show relative time
- [ ] Very old entries show date

### Export History
- [ ] Click download icon
- [ ] CSV file downloads
- [ ] Open CSV - verify format:
  ```
  Winner,Timestamp,Date
  Alice,1234567890,2024-01-01T12:00:00.000Z
  ```
- [ ] All history entries are included

### Clear History
- [ ] Click trash icon
- [ ] History clears completely
- [ ] Empty state message appears: "No spins yet"
- [ ] Icon displays: 📜

### History Count
- [ ] Counter shows correct number: "History (5)"
- [ ] Updates after each spin
- [ ] Updates after clear

---

## Settings Modal

### Opening/Closing
- [ ] Click settings gear icon - modal opens
- [ ] Press `S` key - modal opens
- [ ] Press `Esc` - modal closes
- [ ] Click backdrop - modal closes
- [ ] Click X button - modal closes

### Remove Winners Setting
- [ ] Toggle ON - checkbox checked
- [ ] Spin wheel - winner is removed from wheel
- [ ] Winner appears in "Removed Entries" section
- [ ] Click reset icon - entry returns to wheel
- [ ] Toggle OFF - winners stay on wheel after spin

### Sound Effects
- [ ] Toggle ON - checkbox checked
- [ ] Spin wheel - sound plays (if audio available)
- [ ] Toggle OFF - no sound
- [ ] Test with system audio muted

### Confetti Animation
- [ ] Toggle ON - checkbox checked
- [ ] Spin wheel - confetti appears on winner
- [ ] Toggle OFF - no confetti
- [ ] Confetti doesn't break other animations

### Spin Duration
- [ ] Slider moves smoothly (2s to 6s)
- [ ] Set to 2s - wheel spins fast (~2 seconds)
- [ ] Set to 6s - wheel spins slow (~6 seconds)
- [ ] Set to 4s - medium duration
- [ ] Duration label updates: "4.0s"
- [ ] Min label shows "Fast (2s)"
- [ ] Max label shows "Slow (6s)"

### Export Wheel Configuration
- [ ] Click "Export Wheel Configuration"
- [ ] JSON file downloads: `wheel-config-[timestamp].json`
- [ ] Open file - verify JSON structure:
  ```json
  {
    "entries": [...],
    "settings": {...},
    "version": "1.0"
  }
  ```
- [ ] All entries included with names, colors, weights

### Import Wheel Configuration
- [ ] Click "Import Wheel Configuration"
- [ ] Select valid JSON file
- [ ] Success message appears: "✓ Import successful!"
- [ ] All entries load correctly
- [ ] Settings are applied
- [ ] Modal closes after 1.5s
- [ ] Try invalid file - error message appears
- [ ] Try non-JSON file - error message appears

---

## Dark Mode

### Toggle Dark Mode
- [ ] Click moon icon - dark mode activates
- [ ] Icon changes to sun icon
- [ ] Press `D` key - toggles dark mode
- [ ] Background changes to dark gradient
- [ ] All text is readable (light colored)

### Component Styling in Dark Mode
- [ ] Header - dark background, light text
- [ ] Wheel container - dark background
- [ ] Entry list - dark cards, light text
- [ ] History panel - dark cards, light text
- [ ] Settings modal - dark background
- [ ] Input fields - dark with light text
- [ ] Buttons - proper contrast
- [ ] Hover states work correctly

### Persistence
- [ ] Enable dark mode
- [ ] Refresh page (F5)
- [ ] Dark mode persists
- [ ] Disable dark mode
- [ ] Refresh page
- [ ] Light mode persists

---

## Keyboard Shortcuts

### Spin Wheel
- [ ] `Space` key - spins wheel
- [ ] `Enter` key - spins wheel
- [ ] Shortcuts work when not in input field
- [ ] Shortcuts don't trigger when typing in input

### Settings
- [ ] `S` key - opens settings modal
- [ ] Works from main page
- [ ] Doesn't trigger when typing

### Dark Mode
- [ ] `D` key - toggles dark mode
- [ ] Toggles on/off correctly
- [ ] Visual feedback immediate

### Help Dialog
- [ ] `?` key (Shift + /) - opens keyboard help
- [ ] Modal shows all shortcuts
- [ ] Press `?` again - closes modal
- [ ] `Esc` also closes modal

### Close Modals
- [ ] Open settings - press `Esc` - closes
- [ ] Open keyboard help - press `Esc` - closes
- [ ] Multiple modals - `Esc` closes all

### Input Field Behavior
- [ ] Focus on entry name input
- [ ] Press `Space` - types space (doesn't spin)
- [ ] Press `Enter` - saves entry (doesn't spin)
- [ ] Press `S` - types 's' (doesn't open settings)

---

## Responsive Design

### Desktop (1920x1080)
- [ ] 3-column layout displays correctly
- [ ] Wheel takes 2/3 width
- [ ] Sidebar takes 1/3 width
- [ ] Features grid shows 3 columns
- [ ] All elements properly spaced

### Tablet (768px)
- [ ] Layout switches to single column
- [ ] Wheel displays full width
- [ ] Entry list below wheel
- [ ] History panel below entry list
- [ ] Features grid shows 1 column
- [ ] Text remains readable

### Mobile (375px)
- [ ] All content fits viewport
- [ ] Wheel scales appropriately
- [ ] Buttons are tap-friendly (min 44px)
- [ ] Modals don't overflow
- [ ] Text is legible
- [ ] No horizontal scrolling

### Browser DevTools Testing
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test iPhone SE (375x667)
- [ ] Test iPad (768x1024)
- [ ] Test desktop (1920x1080)
- [ ] Test landscape/portrait orientations

---

## Browser Compatibility

### Chrome/Edge
- [ ] All features work
- [ ] Canvas renders correctly
- [ ] Animations smooth
- [ ] LocalStorage persists

### Firefox
- [ ] All features work
- [ ] Canvas renders correctly
- [ ] Animations smooth
- [ ] LocalStorage persists

### Safari (if available)
- [ ] All features work
- [ ] Canvas renders correctly
- [ ] iOS Safari specific testing

---

## Performance

### Load Time
- [ ] Initial page load < 2 seconds
- [ ] No console errors
- [ ] No console warnings (check F12)

### Animation Performance
- [ ] Wheel spins smoothly at 60fps
- [ ] No frame drops during spin
- [ ] UI remains responsive during animation
- [ ] Check Performance tab in DevTools

### Memory Leaks
- [ ] Spin 20+ times
- [ ] Open/close modals 10+ times
- [ ] Check Memory tab in DevTools
- [ ] Memory usage should stabilize

---

## Data Persistence

### LocalStorage
- [ ] Add 5 custom entries
- [ ] Change colors and weights
- [ ] Spin 3 times (create history)
- [ ] Close browser tab
- [ ] Reopen http://localhost:3000
- [ ] All entries preserved
- [ ] Colors preserved
- [ ] Weights preserved
- [ ] History preserved
- [ ] Settings preserved

### Export/Import Persistence
- [ ] Configure custom wheel
- [ ] Export configuration
- [ ] Clear all data (or use incognito)
- [ ] Import configuration
- [ ] Verify everything restored

---

## Production Build

### Build Process
- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] `/out` directory created

### Build Output
- [ ] `out/index.html` exists
- [ ] `out/_next/` directory exists
- [ ] `out/manifest.json` exists
- [ ] File sizes reasonable (check build summary)

### Test Production Build
- [ ] Install: `npm install -g http-server`
- [ ] Run: `http-server out -p 8080`
- [ ] Open http://localhost:8080
- [ ] All features work in production build
- [ ] Assets load correctly
- [ ] No console errors
- [ ] PWA manifest loads

---

## Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Can activate buttons with Enter
- [ ] Modal traps focus correctly

### Screen Reader (if available)
- [ ] Button labels are announced
- [ ] Spin result is announced
- [ ] Form inputs have labels

### Color Contrast
- [ ] Light mode - text readable
- [ ] Dark mode - text readable
- [ ] No contrast issues (use DevTools Lighthouse)

---

## Edge Cases

### Minimum Entries
- [ ] Delete all but 2 entries - wheel works
- [ ] Try to delete last 2 - prevented (or allowed if coded)
- [ ] Wheel with 1 entry - always wins

### Maximum Entries
- [ ] Add 50+ entries via bulk add
- [ ] Wheel renders all segments
- [ ] Text might be small but wheel works
- [ ] Performance remains acceptable

### Empty Names
- [ ] Try to add entry with empty name
- [ ] Try to edit entry to empty name
- [ ] Proper validation/prevention

### Special Characters
- [ ] Add entry: `Alice & Bob`
- [ ] Add entry: `Test <script>alert(1)</script>`
- [ ] Add entry: `测试` (Chinese characters)
- [ ] Add entry: `🎉🎊🎁` (emojis)
- [ ] All render correctly on wheel

### Rapid Actions
- [ ] Click spin button 10 times rapidly
- [ ] Add 10 entries rapidly
- [ ] Toggle dark mode 10 times rapidly
- [ ] No crashes or errors

---

## Final Checks

### Console Errors
- [ ] Open DevTools Console (F12)
- [ ] No red errors during normal use
- [ ] No warnings (acceptable in dev mode)

### Network Requests
- [ ] Open Network tab
- [ ] Refresh page
- [ ] All assets load (200 status)
- [ ] No 404 errors
- [ ] No CORS errors

### Code Quality
- [ ] Run `npm run lint` - no errors
- [ ] TypeScript: `npx tsc --noEmit` - no errors
- [ ] Code formatted consistently

### Documentation
- [ ] README.md is complete and accurate
- [ ] WEBSTORM_SETUP.md tested and accurate
- [ ] All links work
- [ ] Installation instructions clear

---

## Pre-Commit Checklist

Before committing to GitHub:

- [ ] All tests above pass
- [ ] No console errors
- [ ] Production build works
- [ ] Code is formatted
- [ ] Linting passes
- [ ] No sensitive data in code
- [ ] .gitignore includes node_modules, .next, out
- [ ] GitHub URLs updated (replace "yourusername")

---

## Post-Deploy Verification

After pushing to GitHub and deploying:

- [ ] GitHub Actions workflow runs successfully
- [ ] Site deploys to GitHub Pages
- [ ] Visit live URL: `https://yourusername.github.io/wheel-of-names/`
- [ ] Test core features on live site
- [ ] Verify assets load correctly
- [ ] Test on mobile device (real device if possible)

---

**Testing Complete!** 🎉

If all items are checked, you're ready to push to GitHub with confidence.
