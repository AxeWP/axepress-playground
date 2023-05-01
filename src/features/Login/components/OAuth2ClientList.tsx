import { gql } from '@apollo/client';
import { __, sprintf } from '@wordpress/i18n';
import { LoginClientFragFragment } from '@graphqlTypes';

export const OAuth2ClientList = ( { clients } : {
	clients: LoginClientFragFragment[] | undefined
} ) => {
	if ( ! clients?.length ) {
		return null;
	}

	return (
		<div className="wp-block-group has-text-align-center">
			{ clients.map( ( client ) => {
				if ( ! client?.authorizationUrl ) {
					return null;
				}

				return (
					<a
						key={client.provider}
						href={client.authorizationUrl}
						className="has-regular-font-size hover:shadow-lg cursor-pointer transition ease-in duration-300"
						target="_blank"
					>
						{ sprintf(
							// translators: %s: Client name.
							__( 'Login with %s', 'axepress-labs' ),
							client?.name,
						) }
					</a>
				);
			} ) }
		</div>
	);
};

OAuth2ClientList.fragments = {
	client: gql`
		fragment LoginClientFrag on LoginClient {
			clientId
			authorizationUrl
			name
			provider
			isEnabled
			order
		}
	`,
};

