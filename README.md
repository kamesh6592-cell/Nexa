# NEXA - AI-Powered Chat Application

This is a Next.js-based AI chat application powered by NEXA AI, built with modern web technologies including React, MongoDB, and Supabase authentication.

## Features

- 🤖 AI-powered conversations using NEXA AI
- 🔐 Secure authentication with Supabase Auth
- 💾 Chat history persistence with MongoDB
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔒 Social login support (Google, GitHub)
- 📧 Email/password authentication

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/nexa-chat.git
cd nexa-chat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your NEXA API key and other required credentials

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see NEXA in action.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXA_API_KEY=your_nexa_api_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **AI**: NEXA AI via OpenRouter
- **Authentication**: Supabase Auth
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel-ready

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - authentication and database management
- [MongoDB Documentation](https://docs.mongodb.com/) - database operations
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework

## Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Enable Authentication providers you want to use (Email, Google, GitHub, etc.)
4. Set up OAuth apps for social providers if needed
5. Add your Supabase credentials to `.env.local`

### Authentication Flow

The app uses Supabase Auth with:
- Email/password authentication
- Social login (Google, GitHub)
- Automatic session management
- Protected API routes

## Deploy on Vercel

The easiest way to deploy your NEXA app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Quick Deploy Steps:

1. **Push to GitHub**: Make sure your code is pushed to GitHub
2. **Import to Vercel**: Connect your GitHub repository to Vercel
3. **Set Environment Variables** in Vercel Dashboard:
   ```
   NEXA_API_KEY=your_nexa_api_key
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Deploy**: Vercel will automatically build and deploy your app

### Important Notes:
- ⚠️ **Environment Variables Required**: The app will build but authentication won't work without Supabase credentials
- 🔧 **MongoDB Required**: Set up MongoDB Atlas for chat persistence
- 🌐 **Domain Setup**: Update Supabase redirect URLs with your production domain

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
