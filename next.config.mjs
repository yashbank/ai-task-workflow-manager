/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    NEXT_PUBLIC_DISABLE_AUTH:
      process.env.DISABLE_AUTH ?? process.env.NEXT_PUBLIC_DISABLE_AUTH ?? "true",
  },
};

export default nextConfig;
