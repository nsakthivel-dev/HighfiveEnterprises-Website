/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles image optimization natively, 
  // but we keep this if you want to skip it for static assets.
  images: {
    unoptimized: true, 
  },
  // We removed the custom webpack config because Next.js 15+ 
  // uses Turbopack by default and automatically picks up 
  // path aliases from your tsconfig.json.
};

export default nextConfig;
