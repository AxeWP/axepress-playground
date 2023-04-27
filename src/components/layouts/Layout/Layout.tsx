import { gql } from '@apollo/client';
import { PropsWithChildren } from 'react';
import { Loading } from '@/components';
import { GlobalStylesheet, SEO } from '@/features';
import { RankMathSeo } from '@graphqlTypes';

type LayoutProps = PropsWithChildren<{
	loading: boolean
	seo: RankMathSeo | undefined
	globalStylesheet: string
}>;

export const Layout = ( { loading, seo, globalStylesheet, children } : LayoutProps ) => {
	if ( loading ) {
		return ( <Loading /> );
	}

	return (
		<>
			{ !! globalStylesheet && <GlobalStylesheet stylesheet={globalStylesheet} /> }
			{ seo && <SEO {...seo} /> }
			<div className="wp-site-blocks">
				{ children }
			</div>
		</>
	);
};

Layout.fragments = {
	nodeWithSeo: gql`
		fragment NodeWithSeoFrag on NodeWithRankMathSeo {
			seo {
				...Seo
			}
		}
		${ SEO.fragments.seo }
`,
	globalStyles: gql`
		fragment GlobalStylesFrag on RootQuery {
			globalStylesheet
		}
`,
};
