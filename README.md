# GameWheel - Advanced Random Selection Spinner 🎡

GameWheel is a powerful, open-source random selection spinner with multiple game modes, chat platform integration, and extensive customization options. Perfect for streamers, educators, event organizers, and anyone who needs fair random selection.

> **Version 2.0** - Now with game modes, chat integration, and configurable terminology!

## New Features in Version 2.0

### 🎮 Game Modes
- **First Win**: Traditional mode where the wheel spins once and the selected entry wins
- **Last Remaining (Elimination)**: Competitive mode where selected entries are eliminated until only one remains as the ultimate winner

### 💬 Chat Integration
- Accept contestant submissions from Twitch, Discord, and YouTube
- Configure minimum fee amounts for submissions
- Easy webhook integration with popular streaming platforms
- Real-time entry addition from chat interactions

### 🏷️ Configurable Terminology
- Customize the word "Contestants" to match your use case
- Built-in options: Contestants, Players, Participants, Members, Entries
- Support for custom terminology
- All UI text updates dynamically

## Core Features

### Selection & Probability
- **Weighted Probability**: Assign weights (1-10) to entries for custom probability
- **Fair Random Selection**: Cryptographically secure random selection algorithm
- **Duplicate Name Handling**: Proper handling of duplicate contestant names

### Customization
- **Dark Mode**: Beautiful dark theme with system preference detection
- **Custom Colors**: Individual color selection for each entry
- **Adjustable Duration**: Control spin duration (2-6 seconds)
- **Sound Effects**: Toggle spin sound effects on/off
- **Confetti Animation**: Celebrate winners with confetti (toggleable)

### Data Management
- **History Tracking**: Keep track of all spin results with timestamps
- **CSV Export**: Export spin history with game mode and elimination data
- **Export/Import**: Save and share wheel configurations as JSON
- **Auto-Save**: All data persists in browser localStorage

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
git clone https://github.com/CrandellWS/gamewheel.git
cd gamewheel
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

This creates an optimized static export in the `out` directory, ready for deployment.

## Chat Integration Setup

GameWheel includes a built-in API endpoint for accepting contestant submissions from external platforms.

> **Important**: Chat integration requires a hosting platform with serverless function support (Vercel, Netlify, etc.). This feature will NOT work on GitHub Pages static hosting. For GitHub Pages deployment, all other features work normally, but you'll need to add contestants manually.

### API Endpoint

**URL**: `POST /api/chat-submit`

**Payload**:
```json
{
  "name": "PlayerOne",
  "fee": 5.0,
  "platform": "twitch",
  "userId": "user123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Submission accepted",
  "data": {
    "entryId": "1234567890-abc123",
    "name": "PlayerOne",
    "timestamp": 1234567890
  }
}
```

### Platform Integration Examples

#### Twitch Integration

1. Enable chat integration in GameWheel settings
2. Set minimum fee amount
3. Enable Twitch platform
4. Copy the webhook URL from settings
5. Set up a Twitch chat bot (e.g., Streamlabs, StreamElements) to:
   - Listen for specific commands or channel point redemptions
   - Validate payment/points
   - POST to the webhook URL with contestant data

**Example cURL**:
```bash
curl -X POST https://your-domain.com/api/chat-submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TwitchViewer123",
    "fee": 5.0,
    "platform": "twitch",
    "userId": "12345"
  }'
```

#### Discord Integration

1. Create a Discord bot with slash commands
2. Set up a command like `/enter-wheel <name>`
3. Implement payment verification (if required)
4. POST to the GameWheel webhook URL

#### YouTube Integration

1. Set up YouTube Chat API integration
2. Monitor for Super Chat or membership messages
3. Extract username and fee amount
4. POST to the GameWheel webhook URL

### Security Considerations

- Validate all incoming requests on your backend
- Implement rate limiting to prevent spam
- Verify payment/fee transactions before submitting
- Use HTTPS in production
- Consider adding API key authentication for webhook endpoints

## Game Mode Details

### First Win Mode
- Default mode, traditional wheel behavior
- Spin the wheel, first selected entry wins
- Winners can optionally be removed (configurable)
- Best for: Giveaways, simple selections, one-time picks

### Last Remaining Mode (Elimination)
- Competitive elimination format
- Each spin eliminates the selected entry
- Continue spinning until only one remains
- The final entry is the ultimate winner
- Eliminated entries are marked in history
- Best for: Tournaments, battle royale style selection, competitive events

## Visual Features

### Dynamic Tier System
The wheel features a dramatic 4-tier visual hierarchy based on compass positions:

**🏆 Tier 1 - Grand Prize (North)**
- 2.0x slice size - twice as large!
- Gold theme with radial ray patterns
- Star corner markers
- Maximum text visibility

