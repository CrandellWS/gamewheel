# AI Image Generation - Quick Reference

## Files Modified/Created

```
app/
├── types/
│   └── ai-integration.ts          [NEW] Type definitions
└── components/
    ├── AIImageGenerator.tsx        [NEW] Main component
    └── Settings.tsx                [MODIFIED] Added AI section

Documentation:
├── AI_IMAGE_GENERATION_SUMMARY.md
├── AI_IMAGE_GENERATION_IMPLEMENTATION.md
├── AI_IMAGE_GENERATION_SECURITY_GUIDE.md
└── AI_IMAGE_GENERATION_USER_GUIDE.md
```

## API Endpoints

| Provider | Endpoint | Auth |
|----------|----------|------|
| OpenAI | `https://api.openai.com/v1/images/generations` | API Key |
| Stability AI | `https://api.stability.ai/v1/generation/...` | API Key |
| Google Imagen | `https://generativelanguage.googleapis.com/v1/...` | OAuth |
| Local | `http://localhost:7860/sdapi/v1/txt2img` | None |

## sessionStorage Keys

```javascript
'ai_openai_key'      // OpenAI API key
'ai_stability_key'   // Stability AI API key
'ai_google_token'    // Google OAuth access token
'ai_google_client_id' // Google OAuth Client ID
```

## Component Usage

```tsx
import { AIImageGenerator } from './components/AIImageGenerator';

<AIImageGenerator
  onClose={() => setShowAIGenerator(false)}
  onImageGenerated={(imageUrl, applyTo) => {
    if (applyTo === 'page') {
      updateSettings({
        customBackground: {
          ...settings.customBackground,
          pageBackground: imageUrl,
        },
      });
    }
  }}
/>
```

## Type Definitions

```typescript
type AIProvider = 'google-imagen' | 'openai-dalle' | 'stability-ai' | 'local';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  provider: AIProvider;
  timestamp: number;
  style?: string;
}
```

## API Request Examples

### OpenAI DALL-E

```javascript
const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'dall-e-3',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1024',
  }),
});
```

### Stability AI

```javascript
const response = await fetch('https://api.stability.ai/v1/generation/...', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    text_prompts: [{ text: fullPrompt }],
    width: 1024,
    height: 1024,
  }),
});
```

### Google Imagen (OAuth)

```javascript
// 1. Open OAuth popup
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${clientId}&
  redirect_uri=${redirectUri}&
  response_type=token&
  scope=https://www.googleapis.com/auth/generative-language`;

// 2. Extract token from redirect
const token = new URLSearchParams(hash).get('access_token');

// 3. Use token for API calls
const response = await fetch(endpoint, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Style Presets

```typescript
const STYLE_PRESETS = {
  'photo-realistic': 'Photo-realistic, high quality, detailed',
  'artistic': 'Artistic, painterly, creative interpretation',
  'abstract': 'Abstract, geometric, modern art style',
  'gaming': 'Video game art style, vibrant colors, stylized',
  'cartoon': 'Cartoon style, colorful, playful',
  'cyberpunk': 'Cyberpunk, neon lights, futuristic',
  'fantasy': 'Fantasy art, magical, ethereal',
  'minimalist': 'Minimalist, clean, simple design',
};
```

## Security Checklist

- [x] API keys stored in sessionStorage (not localStorage)
- [x] Keys cleared on browser close
- [x] HTTPS enforced for all API calls
- [x] No server-side credential storage
- [x] Security warnings displayed to users
- [x] OAuth uses Implicit Flow (client-side appropriate)
- [x] No logging of prompts or API keys
- [x] Direct browser-to-provider communication

## Testing Commands

```bash
# Build project
npm run build

# Development mode
npm run dev

# Lint
npm run lint

# Export static
npm run export
```

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| "API key not set" | Enter key in auth section and click Save |
| OAuth popup blocked | Allow popups in browser settings |
| "Failed to generate" | Check API key, credits, and network |
| Local model error | Verify Automatic1111 running on :7860 |
| Image not applying | Check console for errors, regenerate |

## Cost Reference (Per Image)

| Provider | 512x512 | 1024x1024 |
|----------|---------|-----------|
| OpenAI | ~$0.02 | ~$0.04-0.08 |
| Stability AI | ~$0.03 | ~$0.05-0.10 |
| Google Imagen | Free tier | Free tier |
| Local Model | $0 | $0 |

## Provider Setup Links

- **OpenAI:** https://platform.openai.com/api-keys
- **Stability AI:** https://platform.stability.ai/account/keys
- **Google Cloud:** https://console.cloud.google.com/apis/credentials
- **Automatic1111:** https://github.com/AUTOMATIC1111/stable-diffusion-webui

## Example Prompts

```
Gaming:
"A spinning wheel in a gaming arena with RGB lights and digital displays"

Fantasy:
"An ancient mystical wheel in a wizard's tower with glowing runes"

Minimal:
"Clean geometric spinning wheel on gradient background, modern flat design"

Corporate:
"Professional business prize wheel on sleek office background"
```

## Common Patterns

### Check Authentication

```typescript
const isAuthenticated = providerStatus[selectedProvider].isAuthenticated;
if (!isAuthenticated) {
  toast.error('Please authenticate first');
  return;
}
```

### Save API Key

```typescript
sessionStorage.setItem('ai_openai_key', key);
setProviderStatus(prev => ({
  ...prev,
  'openai-dalle': { isAuthenticated: true, apiKeySet: true }
}));
```

### Convert Base64 to Blob URL

```typescript
const blob = await fetch(`data:image/png;base64,${base64Image}`)
  .then(r => r.blob());
const imageUrl = URL.createObjectURL(blob);
```

### Apply Image to Background

```typescript
updateSettings({
  customBackground: {
    ...settings.customBackground,
    [applyTo === 'page' ? 'pageBackground' : 'wheelBackground']: imageUrl,
  },
});
```

## Documentation Map

- **Users:** Read `AI_IMAGE_GENERATION_USER_GUIDE.md`
- **Developers:** Read `AI_IMAGE_GENERATION_IMPLEMENTATION.md`
- **Security:** Read `AI_IMAGE_GENERATION_SECURITY_GUIDE.md`
- **Summary:** Read `AI_IMAGE_GENERATION_SUMMARY.md`
- **Quick Ref:** This file

## Important Notes

⚠️ **sessionStorage vs localStorage:**
- ALWAYS use sessionStorage (auto-clears)
- NEVER use localStorage for API keys

⚠️ **HTTPS Required:**
- All API calls must use HTTPS
- OAuth won't work on HTTP

⚠️ **Client-Side Only:**
- No server endpoints
- Direct browser-to-provider calls
- GitHub Pages compatible

⚠️ **User Responsibility:**
- Users provide own API keys
- Users pay for API usage
- Users comply with provider terms

## Build Status

```
✅ TypeScript compilation: SUCCESS
✅ No missing dependencies
✅ GitHub Pages compatible
✅ Ready for deployment
```

---

**Quick Start:** Open Settings → AI Image Generation → Select OpenAI → Enter API key → Generate!
