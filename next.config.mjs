import million from 'million/compiler';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
				port: '',
			},
		],
	},
	async redirects() {
		return [];
	},
};

let configExport = nextConfig;

if (process.env.NODE_ENV === 'production') {
	console.log('Loaded production config');
	configExport = million.next(nextConfig, { auto: true });
}

export default configExport;
