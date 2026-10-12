import type { MetadataRoute } from 'next';

import { APP_CONFIG } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: APP_CONFIG.fullName,
		short_name: APP_CONFIG.name,
		description: APP_CONFIG.description,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#2563eb',
		icons: [
			{ src: '/icon.png', sizes: 'any', type: 'image/png' },
			{ src: '/images/app-logo.png', sizes: '192x192', type: 'image/png' },
			{ src: '/images/app-logo.png', sizes: '512x512', type: 'image/png' }
		]
	};
}
