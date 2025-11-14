# AI Image Generation - Security Guide

## Overview

The GameWheel AI Image Generation feature allows users to generate custom backgrounds using various AI providers (Google Imagen, OpenAI DALL-E, Stability AI, and local models). This guide covers security considerations and best practices for the implementation.

## Security Architecture

### Client-Side Only Implementation

**Why Client-Side?**
- GitHub Pages and static hosting do not support server-side code
- All API calls are made directly from the user's browser
- No server-side storage of credentials or user data

**Security Benefits:**
- No central credential storage to be compromised
- Users maintain complete control of their API keys
- Minimal attack surface (no server endpoints to exploit)

### Credential Storage

#### sessionStorage (Used) ✅

**Location:** Browser sessionStorage API

**Characteristics:**
- Data is cleared when the browser tab/window is closed
- Data is isolated per-origin (domain)
- Not accessible to other tabs or windows
- Not persisted to disk in most browsers

**What We Store:**
- `ai_openai_key` - OpenAI API key (if provided)
- `ai_stability_key` - Stability AI API key (if provided)
- `ai_google_token` - Google OAuth access token
- `ai_google_client_id` - Google OAuth Client ID (public, not sensitive)

**Security Properties:**
- ✅ Cleared on browser close
- ✅ Not accessible via XSS from other domains
- ✅ Not sent in HTTP headers
- ✅ Not persisted permanently

#### Why NOT localStorage? ❌

localStorage was explicitly avoided because:
- Data persists indefinitely until manually cleared
- Increases risk of key exposure if device is compromised
- Could be accidentally committed in browser developer tools exports
- Creates false sense of security (keys should be temporary)

## Provider-Specific Security

### 1. OpenAI DALL-E

**Authentication Method:** API Key

**Security Implementation:**
```typescript
// API key stored in sessionStorage only
sessionStorage.setItem('ai_openai_key', key);

// Transmitted via Authorization header
headers: {
  'Authorization': `Bearer ${openaiApiKey}`
}
```

**Security Considerations:**
- Users provide their own API key
- Key is never sent to our servers (client-side only)
- Key is cleared when browser closes
- HTTPS required for all API calls

**User Responsibilities:**
- Keep API key secret
- Rotate key if compromised
- Monitor OpenAI usage dashboard for suspicious activity
- Use OpenAI's rate limiting and spending caps

### 2. Google Imagen

**Authentication Method:** OAuth 2.0 (Client-Side Flow)

**Security Implementation:**
```typescript
// OAuth flow using popup window
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${encodeURIComponent(clientId)}&
  redirect_uri=${encodeURIComponent(redirectUri)}&
  response_type=token&  // Implicit flow for client-side
  scope=${encodeURIComponent(scopes)}`;
