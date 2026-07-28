/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every workspace package ships raw TSX from `src/` and is compiled by the consuming
  // app. `@fanation/brand` arrives transitively through `@fanation/ui`, but Next only
  // transpiles what is named here — omit it and the build dies on the first `.tsx`.
  transpilePackages: ["@fanation/ui", "@fanation/core", "@fanation/brand"],
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
