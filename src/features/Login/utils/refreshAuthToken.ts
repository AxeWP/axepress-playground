import { gql } from '@apollo/client';
import { getApolloClient } from '@/lib/apolloClient';
import { RefreshAuthTokenMutation } from '@graphqlTypes';

const REFRESH_TOKEN_MUTATION = gql`
	mutation RefreshAuthToken( $refreshToken: String! ) {
		refreshToken(
			input: {
				refreshToken: $refreshToken
			}
		) {
			authToken
			success
		}
	}
`;

export const refreshAuthToken : ( refreshToken: string ) => Promise<string> = async ( refreshToken: string ) => {
	const variables = {
		refreshToken,
	};

	const client = getApolloClient();

	const {
		data,
	} = await client.mutate<RefreshAuthTokenMutation>( {
		mutation: REFRESH_TOKEN_MUTATION,
		variables,
	} );

	return data?.refreshToken?.authToken ?? '';
};
