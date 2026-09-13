import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Dev keeps server routes (avatar save). Production build stays static export.
	...(process.env.NODE_ENV === "development" ? {} : { output: "export" as const }),
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
