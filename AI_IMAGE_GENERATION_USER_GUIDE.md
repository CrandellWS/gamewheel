# AI Image Generation - User Guide

## What is AI Image Generation?

GameWheel now includes AI-powered image generation to create stunning custom backgrounds for your wheel! Choose from multiple AI providers to generate unique images based on text descriptions.

## Supported AI Providers

### 1. OpenAI DALL-E 3 (Recommended for Beginners)

**Pros:**
- High-quality, creative images
- Easy to set up (just needs API key)
- Reliable and fast
- Good at understanding complex prompts

**Cons:**
- Costs money (pay per generation)
- Requires OpenAI account

**Pricing:** ~$0.04-0.08 per image (1024x1024)

**How to Get Started:**
1. Create account at https://platform.openai.com
2. Add payment method
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Paste into GameWheel

### 2. Stability AI (High Quality)

**Pros:**
- Excellent image quality
- Fine control over generation
- Stable Diffusion XL model

**Cons:**
- Requires API credits
- Slightly more complex setup

**Pricing:** Credit-based system

**How to Get Started:**
1. Create account at https://platform.stability.ai
2. Purchase credits
3. Go to https://platform.stability.ai/account/keys
4. Generate API key
5. Paste into GameWheel

### 3. Google Imagen (Advanced)

**Pros:**
- Google's latest image AI
- Free tier available
- High quality

**Cons:**
- Complex OAuth setup required
- Need to configure Google Cloud project

**How to Get Started:**
1. Create project at https://console.cloud.google.com
2. Enable "Generative Language API"
3. Set up OAuth consent screen
4. Create OAuth 2.0 Client ID
5. Copy Client ID into GameWheel
6. Click "Sign in with Google"

**Note:** This is the most complex setup but worth it if you want free generation credits.

### 4. Local Model (Free but Technical)

**Pros:**
- Completely free
- Unlimited generations
- Full privacy (runs on your computer)
- No internet required after setup

**Cons:**
- Requires technical setup
- Needs powerful GPU for reasonable speed
- Must install Automatic1111 WebUI

**How to Get Started:**
1. Install Automatic1111 Stable Diffusion WebUI
2. Enable API in settings: `--api` flag
3. Run WebUI at http://localhost:7860
4. Select "Local Model" in GameWheel
5. Generate!

**Resources:**
- Automatic1111 GitHub: https://github.com/AUTOMATIC1111/stable-diffusion-webui

## How to Use

### Step 1: Open Settings

Click the ⚙️ Settings icon in the top right corner of GameWheel.

### Step 2: Find AI Image Generation

Scroll down to the "AI Image Generation" section and click the purple "Generate AI Images for Backgrounds" button.

### Step 3: Choose Provider

Select your preferred AI provider:
- **OpenAI DALL-E** - Best for beginners
- **Stability AI** - Best quality
- **Google Imagen** - Best for free tier
- **Local Model** - Best for privacy/unlimited

### Step 4: Authenticate

**For OpenAI/Stability AI:**
1. Paste your API key in the text field
2. Click "Save"
3. You'll see a green "API key is set" confirmation

**For Google Imagen:**
1. Paste your OAuth Client ID
2. Click "Sign in with Google"
3. Authorize in the popup window
4. You'll see "Authenticated with Google"

**For Local Model:**
- No authentication needed! Just make sure Automatic1111 is running.

### Step 5: Write Your Prompt

Describe the image you want to create. Be specific!

**Good Examples:**
- "A magical spinning wheel surrounded by colorful particles and stars on a dark purple background"
- "Gaming tournament prize wheel with neon lights and digital effects"
- "Medieval fortune wheel in an ancient castle with torches and stone walls"
- "Futuristic holographic wheel floating in a cyberpunk cityscape"

**Tips for Better Prompts:**
- Be specific about colors, style, and mood
- Mention lighting (bright, dark, neon, etc.)
- Include background details
- Use adjectives (magical, futuristic, ancient, etc.)

### Step 6: Choose Style Preset

Select a style that matches your vision:

- **Photo-realistic:** Real-looking images
- **Artistic:** Painted, creative interpretation
- **Abstract:** Geometric, modern art
- **Gaming:** Video game art style
- **Cartoon:** Colorful, playful style
- **Cyberpunk:** Neon, futuristic
- **Fantasy:** Magical, ethereal
- **Minimalist:** Clean, simple

### Step 7: Select Image Size

