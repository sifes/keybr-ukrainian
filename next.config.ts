import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/keybr-ukrainian" : "",
  assetPrefix: isGithubPages ? "/keybr-ukrainian/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
