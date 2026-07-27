import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables Static HTML Export
  output: "export",
  
  // GitHub Pages doesn't support Next.js Image Optimization
  images: {
    unoptimized: true,
  },

  // Required since your repo is named 'Wedding_Invite2'
  // basePath: '/Wedding_Invite2',
};

export default nextConfig;
