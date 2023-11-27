/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
    removeConsole:
      process.env.NODE_ENV === "local" || process.env.NODE_ENV === "dev"
        ? false
        : { exclude: ["error"] },
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
