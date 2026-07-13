/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['outpost-prewar-pregnant.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
