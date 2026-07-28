/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@fanation/ui", "@fanation/core"],
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
