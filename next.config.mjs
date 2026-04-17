/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static site generation (SSG)
  trailingSlash: true, // Required for clean URLs on static hosts like Render
  images: {
    unoptimized: true, // Required for static export
  },
  // Next.js automatically picks up paths from tsconfig.json
};

export default nextConfig;
