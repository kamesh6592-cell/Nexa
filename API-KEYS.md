# API Keys Setup Guide

NEXA supports multiple AI providers for enhanced flexibility and performance. Here's how to obtain and configure API keys for each service.

## 🔑 API Key Options

### Option 1: OpenRouter API (Recommended)
**Access to multiple models through one API**

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Go to your [API Keys page](https://openrouter.ai/keys)
4. Create a new API key
5. Add to `.env.local`:
   ```bash
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

**Supported Models via OpenRouter:**
- GPT-4o Mini (OpenAI)
- Gemini 2.0 Flash (Google)

### Option 2: Google Gemini API (Direct)
**Direct access to Google's Gemini models**

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the top navigation
4. Create a new API key
5. Add to `.env.local`:
   ```bash
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

**Supported Models via Gemini API:**
- Gemini 2.0 Flash Experimental
- Gemini 1.5 Pro
- Gemini 1.5 Flash

## 🚀 Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your API keys to `.env.local`:**
   ```bash
   # Choose one or both options
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## 💰 Pricing Comparison

### OpenRouter
- Pay-per-use pricing
- Access to multiple providers
- Unified billing
- Rate limiting included

### Google Gemini API
- Free tier available
- Competitive pricing for high usage
- Direct from Google
- Latest model updates

## 🛠️ Model Selection

1. Open **Settings** in NEXA
2. Go to **General** tab
3. Select your preferred **AI Model**
4. The interface shows which API key is required for each model

## 🔧 Troubleshooting

### "API key not configured" error
- Ensure the correct environment variable is set
- Restart your development server after adding keys
- Check that your `.env.local` file is in the project root

### "Invalid API key" error
- Verify your API key is correct
- Check that the key has proper permissions
- Ensure you haven't exceeded usage limits

### Model not responding
- Try a different model
- Check your internet connection
- Verify API key permissions

## 📝 Notes

- You can use both APIs simultaneously
- Different models may have different capabilities
- API keys are securely stored as environment variables
- Never commit API keys to version control

For more help, refer to the respective provider documentation:
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Google AI Studio Documentation](https://ai.google.dev/)