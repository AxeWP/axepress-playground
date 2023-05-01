
import { __, sprintf } from '@wordpress/i18n';
import { BlockContent, Loading } from '@/components';
import { useAuthenticationContext } from '../providers';
import { LoginFormContainer } from '.';
import type { BlockContentFragFragment, LoginClientFragFragment } from '@graphqlTypes';

export const GatedLogin = ( { editorBlocks, loginClients } : {
	editorBlocks: BlockContentFragFragment['editorBlocks'];
	loginClients: LoginClientFragFragment[];
} ) => {
	const { isAuthenticated, userData, isLoading } = useAuthenticationContext();

	return (
		<div className="wp-block-columns has-global-padding alignfull are-vertically-aligned-center justify-center is-layout-flex min-w-0">
			{ !! editorBlocks?.length && (
				<section className="are-vertically-aligned-center h-full hidden md:flex md:w-1/2 xl:w-2/5 mx-auto has-global-padding">
					<BlockContent blocks={editorBlocks} />
				</section>
			) }
			<section className="are-vertically-aligned-center w-auto md:h-full sm:rounded-lg sm:rounded-none mx-auto has-base-background-color">
				{ isAuthenticated && (
					<div className="has-text-align-center">
						<h2 className="wp-block-heading has-max-36-font-size has-text-align-center mb-4">
							{ sprintf(
								// translators: %s: user name
								__( 'Welcome back%s!', 'axepress-labs' ),
								userData?.name ? `, ${ userData.name }` : '',
							) }
						</h2>
						<p className="has-text-align-center">
							{ __( 'Redirecting you to your account…' ) }
						</p>
						<Loading />
					</div>
				) }
				{ ! isLoading && ! isAuthenticated && !! loginClients?.length && ( <LoginFormContainer loginClients={loginClients} /> ) }
				{ ! isLoading && ! isAuthenticated && ! loginClients?.length && (
					<>
						{__( 'Error! You must configure at least one login client.', 'axepress-labs' ) }
					</>
				) }
			</section>
		</div>
	);
};
