import { gql } from '@apollo/client';
import { FaustTemplate } from '@faustwp/core';
import dynamic from 'next/dynamic';
import { Footer, Header, Layout, Main, BlockContent } from '@/components';
import { LoginFormContainer } from '@/features';
import { GetLoginPageNodeQuery, LoginClientFragFragment } from '@graphqlTypes';

const GatedLogin = dynamic( () => import( '@/features' ).then( ( mod ) => mod.GatedLogin ) );

type CurrentPageType = GetLoginPageNodeQuery['currentPage'] & {
	__typename: 'Page';
}

const Login: FaustTemplate<GetLoginPageNodeQuery> = ( { data, loading } ) => {
	const currentPage = data?.currentPage as CurrentPageType;
	const seo = currentPage?.seo;
	const globalStylesheet = data?.globalStylesheet;

	const headerBlocks = data?.header?.activeTemplatePart?.editorBlocks;

	const editorBlocks =	currentPage?.editorBlocks;
	const footerBlocks = data?.footer?.activeTemplatePart?.editorBlocks;

	const loginClients = ( data?.loginClients ?? [] ) as LoginClientFragFragment[];

	return (
		<Layout loading={ !! loading } seo={ seo ?? undefined } globalStylesheet={ globalStylesheet ?? '' }>
			<Header blocks={headerBlocks} />
			<Main
				className="wp-block-group is-layout-constrained relative min-h-screen"
				style={{
					marginTop: 'var(--wp--preset--spacing--30)',
				}}
			>
				{ /* @todo: We'll want to wrap this in an Authentication gate to prevent unauthorized access. */}
				<GatedLogin editorBlocks={editorBlocks} loginClients={loginClients} />
			</Main>
			<Footer blocks={footerBlocks}/>
		</Layout>
	);
};

Login.variables = ( { uri } ) => {
	return {
		uri,
	};
};

Login.query = gql`
	${ Layout.fragments.globalStyles } # The global styles
	${ Layout.fragments.nodeWithSeo } # SEO Data
	${ Header.fragments.headerTemplateArea } # The Header Template Area
	${ Footer.fragments.footerTemplateArea } # The Block Footer.
	${ BlockContent.fragments.blockContent } # Block Content
	${ LoginFormContainer.fragments.loginClients } # Login Form
	query GetLoginPageNode($uri: String!) {
		...GlobalStylesFrag
		...HeaderTemplateAreaFrag
		...FooterTemplateAreaFrag
		...LoginClientsFrag
		currentPage: nodeByUri(uri: $uri) {
			id
			uri
			... on NodeWithEditorBlocks {
				...BlockContentFrag
			}
			... on NodeWithRankMathSeo {
				...NodeWithSeoFrag
			}
		}
	}
`;

export default Login;
