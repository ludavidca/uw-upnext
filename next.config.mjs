/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.instagram.com",
      },
      {
        protocol: "https",
        hostname: "8d3cdb9a.rocketcdn.me",
      },
      {
        protocol: "https",
        hostname: "wusa.ca",
      },
    ],
  },
};

export default nextConfig;
