import { gql } from '@apollo/client';
import { GraphQLErrors } from '@apollo/client/errors';
import { getApolloClient } from '@/lib/apolloClient';
import { LoginInput, LoginMutation } from '@graphqlTypes';

const USER_DATA_FRAG = gql`
	fragment UserDataFrag on User {
		databaseId
		name
		email
	}
`;

const LOGIN_MUTATION = gql`
	${ USER_DATA_FRAG }
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			authToken
			refreshToken
			userData: user {
				...UserDataFrag
			}
		}
	}
`;

export const authenticate = async ( input: LoginInput ) : Promise<{
	login: LoginMutation['login'],
	errors: GraphQLErrors | undefined,
}> => {
	const client = getApolloClient();

	const {
		data,
		errors,
	} = await client.mutate<LoginMutation>( {
		mutation: LOGIN_MUTATION,
		variables: { input },
	} );

	return { login: data?.login, errors };
};
