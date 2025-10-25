# OAuth & API Configuration Quick Reference

## Your Supabase Project
- Project URL: `https://lfbameiwzhzrsavwahui.supabase.co`
- Auth Callback: `https://lfbameiwzhzrsavwahui.supabase.co/auth/v1/callback`

## Required Google Cloud Console Redirect URIs
Add ALL of these to your OAuth 2.0 Client ID:

```
https://lfbameiwzhzrsavwahui.supabase.co/auth/v1/callback
https://nexa-lemon-one.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## OpenRouter API Configuration
Your app uses OpenRouter for AI functionality, which provides access to multiple AI models:

**Models Available:**
- `deepseek/deepseek-r1` (DeepSeek R1 - Reasoning model)
- `tngtech/deepseek-r1t-chimera:free` (Free DeepSeek model)
- `openai/gpt-4o` (GPT-4 Optimized)
- `anthropic/claude-3.5-sonnet`

**Get OpenRouter API Key:**
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up/Login
3. Go to Keys section
4. Create new key
5. Add to `.env.local`: `OPENROUTER_API_KEY=sk-or-your-key-here`

## Steps to Fix redirect_uri_mismatch:
1. Go to console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add the Supabase callback URL above
5. Save and wait up to 5 minutes

## How OAuth Flow Works:
1. User clicks "Sign in with Google"
2. Google redirects to → Supabase callback
3. Supabase processes auth → redirects to your app
4. User is signed in to your app

This is why you need BOTH URLs in Google Cloud Console!