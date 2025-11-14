# GameWheel Quick Start Guide 🎡

Get up and running with GameWheel in minutes!

## Installation (1 minute)

```bash
# Clone the repository
git clone https://github.com/crandellws/gamewheel.git
cd gamewheel

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser. Done! 🎉

## First Time Setup (2 minutes)

### 1. Add Your Entries
- Type a name in the input field
- Click "Add" or press Enter
- Repeat for all participants

**Quick Tip:** Click "Bulk Add" to paste multiple names at once!

### 2. Choose Your Game Mode
- Press `S` to open Settings
- Select **First Win** (traditional) or **Last Remaining** (elimination)
- Click outside to close

### 3. Customize (Optional)
- Change terminology: Settings → Terminology → Select or enter custom
- Adjust colors: Click the color box next to any entry
- Set weights: Hover over entry → adjust weight (1-10)

### 4. Spin!
- Press `Space` or click the Spin button
- Watch the wheel spin
- Click "Continue" when winner is shown

## Game Modes Explained

### 🎯 First Win (Traditional)
Perfect for: Giveaways, raffles, simple selections

**How it works:**
1. Spin the wheel
2. Selected entry wins
3. Winner can optionally be removed
4. Repeat for more winners

**Settings:**
- Toggle "Remove winners after spin" on/off

### 🔥 Last Remaining (Elimination)
Perfect for: Tournaments, battle royale, competitive events

**How it works:**
1. Spin the wheel
2. Selected entry is eliminated
3. Eliminated entry is removed
4. Repeat until one remains
5. Final entry is the ultimate winner

**Visual Indicators:**
- Eliminated entries show red ❌ badge in history
- Removed entries section shows all eliminations
- Click "Reset All" to restore eliminated entries

## Chat Integration Setup (5 minutes)

### Enable Integration
1. Press `S` to open Settings
2. Scroll to "Chat Integration"
3. Toggle "Enable chat submissions"
4. Set minimum fee (e.g., $5.00)
5. Enable platforms (Twitch, Discord, YouTube)
6. Copy the webhook URL

### Connect Your Bot

**For Twitch (using StreamElements):**
```
1. Go to StreamElements dashboard
2. Create custom command or channel points reward
3. Set up webhook action
4. Paste GameWheel webhook URL
5. Configure payload:
   {
     "name": "${user.name}",
     "fee": ${amount},
     "platform": "twitch",
     "userId": "${user.id}"
   }
```

**For Discord:**
```javascript
// In your Discord bot
const webhookUrl = 'https://your-gamewheel-url/api/chat-submit';

client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === 'enter-wheel') {
    const name = interaction.options.getString('name');

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        fee: 5.0,
        platform: 'discord',
        userId: interaction.user.id
      })
    });
  }
});
```

**Test Your Integration:**
```bash
curl -X POST https://your-domain/api/chat-submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestPlayer",
    "fee": 5.0,
    "platform": "twitch",
    "userId": "test123"
  }'
```

## Keyboard Shortcuts

Master GameWheel with these shortcuts:

| Key | Action |
|-----|--------|
| `Space` or `Enter` | Spin the wheel |
| `S` | Open settings |
| `D` | Toggle dark mode |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modals |

## Common Use Cases

### Classroom Teacher
```
1. Set terminology to "Students"
2. Use First Win mode
3. Enable "Remove winners" for fair selection
4. Press Space to randomly call on students
```

### Twitch Streamer
```
1. Set terminology to "Viewers"
2. Enable chat integration
3. Set minimum fee to $5
4. Use Last Remaining for tournament
5. Let viewers enter via channel points
```

### Event Organizer
```
1. Bulk add all raffle ticket holders
2. Set weights based on ticket count
3. Use First Win mode
4. Export history as CSV for records
```

## Tips & Tricks

### 💡 Probability Weighting
- Default weight is 1
- Higher weight = higher chance to win
- Weight 10 entry is 10x more likely than weight 1
- Great for giving bonus chances

### 💡 Bulk Operations
- Paste comma-separated: `Alice, Bob, Charlie`
- Paste line-separated:
  ```
  Alice
  Bob
  Charlie
  ```
- Mix formats - both work!

### 💡 Data Management
- Everything auto-saves to browser
- Export configuration to share wheels
- Import to switch between different events
- Export history to CSV for records

### 💡 Customization
- Click color box to change entry color
- Use custom terminology for any context
- Adjust spin duration for drama
- Toggle confetti for celebrations

## Troubleshooting

**Wheel won't spin?**
- Check if entries exist (need at least 1)
- Ensure wheel isn't already spinning
- Try refreshing the page

**Chat integration not working?**
- Verify webhook URL is correct
- Check that integration is enabled
- Test endpoint with cURL first
- Check browser console for errors

**History not showing?**
- Spins are limited to last 50 results
- Older results are still in export
- Clear history if needed (Settings)

**Dark mode toggle not working?**
- Press `D` or click moon/sun icon
- Preference saved automatically
- Works per device

## Production Deployment

### Quick Deploy to GitHub Pages (2 minutes)

Perfect for getting GameWheel online fast!

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy GameWheel"
git push origin main

# 2. Enable GitHub Pages
# Go to: Settings → Pages → Source: "GitHub Actions"

# 3. Wait for deployment (2-3 minutes)
# Your site: https://crandellws.github.io/gamewheel/
```

**What works on GitHub Pages:**
- All wheel features (spin, weights, colors)
- History and CSV export
- Settings and customization
- Dark mode and keyboard shortcuts
- Export/import configurations

**What doesn't work on GitHub Pages:**
- Chat integration API (`/api/chat-submit`)
- Need this? Deploy to Vercel instead (see below)

### Deploy to Vercel (For Chat Integration)

Use Vercel if you need the chat integration API:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Benefits: Full API support, custom domains, auto-deployments

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy --prod --dir=out
```

### Other Options

See the full [README.md](./README.md) deployment section for:
- Cloudflare Pages
- Custom servers
- Detailed troubleshooting

## Getting Help

- 📖 Read the full [README.md](./README.md)
- 📝 Check [CHANGELOG.md](./CHANGELOG.md) for version history
- 🐛 Report issues on GitHub
- ❓ Press `?` in-app for keyboard shortcuts

## What's Next?

- Explore game modes and find your favorite
- Set up chat integration for your platform
- Customize colors and weights
- Share your wheel configuration with others
- Try elimination mode for competitive events

---

**Ready to spin?** Press `Space` and let fate decide! 🎡

Made with ❤️ by Bill Crandell
