import type { NextConfig } from 'next';

// GITHUB_PAGES=1 builds a static site for https://<user>.github.io/Claude/housa2027/.
// The API routes are named route.server.ts, so the static build (which can't run them) leaves them out.
const pages = process.env.GITHUB_PAGES === '1';
const basePath = pages ? process.env.PAGES_BASE_PATH ?? '/Claude/housa2027' : '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: pages ? ['tsx', 'ts'] : ['tsx', 'ts', 'server.ts'],
  ...(pages && { output: 'export', basePath, trailingSlash: true, images: { unoptimized: true } }),
  env: { NEXT_PUBLIC_STATIC_EXPORT: pages ? '1' : '0', NEXT_PUBLIC_BASE_PATH: basePath },
  // Tree-shake MUI icon imports.
  experimental: { optimizePackageImports: ['@mui/icons-material', '@mui/material'] },
};

export default nextConfig;
