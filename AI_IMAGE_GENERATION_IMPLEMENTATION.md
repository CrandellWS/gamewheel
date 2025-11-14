# AI Image Generation - Implementation Guide

## Overview

This document provides complete implementation details for the AI Image Generation feature in GameWheel. This feature allows users to generate custom backgrounds using various AI providers.

## File Structure

```
/home/aiuser/projects/gamewheel/
├── app/
│   ├── types/
│   │   └── ai-integration.ts          # Type definitions for AI integration
│   └── components/
│       ├── AIImageGenerator.tsx        # Main AI image generator component
│       └── Settings.tsx                # Updated with AI integration section
└── AI_IMAGE_GENERATION_SECURITY_GUIDE.md  # Security documentation
```

## Core Files

### 1. `/app/types/ai-integration.ts`

**Purpose:** Type definitions for AI image generation

**Key Types:**

```typescript
// Supported AI providers
type AIProvider = 'google-imagen' | 'openai-dalle' | 'stability-ai' | 'local';

// Image generation configuration
interface AIImageConfig {
  provider: AIProvider;
  prompt: string;
  style?: string;
  size?: '512x512' | '1024x1024';
  authenticated: boolean;
}

// OAuth configuration
interface OAuthConfig {
  clientId: string;
  scopes: string[];
  redirectUri: string;
}

// Generated image data
interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  provider: AIProvider;
  timestamp: number;
  style?: string;
}
```

**Style Presets:**
- photo-realistic
- artistic
- abstract
- gaming
- cartoon
- cyberpunk
- fantasy
- minimalist

**Provider Configurations:**

Each provider has:
- Name (display name)
- Auth requirements (OAuth vs API key)
- API endpoint
- Scopes (for OAuth providers)

### 2. `/app/components/AIImageGenerator.tsx`

**Purpose:** Main UI component for AI image generation

**Key Features:**

1. **Provider Selection**
   - Grid of provider cards
   - Visual indication of authentication status
   - Auto-detection of configured providers

2. **Authentication Management**
   - API key input for OpenAI and Stability AI
   - OAuth button for Google Imagen
   - Status indicators (authenticated/not authenticated)
   - Clear/logout functionality

3. **Image Generation Interface**
   - Text prompt input (textarea)
   - Style preset selection (8 presets)
   - Image size selection (512x512 or 1024x1024)
   - Generate button with loading state

4. **Image Preview and Actions**
   - Full image preview after generation
   - Apply to Page Background button
   - Apply to Wheel Background button
   - Download button

**State Management:**

```typescript
const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai-dalle');
const [prompt, setPrompt] = useState('');
const [selectedStyle, setSelectedStyle] = useState<StylePreset>('gaming');
const [imageSize, setImageSize] = useState<'512x512' | '1024x1024'>('1024x1024');
const [isGenerating, setIsGenerating] = useState(false);
const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
const [providerStatus, setProviderStatus] = useState<Record<AIProvider, AIProviderStatus>>({...});
```

**sessionStorage Keys:**

- `ai_openai_key` - OpenAI API key
- `ai_stability_key` - Stability AI API key
- `ai_google_token` - Google OAuth access token
- `ai_google_client_id` - Google OAuth Client ID

### 3. `/app/components/Settings.tsx`

**Updated Sections:**

1. **Imports**
   ```typescript
   import { Wand2 } from 'lucide-react';
   import { AIImageGenerator } from './AIImageGenerator';
   import { AnimatePresence } from 'framer-motion';
   ```

2. **New State**
   ```typescript
   const [showAIGenerator, setShowAIGenerator] = useState(false);
   ```

3. **New Section in Settings UI**
   - Added "AI Image Generation" section
   - Button to open AI Image Generator modal
   - Description text

4. **Modal Integration**
   - AnimatePresence wrapper for smooth transitions
   - onImageGenerated callback to apply images to backgrounds
   - Integration with existing customBackground settings

## API Integration Details

### OpenAI DALL-E

**Endpoint:** `https://api.openai.com/v1/images/generations`

**Request:**
```json
{
  "model": "dall-e-3",
  "prompt": "user prompt with style preset",
  "n": 1,
  "size": "1024x1024"
}
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer sk-..."
}
```

**Response:**
```json
{
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

### Stability AI

**Endpoint:** `https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`

**Request:**
```json
{
  "text_prompts": [{ "text": "user prompt" }],
  "cfg_scale": 7,
  "height": 1024,
  "width": 1024,
  "samples": 1,
  "steps": 30
}
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer sk-..."
}
```

**Response:**
```json
{
  "artifacts": [
    {
      "base64": "iVBORw0KGgo..."
    }
  ]
}
```

**Note:** Response is base64-encoded image, converted to blob URL client-side

### Google Imagen

**Endpoint:** `https://generativelanguage.googleapis.com/v1/models/imagegeneration-001:predict`

