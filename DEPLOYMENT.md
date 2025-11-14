# GameWheel Deployment Guide

Complete guide for deploying GameWheel to various hosting platforms.

## Table of Contents

- [GitHub Pages Deployment](#github-pages-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
- [Chat Integration Setup](#chat-integration-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## GitHub Pages Deployment

**Best for:** Quick static hosting, personal projects, demos
**Chat Integration:** Not supported (static hosting only)
**Cost:** Free

### Prerequisites

- GitHub account
- Repository pushed to GitHub
- GitHub Actions enabled (default for new repos)

### Step-by-Step Instructions

#### 1. Prepare Your Repository

```bash
# Ensure you're on the main branch
git checkout main

# Commit all changes
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

#### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - You should see: "GitHub Actions will automatically deploy from your workflow file"

#### 3. Verify Workflow File

Ensure `.github/workflows/deploy.yml` exists with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

#### 4. Trigger Deployment

```bash
# Push any change to trigger deployment
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

#### 5. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Deployment typically takes 2-3 minutes
4. Green checkmark = successful deployment

#### 6. Access Your Site

Your site will be available at:
```
https://CrandellWS.github.io/gamewheel/
```

### Configuration Details

#### basePath Setting

The project uses `basePath: '/gamewheel'` in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/gamewheel' : '',
  // ...
}
```

This ensures all assets load correctly under the `/gamewheel/` path on GitHub Pages.

#### Custom Domain (Optional)

To use a custom domain like `gamewheel.yourdomain.com`:

1. Add a `CNAME` file in the `public` directory:
   ```
   gamewheel.yourdomain.com
   ```

2. Update your DNS settings:
   - Add a CNAME record pointing to `CrandellWS.github.io`

3. In GitHub Settings > Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS" (after DNS propagates)

### Limitations on GitHub Pages

- **No API Routes**: The `/api/chat-submit` endpoint will not work
- **No Server-Side Logic**: GitHub Pages only serves static files
- **No Environment Variables**: All configuration must be client-side

### Features That Work

All client-side features work perfectly:
- Spinning wheel with physics simulation
- Weighted probability
- Color customization
- History tracking
- CSV export
- Configuration import/export
- Dark mode
- Keyboard shortcuts
- Local storage persistence

---

## Vercel Deployment

**Best for:** Full-featured deployment with API support
**Chat Integration:** Fully supported
**Cost:** Free tier available, scales with usage

### Quick Deploy

#### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /path/to/gamewheel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? gamewheel (or your choice)
# - Directory? ./
# - Override settings? No

# Your site will be deployed to: https://gamewheel-xxx.vercel.app
```

#### Option 2: Vercel Dashboard (Git Integration)

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Login with GitHub
3. Click "Add New Project"
4. Import your GameWheel repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `out` (auto-detected)
6. Click "Deploy"

### Configuration

Vercel automatically detects Next.js configuration. No changes needed!

The project will:
- Automatically remove `basePath` in production (Vercel deployment)
- Enable API routes at `/api/chat-submit`
- Support serverless functions

### Environment Variables (Optional)

If you add authentication or API keys later:

1. Go to Project Settings > Environment Variables
2. Add variables:
   - Key: `CHAT_API_KEY`
   - Value: Your secret key
   - Environment: Production, Preview, Development
3. Redeploy to apply changes

### Custom Domain

1. Go to Project Settings > Domains
2. Add your domain: `gamewheel.yourdomain.com`
3. Update DNS:
   - Add CNAME: `gamewheel.yourdomain.com` → `cname.vercel-dns.com`
4. Vercel auto-provisions SSL certificate

### Automatic Deployments

Every `git push` to your connected branch triggers:
- Automatic build
- Automatic deployment
- Preview URL for PRs
- Production URL for main branch

---

## Netlify Deployment

**Best for:** Static sites with optional Functions
**Chat Integration:** Requires Netlify Functions (needs adaptation)
**Cost:** Free tier available

### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=out

# Follow prompts to create new site or link existing
```

### Deploy via Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Sign up / Login
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
6. Click "Deploy site"

### Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "out"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Chat Integration on Netlify

The chat API requires Netlify Functions (serverless). To enable:

1. Create `netlify/functions/chat-submit.js`:
```javascript
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  // Your chat submission logic here
  // Return response to client

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, data })
  };
};
```

2. Update your app to call `/.netlify/functions/chat-submit` instead of `/api/chat-submit`

---

## Cloudflare Pages Deployment

**Best for:** Global edge distribution, unlimited bandwidth
**Chat Integration:** Requires Cloudflare Workers (needs adaptation)
**Cost:** Free tier with unlimited bandwidth

### Deploy via Dashboard

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up / Login
3. Click "Create a project"
4. Connect your GitHub account
5. Select your repository
6. Configure:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variables**: NODE_VERSION = 20
7. Click "Save and Deploy"

### Configuration

Create `wrangler.toml` for Workers:

```toml
name = "gamewheel"
compatibility_date = "2024-01-01"

