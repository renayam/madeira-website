/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle sequelize for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        "pg-hstore": false,
        tedious: false,
        nock: false,
        "aws-sdk": false,
        "mock-aws-s3": false,
        mysql2: false,
        sqlite3: false,
        "pg-native": false,
        "@sequelize/core": false,
        sequelize: false,
        mariadb: false,
      };
    }
    return config;
  },
  // Configurations pour les images distantes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xbackbone.madeira.eco",
      },
      {
        protocol: "https",
        hostname: "s3.fr-par.scw.cloud",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/proxy-image",
        search: "url=*",
      },
      {
        pathname: "/images/**",
      },
    ],
  },
  // Packages externes pour le server components
  serverExternalPackages: ["sequelize", "mariadb"],
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "renayam",
  project: "madeira",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
