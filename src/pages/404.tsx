import { gql } from '@apollo/client';
import { getApolloClient } from '@faustwp/core';
import { __ } from '@wordpress/i18n';
import { GetStaticProps } from 'next';
import { Footer, Header, Layout, Main } from '@/components';
import { Get404PageQuery, RankMathSeo } from '@graphqlTypes';

type Page404Props = {
	data: Get404PageQuery,
	loading: boolean,
};

const Page404 = (
	{ data, loading } : Page404Props ) => {
	const globalStylesheet = data?.globalStylesheet;
	const headerBlocks = data?.header?.activeTemplatePart?.editorBlocks;
	const footerBlocks = data?.footer?.activeTemplatePart?.editorBlocks;

	const seo: RankMathSeo = {
		title: __( '404 - Not Found', 'axepress-labs' ),
		description: __( '404 - Not Found', 'axepress-labs' ),
	};

	return (
		<Layout loading={ loading } seo={ seo ?? undefined } globalStylesheet={globalStylesheet ?? ''} >
			<Header blocks={headerBlocks} />
			<Main
				className="wp-block-group min-h-[480px] flex flex-col justify-center">
				<h1 className="wp-block-heading has-text-align-center has-x-large-font-size font-extrabold tracking-tight">
					{__( '404 - Not Found', 'axepress-labs' )}
				</h1>
			</Main>
			<Footer blocks={footerBlocks}/>
		</Layout>
	);
};

export const getStaticProps: GetStaticProps<Page404Props> = async () => {
	const query = gql`
		${ Layout.fragments.globalStyles }
		${ Header.fragments.headerTemplateArea } # The Header Template Area
		${ Footer.fragments.footerTemplateArea } # The Block Footer.

		query Get404Page {
			...GlobalStylesFrag
			...HeaderTemplateAreaFrag
			...FooterTemplateAreaFrag
		}
`;

	const client = getApolloClient();

	const { data } = await client.query( {
		query,
	} );

	return {
		props: {
			data: data?.data || {},
			loading: ! data,
		} as Page404Props,
	};
};

export default Page404;
