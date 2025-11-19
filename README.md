# 📌 HighFive Enterprises – Team Website

This repository contains the source code for **HighFive Enterprises**, a modern, AI-assisted startup website that serves as our central hub for showcasing our team, services, projects, and network. The platform provides an accessible and organized interface for collaboration, client engagement, and community updates.

## ✨ Features

### 🎯 Core Functionality
- **Team Profiles** – Showcase team members with detailed bios, roles, and social links
- **Project Portfolio** – Display our work with rich media, tech stack details, and case studies
- **Services Overview** – Highlight our offerings with feature lists and pricing packages
- **Events Calendar** – Manage and display upcoming events, workshops, and activities
- **Network Showcase** – Feature collaborations and official partnerships
- **Contact & Feedback** – Integrated contact forms with client testimonials and ratings
- **AI-Powered Chatbot** – Interactive widget for visitor assistance

### 🔧 Admin Dashboard
- Full-featured admin panel for content management
- CRUD operations for all content types (team, projects, services, events, partners)
- File upload with drag-and-drop support
- Multiple image management for project galleries
- Real-time content updates

### 🎨 User Experience
- Responsive and modern UI design
- Dark/Light theme support
- Smooth animations and transitions
- Accessible components (Radix UI)
- SEO-friendly structure

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Next.js 16 (App Router)
- **Styling:** Tailwind CSS with tailwindcss-animate
- **UI Components:** Radix UI primitives, Shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State Management:** React Query (TanStack Query)
- **Form Handling:** React Hook Form with Zod validation
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js with Express
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Authentication:** Passport.js with session management
- **File Storage:** Supabase Storage
- **File Upload:** Multer

### Build Tools
- **Bundler:** Vite + esbuild
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Development:** tsx for TypeScript execution

### AI Integration
- OpenAI SDK for intelligent features

## 📁 Project Structure

```
HighFiveEnterprises/
├── client/               # Frontend application
│   └── src/
│       ├── app/         # Next.js App Router pages
│       ├── components/  # Reusable UI components
│       ├── pages/       # Main pages and admin panel
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utilities and configurations
│       └── types/       # TypeScript type definitions
├── server/              # Backend API
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── supabase.ts     # Database client
│   └── storage.ts      # File storage logic
├── shared/              # Shared types and schemas
├── migrations/          # Database migrations
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Supabase account (for database and storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd HighFiveEnterprises
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE=your_service_role_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run database migrations**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5000`
   - Admin Panel: `http://localhost:5000/admin`

## 📦 Available Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm start` – Start production server
- `pnpm db:push` – Apply database migrations
- `pnpm db:studio` – Open Drizzle Studio for database management

## 🎯 Purpose

**HighFive Enterprises** serves as our team's official public presence and a comprehensive showcase of our collective work. The platform enables us to:

- **Communicate effectively** with clients, collaborators, and stakeholders
- **Showcase our expertise** through detailed project portfolios
- **Build trust** with client testimonials and transparent team profiles
- **Manage content efficiently** through an intuitive admin interface
- **Scale our presence** as our team and projects grow

## 🌟 Key Pages

- **Home** – Hero section, featured projects, and call-to-action
- **Services** – Service offerings with detailed features and pricing
- **Projects** – Filterable portfolio with project details and case studies
- **Team** – Team member profiles with social links
- **Our Network** – Partnerships and collaborations
- **Events** – Upcoming and past events calendar
- **Contact** – Contact form with feedback and ratings display
- **Admin** – Comprehensive dashboard for content management

## 🔐 Admin Access

The admin panel provides secure access to manage all content. Features include:
- Team member management
- Project CRUD with multi-image upload
- Service and package management
- Event scheduling
- Partnership management
- Feedback moderation
- Activity tracking

## 🤝 Contributing

This is our team's collaborative project. To contribute:

1. Create a new branch for your feature
2. Make your changes following our coding standards
3. Test thoroughly before committing
4. Submit for team review

## 📄 License

This project is proprietary and maintained by the HighFive Enterprises team.

## 📧 Contact

For inquiries, reach out to us at: teamhfive25@gmail.com

---

**Built with ❤️ by HighFive Enterprises | Empowering innovation through technology**
