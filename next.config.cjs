/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'placehold.co'],
    domains: ['placehold.co', 'another-domain.com'],
  },
};

module.exports = nextConfig;