**🥈 Tier 2 - Major Prizes (E/S/W Cardinals)**
- 1.6x slice size
- Silver/platinum shimmer theme
- Diagonal stripe patterns
- Circle corner markers

**🥉 Tier 3 - Minor Prizes (NE/SE/SW/NW)**
- 1.3x slice size
- Enhanced brightness
- Subtle glow effects

**📍 Tier 4 - Standard Positions**
- 1.0x slice size (normal)
- Clean, minimal styling

All effects activate during spinning and winner display for maximum visual impact.

## Configuration Options

### Settings Panel

Access via the ⚙️ icon or press `S`

**Game Mode**
- Choose between First Win or Last Remaining

**Terminology**
- Select from preset options or enter custom text
- Updates all UI references dynamically

**Wheel Behavior**
- Remove winners after spin (First Win mode only)
- Sound effects toggle
- Confetti animation toggle

**Spin Duration**
- Adjust from 2-6 seconds

**Chat Integration**
- Enable/disable submissions
- Set minimum fee amount
- Select enabled platforms (Twitch, Discord, YouTube)
- View and copy webhook URL

**Import/Export**
- Export wheel configuration as JSON
- Import previously saved configurations

## Project Structure

```
gamewheel/
├── app/
│   ├── api/
│   │   └── chat-submit/
│   │       └── route.ts          # Chat submission API endpoint
│   ├── components/
│   │   ├── Wheel.tsx             # Main wheel canvas component
│   │   ├── EntryList.tsx         # Entry management with terminology
│   │   ├── HistoryPanel.tsx      # History with elimination markers
│   │   ├── Settings.tsx          # Enhanced settings with new features
│   │   ├── WelcomeModal.tsx      # Updated onboarding
│   │   └── BulkAddModal.tsx      # Bulk entry addition
│   ├── hooks/
│   │   └── useChatIntegration.ts # Chat integration helper hook
│   ├── stores/
│   │   └── wheelStore.ts         # Zustand store with game modes
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── public/
│   ├── manifest.json             # PWA manifest
│   └── ...                       # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## API Documentation

### GET /api/chat-submit

Returns API documentation and usage examples.

### POST /api/chat-submit

Accepts contestant submission from external platforms.

**Request Body**:
- `name` (string, required): Contestant name (max 30 characters)
- `fee` (number, required): Fee amount (>= 0)
- `platform` (string, required): One of "twitch", "discord", "youtube"
- `userId` (string, required): Platform user ID

**Responses**:
- `200`: Submission accepted
- `400`: Invalid request (missing/invalid fields)
- `500`: Server error

## Development

### Key Components

**Wheel.tsx**:
- Renders the spinning wheel using Canvas API
- Physics-based animation with friction simulation
- Device pixel ratio handling for sharp rendering
- Supports both game modes

**wheelStore.ts**:
- Manages application state with Zustand
- Persistent storage using localStorage
- Game mode logic implementation
- Weighted random selection algorithm
- Export/import functionality

**Settings.tsx**:
- Game mode selection UI
- Terminology configuration
- Chat integration settings
- All existing settings preserved

**EntryList.tsx**:
- Dynamic terminology support
- Bulk add feature
- Weight adjustment (1-10 scale)
- Color customization
- Inline editing

**HistoryPanel.tsx**:
- Elimination vs win indicators
- Game mode tracking in CSV export
- Visual differentiation for elimination mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

### GitHub Pages (Recommended for Quick Setup)

GameWheel is pre-configured for GitHub Pages deployment with automated builds.

#### Step-by-Step Deployment Instructions

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under "Build and deployment":
     - **Source**: Select "GitHub Actions"
     - The workflow will automatically detect the `.github/workflows/deploy.yml` file

3. **Trigger Deployment**
   - Push any commit to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Check the "Actions" tab to monitor deployment progress

4. **Access Your Site**
   - Your site will be available at: `https://CrandellWS.github.io/gamewheel/`
   - Wait 2-3 minutes for the first deployment to complete

#### Important Notes for GitHub Pages

- **basePath Configuration**: The project is configured with `basePath: '/gamewheel'` for GitHub Pages
- **API Routes Limitation**: GitHub Pages is static hosting only - the `/api/chat-submit` endpoint will NOT work
- **Chat Integration Solution**: Use external webhook services (see Chat Integration for GitHub Pages below)
- **All Client-Side Features Work**: Spinning wheel, history, settings, export/import all function normally

#### Chat Integration for GitHub Pages

Since GitHub Pages doesn't support server-side API routes, you'll need to use an external webhook service for chat integration. GameWheel automatically detects GitHub Pages hosting and prompts you to configure a custom webhook URL.

**Option 1: Zapier (Easiest for Non-Developers)**

