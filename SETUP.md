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
5. Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

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