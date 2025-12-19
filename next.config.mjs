/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // This forces the browser to load images directly
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
