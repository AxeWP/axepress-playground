
import { ApolloClient, ApolloClientOptions, InMemoryCache, InMemoryCacheConfig, NormalizedCacheObject, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { mergeDeep } from '@apollo/client/utilities';
import { getConfig, getGraphqlEndpoint, hooks } from '@faustwp/core';
import { APOLLO_STATE_PROP_NAME } from '@faustwp/core/dist/cjs/client';

declare global {
	interface Window {
		[APOLLO_STATE_PROP_NAME]: NormalizedCacheObject;
	}
}

const windowApolloState = typeof window !== 'undefined' ? window[ APOLLO_STATE_PROP_NAME ] : {};

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
let apolloAuthClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient( authenticated = false ) {
	const { possibleTypes } = getConfig();

	let inMemoryCacheObject: InMemoryCacheConfig = {
		possibleTypes,
		typePolicies: {
			RootQuery: {
				queryType: true,
			},
			RootMutation: {
				mutationType: true,
			},
		},
	};

	inMemoryCacheObject = hooks.applyFilters(
		'apolloClientInMemoryCacheOptions',
		inMemoryCacheObject,
		{},
	) as InMemoryCacheConfig;

	const httpLink = createHttpLink( {
		uri: getGraphqlEndpoint(),
	} );

	const authLink = setContext( async ( _, { headers } ) => {
		const { authToken } = await fetch( '/api/auth/user' ).then( ( res ) => res.json() ) as { authToken: string | undefined };

		return {
			headers: {
				...headers,
				authorization: authToken ? `Bearer ${ authToken }` : '',
			},
		};
	} );

	let apolloClientOptions: ApolloClientOptions<NormalizedCacheObject> = {
		ssrMode: typeof window === 'undefined',
		connectToDevTools: typeof window !== 'undefined',
		link: authenticated ? authLink.concat( httpLink ) : httpLink,
		cache: new InMemoryCache( inMemoryCacheObject ).restore( windowApolloState ),
	};

	apolloClientOptions = hooks.applyFilters(
		'apolloClientOptions',
		apolloClientOptions,
		{},
	) as ApolloClientOptions<NormalizedCacheObject>;

	return new ApolloClient( apolloClientOptions );
}

export function getApolloClient( initialState: NormalizedCacheObject | null = null ) {
	const _apolloClient = apolloClient ?? createApolloClient();

	// hydrate the cache with the initial state
	if ( initialState ) {
		const existingCache = _apolloClient.extract();

		const data = mergeDeep( existingCache, initialState, {
			arrayMerge: ( destinationArray: undefined[], sourceArray: undefined[] ) => [
				...sourceArray,
				...destinationArray.filter( ( d ) => sourceArray.every( ( s ) => ! Object.is( d, s ) ) ),
			],
		} );

		_apolloClient.cache.restore( data );
	}

	// For SSG and SSR always create a new Apollo Client
	if ( typeof window === 'undefined' ) {
		return _apolloClient;
	}

	// Create the Apollo Client once in the client
	if ( ! apolloClient ) {
		apolloClient = _apolloClient;
	}

	return _apolloClient;
}

export function getApolloAuthClient() {
	const _apolloAuthClient = apolloAuthClient ?? createApolloClient( true );

	if ( ! apolloAuthClient ) {
		apolloAuthClient = _apolloAuthClient;
	}

	return _apolloAuthClient;
}
