import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      // Added Cloudinary configuration
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;