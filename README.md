# Wheel of Names - Open Source Alternative

An improved, open-source alternative to Wheel of Names. A free, feature-rich random name picker with weighted probability, dark mode, customization options, and professional UX.

> **✨ Recently Updated:** Major UX improvements including mobile-first design, toast notifications, welcome onboarding, confetti animations, and professional bulk-add modal. See [UX_IMPROVEMENTS.md](./UX_IMPROVEMENTS.md) for details.

## Features

### Core Functionality
- **Spinning Wheel**: Smooth, physics-based animation with realistic friction
- **Random Selection**: Cryptographically fair random selection
- **Weighted Probability**: Assign different weights (1-10) to entries for custom probability
- **History Tracking**: Keep track of all spin results with timestamps
- **Export/Import**: Save and share wheel configurations as JSON
- **CSV Export**: Export spin history as CSV for analysis

### Customization
- **Custom Colors**: Choose individual colors for each entry
- **Adjustable Duration**: Control spin duration (2-6 seconds)
- **Dark Mode**: Beautiful dark theme with system preference detection
- **Remove Winners**: Optionally remove winners from subsequent spins
- **Sound Effects**: Toggle spin sound effects on/off
- **Confetti Animation**: Celebrate winners with confetti (toggle on/off)

### User Experience
- **Keyboard Shortcuts**:
  - `Space` or `Enter` - Spin the wheel
  - `S` - Open settings
  - `D` - Toggle dark mode
  - `?` - Show keyboard shortcuts help
  - `Esc` - Close modals
- **Bulk Add**: Paste multiple names (comma or newline separated)
- **Inline Editing**: Edit entry names directly
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **No Tracking**: Your data stays private, stored locally in your browser

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Rendering**: HTML5 Canvas API

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wheel-of-names.git
cd wheel-of-names
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates an optimized static export in the `out` directory, ready for deployment to GitHub Pages or any static hosting service.

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

1. Push your code to GitHub
2. Go to Settings > Pages
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Push to the `main` branch to trigger automatic deployment

The site will be available at: `https://yourusername.github.io/wheel-of-names/`

### Other Static Hosts

The `out` directory after build can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- Any static file hosting service

## Project Structure

```
wheel-of-names/
├── app/
│   ├── components/
│   │   ├── Wheel.tsx           # Main wheel component with Canvas rendering
│   │   ├── EntryList.tsx       # Entry management component
│   │   ├── HistoryPanel.tsx    # Spin history display
│   │   └── Settings.tsx        # Settings modal
│   ├── stores/
│   │   └── wheelStore.ts       # Zustand state management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/                     # Static assets
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # TailwindCSS configuration
└── package.json
```

## Development

### Key Components

**Wheel.tsx**: Renders the spinning wheel using Canvas API with physics-based animation
- Angular velocity with friction simulation
- Device pixel ratio handling for sharp rendering
- Radial gradients for visual polish

**wheelStore.ts**: Manages application state with Zustand
- Persistent storage using localStorage
- Weighted random selection algorithm
- Export/import functionality

**EntryList.tsx**: Manages entries with CRUD operations
- Bulk add feature
- Weight adjustment (1-10 scale)
- Color customization
- Inline editing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the original Wheel of Names
- Built with modern web technologies for improved performance and features
- Created as a demonstration of full-stack development capabilities

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

Made with ❤️ by AI Dev Workforce
