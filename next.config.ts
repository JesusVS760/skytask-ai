import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add Prisma engines to the bundle
      config.externals.push({
        "@prisma/client": "@prisma/client",
      });

      // Copy Prisma engines with proper 'new' constructor
      const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
      config.plugins.push(new PrismaPlugin());
    }
    return config;
  },
  // Updated config option for Next.js 15
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
