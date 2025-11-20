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

### 📋 New Recruitment & Partnership Pages
- **About Page** – Comprehensive company story, values, differentiators, and working approach
- **Join Team Page** – Team member recruitment form with portfolio and social profile links
- **Become Partner Page** – Partnership opportunity form with business type and collaboration type selection
- Interactive forms with FormSubmit integration for direct email notifications
- Success confirmation screens with smooth user experience

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
SolutionSquadHub/
├── client/                           # Frontend application (React + Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   └── api/projects/        # API routes for projects
│   │   │       ├── [id]/route.ts    # Dynamic project endpoint
│   │   │       └── route.ts         # Project list endpoint
│   │   ├── components/
│   │   │   ├── ui/                  # Shadcn/ui components (accordion, button, card, etc.)
│   │   │   ├── examples/            # Component examples (Hero, Navigation, ProjectCard, etc.)
│   │   │   ├── AdminLayout.tsx      # Admin dashboard layout
│   │   │   ├── FileUpload.tsx       # Single file upload component
│   │   │   ├── MultipleFileUpload.tsx # Multiple file upload
│   │   │   ├── FeedbackForm.tsx     # Feedback submission form
│   │   │   ├── FeedbackDisplay.tsx  # Feedback display component
│   │   │   ├── EventCard.tsx        # Event display card
│   │   │   ├── EventModal.tsx       # Event creation/edit modal
│   │   │   ├── TeamMemberCard.tsx   # Team member profile card
│   │   │   ├── TeamMemberModal.tsx  # Team member form modal
│   │   │   ├── TeamNetwork.tsx      # Network visualization
│   │   │   ├── ChatbotWidget.tsx    # AI chatbot widget
│   │   │   └── ThemeProvider.tsx    # Dark/Light theme provider
│   │   ├── pages/
│   │   │   ├── admin/               # Admin panel pages
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── About.tsx            # Company story and values
│   │   │   ├── Services.tsx         # Services overview
│   │   │   ├── Projects.tsx         # Project portfolio
│   │   │   ├── ProjectView.tsx      # Individual project detail
│   │   │   ├── Team.tsx             # Team members page
│   │   │   ├── JoinTeam.tsx         # Team recruitment form
│   │   │   ├── OurNetwork.tsx       # Network and partnerships
│   │   │   ├── BecomePartner.tsx    # Partnership form
│   │   │   ├── Events.tsx           # Events calendar
│   │   │   ├── Contact.tsx          # Contact form
│   │   │   ├── Admin.tsx            # Main admin dashboard
│   │   │   ├── Apply.tsx            # Application page
│   │   │   ├── Privacy.tsx          # Privacy policy
│   │   │   ├── Terms.tsx            # Terms of service
│   │   │   └── not-found.tsx        # 404 page
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   │   ├── use-toast.ts         # Toast notification hook
│   │   │   └── useWindowSize.ts     # Window resize hook
│   │   ├── lib/
│   │   │   ├── supabase.ts          # Supabase client initialization
│   │   │   ├── queryClient.ts       # React Query setup
│   │   │   └── utils.ts             # Utility functions
│   │   ├── types/
│   │   │   ├── Event.ts             # Event type definitions
│   │   │   └── Feedback.ts          # Feedback type definitions
│   │   ├── App.tsx                  # Main app component
│   │   ├── index.css                # Global styles
│   │   └── main.tsx                 # Entry point
│   ├── index.html                   # HTML template
│   └── public/                      # Static assets (favicon, images)
├── server/                          # Backend API (Express.js)
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API route definitions
│   ├── supabase.ts                  # Supabase database client
│   ├── storage.ts                   # File storage logic
│   ├── vite.ts                      # Vite server integration
│   └── uuid.d.ts                    # UUID type definitions
├── shared/
│   └── schema.ts                    # Shared Zod/Drizzle schemas
├── src/                             # Legacy components (migration in progress)
│   ├── components/
│   ├── styles/
│   └── types/
├── README.md                        # Project documentation
├── design_guidelines.md             # Design system documentation
├── package.json                     # Project dependencies
├── pnpm-workspace.yaml              # Monorepo workspace config
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite bundler configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── drizzle.config.ts                # Drizzle ORM configuration
└── components.json                  # Shadcn/ui components config
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
- **About** – Company story, core values, differentiators, and development approach with interactive animations
- **Services** – Service offerings with detailed features and pricing
- **Projects** – Filterable portfolio with project details and case studies
- **Team** – Team member profiles with social links
- **Join Team** – Team recruitment application form with portfolio submission
- **Our Network** – Partnerships and collaborations
- **Become Partner** – Partnership proposal form for collaboration opportunities
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