1. Create a free Zapier account at [zapier.com](https://zapier.com)
2. Create a new Zap with "Webhooks by Zapier" as the trigger
3. Choose "Catch Hook" to generate a webhook URL
4. Copy the webhook URL
5. In GameWheel Settings, enable Chat Integration and paste the webhook URL
6. Add a filter step in Zapier to check the fee meets your minimum
7. Add an action to forward validated requests to your chat platform or directly add entries

Example Zapier Flow:
```
Webhook Trigger (Catch Hook)
  ↓
Filter (Only continue if fee >= minimum)
  ↓
Code by Zapier (Validate platform and format data)
  ↓
Your Action (Post to Discord, Twitch bot, etc.)
```

**Option 2: n8n (Best for Self-Hosters)**

1. Install n8n (self-hosted or cloud at [n8n.io](https://n8n.io))
2. Create a workflow starting with a Webhook node
3. Add validation nodes to check fee and platform
4. Configure platform-specific nodes (Twitch, Discord, YouTube)
5. Use the webhook URL in GameWheel settings

Example n8n Workflow:
```
Webhook → IF (fee >= minimum) → Platform Router → Send to Chat/Add Entry
```

**Option 3: Webhook.site (Testing Only)**

1. Visit [webhook.site](https://webhook.site)
2. Copy the unique webhook URL
3. Paste into GameWheel Settings > Chat Integration
4. Use the "Test Webhook" button to verify
5. **Note**: This is for testing only - entries won't be automatically added to your wheel

**Option 4: Deploy to Vercel Instead**

For the full integrated experience with working API routes:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (will ask for project configuration)
vercel --prod
```

Vercel provides:
- Free tier with serverless functions
- Automatic HTTPS
- Built-in API route support
- No external webhook service needed

**Testing Your Webhook**

After configuring your webhook URL in Settings:

1. Click the "Test Webhook Connection" button
2. Check your webhook service dashboard for the test request
3. Verify the payload format matches expectations
4. The test sends:
```json
{
  "name": "Test User",
  "fee": 5.0,
  "platform": "twitch",
  "userId": "test-user-123"
}
```

**Integration Example Code**

GameWheel Settings displays a ready-to-copy cURL example:
```bash
curl -X POST your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PlayerName",
    "fee": 5.0,
    "platform": "twitch",
    "userId": "user123"
  }'
```

Adapt this for your chat bot or streaming platform integration.

#### Troubleshooting GitHub Pages

**Site not loading?**
- Verify GitHub Pages is enabled in repository settings
- Check that deployment workflow completed successfully (Actions tab)
- Ensure repository is public (or you have GitHub Pro for private repo pages)
- Clear browser cache and try incognito mode

**404 Errors on page refresh?**
- This is normal for GitHub Pages with single-page apps
- The app uses client-side routing which handles this automatically
- Users should bookmark the main URL, not subpages

**Build failing?**
- Check the Actions tab for error messages
- Ensure all dependencies are listed in `package.json`
- Verify `next.config.js` has `output: 'export'`

**Styles not loading?**
- Confirm `basePath` is set correctly in `next.config.js`
- Check browser console for 404 errors on CSS files
- Verify deployment completed successfully

### Alternative Hosting Options (For Full Features)

If you need the chat integration API endpoint, deploy to a platform with serverless function support:

#### Vercel (Recommended for Full Features)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```
- Supports Next.js API routes out of the box
- Automatic deployments on git push
- Free tier available
- Custom domains supported

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```
- Good for static sites
- Netlify Functions for API routes (requires adaptation)
- Free tier available

#### Cloudflare Pages
- Connect your GitHub repository
- Build command: `npm run build`
- Output directory: `out`
- Cloudflare Workers for API functionality (requires adaptation)
- Free tier with unlimited bandwidth

#### Custom Server
Deploy the `out` directory to any static hosting:
- Amazon S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Your own web server (nginx, Apache)

## Migration from v1.x

If you're upgrading from Wheel of Names v1.x:

1. Your localStorage data will be automatically migrated
2. New settings (game mode, terminology, chat integration) will use defaults
3. Existing entries and history are preserved
4. Storage key changed from `wheel-of-names-storage` to `gamewheel-storage`

## Use Cases

- **Streamers**: Integrate with Twitch chat for paid entry giveaways
- **Educators**: Random student selection with custom terminology
- **Event Organizers**: Raffle drawings with elimination tournaments
- **Game Masters**: D&D initiative order or random encounters
- **Teams**: Fair task assignment or team member selection
- **Content Creators**: Audience engagement and interactive content

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with modern web technologies for performance and features
- Inspired by community feedback and feature requests
- Created as a demonstration of full-stack development capabilities

## Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the built-in tutorial (shown on first visit)

---

Made with ❤️ by Bill Crandell

**Star ⭐ this repo if you find it useful!**