[site]
bucket = "./out"
```

### Custom Domain

1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add domain (must be on Cloudflare DNS)
4. DNS records created automatically

---

## Chat Integration Setup

### Requirements for Chat Integration

Chat integration requires serverless function support:
- **Vercel**: Works out of the box
- **Netlify**: Requires Netlify Functions adaptation
- **Cloudflare**: Requires Workers adaptation
- **GitHub Pages**: Not supported

### Setting Up Chat Integration (Vercel)

#### 1. Enable in GameWheel

1. Open GameWheel
2. Press `S` to open Settings
3. Scroll to "Chat Integration"
4. Toggle "Enable chat submissions"
5. Set minimum fee (e.g., $5.00)
6. Enable platforms (Twitch, Discord, YouTube)
7. Copy the webhook URL

#### 2. Twitch Integration (using StreamElements)

```javascript
// StreamElements Custom Command
// Command: !enter or Channel Points Reward

// Webhook URL
https://your-gamewheel.vercel.app/api/chat-submit

// Payload
{
  "name": "${user.name}",
  "fee": ${amount},
  "platform": "twitch",
  "userId": "${user.id}"
}
```

#### 3. Discord Bot Integration

```javascript
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const WEBHOOK_URL = 'https://your-gamewheel.vercel.app/api/chat-submit';

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'enter-wheel') {
    const name = interaction.options.getString('name');

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          fee: 5.0,
          platform: 'discord',
          userId: interaction.user.id
        })
      });

      const data = await response.json();

      if (data.success) {
        await interaction.reply(`${name} entered the wheel!`);
      }
    } catch (error) {
      await interaction.reply('Failed to enter wheel');
    }
  }
});

client.login('YOUR_BOT_TOKEN');
```

#### 4. YouTube Integration

```javascript
// YouTube Chat API Integration
// Monitor for Super Chat or memberships

const WEBHOOK_URL = 'https://your-gamewheel.vercel.app/api/chat-submit';

