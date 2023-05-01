import { useEffect, useState } from 'react';
import { UserSession } from '../types';

export const useAuth = ( {
	redirectTo,
	redirectOnError = true,
}: {
	redirectTo?: string,
	redirectOnError?: boolean
} ) => {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ userData, setUserData ] = useState<UserSession['userData'] | undefined>( undefined );
	const [ error, setError ] = useState<Error | undefined>();
	const [ isAuthenticated, setIsAuthenticated ] = useState<boolean | undefined>();

	useEffect( () => {
		( async () => {
			const res = await fetch(
				'/api/auth/user',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			const data = await res.json();

			setIsLoading( false );
			setUserData( data?.user );
			setIsAuthenticated( !! data?.user?.isLoggedIn );
			setError( data?.error );
		} )();
	}, [] );

	useEffect( () => {
		if ( !! isLoading || ! redirectTo || isAuthenticated === undefined ) {
			return;
		}

		if ( redirectOnError !== isAuthenticated ) {
			setTimeout( () => {
				window.location.assign( redirectTo );
			}, 200 );
		}
	}, [ isLoading, isAuthenticated, redirectOnError, redirectTo ] );

	return {
		isLoading,
		isAuthenticated,
		userData,
		error,
	};
};
