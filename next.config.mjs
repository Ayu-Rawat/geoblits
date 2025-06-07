/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.com', 
      },
      {
        protocol: 'http',
        hostname: '**.com', 
      },
    ],
  },
};

export default nextConfig;