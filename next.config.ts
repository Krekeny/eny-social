import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server's internal requests (HMR websocket, /_next assets)
  // when the page is opened from another device on the LAN. Without this,
  // Next 16 rejects the cross-origin dev traffic and the page loads partially.
  allowedDevOrigins: ["192.168.178.20"],
};

export default nextConfig;
