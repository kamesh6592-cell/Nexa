# AJ Studioz Creative Suite

A modern React + Vercel serverless app for creative workflows powered by AI.

## 🚀 Features

- **AI-Powered Creative Tools**: Image generation, content creation, and design assistance
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS
- **Serverless Architecture**: Vercel Functions for API endpoints
- **Production Ready**: Optimized builds, caching, and security headers
- **Responsive Design**: Works seamlessly across all devices

## 📁 Project Structure

```
aj-studioz-creative-suite/
├── .github/workflows/     # CI/CD pipelines
├── api/                   # Vercel serverless functions
├── public/               # Static assets (index.html, bundle.js)
├── src/                  # React source code
│   ├── components/       # React components
│   │   ├── icons/       # Icon components
│   │   └── templates/   # Template components
│   ├── services/        # Business logic and API services
│   ├── App.tsx          # Main application component
│   ├── index.tsx        # Application entry point
│   └── types.ts         # TypeScript type definitions
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kamesh6592-cell/Nexa.git
   cd aj-studioz-creative-suite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API keys
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:8080`

## 📜 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run start` - Build and serve production locally
- `npm run preview` - Preview production build on port 3000
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `public/` folder** to your hosting provider

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### Build Configuration

The project uses esbuild for fast compilation with:
- JSX automatic runtime
- TypeScript support  
- Production minification
- Source maps generation

## 🔒 Security Features

- Content Security Policy headers
- XSS protection
- CSRF protection
- Secure environment variable handling
- Static asset caching with immutable headers

## 🧪 Testing & CI/CD

The project includes GitHub Actions workflows for:
- Automated testing on multiple Node.js versions
- Type checking with TypeScript
- Production builds
- Automatic deployment to Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ajstudioz.com or open an issue on GitHub.

---

**Built with ❤️ by AJ STUDIOZ**
