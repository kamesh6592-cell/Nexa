# OAuth Configuration Quick Reference

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