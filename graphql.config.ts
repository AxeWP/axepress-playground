// Import env variables
require( 'dotenv' ).config(); // eslint-disable-line @typescript-eslint/no-var-requires
import { getGraphqlEndpoint } from '@faustwp/core';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: [
		{
			[ `${ getGraphqlEndpoint() }` ]: {
				headers: {
					Origin: process.env.NEXT_PUBLIC_SITE_URL, // Required to limit authorized domains.
				},
			},
		},
	],
	// match any tsx file in the src directory no matter how deep
	documents: [ './src/**/*.{tsx,ts}', '!./src/__generated__/**/*' ],
	generates: {
		'./src/__generated__/': {
			preset: 'client',
			presetConfig: {
				gqlTagName: 'gql',
				fragmentMasking: false,
			},
			config: {
				reactApolloVersion: 3,
				declarationKind: {
					union: 'type',
					type: 'interface',
					input: 'interface',
					scalar: 'interface',
					arguments: 'interface',
					interface: 'interface',
				},
				withRefretchFn: true,
				useImplementingTypes: true,
				ignoreNoDocuments: true,
			},
		},
	},
};

export default config;
