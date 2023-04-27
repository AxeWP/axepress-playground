module.exports = {
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/features/**/*.{js,ts,jsx,tsx}',
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/wp-blocks/**/*.{js,ts,jsx,tsx}',
		'./src/wp-templates/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			background: '#fafafb',
			black: '#000',
			white: '#fff',
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1200px',
		},
	},
	plugins: [ require( '@tailwindcss/forms' ) ],
	safelist: [ 'flex-wrap-reverse', 'gap-0', 'list-disc', 'list-inside' ],
};
