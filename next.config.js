/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sequelize'],
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://157.180.87.32:3000",
    ],
  },
  // Настройки для production
  poweredByHeader: false,
  compress: true,
  // Настройки для статических файлов
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
