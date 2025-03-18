import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import nextRoutes from "nextjs-routes/config";

const withRoutes = nextRoutes({ outDir: 'src' });

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default withPayload(withRoutes(nextConfig));
