/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static site generation (SSG) for Render/SEO
  images: {
    unoptimized: true, 
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'lupusventure.com' }],
        destination: 'https://www.lupusventure.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
