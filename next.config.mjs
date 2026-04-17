/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static site generation (SSG) for Render/SEO
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;
