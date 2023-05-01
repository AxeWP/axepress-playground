import { gql } from '@apollo/client';
import { __ } from '@wordpress/i18n';
import { LoginClientFragFragment, LoginProviderEnum } from '@graphqlTypes';
import { OAuth2ClientList } from './OAuth2ClientList';
import { PasswordForm } from './PasswordForm';

export const LoginFormContainer = ( { loginClients } : {
	loginClients: LoginClientFragFragment[] | undefined;
} ) => {
	// Filter out the disabled clients.
	const enabledClients = loginClients?.filter( ( client ) => client?.isEnabled ) || [];

	// Get the Oauth2 Clients.
	const oauthClients = enabledClients.filter( ( client ) => client?.authorizationUrl );

	// Get the password client
	const passwordClient = enabledClients.find( ( client ) => client?.provider === LoginProviderEnum.Password );

	return (
		<div className="max-w-md w-full space-y-8">
			<div className="has-text-align-center">
				<h2 className="wp-block-heading mt-6 text-3xl font-extrabold">
					{ __( 'Welcome Back', 'axepress-labs' )}
				</h2>
				<p className="mt-2 has-small-font-size">
					{ __( 'Sign in to your account', 'axepress-labs' ) }
				</p>
			</div>
			{
				oauthClients.length > 0 && (
					<>
						<OAuth2ClientList clients={oauthClients} />
						<div className="flex items-center justify-center space-x-2 w-full">
							<span className="h-px w-16 bg-secondary"></span>
							<span className="has-normal-font-size">
								{ __( 'or continue with', 'axepress-labs' ) }

							</span>
							<span className="h-px w-16 bg-secondary"></span>
						</div>
					</>
				)
			}
			{
				passwordClient && <PasswordForm />
			}
		</div>
	);
};

LoginFormContainer.fragments = {
	loginClients: gql`
		${ OAuth2ClientList.fragments.client }
		fragment LoginClientsFrag on RootQuery {
			loginClients {
				...LoginClientFrag
			}
		}
	`,
};
