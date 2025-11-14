# AI Image Generation - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           GameWheel App                              │
│                        (GitHub Pages / Static)                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌──────────────────────┐
        │   Settings Component   │       │   Page Component     │
        │   (Settings.tsx)       │       │   (page.tsx)         │
        └───────────────────────┘       └──────────────────────┘
                    │                               │
                    │ Opens Modal                   │
                    ▼                               │
        ┌───────────────────────┐                  │
        │  AIImageGenerator     │                  │
        │  Component            │                  │
        │  (AIImageGenerator.tsx)│                 │
        └───────────────────────┘                  │
                    │                               │
                    │ Uses Types                    │
                    ▼                               │
        ┌───────────────────────┐                  │
        │  Type Definitions      │                  │
        │  (ai-integration.ts)   │                  │
        └───────────────────────┘                  │
                    │                               │
                    │                               │
        ┌───────────┴───────────────┐              │
        │                           │              │
        ▼                           ▼              │
┌───────────────┐         ┌──────────────────┐    │
│ sessionStorage│         │  Provider Status  │    │
│               │         │   Management      │    │
│ - API Keys    │         │                   │    │
│ - OAuth Token │         │ - isAuthenticated │    │
│ - Client ID   │         │ - apiKeySet       │    │
└───────────────┘         └──────────────────┘    │
        │                           │              │
        │                           │              │
        └───────────┬───────────────┘              │
                    │                               │
                    │ Generate Image                │
                    ▼                               │
        ┌───────────────────────┐                  │
        │   API Integration     │                  │
        │   (Client-Side)       │                  │
        └───────────────────────┘                  │
                    │                               │
        ┌───────────┴───────────────┐              │
        │                           │              │
        ▼                           ▼              │
┌───────────────┐         ┌──────────────────┐    │
│  OAuth Flow   │         │  Direct API Call │    │
│  (Google)     │         │  (OpenAI/Stability)│   │
│               │         │                   │    │
│ 1. Popup      │         │ 1. Fetch with    │    │
│ 2. Auth       │         │    API key        │    │
│ 3. Token      │         │ 2. Get response   │    │
└───────────────┘         └──────────────────┘    │
        │                           │              │
        │                           │              │
        └───────────┬───────────────┘              │
                    │                               │
                    │ Image Response                │
                    ▼                               │
        ┌───────────────────────┐                  │
        │   Image Processing    │                  │
        │                       │                  │
        │ - URL or Base64       │                  │
        │ - Convert to Blob URL │                  │
        │ - Store in state      │                  │
        └───────────────────────┘                  │
                    │                               │
                    │ Apply to Background           │
                    ▼                               │
        ┌───────────────────────┐                  │
        │   Background Settings │◄─────────────────┘
        │                       │
        │ - pageBackground      │
        │ - wheelBackground     │
        └───────────────────────┘
```

## Data Flow

```
User Action → Component State → sessionStorage → API Call → Response → Blob URL → Background
```

### Detailed Flow

```
1. User Opens AI Generator
   └─→ Settings → setShowAIGenerator(true)
   └─→ AIImageGenerator mounts

2. User Selects Provider
   └─→ setSelectedProvider('openai-dalle')
   └─→ Check providerStatus[provider].isAuthenticated

3. User Authenticates
   ├─→ API Key Providers:
   │   └─→ User enters key
   │   └─→ saveApiKey() → sessionStorage.setItem()
   │   └─→ Update providerStatus
   │
   └─→ OAuth Providers:
       └─→ User clicks "Sign in with Google"
       └─→ Open popup window
       └─→ Google auth flow
       └─→ Extract token from URL
       └─→ sessionStorage.setItem('ai_google_token', token)
       └─→ Update providerStatus

4. User Enters Prompt
   └─→ setPrompt('A magical wheel...')
   └─→ setSelectedStyle('gaming')
   └─→ setImageSize('1024x1024')

5. User Clicks Generate
   └─→ generateImage()
   └─→ Validate authentication
   └─→ Build API request
   └─→ fetch(apiEndpoint, { headers: { Authorization: ... } })
   └─→ await response
   └─→ Process response (URL or base64)
   └─→ Create blob URL if needed
   └─→ setGeneratedImage({ url, prompt, ... })

6. User Applies Image
   └─→ handleApplyImage('page' | 'wheel')
   └─→ onImageGenerated(imageUrl, applyTo)
   └─→ Settings.updateSettings({
       customBackground: {
         [pageBackground | wheelBackground]: imageUrl
       }
     })
   └─→ Modal closes
   └─→ Background updates in UI