async function handleYouTubeChat(chatMessage) {
  if (chatMessage.snippet.superChatDetails) {
    const name = chatMessage.authorDetails.displayName;
    const fee = chatMessage.snippet.superChatDetails.amountMicros / 1000000;

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        fee: fee,
        platform: 'youtube',
        userId: chatMessage.authorDetails.channelId
      })
    });
  }
}
```

### Testing Chat Integration

```bash
# Test with cURL
curl -X POST https://your-gamewheel.vercel.app/api/chat-submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestUser",
    "fee": 5.0,
    "platform": "twitch",
    "userId": "test123"
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Submission accepted",
#   "data": {
#     "entryId": "1234567890-abc123",
#     "name": "TestUser",
#     "timestamp": 1234567890
#   }
# }
```

### Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent spam
2. **API Keys**: Consider adding API key authentication
3. **CORS**: Configure CORS for specific domains only
4. **Validation**: Always validate incoming data
5. **HTTPS**: Only use HTTPS in production
6. **Payment Verification**: Verify payments on your backend before submitting

---

## Environment Variables

### Current Environment Variables

GameWheel currently doesn't require environment variables for basic deployment.

### Future Environment Variables (if adding features)

If you extend GameWheel with additional features:

```bash
# Example .env.local for development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CHAT_API_KEY=your_secret_api_key
WEBHOOK_SECRET=your_webhook_secret
```

**Vercel**: Add in Project Settings > Environment Variables
**Netlify**: Add in Site Settings > Environment Variables
**Cloudflare**: Add in Pages project > Settings > Environment Variables
**GitHub Pages**: Not supported (use client-side config only)

---

## Troubleshooting

### GitHub Pages Issues

**Problem**: Site shows 404
- **Solution**: Verify GitHub Pages is enabled (Settings > Pages)
- **Solution**: Check deployment workflow completed (Actions tab)
- **Solution**: Ensure repository is public (or GitHub Pro for private)

**Problem**: Styles not loading
- **Solution**: Verify `basePath: '/gamewheel'` in `next.config.js`
- **Solution**: Clear browser cache
- **Solution**: Check browser console for 404s

**Problem**: API endpoint not working
- **Solution**: This is expected! GitHub Pages doesn't support API routes
- **Solution**: Deploy to Vercel/Netlify for API support

### Vercel Issues

**Problem**: Build failing
- **Solution**: Check build logs in Vercel dashboard
- **Solution**: Ensure all dependencies in `package.json`
- **Solution**: Try deploying from CLI: `vercel --debug`

**Problem**: Environment variables not working
- **Solution**: Prefix client-side vars with `NEXT_PUBLIC_`
- **Solution**: Redeploy after adding variables
- **Solution**: Check variable scope (production/preview/development)

### Netlify Issues

**Problem**: Redirects not working
- **Solution**: Add `netlify.toml` with redirect rules
- **Solution**: Use `trailingSlash: true` in `next.config.js`

**Problem**: Functions not found
- **Solution**: Place functions in `netlify/functions/` directory
- **Solution**: Update function paths in your code

### Chat Integration Issues

**Problem**: Webhook not receiving data
- **Solution**: Test with cURL to verify endpoint works
- **Solution**: Check browser console for CORS errors
- **Solution**: Verify webhook URL is correct (no trailing slash issues)
- **Solution**: Ensure platform is enabled in GameWheel settings

**Problem**: Submissions not appearing in wheel
- **Solution**: Check that chat integration is enabled
- **Solution**: Verify minimum fee is met
- **Solution**: Check browser console for errors
- **Solution**: Try refreshing the page

### General Issues

**Problem**: Old version still showing after deployment
- **Solution**: Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- **Solution**: Try incognito/private browsing mode
- **Solution**: Wait a few minutes for CDN to update
- **Solution**: Check that deployment actually completed

**Problem**: localStorage data lost
- **Solution**: Check browser privacy settings
- **Solution**: Ensure not in private/incognito mode
- **Solution**: Export configuration as backup before changing browsers

---

## Platform Comparison

| Feature | GitHub Pages | Vercel | Netlify | Cloudflare |
|---------|-------------|--------|---------|------------|
| **Cost** | Free | Free tier | Free tier | Free tier |
| **API Routes** | No | Yes | With Functions | With Workers |
| **Build Time** | 2-3 min | 1-2 min | 1-2 min | 1-2 min |
| **Custom Domain** | Yes | Yes | Yes | Yes |
| **SSL** | Yes (auto) | Yes (auto) | Yes (auto) | Yes (auto) |
| **Bandwidth** | Limited | Limited | 100GB/mo | Unlimited |
| **Edge Network** | GitHub CDN | Global | Global | Global (best) |
| **Setup Difficulty** | Easy | Easiest | Easy | Medium |
| **Best For** | Demos | Full apps | Static+Functions | High traffic |

## Recommendation

- **Quick demo/personal use**: GitHub Pages
- **Full features with chat**: Vercel
- **Static with optional API**: Netlify
- **High traffic/global**: Cloudflare Pages

---

## Getting Help

- Check deployment logs in your platform's dashboard
- Review this guide's troubleshooting section
- Open an issue on GitHub
- Check platform-specific documentation:
  - [GitHub Pages Docs](https://docs.github.com/pages)
  - [Vercel Docs](https://vercel.com/docs)
  - [Netlify Docs](https://docs.netlify.com)
  - [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)

---

Made with care by Bill Crandell
