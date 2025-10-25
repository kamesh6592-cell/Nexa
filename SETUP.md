# NEXA Setup Guide

## Environment Configuration

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure Supabase (Required for Authentication)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and anon key
5. Go to Authentication > Settings
6. Set **Site URL** to: `https://nexa-lemon-one.vercel.app`
7. Add **Redirect URLs**:
   ```
   https://nexa-lemon-one.vercel.app/auth/callback
   https://nexa-lemon-one.vercel.app/
   http://localhost:3000/auth/callback
   http://localhost:3000/
   ```
8. Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### OAuth Providers (Optional)
If you want to enable Google/GitHub login:

**Google OAuth:**
1. In Google Cloud Console → APIs & Services → Credentials
2. Create or edit your OAuth 2.0 Client ID
3. In **Authorized redirect URIs**, add:
   ```
   https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback
   https://nexa-lemon-one.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
4. In Supabase → Auth → Providers → Google: Enable and add your Google Client ID and Secret

**GitHub OAuth:**
1. In GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App or edit existing
3. Set **Authorization callback URL** to:
   ```
   https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback
   ```
4. In Supabase → Auth → Providers → GitHub: Enable and add your GitHub Client ID and Secret

**Important:** Replace `YOUR-SUPABASE-PROJECT` with your actual Supabase project reference from your project URL.

### 3. Configure OpenAI (Required for AI Chat)

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com)
2. Update `.env.local`:

```bash
OPENAI_API_KEY=sk-your-openai-key-here
```

### 4. Optional: MongoDB (For Chat History)

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexa
```

## Quick Setup Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The app is configured for Vercel deployment. Make sure to add all environment variables in your Vercel project settings.

## Features

- ✅ AI Chat with OpenAI
- ✅ User Authentication (Supabase)
- ✅ Mobile-First Design
- ✅ Dark Mode UI
- ✅ Chat History (Optional with MongoDB)
- ✅ PWA Support

## Troubleshooting

### Google OAuth Error: "redirect_uri_mismatch"
If you see this error, you need to add your Supabase callback URL to Google Cloud Console:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   ```
   https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback
   ```
4. Replace `YOUR-SUPABASE-PROJECT` with your actual Supabase project reference

### "Auth not configured" message
1. Make sure you've added your Supabase credentials to `.env.local`
2. Restart your development server: `npm run dev`
3. Check that environment variables are set in Vercel for production