```

## Component Hierarchy

```
App (page.tsx)
│
├── Settings
│   │
│   └── AIImageGenerator [Modal]
│       │
│       ├── Provider Selection Grid
│       │   ├── OpenAI DALL-E Card
│       │   ├── Stability AI Card
│       │   ├── Google Imagen Card
│       │   └── Local Model Card
│       │
│       ├── Authentication Section
│       │   ├── API Key Input (OpenAI/Stability)
│       │   ├── OAuth Button (Google)
│       │   └── Status Indicator
│       │
│       ├── Prompt Input
│       │   ├── Textarea
│       │   └── Character Counter
│       │
│       ├── Style Presets Grid
│       │   ├── photo-realistic
│       │   ├── artistic
│       │   ├── abstract
│       │   ├── gaming
│       │   ├── cartoon
│       │   ├── cyberpunk
│       │   ├── fantasy
│       │   └── minimalist
│       │
│       ├── Size Selection
│       │   ├── 512x512 Button
│       │   └── 1024x1024 Button
│       │
│       ├── Generate Button
│       │   └── Loading Spinner
│       │
│       └── Image Preview [Conditional]
│           ├── Generated Image
│           ├── Apply to Page BG Button
│           ├── Apply to Wheel BG Button
│           └── Download Button
│
└── Wheel
    └── Custom Background Display
```

## State Management

```
AIImageGenerator Component State:
┌────────────────────────────────────────┐
│ selectedProvider: AIProvider           │
│ prompt: string                         │
│ selectedStyle: StylePreset             │
│ imageSize: '512x512' | '1024x1024'     │
│ isGenerating: boolean                  │
│ generatedImage: GeneratedImage | null  │
│ providerStatus: Record<...>            │
│ openaiApiKey: string                   │
│ stabilityApiKey: string                │
│ googleClientId: string                 │
└────────────────────────────────────────┘
```

## Storage Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser Storage                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  sessionStorage (Temporary - Clears on close)           │
│  ├── ai_openai_key: "sk-..."                           │
│  ├── ai_stability_key: "sk-..."                        │
│  ├── ai_google_token: "ya29...."                       │
│  └── ai_google_client_id: "123456.apps..."            │
│                                                          │
│  localStorage (NOT USED - Security)                     │
│  └── [No AI credentials stored]                        │
│                                                          │
│  Memory (Component State - Cleared on unmount)         │
│  ├── generatedImage (blob URL)                         │
│  ├── providerStatus                                    │
│  └── UI state                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Input Validation                              │
│  ├── Validate API key format                           │
│  ├── Sanitize prompts                                  │
│  └── Check authentication status                       │
│                                                          │
│  Layer 2: Storage Security                             │
│  ├── sessionStorage (auto-clears)                      │
│  ├── No localStorage usage                             │
│  └── No server-side storage                            │
│                                                          │
│  Layer 3: Network Security                             │
│  ├── HTTPS enforcement                                 │
│  ├── Direct browser-to-provider                        │
│  └── No proxy/middleware                               │
│                                                          │
│  Layer 4: User Awareness                               │
│  ├── Security warnings displayed                       │
│  ├── Clear credential management                       │
│  └── Privacy notices                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## API Integration Flow

```
OpenAI DALL-E Flow:
──────────────────
Browser
  │
  ├─→ POST https://api.openai.com/v1/images/generations
  │   Headers: { Authorization: "Bearer sk-..." }
  │   Body: { model, prompt, size }
  │
  ├─→ Response: { data: [{ url: "https://..." }] }
  │
  └─→ Direct URL (no conversion needed)


Stability AI Flow:
─────────────────
Browser
  │
  ├─→ POST https://api.stability.ai/v1/generation/...
  │   Headers: { Authorization: "Bearer sk-..." }
  │   Body: { text_prompts, width, height }
  │
  ├─→ Response: { artifacts: [{ base64: "iVBOR..." }] }
  │
  └─→ Convert base64 → Blob → URL.createObjectURL()


Google Imagen Flow:
──────────────────
Browser
  │
  ├─→ OAuth Popup
  │   └─→ Google Auth
  │       └─→ Access Token (ya29...)
  │
  ├─→ POST https://generativelanguage.googleapis.com/...
  │   Headers: { Authorization: "Bearer ya29..." }
  │   Body: { instances, parameters }
  │
  ├─→ Response: { predictions: [{ bytesBase64Encoded }] }
  │
  └─→ Convert base64 → Blob → URL.createObjectURL()


Local Model Flow:
────────────────
Browser
  │
  ├─→ POST http://localhost:7860/sdapi/v1/txt2img
  │   Headers: { Content-Type: "application/json" }
  │   Body: { prompt, steps, width, height }
  │
  ├─→ Response: { images: ["base64..."] }
  │
  └─→ Convert base64 → Blob → URL.createObjectURL()
```

## Error Handling Flow

```
User Action
    │
    ▼
