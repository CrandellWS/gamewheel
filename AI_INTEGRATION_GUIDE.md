# AI Image Generation Integration Guide

**Status**: Planned for v2.2.0
**Last Updated**: 2025-01-14

This guide explains how to integrate AI image generation services with GameWheel for custom background artwork. While the feature is currently in development, this documentation will help you prepare for the upcoming release.

## Overview

GameWheel will support three major AI image generation platforms:
1. **Google Imagen** - Google's text-to-image AI
2. **DALL-E** - OpenAI's image generation model
3. **Stability AI** - Open-source Stable Diffusion models

## Feature Architecture

### Current Implementation Status

**Completed**:
- Type definitions in `/app/types/index.ts`
- Data structure for `CustomBackground` interface
- State management in Zustand store
- localStorage persistence support

**In Development**:
- UI controls in Settings panel
- Image upload and preview
- AI service integration
- OAuth authentication flows
- Background rendering in Wheel component

### Data Structure

```typescript
interface CustomBackground {
  pageBackground: string | null; // URL or data URI
  wheelBackground: string | null; // URL or data URI
  pageBackgroundOpacity: number; // 0-1
  wheelBackgroundOpacity: number; // 0-1
  wheelBackgroundBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  wheelBackgroundRotates: boolean; // Whether wheel background rotates with wheel
}
```

## Integration Roadmap

### Phase 1: Manual Upload (v2.2.0)
- Image file upload (drag & drop)
- Preview before applying
- Opacity controls (0-100%)
- Blend mode selector
- Rotation toggle
- Clear/reset functionality

### Phase 2: AI Generation (v2.3.0)
- Text prompt input
- Service selection (Google/OpenAI/Stability)
- OAuth authentication
- Image generation with progress
- Save to wheel configuration

### Phase 3: Advanced Features (v2.4.0)
- Image history and favorites
- Style presets
- Batch generation
- Image editing tools
- Community gallery

## Google Imagen Setup

### Prerequisites
- Google Cloud Platform account
- Vertex AI API enabled
- OAuth 2.0 credentials

### Step-by-Step Setup

#### 1. Create Google Cloud Project

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize and login
gcloud init
gcloud auth login
```

#### 2. Enable Vertex AI API

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
```

#### 3. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** > **Credentials**
3. Click **Create Credentials** > **OAuth client ID**
4. Choose **Web application**
5. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
7. Download the credentials JSON

#### 4. Configure Environment Variables

Create `.env.local`:

```bash
# Google Imagen
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_LOCATION=us-central1

# NextAuth (for OAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

#### 5. Test API Access

```javascript
// Test script (not yet in codebase)
import { ImageGenerationClient } from '@google-cloud/vertexai';

const client = new ImageGenerationClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION,
});

const response = await client.generateImages({
  prompt: 'A colorful spinning wheel background',
  numberOfImages: 1,
  aspectRatio: '1:1',
});

console.log('Generated image:', response.images[0]);
```

### Cost Considerations

**Google Imagen Pricing** (as of 2025):
- Image generation: ~$0.02-0.04 per image
- Free tier: First 100 images/month (check current limits)
- Quota management available in Cloud Console

**Recommendations**:
- Set up billing alerts
- Implement rate limiting (max 10 generations/day per user)
- Cache generated images
- Use preview/thumbnail before full generation

## OpenAI DALL-E Setup

### Prerequisites
- OpenAI account
- API key with billing enabled
- DALL-E access

### Step-by-Step Setup

#### 1. Get API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy and save securely (shown only once)

#### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# OpenAI DALL-E
OPENAI_API_KEY=sk-...your-secret-key...
OPENAI_ORG_ID=org-...your-org-id... # Optional
```

#### 3. Test API Access

```javascript
// Test script (not yet in codebase)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "A vibrant spinning wheel background with colorful patterns",
  n: 1,
  size: "1024x1024",
  quality: "standard",
});

console.log('Generated image:', response.data[0].url);
```

