/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	root: true,
	overrides: [
		{
			files: [ "*.tsx", "*.ts", "*.jsx", "*.js" ],
			parser: "@typescript-eslint/parser",
			processor: "@graphql-eslint/graphql",
			rules: {
				"no-console": "off",
				"no-unused-vars": "off",
				"array-bracket-spacing": [ "warn", "always" ],
				"object-curly-spacing": [ "warn", "always" ],
				"space-in-parens": [ "warn", "always" ],
				"indent": [ "error", "tab" ],
				"unused-imports/no-unused-imports": "off",
				"unused-imports/no-unused-vars": [
					"warn",
					{
						"vars": "all",
						"varsIgnorePattern": "^_",
						"args": "after-used",
						"argsIgnorePattern": "^_"
					}
				],
				"import/order": [
					"error",
					{
						"groups": [
							"builtin",
							"external",
							"internal",
							"parent",
							"sibling",
							"index",
							"object",
							"type"
						],
						"alphabetize": {
							"order": "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
							"caseInsensitive": true /* ignore case. Options: [true, false] */
						}
					}
				],
				"import/namespace": [ "error", { "allowComputed": true } ],
				"jsdoc/require-param-type": "off",
				"react/function-component-definition": [ 2, { "namedComponents": "arrow-function" } ]
			},
			extends: [
				"eslint:recommended",
				"next/core-web-vitals",
				"plugin:@wordpress/eslint-plugin/jsx-a11y",
				"plugin:@wordpress/eslint-plugin/esnext",
				"plugin:@wordpress/eslint-plugin/i18n",
				"plugin:import/recommended",
				"plugin:import/typescript",
				"plugin:@typescript-eslint/recommended",
				"plugin:@next/next/recommended"
			],
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			},
			env: {
				browser: true,
				node: true,
				es6: true
			},
			globals: {
				"window": true,
				"document": true,
			},
			plugins: [ "prettier", "import", "unused-imports", "@typescript-eslint" ],
			settings: {
				"import/resolver": {
					"typescript": {
						"alwaysTryTypes": true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
					}
				}
			}
		},
		{
			files: [ "*.graphql" ],
			parser: "@graphql-eslint/eslint-plugin",
			extends: "plugin:@graphql-eslint/schema-recommended",
			plugins: [ "@graphql-eslint" ]
		}
	]
}
