import { useState } from 'react';

export const useLogout = () => {
	const [ logoutError, setLogoutError ] = useState<unknown>( undefined );
	const [ isLoading, setIsLoading ] = useState( false );

	async function logout( redirectUrl?: string ) {
		setIsLoading( true );

		const logoutUrl = '/api/auth/logout';

		try {
			const res = await fetch( logoutUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			} );

			if ( ! res.ok ) {
				const { error } = await res.json();
				setLogoutError( error );
				setIsLoading( false );
				return;
			}

			if ( redirectUrl ) {
				window.location.assign( redirectUrl );
			} else {
				window.location.reload();
			}

			setIsLoading( false );
		} catch ( e ) {
			setLogoutError( e );
			setIsLoading( false );
		}
	}

	return {
		logout,
		error: logoutError,
		isLoading,
	};
};
