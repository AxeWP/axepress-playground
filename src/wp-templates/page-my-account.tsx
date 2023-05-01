import { gql } from '@apollo/client';
import { FaustTemplate } from '@faustwp/core';
import { Footer, Header, EntryHeader, Layout, Main, BlockContent, ImageType } from '@/components';
import { GetAccountPageNodeQuery } from '@graphqlTypes';

type CurrentPageType = GetAccountPageNodeQuery['currentPage'] & {
	__typename: 'Page';
}

const MyAccount: FaustTemplate<GetAccountPageNodeQuery> = ( { data, loading } ) => {
	const currentPage = data?.currentPage as CurrentPageType;
	const seo = currentPage?.seo;
	const globalStylesheet = data?.globalStylesheet;

	const headerBlocks = data?.header?.activeTemplatePart?.editorBlocks;
	const editorBlocks =	currentPage?.editorBlocks;
	const fallbackContent = currentPage?.content;
	const footerBlocks = data?.footer?.activeTemplatePart?.editorBlocks;

	return (
		<Layout loading={ !! loading } seo={ seo ?? undefined } globalStylesheet={ globalStylesheet ?? '' }>
			<Header blocks={headerBlocks} />
			<Main
				className="wp-block-group has-global-padding"
				style={{
					marginTop: 'var(--wp--preset--spacing--30)',
				}}
			>
				<EntryHeader
					title={currentPage?.title ?? ''}
					image={currentPage?.featuredImage?.node as ImageType }
					className="has-global-padding wp-block-group alignwide"
				/>

				{ /* @todo: We'll want to wrap this in an Authentication gate to prevent unauthorized access. */}
				{ !! editorBlocks?.length && (
					<BlockContent blocks={editorBlocks} fallbackContent={fallbackContent ?? undefined } />
				) }

			</Main>
			<Footer blocks={footerBlocks}/>
		</Layout>
	);
};

MyAccount.variables = ( { uri } ) => {
	return {
		uri,
	};
};

MyAccount.query = gql`
	${ Layout.fragments.globalStyles } # The global styles
	${ Layout.fragments.nodeWithSeo } # SEO Data
	${ Header.fragments.headerTemplateArea } # The Header Template Area
	${ Footer.fragments.footerTemplateArea } # The Block Footer.
	${ BlockContent.fragments.blockContent } # Block Content
	${ EntryHeader.fragments.headerWithoutMeta } # The Page Header.
	query GetAccountPageNode($uri: String!) {
		...GlobalStylesFrag
		...HeaderTemplateAreaFrag
		...FooterTemplateAreaFrag
		currentPage: nodeByUri(uri: $uri) {
			id
			uri
			... on ContentNode {
				...EntryHeaderWithoutMetaFrag
			}
			... on NodeWithContentEditor {
				content
			}
			... on NodeWithEditorBlocks {
				...BlockContentFrag
			}
			... on NodeWithRankMathSeo {
				...NodeWithSeoFrag
			}
		}
	}
`;

export default MyAccount;
