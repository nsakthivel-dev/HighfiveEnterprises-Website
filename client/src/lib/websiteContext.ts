// Website context module that provides structured information about Lupus Venture website
// This helps the chatbot understand the website structure and content to provide better answers

export interface WebsiteStructure {
  name: string;
  description: string;
  pages: Page[];
  services: Service[];
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

export const websiteContext: WebsiteStructure = {
  name: "Lupus Venture",
  description: "A modern web development company that creates innovative digital solutions for businesses.",
  pages: [
    {
      name: "Home",
      path: "/",
      description: "The main landing page showcasing the company's value proposition and call-to-action buttons.",
      keyFeatures: [
        "Hero section with company tagline",
        "Statistics counter showing company achievements",
        "Call-to-action section for starting projects"
      ]
    },
    {
      name: "Who We Are",
      path: "/who-we-are",
      description: "Company information page detailing the mission, vision, values, and history of Lupus Venture.",
      keyFeatures: [
        "Company mission and vision statements",
        "Core values presentation",
        "Company timeline/history",
        "Leadership team introduction"
      ]
    },
    {
      name: "What We Do",
      path: "/what-we-do",
      description: "Detailed information about the services offered by Lupus Venture.",
      keyFeatures: [
        "Service cards with descriptions",
        "Feature comparison table",
        "Service packages information"
      ]
    },
    {
      name: "Insights",
      path: "/insights",
      description: "A page highlighting our future vision, innovation goals, and commitment to sustainable growth.",
      keyFeatures: [
        "Innovation at scale goals",
        "Global impact vision",
        "Thought leadership objectives",
        "Sustainable growth commitment"
      ]
    },
    {
      name: "Reach Us",
      path: "/reach-us",
      description: "Contact form and company contact information for inquiries and collaborations.",
      keyFeatures: [
        "Contact form for inquiries",
        "Company address and contact details",
        "Social media links",
        "Feedback submission form"
      ]
    },
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
  ]
};

export function getWebsiteContextPrompt(): string {
  return `
Website Context for Lupus Venture:

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

Use this context to accurately answer questions about the website and its services.
`;
}