- **512x512:** Smaller, faster, cheaper (good for testing)
- **1024x1024:** Larger, better quality (recommended for final use)

### Step 8: Generate!

Click the "Generate Image" button and wait. This usually takes:
- OpenAI DALL-E: 10-20 seconds
- Stability AI: 15-30 seconds
- Google Imagen: 10-20 seconds
- Local Model: 30 seconds to several minutes (depends on your GPU)

### Step 9: Use Your Image

Once generated, you have three options:

1. **Page BG:** Apply as the page background
2. **Wheel BG:** Apply as the wheel background
3. **Download:** Save to your computer

## Example Prompts for GameWheel

### Gaming Style
```
A spinning prize wheel in a gaming arena with RGB lights,
digital displays, and excited crowd in the background,
vibrant colors, esports tournament atmosphere
```

### Fantasy Style
```
An ancient mystical wheel of fortune in a wizard's tower,
glowing runes, magical energy swirls, purple and gold colors,
candles and spell books scattered around
```

### Minimal Style
```
Clean geometric spinning wheel on a solid gradient background,
modern flat design, pastel colors, minimalist and elegant
```

### Party Style
```
Colorful party wheel with confetti, balloons, streamers,
bright festive atmosphere, celebration vibes,
rainbow colors and sparkles
```

### Corporate Style
```
Professional business prize wheel on a sleek modern office background,
corporate blue and grey colors, clean and sophisticated
```

## Security and Privacy

### Your Data is Safe

✅ **What GameWheel Does:**
- Stores your API key temporarily (only while browser is open)
- All API calls go directly from your browser to the AI provider
- No data sent to GameWheel servers
- API keys cleared when you close your browser

❌ **What GameWheel Does NOT Do:**
- Store your API keys permanently
- Log your prompts
- Save your generated images (except as blob URLs)
- Send any data to our servers

### Best Practices

1. **API Key Security:**
   - Never share your API keys
   - Create separate keys for GameWheel (easy to revoke)
   - Set spending limits in provider dashboards
   - Rotate keys periodically

2. **Browser Security:**
   - Use trusted browsers only
   - Keep browser updated
   - Don't use on public/shared computers
   - Close browser when done (auto-clears API keys)

3. **Cost Management:**
   - Start with 512x512 images (cheaper)
   - Test prompts before generating at 1024x1024
   - Set spending alerts in provider dashboards
   - Monitor your usage regularly

## Troubleshooting

### "Please set your API key first"

**Problem:** You haven't entered or saved your API key.

**Solution:**
1. Get API key from provider
2. Paste in the authentication field
3. Click "Save"
4. Try generating again

### "Failed to generate image"

**Possible Causes:**

1. **Invalid API Key**
   - Check if you copied the full key
   - Make sure key hasn't expired
   - Generate a new key and try again

2. **Insufficient Credits/Funds**
   - Check your account balance
   - Add payment method or credits
   - Set up billing if required

3. **Network Error**
   - Check internet connection
   - Try again in a few moments
   - Provider might be experiencing issues

4. **Prompt Violation**
   - Your prompt might violate content policy
   - Try a different, safer prompt
   - Avoid controversial topics

### OAuth Popup Blocked

**Problem:** Browser blocked the Google sign-in popup.

**Solution:**
1. Look for popup blocker icon in address bar
2. Click it and allow popups for GameWheel
3. Try signing in again

### Generated Image Doesn't Appear

**Problem:** Image generated but doesn't show in preview.

**Solution:**
1. Check browser console for errors (F12)
2. Try generating again
3. Try a different image size
4. Refresh page and retry

### Local Model Not Working

**Problem:** "Failed to generate with local model" error.

**Solution:**
1. Verify Automatic1111 is running: http://localhost:7860
2. Check that API is enabled (--api flag)
3. Make sure CORS is enabled
4. Restart Automatic1111 and try again

## Cost Comparison

### Per Image (1024x1024)

| Provider | Cost | Quality | Speed | Setup |
|----------|------|---------|-------|-------|
| OpenAI DALL-E | ~$0.04-0.08 | Excellent | Fast | Easy |
| Stability AI | ~$0.05-0.10 | Excellent | Medium | Easy |
| Google Imagen | Free tier then paid | Very Good | Fast | Hard |
| Local Model | Free | Good-Excellent* | Slow-Medium | Very Hard |

*Depends on your model and GPU

### Monthly Costs (100 images)

