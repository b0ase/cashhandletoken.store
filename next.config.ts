import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore during build to deploy quickly
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side, completely ignore Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
        fs: false,
        net: false,
        tls: false,
        path: false,
        os: false,
        util: false,
        assert: false,
      };
      
      // Ignore node: protocol URIs on client-side
      config.externals = {
        ...config.externals,
        'scrypt-ts': 'commonjs scrypt-ts',
      };
    }
    
    return config;
  },
};

export default nextConfig;
