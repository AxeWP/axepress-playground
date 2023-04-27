const { withFaust, getWpHostname } = require( '@faustwp/core' ); // eslint-disable-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require( '@next/bundle-analyzer' )( { // eslint-disable-line @typescript-eslint/no-var-requires
	enabled: process.env.ANALYZE === 'true',
} );
const withPWA = require( 'next-pwa' )( { // eslint-disable-line @typescript-eslint/no-var-requires
	dest: 'public',
	register: true,
	skipWaiting: true,
	buildExcludes: [ /middleware-manifest.json$/ ],
	disable: process.env.NODE_ENV === 'development',
} );

const faustConfig = withBundleAnalyzer(
	withPWA( {
		typescript: {
			// !! WARN !!
			// Dangerously allow production builds to successfully complete even if
			// your project has type errors.
			// !! WARN !!
			ignoreBuildErrors: true,
		},
		swcMinify: true,
		trailingSlash: true,
		reactStrictMode: true,
		compress: true,
		productionBrowserSourceMaps: true,
		experimental: {
			swcFileReading: true,
		},
		pageExtensions: [ 'ts', 'tsx', 'js', 'jsx' ],
		images: {
			domains: [ getWpHostname(), process.env.NEXT_PUBLIC_WORDPRESS_URL ],
			minimumCacheTTL: 31536000,
		},
		sassOptions: {
			includePaths: [ 'node_modules', './src' ],
		},
		webpack( config ) {
			config.module.rules.push( {
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: [ '@svgr/webpack' ],
			} );
			return config;
		},
		async redirects() {
			return require( './redirects.json' );
		},
		rewrites: async () => [
			{
				source: '/rss.xml',
				destination: '/api/feeds/rss.xml',
			},
			{
				source: '/feed.atom',
				destination: '/api/feeds/feed.atom',
			},
			{
				source: '/feed.json',
				destination: '/api/feeds/feed.json',
			},
		],
	} ),
);

/**
 * @type {import('next').NextConfig}
 */
module.exports = withFaust( faustConfig );
