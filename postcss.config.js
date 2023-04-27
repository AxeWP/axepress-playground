module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-flexbugs-fixes': {},
		'postcss-focus-visible': {},
		'tailwindcss/nesting': {},
		tailwindcss: {
			config: './tailwind.config.js',
		},
		'postcss-font-magician': {
			variants: {
				'Source Sans Pro': {
					400: [ 'woff2', 'latin' ],
					'400 italic': [ 'woff2', 'latin' ],
					'700 italic': [ 'woff2', 'latin' ],
					700: [ 'woff2', 'latin' ],
				},
			},
			aliases: {
				'sans-serif': 'Source Sans Pro',
			},
			foundries: [ 'google' ],
		},
		'postcss-preset-env': {
			autoprefixer: {
				flexbox: 'no-2009',
			},
			stage: 3,
			features: {
				'custom-properties': false,
				'nesting-rules': true,
			},
		},
		// '@fullhuman/postcss-purgecss':
		// {
		// 	content: [
		// 		'./src/pages/**/*.{js,jsx,ts,tsx}',
		// 		'./src/features/**/*.{js,jsx,ts,tsx}',
		// 		'./src/components/**/*.{js,jsx,ts,tsx}',
		// 		'./src/wp-blocks/**/*.{js,jsx,ts,tsx}',
		// 		'./src/wp-templates/**/*.{js,jsx,ts,tsx}',
		// 	],
		// 	defaultExtractor: ( content ) => content.match( /[\w-/:]+(?<!:)/g ) || [],
		// 	safelist: [ 'html', 'body' ],
		// },
		...( process.env.NODE_ENV === 'production' ? { cssnano: {} } : {} ),
	},
};
