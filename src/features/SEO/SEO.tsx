import { gql } from '@apollo/client';
import { NextSeo } from 'next-seo';
import { AdditionalRobotsProps } from 'next-seo/lib/types';
import { RankMathSeo } from '@graphqlTypes';

export const SEO = ( props : RankMathSeo ) => {
	const { title, description, robots, openGraph } = props;

	const shouldNoFollow = robots?.includes( 'nofollow' );
	const shouldNoIndex = robots?.includes( 'noindex' );

	return (
		<NextSeo
			title={ title ?? undefined }
			description={ description ?? undefined }
			nofollow={ shouldNoFollow }
			noindex={ shouldNoIndex }
			robotsProps={{
				...robots,
			} as AdditionalRobotsProps }
			openGraph={ {
				type: openGraph?.type ?? undefined,
				locale: openGraph?.locale ?? undefined,
				title: openGraph?.title ?? undefined,
				description: openGraph?.description || description || undefined,
				images: [
					{
						url: openGraph?.image?.secureUrl ?? '',
						width: 1200,
						height: 675,
					},
				],
				url: openGraph?.url ?? undefined,
				site_name: openGraph?.siteName ?? undefined,
			} }
		/>
	);
};

SEO.fragments = {
	seo: gql`
		fragment Seo on RankMathSeo {
			title
			description
			robots
			openGraph {
				type
				locale
				title
				description
				image {
					secureUrl
					height
					width
				}
				url
				siteName
			}
		}
	`,
};
