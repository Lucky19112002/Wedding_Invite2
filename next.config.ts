import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables Static HTML Export
  output: "export",
  
  // GitHub Pages doesn't support Next.js Image Optimization
  images: {
    unoptimized: true,
  },

  // NOTE: If you are hosting at github.com/username/repo-name instead of username.github.io,
  // uncomment the next line and replace 'repo-name' with your actual repository name.
  // basePath: '/repo-name',
};

export default nextConfig;
