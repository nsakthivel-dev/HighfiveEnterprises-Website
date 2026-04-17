import { adminDb } from "../server/firebase";

const services = [
  {
    title: "Web Development",
    description: "Enterprise-grade web applications built with modern frameworks like React and Next.js.",
    features: ["Scalable architectures", "Responsive design", "SEO optimization", "API integration"],
    icon: "Code2",
    sort_order: 1,
    is_active: true
  },
  {
    title: "UI/UX Design",
    description: "User-centric designs that prioritize intuitive experiences and brand identity.",
    features: ["Interactive prototyping", "User journey mapping", "Modern aesthetics", "Design systems"],
    icon: "Palette",
    sort_order: 2,
    is_active: true
  },
  {
    title: "AI Solutions",
    description: "Leveraging machine learning to automate processes and provide intelligent insights.",
    features: ["LLM integration", "Data analytics", "Predictive modeling", "Custom AI agents"],
    icon: "Cpu",
    sort_order: 3,
    is_active: true
  },
  {
    title: "Security Audits",
    description: "Comprehensive security checks to ensure your data and users are safe.",
    features: ["Penetration testing", "Vulnerability scanning", "Compliance audits", "Code review"],
    icon: "Shield",
    sort_order: 4,
    is_active: true
  }
];

const packages = [
  {
    name: "Starter",
    price: "₹3,000",
    description: "Perfect for personal brands and small businesses.",
    features: [
      { name: "1-2 Web Pages", included: true },
      { name: "Mobile Responsive", included: true },
      { name: "Contact Form", included: true },
      { name: "1 Logo Concept", included: true },
      { name: "1 Revision", included: true },
      { name: "1 Poster Design", included: true },
      { name: "Marketing Support", included: false },
      { name: "Platform Listing", included: false },
    ],
    is_recommended: false,
    is_active: true,
    sort_order: 1
  },
  {
    name: "Professional",
    price: "₹6,000",
    description: "Ideal for growing startups needing custom solutions.",
    features: [
      { name: "3-5 Web Pages", included: true },
      { name: "Portfolio Section", included: true },
      { name: "Basic Analytics", included: true },
      { name: "2 Logo Concepts", included: true },
      { name: "Business Card Mockup", included: true },
      { name: "2 Poster Designs", included: true },
      { name: "Marketing (5 Days)", included: true },
      { name: "2 Platform Listings", included: true },
    ],
    is_recommended: true,
    is_active: true,
    sort_order: 2
  },
  {
    name: "Enterprise",
    price: "₹10,000+",
    description: "Full-scale solutions for large organizations.",
    features: [
      { name: "Custom Web App", included: true },
      { name: "Basic SEO Setup", included: true },
      { name: "Blog Setup", included: true },
      { name: "3 Logo Concepts", included: true },
      { name: "3 Revisions", included: true },
      { name: "Short Promo Video", included: true },
      { name: "Marketing (10 Days)", included: true },
      { name: "3 Platform Listings", included: true },
    ],
    is_recommended: false,
    is_active: true,
    sort_order: 3
  }
];

async function seed() {
  console.log("🚀 Starting Firestore Seeding...");

  try {
    // 1. Seed Services
    const servicesCol = adminDb.collection('services');
    const serviceSnap = await servicesCol.get();
    console.log(`🗑️ Deleting ${serviceSnap.size} existing services...`);
    for (const doc of serviceSnap.docs) {
      await doc.ref.delete();
    }

    for (const s of services) {
      await servicesCol.add({
        ...s,
        created_at: new Date().toISOString()
      });
      console.log(`✅ Added service: ${s.title}`);
    }

    // 2. Seed Packages
    const packagesCol = adminDb.collection('packages');
    const packageSnap = await packagesCol.get();
    console.log(`🗑️ Deleting ${packageSnap.size} existing packages...`);
    for (const doc of packageSnap.docs) {
      await doc.ref.delete();
    }

    for (const p of packages) {
      await packagesCol.add({
        ...p,
        created_at: new Date().toISOString()
      });
      console.log(`✅ Added package: ${p.name}`);
    }

    console.log("✨ Seeding Complete!");
  } catch (err) {
    console.error("❌ Seeding failed during Firestore operations:", err);
  } finally {
    process.exit(0);
  }
}

seed().catch(err => {
  console.error("❌ Fatal seeding error:", err);
  process.exit(1);
});

