import { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { Loading } from '@/components';
import { useAuth } from '../hooks';
import { UserSession } from '../types';

export const AuthenticationContext = createContext<{
	isAuthenticated: boolean | undefined;
	isLoading: boolean;
	userData: UserSession['userData'];
	error: Error | undefined,
}>( {
	isAuthenticated: false,
	isLoading: true,
	userData: undefined,
	error: undefined,
} );

const shouldShowChildren = (
	isAuthenticated: boolean | undefined,
	isLoading: boolean,
	redirectOnError: boolean ) => {
	// Hide until we know if the user is authenticated.
	if ( isLoading ) {
		return false;
	}

	// If we're redirecting on an error, we need to know if the user is authenticated.
	if ( redirectOnError && isAuthenticated === undefined ) {
		return false;
	}

	// Return based on how the child is gated.
	return isAuthenticated === redirectOnError;
};

export const AuthenticationProvider = ( { redirectTo, redirectOnError = true, children } : PropsWithChildren<{
	redirectTo?: string;
	redirectOnError?: boolean;
}> ) => {
	const [ showChildren, setShowChildren ] = useState( ! redirectTo );

	const { isAuthenticated, isLoading, error, userData } = useAuth( { redirectTo, redirectOnError } );

	useEffect( () => {
		if ( ! redirectTo ) {
			return;
		}

		const show = shouldShowChildren( isAuthenticated, isLoading, redirectOnError );

		if ( showChildren !== show ) {
			setShowChildren( show );
		}
	}, [ isAuthenticated, isLoading, redirectOnError, redirectTo, showChildren ] );

	return (
		<AuthenticationContext.Provider value={ { isAuthenticated, isLoading, error, userData } }>
			{ showChildren ? children : <Loading /> }
		</AuthenticationContext.Provider>
	);
};

export const useAuthenticationContext = () => useContext( AuthenticationContext );
