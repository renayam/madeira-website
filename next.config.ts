import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Ne pas inclure les modules Sequelize côté client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Configurations pour les images distantes
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "s3.fr-par.scw.cloud",
      },
    ],
  },
  // Packages externes pour le server component
  serverExternalPackages: ["sequelize", "sequelize-typescript"],
};

export default nextConfig;
