/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle sequelize for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'pg-hstore': false,
        tedious: false,
        nock: false,
        'aws-sdk': false,
        'mock-aws-s3': false,
        'mysql2': false,
        sqlite3: false,
        'pg-native': false,
        '@sequelize/core': false,
        sequelize: false,
        mariadb: false,
      };
    }
    return config;
  },
  // Ajoutez ces configurations pour gérer les images
  images: {
    domains: ['localhost', 's3.fr-par.scw.cloud'], // Added Scaleway S3 domain
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'mariadb'],
  },
}

module.exports = nextConfig
