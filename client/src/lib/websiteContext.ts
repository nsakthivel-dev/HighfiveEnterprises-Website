// Website context module that provides structured information about HighFive Enterprises website
// This helps the chatbot understand the website structure and content to provide better answers

export interface WebsiteStructure {
  name: string;
  description: string;
  pages: Page[];
  services: Service[];
  team: TeamInfo;
  projects: ProjectInfo;
}

export interface Page {
  name: string;
  path: string;
  description: string;
  keyFeatures: string[];
}

export interface Service {
  title: string;
  description: string;
  features: string[];
}

export interface TeamInfo {
  description: string;
  roles: string[];
}

export interface ProjectInfo {
  description: string;
  types: string[];
}

export const websiteContext: WebsiteStructure = {
  name: "HighFive Enterprises",
  description: "A modern web development company that creates innovative digital solutions for businesses.",
  pages: [
    {
      name: "Home",
      path: "/",
      description: "The main landing page showcasing the company's value proposition, featured projects, and call-to-action buttons.",
      keyFeatures: [
        "Hero section with company tagline",
        "Statistics counter showing company achievements",
        "Featured projects showcase",
        "Live activity feed",
        "Call-to-action section for starting projects"
      ]
    },
    {
      name: "About",
      path: "/about",
      description: "Company information page detailing the mission, vision, values, and history of HighFive Enterprises.",
      keyFeatures: [
        "Company mission and vision statements",
        "Core values presentation",
        "Company timeline/history",
        "Leadership team introduction"
      ]
    },
    {
      name: "Team",
      path: "/team",
      description: "Page showcasing the team members with their roles, skills, and experience levels.",
      keyFeatures: [
        "Team member profiles with photos",
        "Role and skill filtering capabilities",
        "Spotlight section highlighting team members",
        "Culture and values information",
        "Join team call-to-action"
      ]
    },
    {
      name: "Services",
      path: "/services",
      description: "Detailed information about the services offered by HighFive Enterprises.",
      keyFeatures: [
        "Service cards with descriptions",
        "Feature comparison table",
        "Service packages information"
      ]
    },
    {
      name: "Projects",
      path: "/projects",
      description: "Portfolio showcasing completed and ongoing projects with detailed information.",
      keyFeatures: [
        "Project gallery with filtering options",
        "Detailed project view pages",
        "Technology stack information",
        "Project status indicators"
      ]
    },
    {
      name: "Events",
      path: "/events",
      description: "Calendar and information about company events, workshops, and meetups.",
      keyFeatures: [
        "Event calendar view",
        "Event details with registration",
        "Past events archive"
      ]
    },
    {
      name: "Contact",
      path: "/contact",
      description: "Contact form and company contact information for inquiries and collaborations.",
      keyFeatures: [
        "Contact form for inquiries",
        "Company address and contact details",
        "Social media links",
        "Feedback submission form"
      ]
    },
    {
      name: "Join Team",
      path: "/join-team",
      description: "Application page for prospective team members to join the company.",
      keyFeatures: [
        "Application form for job seekers",
        "Position openings information",
        "Company culture presentation"
      ]
    },
    {
      name: "Become Partner",
      path: "/become-partner",
      description: "Information and application process for becoming a business partner.",
      keyFeatures: [
        "Partnership benefits information",
        "Partner application form",
        "Success stories from existing partners"
      ]
    }
  ],
  services: [
    {
      title: "Web Development",
      description: "Design and development of all types of websites including static and dynamic sites.",
      features: [
        "Database-driven websites for better functionality",
        "Responsive, modern, and user-friendly designs",
        "Custom web applications development",
        "Performance optimization and maintenance"
      ]
    },
    {
      title: "Logo Design",
      description: "Creation of unique and creative logos that perfectly represent brand identity.",
      features: [
        "Custom logo designs tailored to vision",
        "Multiple design concepts and revisions",
        "Brand identity development",
        "Full copyright ownership"
      ]
    }
  ],
  team: {
    description: "A talented team of professionals with diverse skills in development, design, and business.",
    roles: [
      "Developers",
      "Designers",
      "Project Managers",
      "Business Analysts",
      "Quality Assurance Engineers"
    ]
  },
  projects: {
    description: "A portfolio of diverse projects ranging from small business websites to complex enterprise applications.",
    types: [
      "E-commerce websites",
      "Corporate websites",
      "Mobile applications",
      "Web applications",
      "UI/UX design projects"
    ]
  }
};

export function getWebsiteContextPrompt(): string {
  return `
Website Context for HighFive Enterprises:

Company Name: ${websiteContext.name}
Description: ${websiteContext.description}

Pages:
${websiteContext.pages.map(page => `
- ${page.name} (${page.path}): ${page.description}
  Key Features: ${page.keyFeatures.join(', ')}`).join('')}

Services:
${websiteContext.services.map(service => `
- ${service.title}: ${service.description}
  Features: ${service.features.join(', ')}`).join('')}

Team Information:
Description: ${websiteContext.team.description}
Roles Available: ${websiteContext.team.roles.join(', ')}

Projects Information:
Description: ${websiteContext.projects.description}
Project Types: ${websiteContext.projects.types.join(', ')}

Use this context to accurately answer questions about the website, its services, team, and projects.
`;
}