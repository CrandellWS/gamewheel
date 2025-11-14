# WebStorm Setup Guide - Wheel of Names

Complete guide to set up, run, and test the Wheel of Names application in WebStorm before deploying to GitHub.

## Prerequisites

Before opening the project in WebStorm, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **WebStorm 2023.3+** ([Download](https://www.jetbrains.com/webstorm/))
- **Git** installed ([Download](https://git-scm.com/))

## Step 1: Open Project in WebStorm

### Option A: Open Existing Project
1. Launch WebStorm
2. Click **"Open"** on the welcome screen
3. Navigate to `/home/aiuser/projects/wheel-of-names`
4. Click **"OK"**

### Option B: From Terminal
```bash
cd /home/aiuser/projects/wheel-of-names
webstorm .
```

## Step 2: Trust Project & Install Dependencies

1. **Trust the Project**: When prompted, click **"Trust Project"**
2. **Install Dependencies**: WebStorm should auto-detect `package.json`
   - If prompted, click **"Run 'npm install'"**
   - Or manually run in WebStorm's terminal:
   ```bash
   npm install
   ```

## Step 3: Configure WebStorm for Next.js

### Enable Next.js Support
1. Go to **File → Settings** (or **WebStorm → Preferences** on macOS)
2. Navigate to **Languages & Frameworks → JavaScript → Frameworks**
3. Ensure **Next.js** is detected (should auto-detect from project)

### Configure TypeScript
1. **Settings → Languages & Frameworks → TypeScript**
2. Select **TypeScript version**: `Use TypeScript from project`
3. Enable **"Recompile on changes"**
4. Click **"Apply"**

### Set Node.js Interpreter
1. **Settings → Languages & Frameworks → Node.js**
2. Ensure Node interpreter is set (should auto-detect)
3. Click **"Apply"**

## Step 4: Configure Run Configurations

### Development Server Configuration

1. Click **"Add Configuration..."** in the top-right toolbar
2. Click **"+"** and select **"npm"**
3. Configure as follows:
   - **Name**: `Dev Server`
   - **Command**: `run`
   - **Scripts**: `dev`
   - **Node interpreter**: Project default
   - **Package manager**: npm
4. Click **"Apply"** and **"OK"**

### Build Configuration

1. Click **"Add Configuration..."** again
2. Click **"+"** and select **"npm"**
3. Configure as follows:
   - **Name**: `Build Production`
   - **Command**: `run`
   - **Scripts**: `build`
   - **Node interpreter**: Project default
   - **Package manager**: npm
4. Click **"Apply"** and **"OK"**

## Step 5: Start Development Server

### Method 1: Using Run Configuration
1. Select **"Dev Server"** from the dropdown in the toolbar
2. Click the green **Play** button (or press **Shift+F10**)
3. Wait for "Ready on http://localhost:3000"

### Method 2: Using Terminal
1. Open WebStorm's terminal (**View → Tool Windows → Terminal**)
2. Run:
```bash
npm run dev
```

### Method 3: Using npm Scripts Panel
1. Open **npm** tool window (**View → Tool Windows → npm**)
2. Double-click **"dev"** under Scripts

## Step 6: Open in Browser

1. Once the server starts, WebStorm will show a notification
2. Click the **"Open in Browser"** link
3. Or manually navigate to: **http://localhost:3000**

## Step 7: Testing the Application

### Manual Testing Checklist

#### Basic Functionality
- [ ] **Wheel Loads**: Verify the wheel renders with default entries
- [ ] **Spin Works**: Click "SPIN" or press **Space/Enter**
- [ ] **Winner Display**: Confirm winner is announced after spin
- [ ] **History Updates**: Check history panel shows the result

#### Entry Management
- [ ] **Add Entry**: Click "Add Entry" and type a name
- [ ] **Edit Entry**: Click pencil icon, modify name, press Enter
- [ ] **Delete Entry**: Click trash icon, confirm entry is removed
- [ ] **Bulk Add**: Click "Bulk Add", paste multiple names (comma or newline separated)
- [ ] **Color Change**: Click color swatch, select new color
- [ ] **Weight Adjustment**: Change weight slider (1-10)

#### Settings
- [ ] **Open Settings**: Click gear icon or press **S**
- [ ] **Remove Winners**: Toggle on/off, verify behavior after spin
- [ ] **Sound Effects**: Toggle and test (may need audio permissions)
- [ ] **Confetti**: Toggle on/off, verify after spin
- [ ] **Spin Duration**: Adjust slider, test different durations
- [ ] **Export Wheel**: Click export, verify JSON file downloads
- [ ] **Import Wheel**: Upload the exported JSON, verify it loads

#### Dark Mode
- [ ] **Toggle Dark Mode**: Click moon/sun icon or press **D**
- [ ] **Verify Styling**: Check all components look correct in dark mode
- [ ] **Persistence**: Refresh page, verify dark mode persists

#### Keyboard Shortcuts
- [ ] **Space/Enter**: Spin the wheel
- [ ] **S**: Open settings
- [ ] **D**: Toggle dark mode
- [ ] **?**: Show keyboard shortcuts help
- [ ] **Esc**: Close modals

#### History Panel
- [ ] **Export CSV**: Click download icon, verify CSV file
- [ ] **Clear History**: Click trash icon, confirm history clears
- [ ] **Time Display**: Verify relative time ("Just now", "5m ago")

#### Responsive Design
- [ ] **Desktop View**: Test at 1920x1080
- [ ] **Tablet View**: Resize to ~768px width
- [ ] **Mobile View**: Resize to ~375px width
- [ ] Use WebStorm's built-in browser DevTools to test

### Automated Testing

Currently, the project doesn't have automated tests. To add them:

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests (after setup)
npm test
```

## Step 8: Build for Production

### Run Production Build

1. Select **"Build Production"** from the run configuration dropdown
2. Click the green **Play** button
3. Or in terminal:
```bash
npm run build
```

### Verify Build Output

1. Build should complete successfully
2. Check the **`/out`** directory is created
3. Verify it contains:
   - `index.html` (main page)
   - `_next/` (Next.js assets)
   - `manifest.json` (PWA manifest)

### Test Production Build Locally

```bash
# Install a simple HTTP server
npm install -g http-server

# Serve the out directory
http-server out -p 8080

# Open http://localhost:8080 in browser
```

## Step 9: Code Quality Checks

### Run Linting

```bash
npm run lint
```

Fix any errors before committing.

### TypeScript Type Checking

WebStorm should show TypeScript errors inline. To manually check:

```bash
npx tsc --noEmit
```

### Format Code

1. **Settings → Tools → Actions on Save**
2. Enable:
   - ✓ Reformat code
   - ✓ Optimize imports
3. Or manually: **Ctrl+Alt+L** (Cmd+Option+L on macOS)

## Step 10: Git Integration & Commit

### Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "Initial commit: Complete Wheel of Names application"
```

### Using WebStorm's Git Integration

#### View Changes
1. Open **"Git"** tool window (**View → Tool Windows → Git**)
2. See all modified files in the **"Local Changes"** tab

#### Commit Changes
1. Press **Ctrl+K** (Cmd+K on macOS) or **VCS → Commit**
2. Review changes in the commit dialog
3. Write commit message:
   ```
   Initial commit: Complete Wheel of Names application

   Features:
   - Physics-based spinning wheel with Canvas rendering
   - Weighted probability system
   - Dark mode support
   - Keyboard shortcuts
   - History tracking with CSV export
   - Import/export wheel configurations
   - PWA support
   - GitHub Pages deployment ready
   ```
4. Click **"Commit"**

#### Push to GitHub
1. Create repository on GitHub (without initializing with README)
2. In WebStorm terminal:
```bash
git remote add origin https://github.com/yourusername/wheel-of-names.git
git branch -M main
git push -u origin main
```

Or use WebStorm's UI:
1. **VCS → Git → Push** (or **Ctrl+Shift+K**)
2. Click **"Define remote"**
3. Enter GitHub repository URL
4. Click **"Push"**

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors in WebStorm

**Solution:**
1. **File → Invalidate Caches**
2. Select **"Invalidate and Restart"**

### Issue: Hot reload not working

**Solution:**
1. Check WebStorm's safe write setting
2. **Settings → System Settings → Synchronization**
3. Uncheck **"Use safe write"**

### Issue: Build fails with memory error

**Solution:**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## WebStorm Tips & Tricks

### Useful Shortcuts
- **Ctrl+Space**: Code completion
- **Ctrl+Click**: Go to definition
- **Ctrl+B**: Go to declaration
- **Ctrl+Alt+L**: Reformat code
- **Shift+Shift**: Search everywhere
- **Alt+Enter**: Show context actions
- **Ctrl+/**: Toggle line comment

### Enable Tailwind CSS IntelliSense
1. Install **Tailwind CSS** plugin (should auto-detect)
2. **Settings → Languages & Frameworks → Style Sheets → Tailwind CSS**
3. Ensure configuration file is detected: `tailwind.config.ts`

### Multiple Cursors
- **Alt+Click**: Add cursor
- **Alt+Shift+Click**: Add rectangular selection

### Split Editor
- **Right-click tab → Split Right/Down**
- Great for viewing component + store simultaneously

## Next Steps After Testing

1. ✅ Verify all features work correctly
2. ✅ Test responsive design on different screen sizes
3. ✅ Run production build and test locally
4. ✅ Commit changes to Git
5. ✅ Push to GitHub
6. ✅ Enable GitHub Pages in repository settings
7. ✅ Wait for GitHub Actions deployment
8. ✅ Test live site

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [WebStorm Next.js Guide](https://www.jetbrains.com/help/webstorm/next-js.html)
- [Project README](./README.md)
- [GitHub Actions Workflow](./.github/workflows/deploy.yml)

---

**Need Help?** Open an issue on GitHub or check the troubleshooting section above.
