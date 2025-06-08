/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Рекомендуется для выявления потенциальных проблем
  transpilePackages: ['sequelize'],
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000", // Для обычного доступа
      "http://127.0.0.1:3000", // На случай, если fetch резолвится на IP
    ],
  },
  // Если у вас есть другие конфигурации, их нужно будет добавить сюда
  // Например, если вы используете env переменные:
  // env: {
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // },
};

export default nextConfig; // Используем export default для ES Modules
