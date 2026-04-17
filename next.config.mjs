/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static site generation (SSG)
  images: {
    unoptimized: true, // Required for static export
  },
  // Add path aliases to match existing project structure
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './client/src',
      '@assets': './assets',
    };
    return config;
  },
};

export default nextConfig;
