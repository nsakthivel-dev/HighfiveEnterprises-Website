# 📌 Lupus Venture – Master Documentation

This is the consolidated documentation for **Lupus Venture**, a modern, AI-assisted startup website that serves as our central hub for showcasing our services and network.

---

## ✨ Features

### 🎯 Core Functionality
- **Services Overview** – Highlight our offerings with feature lists and pricing packages.
- **Contact & Feedback** – Integrated contact forms with client testimonials and ratings.
- **AI-Powered Chatbot** – Interactive widget for visitor assistance using Google Gemini.
- **Partnership Management** – Network and official partnership showcases.

### 🔧 Admin Dashboard
- Full-featured admin panel for content management.
- CRUD operations for services, packages, activity tracking, and feedback moderation.
- File upload with drag-and-drop support.
- **Secure Authentication** – Only authorized administrators can access the panel via Firebase Auth.

### 📋 Key Pages
- **Home** – Hero section and call-to-action.
- **About** – Company story, core values, differentiators, and development approach with interactive animations.
- **Services** – Service offerings with detailed features and pricing.
- **Become Partner** – Partnership proposal form for collaboration opportunities.
- **Contact** – Contact form with feedback and ratings display.
- **Admin** – Comprehensive dashboard for content management.

### 🎨 User Experience
- Responsive and modern UI design with **Modern Glassmorphism**.
- Dark/Light theme support.
- Smooth animations and transitions using Framer Motion.
- Accessible components powered by Radix UI and Shadcn/ui.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Next.js 16 (App Router), Tailwind CSS, Framer Motion, Radix UI, Shadcn/ui, Lucide React, React Query.
- **Backend:** Node.js with Express.
- **Database & Auth:** Google Firebase (Firestore), Custom authentication with Firebase Auth.
- **Build Tools:** Vite, TypeScript, pnpm.
- **AI Integration:** Google Gemini API (or OpenAI SDK).

---

## � Getting Started

### Prerequisites
- Node.js 18+ installed.
- pnpm package manager.
- Firebase account (for database and storage).

### Installation
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LupusVenture
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Set up environment variables**
   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) section).
4. **Start the development server**
   ```bash
   pnpm dev
   ```

### Available Scripts
- `pnpm dev` – Start development server.
- `pnpm build` – Build for production.
- `pnpm start` – Start production server.
- `pnpm setup:admin-users` – Initialize admin users in Firebase.

---

## 🔐 Admin Access & Authentication

The admin panel is restricted to authorized administrators.

### Authorized Administrators
| Email | Password | Role |
|-------|----------|------|
| nsakthiveldev@gmail.com | @whitedevil12345 | Founder |
| aaminathamiz@gmail.com | @aamin12345 | Client Manager |
| hiteshreem2007@gmail.com | @hiteshree12345 | HR |
| hariharan.b17706@gmail.com | @hariharan12345 | CTO |
| fazeelaofficial1609@gmail.com | @fazeela12345 | CFO |
| arjungova111@gmail.com | @arjun12345 | Brand Ambassador |

### Setup Instructions
1. Run `npx tsx scripts/seed-firebase.ts` to initialize basic content in Firestore.
2. Enable **Email/Password** provider in your Firebase project under "Authentication" -> "Sign-in method".
3. Navigate to `/admin-workspace` to access the panel.

---

## 🌍 Deployment (Render)

### Prerequisites
- GitHub repository pushed.
- Render account connected to GitHub.
- Firebase project configured.

### Deployment Steps
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the following configurations:
   - **Runtime:** `Node`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm run start`
4. Configure environment variables in the Render dashboard (see below).
5. Deploy.

### Environment Variables (set in Render Dashboard)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase Project ID |
| `FIREBASE_PROJECT_ID` | Yes | Firebase Project ID (Server) |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Yes | Firebase service account private key |
| `VITE_FIREBASE_STORAGE_BUCKET`| Yes | Firebase Storage Bucket |
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key for chatbot |
| `PORT` | No | Port for the server (defaults to 4000) |
| `NODE_ENV` | No | Set to `production` |

---

## 🎨 Design Guidelines

- **Modern Glassmorphism:** bg-white/10 or bg-slate-900/10, backdrop-blur-xl, border border-white/20.
- **Typography:** Poppins for headings, Inter for body text.
- **Grid Philosophy:** 2 or 3-column grid for cards, 2-column flex for stats.
- **Animations:** Framer Motion for page transitions, card hovers, and scroll reveals.

---

## 📁 Project Structure

```
LupusVenture/
├── client/               # Frontend (React)
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # UI components (Shadcn/ui)
│       ├── context/      # AuthContext
│       ├── lib/          # Utils, Firebase client, Chat service
│       └── pages/        # Page components & Admin routes
├── server/               # Backend (Express.js)
├── scripts/              # Setup and maintenance scripts
└── package.json          # Project dependencies and scripts
```

---

## 🤝 Contributing & License

This project is proprietary and maintained by the **Lupus Venture** team.

### Contact
For inquiries, reach out to us at: **touch@lupusventure.com**

---
**Built with ❤️ by Lupus Venture | Empowering innovation through technology**
