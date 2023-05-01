import { gql } from '@apollo/client';
import { FaustTemplate } from '@faustwp/core';
import { __, sprintf } from '@wordpress/i18n';
import Link from 'next/link';
import { Main, Header, Layout, Footer } from '@/components';
import { GetIndexNodeQuery, Page, Post } from '@graphqlTypes';

type CurrentPageType = GetIndexNodeQuery['currentPage'] & {
	__typename: 'ContentType';
}

type ContentNodeUnion = Post | Page;

const Index: FaustTemplate<GetIndexNodeQuery> = ( { data, loading } ) => {
	const currentPage = data?.currentPage as CurrentPageType;
	const seo = currentPage?.seo || {};
	const globalStylesheet = data?.globalStylesheet;

	const headerBlocks = data?.header?.activeTemplatePart?.editorBlocks;
	const footerBlocks = data?.footer?.activeTemplatePart?.editorBlocks;

	const contentNodes = currentPage?.contentNodes?.nodes as ContentNodeUnion[];

	return (
		<Layout loading={ !! loading } seo={ seo ?? undefined } globalStylesheet={ globalStylesheet ?? '' } >
			<Header blocks={headerBlocks} />
			<Main
				className="wp-block-group is-layout-constrained has-global-padding"
			>
				<h1 className="has-text-align-center">
					{ `Archive Endpoint (WIP)` }
				</h1>
				<blockquote className="wp-block-group">
					<p>
						{__( '`nodeByUri` currently doesn\'t support true Archive types. If you want to support archives, you\'ll need to do some custom templating and querying.', 'axepress-labs' ) }
					</p>
					<br />
					<p>
						{
							sprintf(
								// translators: %s is the name of the current post type.
								__( 'E.g. This is a list of all the content nodes of the %s type.', 'axepress-labs' ),
								currentPage?.name ?? __( 'unknown', 'axepress-labs' ),
							)
						}
					</p>
				</blockquote>
				<ul className="list-disc list-inside">
					{ !! contentNodes.length && contentNodes.map( ( node ) => {
						return (
							<li key={node?.id} >
								{ !! node.uri && (
									<Link href={node.uri }>
										{ node?.title }
									</Link>
								) }
							</li>
						);
					} ) }
				</ul>
			</Main>
			<Footer blocks={footerBlocks}/>
		</Layout>
	);
};

Index.variables = ( { uri } ) => {
	return {
		uri,
	};
};

Index.query = gql`
	${ Layout.fragments.globalStyles } # The Global styles
	${ Layout.fragments.nodeWithSeo } # SEO Data
	${ Header.fragments.headerTemplateArea } # The Header Template Area
	${ Footer.fragments.footerTemplateArea } # The Block Footer.
	query GetIndexNode($uri: String!) {
		...GlobalStylesFrag
		...HeaderTemplateAreaFrag
		...FooterTemplateAreaFrag
		currentPage: nodeByUri(uri: $uri) {
			uri
			... on NodeWithRankMathSeo {
				... NodeWithSeoFrag
			}
			... on ContentType {
				name
				contentNodes {
					nodes {
						id
						uri
						... on NodeWithTitle {
							title
						}
					}
				}
			}
		}
	}
`;

export default Index;
