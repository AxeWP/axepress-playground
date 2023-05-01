import { __, sprintf } from '@wordpress/i18n';
import Link from 'next/link';
import { useAuth, useLogout } from '../hooks';

export const UserMenu = () => {
	const { isAuthenticated, userData, isLoading } = useAuth( {} );
	const { logout, isLoading: isLoggingOut } = useLogout();

	if ( isLoading ) {
		return <></>;
	}

	return (
		<div className="wp-block-button is-style-outline-background is-style-outline has-small-font-size mr-4">
			{ ! isAuthenticated ? (
				<Link href="/login" className="wp-block-button__link wp-element-button">
					{__( 'Login', 'axepress-labs' )}
				</Link> ) : (
				<button className="wp-block-button__link wp-element-button is-style-outline-background is-style-outline has-small-font-size"
					onClick={ () => logout() } disabled={ isLoggingOut }>
					{ __( 'Logout', 'axepress-labs' ) }
					{ userData?.name && sprintf(
						// translators: %s is the user's name
						__( 'as %s', 'axepress-labs' ),
						userData.name,
					) }
				</button>
			)}
		</div>
	);
};