Validation
    │
    ├─→ ✅ Valid → Continue
    │
    └─→ ❌ Invalid
        └─→ toast.error("Message")
        └─→ Update UI
        └─→ Return

API Call
    │
    ▼
try/catch
    │
    ├─→ ✅ Success
    │   └─→ Process response
    │   └─→ Update state
    │   └─→ toast.success()
    │
    └─→ ❌ Error
        └─→ Parse error message
        └─→ Update providerStatus
        └─→ toast.error()
        └─→ Log to console (development)
        └─→ Do NOT expose sensitive data
```

## File Dependencies

```
AIImageGenerator.tsx
    │
    ├─→ Imports
    │   ├─→ react
    │   ├─→ framer-motion
    │   ├─→ lucide-react (icons)
    │   ├─→ react-hot-toast
    │   └─→ ../types/ai-integration
    │
    └─→ Used By
        └─→ Settings.tsx

Settings.tsx
    │
    ├─→ Imports
    │   ├─→ AIImageGenerator
    │   ├─→ useWheelStore
    │   └─→ framer-motion
    │
    └─→ Used By
        └─→ page.tsx (main app)

ai-integration.ts
    │
    ├─→ Exports
    │   ├─→ Type definitions
    │   ├─→ Interfaces
    │   ├─→ Constants (STYLE_PRESETS)
    │   └─→ Provider configs
    │
    └─→ Used By
        └─→ AIImageGenerator.tsx
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Repository                      │
│                  (Source Code)                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Push
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   GitHub Actions                         │
│                  (CI/CD Pipeline)                        │
│                                                          │
│  1. npm install                                         │
│  2. npm run build                                       │
│  3. npm run export (static files)                      │
│  4. Deploy to gh-pages branch                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Deploy
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   GitHub Pages                           │
│              (Static File Hosting)                       │
│                                                          │
│  ├── index.html                                         │
│  ├── _next/static/...                                   │
│  └── out/...                                            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   User's Browser                         │
│                                                          │
│  ├── React App loads                                    │
│  ├── AIImageGenerator component                        │
│  ├── sessionStorage management                         │
│  └── Direct API calls to providers                     │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTPS API Calls
                        ▼
┌─────────────────────────────────────────────────────────┐
│              AI Provider APIs                            │
│                                                          │
│  ├── OpenAI (api.openai.com)                           │
│  ├── Stability AI (api.stability.ai)                   │
│  ├── Google (generativelanguage.googleapis.com)        │
│  └── Local (localhost:7860)                            │
└─────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Client-Side Only
**Decision:** All logic runs in browser, no server-side code

**Rationale:**
- GitHub Pages compatibility
- No server costs
- Simpler deployment
- User controls own credentials

### 2. sessionStorage for Credentials
**Decision:** Use sessionStorage instead of localStorage

**Rationale:**
- Auto-clears on browser close
- Reduces credential exposure risk
- Forces user awareness
- Better security posture

### 3. Direct API Calls
**Decision:** Browser calls AI providers directly (no proxy)

**Rationale:**
- No server required
- Faster response (no hop)
- User pays provider directly
- No GameWheel API costs

### 4. OAuth Implicit Flow
**Decision:** Use OAuth 2.0 Implicit Flow for Google

**Rationale:**
- Appropriate for client-side apps
- No server to store client secret
- Short-lived tokens
- Industry standard for SPAs

### 5. Blob URLs for Images
**Decision:** Convert responses to blob URLs

**Rationale:**
- Works with all providers
- Memory efficient
- Compatible with background settings
- No external hosting needed

## Performance Considerations

```
Component Load Time:
├─→ AIImageGenerator: ~50ms (initial mount)
├─→ Provider selection: Instant (pre-rendered)
└─→ Authentication check: ~10ms (sessionStorage read)

Image Generation Time:
├─→ OpenAI DALL-E: 10-20 seconds
├─→ Stability AI: 15-30 seconds
├─→ Google Imagen: 10-20 seconds
└─→ Local Model: 30s - several minutes

Image Processing:
├─→ Base64 to Blob: ~100ms
├─→ URL.createObjectURL: ~10ms
└─→ Apply to background: Instant

Memory Usage:
├─→ Component state: ~1KB
├─→ Blob URL (1024x1024 PNG): ~1-3MB
└─→ sessionStorage: <1KB
```

## Scalability

```
Current Architecture:
├─→ Handles: Unlimited users (static hosting)
├─→ Cost: $0 infrastructure
├─→ Limits: Provider API rate limits only
└─→ Bottleneck: User's API quota/spending

Future Considerations:
├─→ Image caching: Could add to sessionStorage
├─→ Batch generation: Could parallelize requests
├─→ Template library: Could add pre-made prompts
└─→ History: Could store recent generations
```

---

This architecture provides a secure, scalable, and GitHub Pages-compatible solution for AI image generation in GameWheel.
