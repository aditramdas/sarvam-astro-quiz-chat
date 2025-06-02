# API Setup Guide

This enhanced Sarvam AstroQuiz app integrates with NASA APIs and Sarvam AI for real-time content generation and multi-language support.

## Required API Keys

### 1. NASA API Key

**Free and Easy to Get:**

- Visit: https://api.nasa.gov/
- Click "Generate API Key"
- Fill in your details (name, email, use case)
- You'll receive your API key instantly via email

**What it provides:**

- APOD (Astronomy Picture of the Day)
- Mars Rover Photos (Curiosity, Opportunity, Spirit)
- Near-Earth Objects (Asteroids)

### 2. Sarvam AI API Key

**For Multi-language Support:**

- Visit: https://www.sarvam.ai/
- Sign up for an account
- Request API access (may require approval)
- Get your API subscription key

**What it provides:**

- Translation to Hindi, Tamil, Bengali, Marathi, Malayalam
- Contextual question generation in Indic languages

## Environment Setup

1. Create a `.env` file in the project root:

```env
# NASA API Key (Required for live data)
VITE_NASA_API_KEY=your_nasa_api_key_here

# Sarvam AI API Key (Optional - fallback translations provided)
VITE_SARVAM_API_KEY=your_sarvam_api_key_here
```

2. Replace the placeholder values with your actual API keys.

## Fallback Behavior

The app is designed to work even without API keys:

- **Without NASA API Key:** Uses "DEMO_KEY" which has limited requests but still works
- **Without Sarvam API Key:** Uses built-in fallback translations for common phrases

## Features Enabled with APIs

### With NASA API Key:

- ✅ Fresh daily APOD questions with real images
- ✅ Random Mars Rover photos with metadata
- ✅ Current week's near-Earth objects data
- ✅ Never repetitive content

### With Sarvam API Key:

- ✅ Professional translation quality
- ✅ Contextual question generation
- ✅ Natural language explanations
- ✅ Cultural adaptation of content

## Testing the Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Check the browser console for any API errors

3. Test features:
   - Try different languages to test translations
   - Complete a quiz to see live NASA data
   - Check if images load properly
   - Verify badge notifications work

## API Rate Limits

### NASA API:

- **With API Key:** 1,000 requests per hour
- **Demo Key:** 30 requests per hour per IP
- **Best Practice:** Cache responses when possible

### Sarvam AI:

- Check your plan limits on the dashboard
- Implement request queuing for high-traffic scenarios

## Troubleshooting

### Common Issues:

1. **Images not loading:**

   - Check NASA API key validity
   - Verify network connectivity
   - Some APOD entries may be videos instead of images

2. **Translation not working:**

   - Verify Sarvam API key format
   - Check API subscription status
   - Fallback translations should still work

3. **CORS errors:**
   - NASA APIs support CORS for browser requests
   - Sarvam AI may require server-side proxy for production

### Debug Mode:

Add this to your `.env` for detailed logging:

```env
VITE_DEBUG_MODE=true
```

## Production Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Consider implementing server-side API proxies for better security
3. Add request caching to reduce API calls
4. Monitor API usage and costs

## Security Notes

- Never commit API keys to version control
- Use environment variables for all API keys
- Consider rate limiting on your application level
- Monitor API usage to prevent unexpected charges

## Cost Estimation

### NASA API:

- **Free:** Up to 1,000 requests/hour
- **Cost:** $0 (completely free)

### Sarvam AI:

- **Pricing:** Check current rates at https://www.sarvam.ai/pricing
- **Usage:** Approximately 2-3 translation requests per quiz question

## Support

If you encounter issues:

- NASA API: Check https://api.nasa.gov/ documentation
- Sarvam AI: Contact their support team
- App Issues: Check console logs and network tab in browser dev tools
