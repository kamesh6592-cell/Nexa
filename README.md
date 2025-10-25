# NEXA - AI-Powered Chat Application

This is a Next.js-based AI chat application powered by NEXA AI, built with modern web technologies including React, MongoDB, and Clerk authentication.

## Features

- 🤖 AI-powered conversations using NEXA AI
- 🔐 Secure authentication with Clerk
- 💾 Chat history persistence with MongoDB
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS

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
SIGNIN_SECRET=your_clerk_signin_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **AI**: NEXA AI via OpenRouter
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel-ready

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Clerk Documentation](https://clerk.com/docs) - authentication and user management
- [MongoDB Documentation](https://docs.mongodb.com/) - database operations
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework

## Deploy on Vercel

The easiest way to deploy your NEXA app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
