# Changelog

All notable changes to GameWheel will be documented in this file.

## [2.1.1] - 2025-01-14

### Fixed
- Floating-point precision issues causing micro-gaps at 360° boundary
- Final slice angle clamping ensures perfect 360° coverage
- Segment boundary detection with epsilon tolerance (1e-6)
- Visual display now correct for all entry counts (especially 2, 3, 4, 7)
- Sub-pixel rendering artifacts eliminated with angle rounding

### Technical
- Added `ANGLE_EPSILON` constant (1e-6) for float comparisons
- Force last slice `endAngle = 360°` exactly to prevent gaps
- Improved angle rounding for sub-pixel precision (10 decimal places)
- Enhanced segment boundary detection with epsilon tolerance
- Optimized canvas rendering with proper angle normalization

### Performance
- Build size: 144 kB (well under 150 kB limit)
- Zero TypeScript errors in production build
- Maintains 60fps rendering with all visual effects
- Efficient gradient caching and pattern rendering

### Infrastructure
- Added comprehensive test report: `DISPLAY_FIXES_TEST_REPORT.md`
- Verified all edge cases (2, 3, 4, 7+ entries)
- Confirmed tier system working correctly
- All previous features regression tested

## [2.1.0] - 2025-01-14

### Added
- **Dramatic Visual Tier System**: Implemented maximum-impact visual hierarchy
  - North position: 2.0x size with gold theme, radial rays, and star markers
  - Cardinal directions: 1.6x size with silver theme and diagonal stripes
  - Intercardinal positions: 1.3x size with subtle enhancements
  - Multi-stop gradients with intelligent color lighting/darkening
  - Pattern overlays for premium tiers (rays and stripes)
  - Corner markers (stars and circles) for visual distinction
  - Enhanced text scaling up to 2.0x for maximum readability
  - Tier-based shadows and glows for depth perception
  - Pulsing animations during spin only (clean idle state)

### Technical
- Color manipulation utilities (hex/RGB conversion, lighten/darken)
- Tier detection system based on compass positions
- Configurable visual effects per tier level
- Optimized canvas rendering with proper save/restore
- Performance maintained at 60fps with all effects

## [2.0.1] - 2025-01-14

### 📚 Documentation Updates

- **Added** Comprehensive GitHub Pages deployment guide in README.md
- **Added** Step-by-step deployment instructions with troubleshooting
- **Added** New DEPLOYMENT.md with detailed platform-specific guides
- **Added** Comparison of hosting platforms (GitHub Pages, Vercel, Netlify, Cloudflare)
- **Added** Chat integration setup for production environments
- **Updated** QUICK_START_GUIDE.md with deployment quick start section
- **Added** Notes about basePath configuration for GitHub Pages
- **Added** Limitations documentation for static hosting (API routes)
- **Added** Alternative hosting recommendations for full feature support

### 🔧 Configuration Notes

- **Confirmed** basePath set to `/gamewheel` for GitHub Pages compatibility
- **Documented** Chat integration requires serverless platform (not GitHub Pages)
- **Clarified** All client-side features work on GitHub Pages
- **Added** Environment variables documentation for future extensibility

## [2.0.0] - 2025-01-14

### 🎮 Game Modes Feature
- **Added** First Win mode (traditional single-spin selection)
- **Added** Last Remaining mode (elimination-style gameplay)
- **Added** Game mode selector in Settings panel
- **Added** Visual indicators for elimination mode in history
- **Added** Automatic removal of eliminated entries in Last Remaining mode
- **Added** Game mode tracking in history exports

### 💬 Chat Integration System
- **Added** REST API endpoint `/api/chat-submit` for external submissions
- **Added** Support for Twitch, Discord, and YouTube platforms
- **Added** Configurable minimum fee settings
- **Added** Platform enable/disable toggles
- **Added** Webhook URL display and copy functionality in settings
- **Added** API documentation endpoint (GET `/api/chat-submit`)
- **Added** Validation for incoming submissions
- **Added** `useChatIntegration` hook for future real-time features

### 🏷️ Configurable Terminology
- **Added** Terminology customization system
- **Added** Preset options: Contestants, Players, Participants, Members, Entries
- **Added** Custom terminology input support
- **Added** Dynamic UI text updates across all components
- **Updated** EntryList to use configurable terminology
- **Updated** All user-facing text to respect terminology setting

### 🎨 Rebranding
- **Changed** Application name from "Wheel of Names" to "GameWheel"
- **Updated** All UI text and branding
- **Updated** package.json metadata
- **Updated** README.md with new branding and features
- **Updated** manifest.json for PWA
- **Updated** Page titles and meta descriptions
- **Updated** GitHub repository URLs
- **Updated** localStorage key from `wheel-of-names-storage` to `gamewheel-storage`
- **Updated** First visit flag from `wheel-of-names-visited` to `gamewheel-visited`

### 📊 Enhanced History
- **Added** Elimination indicators in history panel
- **Added** Visual differentiation (red badge) for eliminated entries
- **Added** Game mode column in CSV exports
- **Added** Type column (Elimination vs Win) in CSV exports
- **Updated** History export filename to `gamewheel-history-{timestamp}.csv`

### ⚙️ Settings Improvements
- **Redesigned** Settings modal layout for better organization
- **Added** Game mode selection section
- **Added** Terminology configuration section
- **Added** Chat integration configuration section
- **Added** Conditional display of "Remove winners" based on game mode
- **Added** Info banner for elimination mode behavior
- **Improved** Modal scrolling for mobile devices
- **Increased** Maximum width to accommodate new features

### 🎨 UI/UX Enhancements
- **Updated** Welcome modal with new features showcase
- **Updated** Feature highlights on homepage
- **Updated** App icon emoji (kept 🎡)
- **Improved** Settings modal organization and layout
- **Added** Border highlighting for selected game mode
- **Added** Copy to clipboard for webhook URL

### 🔧 Technical Changes
- **Added** New TypeScript types: `GameMode`, `ChatIntegrationSettings`
- **Updated** `WheelSettings` interface with new fields
- **Updated** `SpinResult` interface with elimination tracking
- **Added** Game mode logic in `wheelStore.ts`
- **Added** Conditional winner removal based on game mode
- **Added** API route structure for Next.js
- **Added** Request validation and error handling
- **Updated** Export filenames to use "gamewheel" prefix

### 📚 Documentation
- **Created** Comprehensive README.md (v2.0)
- **Added** Chat integration setup guide
- **Added** API documentation
- **Added** Platform integration examples (Twitch, Discord, YouTube)
- **Added** Game mode usage guide
- **Added** Security considerations for chat integration
- **Added** Migration guide from v1.x
- **Added** Use case examples
- **Added** This CHANGELOG.md

### 🐛 Bug Fixes
- **Maintained** All existing duplicate name handling fixes
- **Preserved** Rotation calculation accuracy
- **Kept** All previous winner removal logic improvements

## [1.0.0] - 2024-11-14

### Initial Release
- ✨ Spinning wheel with physics-based animation
- ⚖️ Weighted probability system
- 🎨 Custom colors for entries
- 🌙 Dark mode support
- 📝 Bulk add functionality
- 📊 History tracking
- 💾 Export/Import configurations
- 📈 CSV export for history
- ⌨️ Keyboard shortcuts
- 📱 Responsive design
- 🎯 Duplicate name handling
- 🎊 Confetti animations
- 🔊 Sound effects
- ⚡ Auto-save with localStorage
- 🎓 Welcome tutorial
