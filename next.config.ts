import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add Prisma engines to the bundle
      config.externals.push({
        "@prisma/client": "@prisma/client",
      });

      // Copy Prisma engines
      config.plugins.push(require("@prisma/nextjs-monorepo-workaround-plugin").PrismaPlugin());
    }
    return config;
  },
  experimental: {
    // Help Prisma work better in serverless environments
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
