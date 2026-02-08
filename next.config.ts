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

  async rewrites(){
    return [
      {
        source: "/api/:path*",
        destination: "https://finprime-backend-app.onrender.com/:path*"
      }
    ]
  }
};

export default nextConfig;