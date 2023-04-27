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
			base: '#ffffff',
			contrast: '#000000',
			primary: '#0000ff',
			secondary: '#000099',
			neutral: '#eeeeee',
		},
		screens: {
			sm: '480px',
			md: '640px',
			lg: '800px',
			xl: '1200px',
		},
	},
	plugins: [ require( '@tailwindcss/forms' ) ],
	safelist: [ 'flex-wrap-reverse', 'gap-0', 'list-disc', 'list-inside' ],
};
