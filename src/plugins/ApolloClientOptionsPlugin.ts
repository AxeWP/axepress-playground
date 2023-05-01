import { NormalizedCacheObject, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getGraphqlEndpoint, FaustHooks } from '@faustwp/core';
import type { ApolloClientOptions } from '@apollo/client/core/ApolloClient';

async function loggingFetch( input: RequestInfo, init?: RequestInit ): Promise<Response> {
	const body = init?.body ? JSON.parse( init.body.toString() ) : {};

	// log request headers.
	console.log( `${ new Date().toISOString().slice( -13 ) } 📡 Sending ${ body.operationName } request headers:` );

	const start = Date.now();
	console.log( `${ new Date().toISOString().slice( -13 ) } 📡 Sending ${ body.operationName } request` );
	console.log( `${ new Date().toISOString().slice( -13 ) } 🤯 Request Headers: `, { ...init?.headers } );
	const response = await fetch( input, init );
	console.log( `${ new Date().toISOString().slice( -13 ) } 📡 Received ${ body.operationName } response in ${ Date.now() - start }ms` );
	console.log( `${ new Date().toISOString().slice( -13 ) }🎩 Response Headers:`, { ...response.headers } );

	return {
		...response,

		async text() {
			const textStart = Date.now();
			const result = await response.text();
			console.log( `${ new Date().toISOString().slice( -13 ) } ⚙️ Read ${ body.operationName } response body in ${ Date.now() - textStart }ms (${ result.length } bytes)` );
			return result;
		},
	};
}

const httpLink = createHttpLink( {
	uri: getGraphqlEndpoint(), // The backend is at a different URL.
	credentials: 'omit',
	// Without this, no Origin is set despite the fact that the request is cross-origin.
	headers: {
		Origin: process.env.NEXT_PUBLIC_SITE_URL,
	},
	fetchOptions: {
		mode: 'cors',
		referrerPolicy: 'strict-origin-when-cross-origin',
	},
	fetch: process.env.NODE_ENV === 'development' ? loggingFetch : undefined,
} );

const errorLink = onError( ( { graphQLErrors, networkError } ) => {
	if ( graphQLErrors ) {
		graphQLErrors.forEach( ( { message, locations, path } ) =>
			console.log(
				`[GraphQL error]: Message: ${ message }, Path: ${ path }, Locations: ${ locations?.toString() }`,
			),
		);
	}

	if ( networkError ) {
		console.log( `[Network error]: ${ networkError }` );
	}
} );

class ApolloClientOptionsPlugin {
	apply( { addFilter }: FaustHooks ) {
		addFilter(
			'apolloClientOptions',
			'faust',
			( apolloClientOptions ) : ApolloClientOptions<NormalizedCacheObject> => {
				return {
					...apolloClientOptions,
					link: errorLink.concat( httpLink ),
				};
			},
		);
	}
}

export default ApolloClientOptionsPlugin;
