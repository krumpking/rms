/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        // SET PATTERN FOR YOUR FIREBASE IMAGE HOST
        protocol: "https",
        hostname: "**.**.**",
      },
    ],
  },
  nextConfig: {
    reactStrictMode: true,
    swcMinify: false,
  },
};
