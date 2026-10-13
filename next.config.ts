import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	images: { imageSizes: [32, 48, 64, 96, 128, 256, 384, 768, 1080, 1376], qualities: [50, 75, 100] }
};

export default nextConfig;
