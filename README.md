# 🌿 FlowNest – AI-Powered Productivity Ecosystem

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://flow-nest.vercel.app/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.5-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> A modern, AI-enhanced productivity management platform that helps you build better habits, achieve goals, and optimize your daily workflow with intelligent insights.

## ✨ Key Features

## ✨ Revolutionary AI Features

### 🤖 **OpenRouter GPT-3.5 Turbo Integration**
- **AI Chat Assistant**: 24/7 productivity coaching with contextual conversations
- **Smart Task Prioritization**: AI analyzes and prioritizes your tasks automatically
- **Intelligent Goal Breakdown**: Complex goals broken into actionable steps
- **Meeting Notes Analysis**: Extract action items and insights from meeting notes
- **Personalized Habit Recommendations**: AI suggests habits based on your profile
- **Schedule Optimization**: AI optimizes your daily schedule for peak productivity
- **Dynamic Quote Generation**: Personalized motivational quotes based on your context

### 🧠 **Advanced AI Analytics**
- **Productivity Scoring**: AI-calculated 0-100 productivity score with insights
- **Behavioral Pattern Analysis**: Identify productivity patterns and bottlenecks
- **Predictive Recommendations**: AI predicts what you need before you know it
- **Context-Aware Insights**: Personalized advice based on your unique workflow
- **Performance Forecasting**: Predict goal achievement likelihood

### 📊 **Advanced Analytics Dashboard**
- Real-time productivity scoring (0-100 scale)
- Weekly performance summaries with actionable insights
- Focus time tracking and trends analysis
- Goal completion rate monitoring
- Habit consistency visualization

### 🗓️ **Real-time Calendar Integration**
- **Google Calendar Sync**: Seamless two-way synchronization with Google Calendar
- **Event Management**: Create, update, and delete events directly from FlowNest
- **Real-time Updates**: Instant synchronization of calendar changes
- **Multi-Calendar Support**: Access and manage multiple Google calendars
- **Smart Scheduling**: AI-powered schedule optimization with calendar data
- **Smart Todo Management**: Priority-based task organization with real-time sync
- **Habit Tracking**: Streak monitoring with visual progress indicators
- **Pomodoro Timer**: Focus sessions with automatic analytics tracking
- **Goal Setting**: SMART goals with progress visualization
- **Time Blocking**: Calendar integration for optimal scheduling
- **Daily Reflections**: Mindfulness and progress tracking

### 🎯 **Comprehensive Productivity Tools**
- **Smart Todo Management**: Priority-based task organization with real-time sync
- **Habit Tracking**: Streak monitoring with visual progress indicators
- **Pomodoro Timer**: Focus sessions with automatic analytics tracking
- **Goal Setting**: SMART goals with progress visualization
- **Time Blocking**: Calendar integration for optimal scheduling
- **Daily Reflections**: Mindfulness and progress tracking
- Firebase Authentication with email/password and social login
- Environment-based configuration management
- Secure API key handling
- User data encryption and privacy protection

### 🎨 **Modern User Experience**
- Fully responsive design (mobile-first approach)
- Dark/Light mode with system preference detection
- Smooth animations with Framer Motion
- Accessibility compliant (WCAG 2.1 AA)
- Progressive Web App (PWA) capabilities

## 🚀 Live Demo

**[Try FlowNest Now →](https://flow-nest.vercel.app/)**

*Experience the full power of AI-enhanced productivity management*

## 📸 Screenshots

### Light Mode
![FlowNest Light Mode Dashboard](src/assets/ProductivityDashboard_Light.webp)

### Dark Mode
![FlowNest Dark Mode Dashboard](src/assets/ProductivityDashboard_Dark.webp)

## 🛠 Tech Stack

### **Frontend**
- **React 19.1.0** - Latest React with concurrent features
- **Vite 6.3.5** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.5** - Utility-first CSS framework
- **Framer Motion 12.10.1** - Production-ready motion library

### **Backend & Services**
- **Firebase 11.9.1** - Authentication, Firestore, and hosting
- **OpenRouter API** - GPT-3.5 Turbo for advanced AI capabilities
- **Google Gemini AI** - Fallback AI service for quotes
- **Vercel** - Edge deployment and serverless functions

### **Data Visualization**
- **Recharts 2.15.3** - Composable charting library
- **React Icons 5.5.0** - Comprehensive icon library

### **Development Tools**
- **ESLint 9.25.0** - Code quality and consistency
- **TypeScript Support** - Type safety and better DX
- **Vitest** - Unit testing framework

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore and Authentication enabled
- OpenRouter API key (for advanced AI features)
- Google Calendar API credentials (for calendar integration)
- Google Gemini API key (optional, for fallback AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/flownest.git
cd flownest
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Update `.env` with your credentials:
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenRouter API key is now stored server-side.
# Set it with: firebase functions:secrets:set OPENROUTER_API_KEY

# Google Gemini API (Fallback)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Environment
VITE_NODE_ENV=development
```

### 4. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add your domain to authorized domains

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see your app running!

## 🏗 Project Architecture

```
flownest/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorBoundary.jsx
│   │   ├── Loading.jsx
│   │   ├── TodoWidget.jsx
│   │   └── ...
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useFirestore.js
│   │   └── useDarkMode.jsx
│   ├── pages/              # Route components
│   │   ├── Home.jsx
│   │   ├── Analytics.jsx
│   │   └── ...
│   ├── services/           # External service integrations
│   │   ├── AnalyticsService.js
│   │   └── QuoteService.js
│   ├── utils/              # Utility functions
│   │   └── firebase.js
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── public/                 # Static assets
├── .env.example           # Environment template
└── README.md              # This file
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build
```bash
npm run build
npm run preview
```

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 🔒 Security

- **Firestore Security Rules**: All collections enforce authenticated, owner-only access.
- **Server-Side API Keys**: The OpenRouter API key has been moved to a Firebase Cloud Function (`functions/index.js`). It is **never** exposed in the client-side bundle.
- **Input Sanitization**: All Firestore writes are sanitized (trimmed, length-limited, undefined values stripped) via the `useFirestore` hook.
- **Offline Persistence**: Firestore IndexedDB persistence is enabled — data is cached locally and syncs when the user reconnects.
- **Dependency Audits**: Run `npm audit fix` regularly to address known vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent quote generation
- **Firebase** for robust backend infrastructure
- **Vercel** for seamless deployment
- **React Community** for amazing ecosystem

## 📞 Support

For support, email support@flownest.app or join our [Discord community](https://discord.gg/flownest).

---

<div align="center">
  <strong>Built with ❤️ for productivity enthusiasts worldwide</strong>
  <br>
  <sub>© 2024 FlowNest. All rights reserved.</sub>
</div>