```

**Security Considerations:**
- ✅ Uses OAuth 2.0 Implicit Flow (appropriate for client-side)
- ✅ Access tokens are short-lived (typically 1 hour)
- ✅ Tokens cleared on browser close
- ⚠️ User must configure OAuth consent screen in Google Cloud Console
- ⚠️ Client ID is public (this is expected and safe)

**OAuth Security Best Practices:**
- Redirect URI must match exactly what's registered in Google Cloud Console
- Use HTTPS only (enforced by Google)
- Don't request more scopes than needed
- Access tokens expire automatically

### 3. Stability AI

**Authentication Method:** API Key

**Security Implementation:**
Similar to OpenAI - API key in Authorization header, stored in sessionStorage.

**Additional Notes:**
- Stability AI returns base64-encoded images
- Images converted to blob URLs client-side
- No image data sent to our servers

### 4. Local Model (Automatic1111)

**Authentication Method:** None (localhost only)

**Security Implementation:**
```typescript
// Direct call to localhost
fetch('http://localhost:7860/sdapi/v1/txt2img', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, ... })
})
```

**Security Considerations:**
- ⚠️ No authentication (assumes trusted local environment)
- ⚠️ HTTP allowed (localhost only)
- ✅ Never exposes local network to internet
- ✅ No credentials needed

## Data Privacy

### What We Store

**sessionStorage:**
- API keys (temporary, cleared on close)
- OAuth tokens (temporary, cleared on close)

**NOT Stored Anywhere:**
- User prompts (not logged or stored)
- Generated images URLs (only blob URLs in memory)
- API responses
- Usage statistics

### What Gets Sent to AI Providers

**Sent:**
- User's prompt text
- Generation parameters (size, style)
- API credentials (for authentication)

**NOT Sent:**
- User's personal information
- Other entries in the wheel
- Browsing history
- Any data from other parts of the application

## Common Security Vulnerabilities - Mitigated

### 1. XSS (Cross-Site Scripting)

**Mitigation:**
- React's built-in XSS protection (auto-escaping)
- No `dangerouslySetInnerHTML` used
- Content Security Policy headers recommended

### 2. CSRF (Cross-Site Request Forgery)

**Not Applicable:**
- No server-side endpoints to exploit
- All requests are to third-party APIs with proper authentication

### 3. API Key Exposure

**Mitigation:**
- sessionStorage instead of localStorage
- No logging of API keys
- No transmission to our servers
- Clear warning messages to users

### 4. Man-in-the-Middle Attacks

**Mitigation:**
- HTTPS enforced for all API calls
- OAuth redirect URI validation
- No HTTP fallback

## User Warnings and Best Practices

### In-App Security Notices

The application displays these warnings:

1. **Main Security Warning:**
   ```
   API keys are stored in sessionStorage and will be cleared when you close
   your browser. Never share your API keys. All requests are made client-side
   from your browser.
   ```

2. **Provider-Specific Links:**
   - Direct links to official API key pages
   - Links to OAuth consent screen setup
   - Links to documentation

### Recommended User Practices

1. **API Key Management:**
   - Create separate API keys for this application
   - Set spending limits in provider dashboards
   - Rotate keys periodically
   - Revoke keys if browser is compromised

2. **Browser Security:**
   - Keep browser updated
   - Use trusted browsers only
   - Don't use on shared/public computers
   - Close browser when done (clears sessionStorage)

3. **OAuth Security:**
   - Review OAuth consent carefully
   - Understand what permissions are granted
   - Revoke access if no longer needed

## Implementation Checklist

### Completed ✅

- [x] Client-side only implementation
- [x] sessionStorage for temporary credential storage
- [x] Security warnings displayed to users
- [x] HTTPS enforcement for API calls
- [x] No server-side credential storage
- [x] OAuth 2.0 Implicit Flow for Google
- [x] Direct user-to-provider API communication
- [x] Clear tokens on browser close
- [x] Links to official API key management pages

### Recommended Additions (Future)

- [ ] Content Security Policy headers (if deploying to custom domain)
- [ ] Rate limiting UI (warn user about costs)
- [ ] Usage tracking (client-side only, for user awareness)
- [ ] Prompt history (encrypted in sessionStorage)
- [ ] Generated image gallery (blob URLs only, cleared on refresh)

## GitHub Pages Specific Considerations

### Static Hosting Limitations

**What Works:**
- ✅ Client-side JavaScript execution
- ✅ sessionStorage/localStorage access
- ✅ Direct API calls to third-party services
- ✅ OAuth redirect flow (with proper setup)

**What Doesn't Work:**
- ❌ Server-side API routes
- ❌ Environment variable protection
- ❌ Server-side credential validation
- ❌ Backend proxy for API calls

### Our Solution

We embrace the limitations and design for client-side only:
- Users bring their own API keys
- No proxy server needed
- No backend infrastructure to maintain
- No server-side security concerns

## Testing Security

### Manual Security Tests

1. **Verify sessionStorage Clearing:**
   - Add API key
   - Close browser
   - Reopen browser
   - Verify key is gone

2. **Verify HTTPS Enforcement:**
   - Check all API calls use HTTPS
   - No HTTP fallback for external APIs

3. **Verify No Server Communication:**
   - Open Network tab in DevTools
   - Generate an image
   - Verify no requests to gamewheel domain
   - Only requests to AI provider domains

4. **Verify Blob URL Security:**
   - Generated images use blob: URLs
   - Blob URLs can't be accessed from other origins
   - Blob URLs are temporary (cleared on page refresh)

## Incident Response

### If API Key is Compromised

**User Actions:**
1. Immediately revoke key in provider dashboard:
   - OpenAI: https://platform.openai.com/api-keys
   - Stability AI: https://platform.stability.ai/account/keys
   - Google: https://myaccount.google.com/permissions

2. Generate new API key with spending limits

3. Review usage logs for suspicious activity

4. Consider enabling 2FA on provider accounts

### If OAuth Token is Compromised

**User Actions:**
1. Revoke access at: https://myaccount.google.com/permissions
2. Clear browser data
3. Re-authenticate with new token

## Compliance Considerations

### GDPR Compliance

- ✅ No user data collected by our application
- ✅ Users control their own API keys
- ✅ No cookies used for tracking
- ✅ Clear privacy notices

### AI Provider Terms

Users must comply with:
- OpenAI Terms of Service
- Google AI Terms of Service
- Stability AI Terms of Service

**Our Responsibility:**
- Clearly indicate which provider is being used
- Link to provider terms of service
- Not interfere with provider's terms enforcement

## Conclusion

This implementation prioritizes:
1. **User Control:** Users manage their own credentials
2. **Transparency:** Clear warnings about data handling
3. **Simplicity:** No complex server-side infrastructure
4. **Security:** sessionStorage, HTTPS, and OAuth best practices
5. **Privacy:** No data collection or logging

The client-side approach is appropriate for GitHub Pages deployment and provides good security when users follow best practices.