**OAuth Flow:**
1. User provides OAuth Client ID
2. Open Google OAuth popup
3. User authorizes
4. Extract access token from redirect URL hash
5. Store token in sessionStorage

**Request:**
```json
{
  "instances": [{ "prompt": "user prompt" }],
  "parameters": {
    "sampleCount": 1
  }
}
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ya29...."
}
```

### Local Model (Automatic1111)

**Endpoint:** `http://localhost:7860/sdapi/v1/txt2img`

**Requirements:**
- Automatic1111 WebUI running locally
- API enabled in settings
- CORS enabled for browser access

**Request:**
```json
{
  "prompt": "user prompt",
  "negative_prompt": "blurry, low quality",
  "steps": 20,
  "width": 1024,
  "height": 1024
}
```

**No Authentication Required**

## User Flow

### First-Time Setup

1. User opens Settings
2. Clicks "Generate AI Images for Backgrounds"
3. Selects a provider
4. Sees authentication prompt:
   - **OpenAI/Stability:** Enter API key
   - **Google:** Enter Client ID and click "Sign in with Google"
   - **Local:** No setup needed (just run Automatic1111)

### Generating an Image

1. User authenticates with provider (if not already authenticated)
2. Enters prompt: "A spinning wheel in a fantasy game with magical effects"
3. Selects style preset: "gaming"
4. Selects size: "1024x1024"
5. Clicks "Generate Image"
6. Waits for generation (loading spinner)
7. Sees image preview
8. Clicks "Page BG" or "Wheel BG" or "Download"

### Applying Generated Image

When user clicks "Page BG" or "Wheel BG":
1. Image blob URL is passed to `onImageGenerated` callback
2. Settings component updates `customBackground.pageBackground` or `customBackground.wheelBackground`
3. AI Generator modal closes
4. User sees background applied immediately

## Error Handling

### Authentication Errors

```typescript
if (!openaiApiKey) {
  toast.error('Please set your OpenAI API key first');
  return;
}
```

### API Errors

```typescript
try {
  const response = await fetch(apiEndpoint, {...});
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate image');
  }
} catch (error) {
  toast.error(error instanceof Error ? error.message : 'Failed to generate image');
  setProviderStatus(prev => ({
    ...prev,
    [provider]: { ...prev[provider], lastError: error.message }
  }));
}
```

### Network Errors

- Handled with try/catch
- Display user-friendly error messages
- Store last error in provider status
- Don't expose sensitive error details

## OAuth Implementation (Google)

### Setup Requirements

Users must:
1. Create project in Google Cloud Console
2. Enable Generative Language API
3. Configure OAuth consent screen
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URI (must match app URL)

### Client-Side Flow

