
import { gql } from '@apollo/client';
import { FaustTemplate } from '@faustwp/core';
import { BlockContent, Footer, Header, Layout, EntryHeader, Main } from '@/components';
import { GetSingularNodeQuery } from '@graphqlTypes';

type CurrentPageType = GetSingularNodeQuery['currentPage'] & {
	__typename: 'Post';
}

const Singular: FaustTemplate<GetSingularNodeQuery> = ( { data, loading } ) => {
	const currentPage = data?.currentPage as CurrentPageType;
	const seo = data?.currentPage?.seo || {};
	const globalStylesheet = data?.globalStylesheet;

	const headerBlocks = data?.header?.activeTemplatePart?.editorBlocks;
	const editorBlocks =	currentPage?.editorBlocks;
	const fallbackContent = currentPage?.content;
	const footerBlocks = data?.footer?.activeTemplatePart?.editorBlocks;

	return (
		<Layout loading={ !! loading } seo={ seo ?? undefined } globalStylesheet={ globalStylesheet ?? ''}>
			<Header blocks={headerBlocks} />
			<Main className="overflow-hidden pt-10 max-w-3xl mx-auto">
				<EntryHeader
					title={currentPage?.title ?? ''}
					date={currentPage?.date ?? ''}
					author={currentPage?.author?.node?.name ?? '' }
					image={currentPage?.featuredImage?.node }
				/>
				{ !! editorBlocks?.length && (
					<BlockContent blocks={editorBlocks} fallbackContent={fallbackContent ?? undefined } />
				) }
			</Main>
			<Footer blocks={footerBlocks}/>
		</Layout>
	);
};

Singular.variables = ( { uri } ) => {
	return {
		uri,
	};
};

Singular.query = gql`
	${ Layout.fragments.globalStyles } # The global styles
	${ Layout.fragments.nodeWithSeo } # SEO Data
	${ Header.fragments.headerTemplateArea } # The Header Template Area
	${ Footer.fragments.footerTemplateArea } # The Block Footer.
	${ BlockContent.fragments.blockContent } # Block Content
	${ EntryHeader.fragments.headerWithMeta } # The fragment for the page header
	query GetSingularNode($uri: String!) {
		... GlobalStylesFrag
		... HeaderTemplateAreaFrag
		... FooterTemplateAreaFrag
		currentPage: nodeByUri(uri: $uri) {
			id
			uri
			... on ContentNode {
				...EntryHeaderWithMetaFrag
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

export default Singular;
