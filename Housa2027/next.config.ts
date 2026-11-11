import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Tree-shake MUI icon imports.
  experimental: { optimizePackageImports: ['@mui/icons-material', '@mui/material'] },
};

export default nextConfig;
