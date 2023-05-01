import { GraphQLErrors } from '@apollo/client/errors';
import { useState } from 'react';
import { UserDataFragFragment } from '@graphqlTypes';

export const usePasswordLogin = () => {
	const [ loginErrors, setLoginErrors ] = useState<GraphQLErrors>();
	const [ isLoading, setIsLoading ] = useState( false );

	const [ userData, setUserData ] = useState<UserDataFragFragment | undefined >( undefined );

	async function login( username: string, password: string, redirectTo?: string ) {
		setIsLoading( true );

		const loginUrl = '/api/auth/login/password';

		const res = await fetch( loginUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				username,
				password,
			} ),
		} );

		if ( ! res.ok ) {
			const { errors } = await res.json();
			setLoginErrors( errors );
			setIsLoading( false );
			return;
		}

		const { user } = await res.json();

		setUserData( user );
		setIsLoading( false );

		if ( redirectTo ) {
			window.location.assign( redirectTo );
		}
	}

	return {
		login,
		errors: loginErrors,
		isLoading,
		isAuthenticated: !! userData,
		userData,
	};
};
