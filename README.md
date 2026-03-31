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
- **Secure Authentication** – Only authorized administrators can access the panel via Supabase Auth.

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
- **Database & Auth:** Supabase (PostgreSQL), Custom authentication with Supabase Auth.
- **ORM:** Drizzle ORM.
- **Build Tools:** Vite, TypeScript, pnpm.
- **AI Integration:** Google Gemini API (or OpenAI SDK).

---

## � Getting Started

### Prerequisites
- Node.js 18+ installed.
- pnpm package manager.
- Supabase account (for database and storage).

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
4. **Run database migrations**
   ```bash
   pnpm db:push
   ```
5. **Start the development server**
   ```bash
   pnpm dev
   ```

### Available Scripts
- `pnpm dev` – Start development server.
- `pnpm build` – Build for production.
- `pnpm start` – Start production server.
- `pnpm db:push` – Apply database migrations.
- `pnpm db:studio` – Open Drizzle Studio for database management.

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
1. Run `node scripts/create-admin-users.js` to create these users in Supabase.
2. Enable **Email** provider in your Supabase project under "Authentication" -> "Providers".
3. Navigate to `/admin` or `/admin/login` to access the panel.

---

## 🌍 Deployment (Render)

### Prerequisites
- GitHub repository pushed.
- Render account connected to GitHub.
- Supabase project configured.

### Deployment Steps
1. From Render dashboard, click **"New +"** → **"Web Service"**.
2. Select your repository.
3. Render will detect `render.yaml` automatically.
4. **Build Command:** `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm run build`
5. **Start Command:** `pnpm start`
6. Configure environment variables in the Render dashboard.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous API key |
| `SUPABASE_URL` | Yes | Server-side Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY`| Yes | ⚠️ Keep Secret! Supabase service role key |
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key for chatbot |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | Yes | `development` or `production` |

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
├── client/               # Frontend (React + Next.js App Router style)
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # UI components (Shadcn/ui)
│       ├── context/      # AuthContext
│       ├── lib/          # Utils, Supabase client, Chat service
│       └── pages/        # Page components & Admin routes
├── server/               # Backend (Express.js)
├── shared/               # Shared Drizzle/Zod schemas
├── scripts/              # Setup and maintenance scripts
└── render.yaml           # Render deployment config
```

---

## 🤝 Contributing & License

This project is proprietary and maintained by the **Lupus Venture** team.

### Contact
For inquiries, reach out to us at: **touch@lupusventure.com**

---
**Built with ❤️ by Lupus Venture | Empowering innovation through technology**