```typescript
const handleGoogleLogin = () => {
  const redirectUri = window.location.origin + window.location.pathname;
  const scopes = 'https://www.googleapis.com/auth/generative-language';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${clientId}&
    redirect_uri=${redirectUri}&
    response_type=token&
    scope=${scopes}`;

  const popup = window.open(authUrl, 'Google OAuth', 'width=600,height=700');

  // Poll for token in popup URL
  const checkPopup = setInterval(() => {
    try {
      const hash = popup?.location.hash;
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        sessionStorage.setItem('ai_google_token', token);
        popup?.close();
      }
    } catch (e) {
      // Cross-origin errors expected until redirect
    }
  }, 500);
};
```

**Security Note:** This uses OAuth 2.0 Implicit Flow, which is appropriate for client-side applications where the client secret cannot be kept confidential.

## Styling and UX

### Color Scheme

- Primary: Purple gradient (`from-purple-600 to-pink-600`)
- Success: Green (`bg-green-50`, `text-green-800`)
- Warning: Amber (`bg-amber-50`, `text-amber-800`)
- Error: Red (`text-red-600`)

### Animations

- Modal entrance/exit with framer-motion
- Loading spinner during generation
- Button hover effects
- Smooth transitions

### Responsive Design

- Modal max-width: `max-w-4xl`
- Grid layouts adapt to screen size
- Touch-friendly button sizes
- Scrollable modal content

## Integration with Existing Features

### Custom Backgrounds

The AI Image Generator integrates with the existing Custom Backgrounds feature:

```typescript
onImageGenerated={(imageUrl, applyTo) => {
  if (applyTo === 'page') {
    updateSettings({
      customBackground: {
        ...settings.customBackground,
        pageBackground: imageUrl,
      },
    });
  } else if (applyTo === 'wheel') {
    updateSettings({
      customBackground: {
        ...settings.customBackground,
        wheelBackground: imageUrl,
      },
    });
  }
}}
```

The generated blob URLs work seamlessly with:
- Background opacity controls
- Blend mode selection (for wheel backgrounds)
- Background rotation toggle

## Testing

### Manual Testing Checklist

1. **Provider Selection**
   - [ ] Can select each provider
   - [ ] Selected provider is highlighted
   - [ ] Authentication status shows correctly

2. **OpenAI DALL-E**
   - [ ] Can enter API key
   - [ ] Can save API key
   - [ ] Key persists in sessionStorage
   - [ ] Can clear API key
   - [ ] Can generate image
   - [ ] Generated image displays correctly
   - [ ] Can apply to page background
   - [ ] Can apply to wheel background
   - [ ] Can download image

3. **Stability AI**
   - [ ] Same tests as OpenAI

4. **Google Imagen**
   - [ ] Can enter Client ID
   - [ ] OAuth popup opens
   - [ ] Can authenticate
   - [ ] Token stored in sessionStorage
   - [ ] Can generate image
   - [ ] Can logout

5. **Local Model**
   - [ ] Shows appropriate message if Automatic1111 not running
   - [ ] Can generate if Automatic1111 is running
   - [ ] No authentication required

6. **Security**
   - [ ] Keys cleared on browser close
   - [ ] HTTPS used for all API calls
   - [ ] Security warning displayed
   - [ ] No keys logged to console

## Known Limitations

1. **Browser Compatibility**
   - Requires modern browser with sessionStorage support
   - OAuth popup may be blocked by popup blockers
   - Blob URLs have size limits (varies by browser)

2. **Provider Limitations**
   - OpenAI DALL-E: Rate limits, costs per generation
   - Stability AI: API credits required
   - Google Imagen: OAuth setup complexity
   - Local Model: Requires local installation

3. **Image Handling**
   - Blob URLs cleared on page refresh
   - Large images may impact performance
   - No image history persistence

## Future Enhancements

### Potential Features

1. **Image History**
   - Store recent generations in sessionStorage
   - Gallery view of past images
   - Reuse previous prompts

2. **Advanced Options**
   - Negative prompts
   - Advanced parameters (steps, CFG scale)
   - Multiple image generation
   - Seed control for reproducibility

3. **Prompt Templates**
   - Pre-made prompts for common use cases
   - Prompt builder with modifiers
   - Save favorite prompts

4. **Cost Tracking**
   - Estimate API costs
   - Usage statistics
   - Spending warnings

5. **Image Editing**
   - Crop/resize before applying
   - Filters and adjustments
   - Image composition tools

## Troubleshooting

### Common Issues

**Issue:** "Please set your API key first"
- **Solution:** Enter API key in the authentication section and click Save

**Issue:** OAuth popup blocked
- **Solution:** Allow popups for this site in browser settings

**Issue:** "Failed to generate image"
- **Check:** API key is correct
- **Check:** Provider API is operational
- **Check:** Network connection is stable
- **Check:** Browser console for specific error

**Issue:** Generated image doesn't apply
- **Check:** Image was fully generated
- **Check:** Settings modal didn't close prematurely
- **Try:** Generate again and apply immediately

**Issue:** Local model not working
- **Check:** Automatic1111 is running at http://localhost:7860
- **Check:** API is enabled in Automatic1111 settings
- **Check:** CORS is enabled in Automatic1111

## Deployment Notes

### GitHub Pages

- ✅ Fully compatible
- ✅ No server-side code required
- ✅ All features work client-side
- ⚠️ Users must configure their own API keys/OAuth

### Custom Domain

- Set up HTTPS (required for OAuth)
- Configure OAuth redirect URIs
- Add to Google Cloud Console authorized origins
- Consider Content Security Policy headers

### Environment Variables

Not used/needed because:
- Client-side only implementation
- Users provide their own credentials
- No secrets to hide from users

## Support and Documentation

### User Documentation

Provide users with:
1. Links to API key signup pages
2. OAuth setup instructions
3. Cost information for paid APIs
4. Example prompts
5. Troubleshooting guide

### Developer Documentation

See:
- This file (implementation details)
- `AI_IMAGE_GENERATION_SECURITY_GUIDE.md` (security)
- Provider API documentation (OpenAI, Stability AI, Google)

## License and Attribution

### AI Provider Terms

Users must comply with:
- OpenAI Terms of Service
- Stability AI Terms of Service
- Google AI Terms of Service

### Image Rights

Generated images:
- Ownership depends on provider's terms
- Users responsible for checking usage rights
- Commercial use may have restrictions

### GameWheel License

This feature is part of GameWheel (MIT License)
- Free to use and modify
- No warranty provided
- See LICENSE file for details

## Conclusion

The AI Image Generation feature provides a powerful, secure, and user-friendly way to create custom backgrounds for GameWheel. The implementation prioritizes:

- **Security:** Client-side only, sessionStorage, HTTPS
- **Privacy:** No data collection or logging
- **Flexibility:** Multiple provider options
- **Usability:** Simple UI, clear instructions
- **Compatibility:** Works on GitHub Pages and static hosting

For security considerations, see `AI_IMAGE_GENERATION_SECURITY_GUIDE.md`.