- OpenAI DALL-E: ~$4-8
- Stability AI: ~$5-10
- Google Imagen: Free tier may cover it
- Local Model: $0 (electricity only)

### Recommendations

**For Casual Use (1-10 images/month):**
- Start with OpenAI DALL-E
- Low cost, great quality
- Easy to get started

**For Regular Use (50-100 images/month):**
- Consider Google Imagen (free tier)
- Or set up local model
- Better long-term value

**For Heavy Use (100+ images/month):**
- Definitely set up local model
- One-time setup effort
- Unlimited free generations

**For Professional Use:**
- OpenAI DALL-E or Stability AI
- Consistent quality
- Reliable uptime
- Business support available

## Advanced Tips

### Prompt Engineering

**Add Details:**
- ❌ "A wheel"
- ✅ "A golden spinning wheel with ornate decorations and gems"

**Specify Style:**
- ❌ "Nice background"
- ✅ "Photorealistic gaming arena with dramatic lighting"

**Set the Mood:**
- ❌ "Dark background"
- ✅ "Mysterious dark purple atmosphere with soft glowing particles"

**Use References:**
- "In the style of [artist/game/movie]"
- "Like a [specific thing] but with [modifications]"

### Combining with Other Features

**Opacity Control:**
1. Generate background image
2. Apply to page or wheel
3. Go to Custom Backgrounds in Settings
4. Adjust opacity slider
5. Find perfect balance

**Blend Modes (Wheel Only):**
- Try different blend modes
- "Multiply" for darker effects
- "Screen" for lighter effects
- "Overlay" for vibrant colors

**Background Rotation:**
- For wheel backgrounds, enable "Rotate with wheel"
- Creates dynamic spinning effect
- Works great with circular/radial designs

## Frequently Asked Questions

### Q: Will my API key be stored permanently?

**A:** No. API keys are stored in sessionStorage and automatically cleared when you close your browser. This is intentional for security.

### Q: Can I use generated images commercially?

**A:** This depends on the AI provider's terms:
- OpenAI DALL-E: Yes, you own the images
- Stability AI: Check their terms
- Google Imagen: Check their terms
- Local Model: Yes (you own everything)

Always verify with the provider's current terms of service.

### Q: How do I delete my API key?

**A:** Click the "Clear" button next to the authenticated provider, or simply close your browser.

### Q: Can I save my generated images?

**A:** Yes! Click the "Download" button after generating. Images are not automatically saved by GameWheel.

### Q: Which provider is best?

**A:** For beginners: OpenAI DALL-E. For free/unlimited: Local Model. For balance: Google Imagen.

### Q: How long do generated images last?

**A:** As blob URLs, they last until you refresh the page. Download them if you want to keep them permanently.

### Q: Can I use the same prompt multiple times?

**A:** Yes! Each generation will be slightly different, even with the same prompt.

### Q: Is my prompt sent to GameWheel servers?

**A:** No. Prompts go directly from your browser to the AI provider. GameWheel never sees them.

## Getting Help

### Resources

- GameWheel Issues: https://github.com/CrandellWS/gamewheel/issues
- OpenAI Docs: https://platform.openai.com/docs
- Stability AI Docs: https://platform.stability.ai/docs
- Google AI Docs: https://ai.google.dev/

### Support

If you encounter issues:
1. Check this troubleshooting guide
2. Check provider status pages
3. Try a different provider
4. Open issue on GitHub
5. Check browser console (F12) for errors

## Legal and Compliance

### Terms of Service

By using AI image generation, you agree to:
- OpenAI Terms (if using DALL-E)
- Stability AI Terms (if using Stability AI)
- Google Terms (if using Imagen)
- GameWheel MIT License

### Content Policy

Do not generate:
- Illegal content
- Copyrighted material
- Offensive imagery
- Personal information

Violating content policies may result in:
- API key suspension
- Account termination
- Legal consequences

### Privacy

GameWheel does not:
- Collect your prompts
- Store your generated images
- Track your usage
- Share your data

AI providers may:
- Log prompts for quality/safety
- Use data to improve models
- Monitor for policy violations

Check each provider's privacy policy for details.

## Conclusion

AI image generation in GameWheel makes it easy to create stunning, unique backgrounds for your spinning wheel. Whether you're running a gaming tournament, hosting a giveaway, or just want to make your wheel look amazing, AI-generated backgrounds add that professional touch.

Start with OpenAI DALL-E for the easiest experience, or try local models for unlimited free generations. The choice is yours!

Happy generating! 🎨✨
