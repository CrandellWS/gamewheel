# Quick Start Guide

Fast setup for experienced developers who want to test immediately.

## 1. Open in WebStorm

```bash
cd /home/aiuser/projects/wheel-of-names
webstorm .
```

## 2. Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:3000**

## 3. Test Key Features

- **Spin**: Press `Space` or `Enter`
- **Settings**: Press `S` (test remove winners, duration, export/import)
- **Dark Mode**: Press `D`
- **Bulk Add**: Paste multiple names: `Alice, Bob, Charlie`
- **Weights**: Adjust entry weights to test probability
- **History**: Check history panel and CSV export

## 4. Build & Test Production

```bash
# Build for production
npm run build

# Serve locally
npx http-server out -p 8080
```

Test at **http://localhost:8080**

## 5. Commit to GitHub

```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit: Wheel of Names application"

# Push to GitHub
git remote add origin https://github.com/crandellws/gamewheel.git
git branch -M main
git push -u origin main
```

## 6. Enable GitHub Pages

1. Go to repository **Settings → Pages**
2. Select **"GitHub Actions"** as source
3. Push triggers auto-deployment
4. Site live at: `https://crandellws.github.io/gamewheel/`

## WebStorm Run Configurations

**Add npm configurations:**
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`

Access via toolbar dropdown or `Shift+F10`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Spin wheel |
| `S` | Settings |
| `D` | Dark mode |
| `?` | Keyboard help |
| `Esc` | Close modals |

## Common Issues

**Port in use:**
```bash
npx kill-port 3000
```

**Module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
File → Invalidate Caches → Invalidate and Restart

---

For detailed setup instructions, see **[WEBSTORM_SETUP.md](./WEBSTORM_SETUP.md)**
