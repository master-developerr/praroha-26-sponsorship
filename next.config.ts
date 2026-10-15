import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/sign-in",
        permanent: false,
      },
      {
        source: "/onboarding",
        destination: "/register/profile",
        permanent: false,
      },
      {
        source: "/workspace/access-pending",
        destination: "/pending",
        permanent: false,
      },
      {
        source: "/workspace/access-rejected",
        destination: "/rejected",
        permanent: false,
      },
      {
        source: "/workspace/access-suspended",
        destination: "/suspended",
        permanent: false,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
