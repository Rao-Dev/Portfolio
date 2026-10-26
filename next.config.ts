import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is the default for everything; 90 is reserved for the headshot.
    qualities: [75, 90],
  },
};

export default nextConfig;