### Cost Considerations

**DALL-E 3 Pricing** (as of 2025):
- Standard quality (1024x1024): $0.040 per image
- HD quality (1024x1024): $0.080 per image
- No free tier

**Recommendations**:
- Start with standard quality
- Implement strict rate limits
- Consider image caching
- Set up usage alerts

### Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use server-side API routes only**
3. **Implement request validation**
4. **Add user authentication**
5. **Monitor usage and costs**

## Stability AI Setup

### Prerequisites
- Stability AI account
- API key
- Credits purchased

### Step-by-Step Setup

#### 1. Get API Key

1. Visit [Stability AI Platform](https://platform.stability.ai)
2. Sign up or log in
3. Navigate to **API Keys**
4. Generate new key
5. Purchase credits

#### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# Stability AI
STABILITY_API_KEY=sk-...your-api-key...
STABILITY_API_HOST=https://api.stability.ai
```

#### 3. Test API Access

```javascript
// Test script (not yet in codebase)
import fetch from 'node-fetch';

const response = await fetch(
  `${process.env.STABILITY_API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: 'A colorful spinning wheel background',
        },
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
    }),
  }
);

const data = await response.json();
console.log('Generated image:', data.artifacts[0]);
```

### Cost Considerations

**Stability AI Pricing** (as of 2025):
- Credit-based system
- ~3-5 credits per image (varies by model)
- $10 = 1000 credits (approximately)

**Recommendations**:
- Monitor credit usage
- Use appropriate step counts (30 is usually sufficient)
- Consider lower resolution for previews

## Privacy and Security Considerations

### Data Handling

**Local Storage**:
- Images stored as base64 data URIs in localStorage
- Maximum size: ~5-10 MB total per domain
- User data never sent to external servers (except AI generation)

**AI Service Usage**:
- Prompts are sent to AI services for generation
- Generated images are downloaded and stored locally
- Original prompts may be logged by AI providers
- Read each service's privacy policy

### User Consent

Implement clear user consent:
1. Inform users that prompts are sent to third-party AI services
2. Explain data retention policies
3. Provide opt-out options
4. Link to privacy policies

### Recommended Disclaimers

```
Before generating AI images:
- Your text prompt will be sent to [Service Name] for processing
- Generated images are stored locally in your browser
- [Service Name] may retain your prompts per their privacy policy
- You are responsible for the content you generate
- Do not use copyrighted or inappropriate content in prompts
```

## Implementation Checklist

### Backend (v2.2.0)
- [ ] Create API route: `/api/ai/generate-image`
- [ ] Implement Google OAuth flow
- [ ] Add OpenAI API integration
- [ ] Add Stability AI integration
- [ ] Implement rate limiting (per user)
- [ ] Add error handling and logging
- [ ] Set up usage tracking
- [ ] Create admin dashboard for monitoring

### Frontend (v2.2.0)
- [ ] Add "Custom Background" section to Settings
- [ ] Image upload component with drag & drop
- [ ] Opacity sliders (0-100%)
- [ ] Blend mode selector dropdown
- [ ] "Rotate with wheel" toggle
- [ ] Preview panel
- [ ] Clear/reset buttons
- [ ] File size validation (<5 MB)

### AI Generation UI (v2.3.0)
- [ ] AI service selector (Google/OpenAI/Stability)
- [ ] Text prompt input (max 500 chars)
- [ ] OAuth authentication buttons
- [ ] Generation progress indicator
- [ ] Generated image preview
- [ ] "Apply to wheel" button
- [ ] "Save for later" functionality
- [ ] Generation history

### Testing
- [ ] Test image upload with various formats
- [ ] Test opacity and blend modes
- [ ] Test rotation with wheel
- [ ] Test localStorage limits
- [ ] Test OAuth flows
- [ ] Test each AI service integration
- [ ] Test error handling
- [ ] Test mobile responsiveness

## Troubleshooting

### Common Issues

#### Google Imagen

**Error: "Project not found"**
- Solution: Verify PROJECT_ID in environment variables
- Check: `gcloud config get-value project`

**Error: "API not enabled"**
- Solution: Enable Vertex AI API
- Command: `gcloud services enable aiplatform.googleapis.com`

**Error: "Authentication failed"**
- Solution: Regenerate OAuth credentials
- Check: Authorized origins match your domain

#### OpenAI DALL-E

**Error: "Invalid API key"**
- Solution: Verify key is correct and active
- Check: Key hasn't been revoked in OpenAI dashboard

**Error: "Rate limit exceeded"**
- Solution: Implement request throttling
- Wait: Rate limits reset periodically

**Error: "Insufficient quota"**
- Solution: Add credits to OpenAI account
- Check: Billing settings in dashboard

#### Stability AI

**Error: "Insufficient credits"**
- Solution: Purchase more credits
- Check: Current balance in dashboard

**Error: "Invalid model"**
- Solution: Use correct model ID
- Reference: API documentation for current models

### Performance Issues

**Slow image loading**:
- Use smaller image sizes (512x512 or 768x768)
- Compress images before storing
- Implement lazy loading

**localStorage full**:
- Clear old images periodically
- Implement image compression
- Warn users when approaching limit
- Provide export option

**High costs**:
- Implement strict rate limiting
- Cache generated images
- Use lower quality/resolution options
- Add cost warnings to UI

## Example Prompts

### Good Prompts for Wheel Backgrounds

**Colorful & Fun**:
- "Vibrant rainbow gradient with subtle stars, perfect for a spinning wheel"
- "Colorful confetti explosion pattern on a dark background"
- "Neon lights geometric pattern, circular design, bright colors"

**Themed**:
- "Medieval fantasy theme, parchment texture with golden borders"
- "Futuristic cyberpunk neon grid, dark background with purple and blue"
- "Tropical paradise theme, palm trees and sunset colors"

**Elegant**:
- "Luxury gold and black marble texture, seamless pattern"
- "Royal purple velvet with gold accents and subtle shimmer"
- "Classic casino style, red and gold ornate design"

### Prompt Tips

1. **Be specific**: Include colors, style, mood
2. **Mention "background" or "pattern"**: Helps AI understand context
3. **Use style keywords**: "seamless", "circular", "radial"
4. **Avoid text**: AI-generated text is often garbled
5. **Keep it simple**: Fewer elements = better results

## Resources

### Documentation
- [Google Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Stability AI API Docs](https://platform.stability.ai/docs/api-reference)

### Libraries
- `@google-cloud/vertexai` - Google Imagen client
- `openai` - Official OpenAI SDK
- `node-fetch` - HTTP client for Stability AI

### Community
- [GameWheel GitHub Discussions](https://github.com/CrandellWS/gamewheel/discussions)
- [Next.js Discord](https://discord.gg/nextjs)
- [OpenAI Community Forum](https://community.openai.com)

## Support

If you encounter issues with AI integration:

1. Check this guide's troubleshooting section
2. Review the relevant API documentation
3. Search [GitHub Issues](https://github.com/CrandellWS/gamewheel/issues)
4. Open a new issue with:
   - Error message (redact API keys!)
   - Steps to reproduce
   - Environment details
   - Expected vs actual behavior

## Roadmap

### v2.2.0 (Q1 2025)
- Manual image upload
- Opacity and blend controls
- Basic background rendering

### v2.3.0 (Q2 2025)
- Google Imagen integration
- OpenAI DALL-E integration
- OAuth authentication

### v2.4.0 (Q3 2025)
- Stability AI integration
- Image history
- Advanced editing tools
- Community gallery

---

**Note**: This guide describes planned features. Implementation details may change. Always refer to the latest documentation in the repository.

**Contributing**: Have experience with AI image generation? We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**License**: This guide is part of GameWheel, licensed under MIT License.
