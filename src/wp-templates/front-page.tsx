import { gql } from '@apollo/client';
import { FaustTemplate } from '@faustwp/core';
import { Footer, Header, Layout, Main, BlockContent } from '@/components';
import { GetFrontPageNodeQuery } from '@graphqlTypes';

type CurrentPageType = GetFrontPageNodeQuery['currentPage'] & {
	__typename: 'Page';
}

const FrontPage: FaustTemplate<GetFrontPageNodeQuery> = ( { data, loading } ) => {
	const currentPage = data?.currentPage as CurrentPageType;
	const seo = currentPage?.seo || {};
	const globalStylesheet = data?.globalStylesheet;

	const headerBlocks = data?.header?.activeTemplatePart?.editorBlocks;
	const editorBlocks =	currentPage?.editorBlocks;
	const fallbackContent = currentPage?.content;
	const footerBlocks = data?.footer?.activeTemplatePart?.editorBlocks;

	return (
		<>
			<Layout loading={ !! loading } seo={ seo } globalStylesheet={ globalStylesheet ?? '' } >
				<Header blocks={headerBlocks} />
				<Main
					className="wp-block-group"
				>
					{ !! editorBlocks?.length && (
						<BlockContent blocks={editorBlocks} fallbackContent={fallbackContent ?? undefined } />
					) }
				</Main>
				<Footer blocks={footerBlocks}/>
			</Layout>
		</>
	);
};

FrontPage.variables = () => {
	return {
		uri: '/',
	};
};

FrontPage.query = gql`
	${ Layout.fragments.globalStyles } # The global styles
	${ Layout.fragments.nodeWithSeo } # SEO Data
	${ Header.fragments.headerTemplateArea } # The Header Template Area
	${ Footer.fragments.footerTemplateArea } # The Block Footer.
	${ BlockContent.fragments.blockContent } # Block Content
	query GetFrontPageNode($uri: String!) {
		...GlobalStylesFrag
		...HeaderTemplateAreaFrag
		...FooterTemplateAreaFrag
		currentPage: nodeByUri(uri: $uri) {
			id
			uri
			... on ContentNode {
				date
			}
			... on NodeWithContentEditor {
				content
			}
			... on NodeWithEditorBlocks {
				...BlockContentFrag
			}
			... on NodeWithTitle {
				title
			}
			... on NodeWithRankMathSeo {
				...NodeWithSeoFrag
			}
		}
	}
`;

export default FrontPage;
