import { gql } from '@apollo/client';
import { Temporal } from '@js-temporal/polyfill';
import { Feed } from 'feed';
import { BlogFeedQueryQuery } from '@graphqlTypes';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const FEED_QUERY = gql`
	query BlogFeedQuery {
		generalSettings {
			title
			description
			timezone
		}
		rankMathSettings {
			meta {
				global {
					openGraphImage{
						sourceUrl
					}
				}
			}
		}
		posts(where: { orderby: { field: DATE, order: DESC } }, first: 10) {
			nodes {
				content
				dateGmt
				excerpt
				id
				modifiedGmt
				title
				uri
				author {
					node {
						name
						url
					}
				}
				categories {
					nodes {
						name
						slug
						uri
					}
				}
			}
			pageInfo {
				endCursor
				startCursor
				hasPreviousPage
				hasNextPage
			}
		}
		lastModified: posts(
			where: { orderby: { field: MODIFIED, order: DESC } }
			first: 1
		) {
			nodes {
				modifiedGmt
			}
		}
	}
`;

export function createFeed( { feedData, lastModified }: {
	feedData: BlogFeedQueryQuery,
	lastModified: Temporal.PlainDateTime,
} ) {
	const { rankMathSettings, generalSettings } = feedData;

	const feed = new Feed( {
		title: `${ generalSettings?.title } Blog`,
		description: generalSettings?.description ?? '',
		id: `${ SITE_URL }/blog/`,
		link: `${ SITE_URL }/blog/`,
		language: 'en',
		image: rankMathSettings?.meta?.global?.openGraphImage?.sourceUrl ?? '',
		favicon: `${ SITE_URL }/favicon.ico`,
		copyright: feedData?.generalSettings?.timezone ? Temporal.Now.plainDateISO(
			feedData.generalSettings.timezone,
		).year.toString() : '',
		updated: new Date( lastModified.toString() ),
		feedLinks: {
			json: `${ SITE_URL }/api/feeds/feed.json`,
			atom: `${ SITE_URL }/api/feeds/feed.atom`,
			rss: `${ SITE_URL }/api/feeds/rss.xml`,
		},
	} );

	feedData?.posts?.nodes?.forEach( ( post ) => {
		const author = post?.author?.node;
		const categories = post?.categories?.nodes || [];

		feed.addItem( {
			id: post.id,
			title: post?.title ?? '',
			link: `${ SITE_URL }${ post.uri }`,
			description: post?.excerpt ?? '',
			content: post?.content ?? '',
			date: post.modifiedGmt ? new Date( post.modifiedGmt ) : new Date(), // you may want some other default
			published: post.dateGmt ? new Date( post.dateGmt ) : undefined,
			author: [
				{
					name: author?.name ?? undefined,
					link: author?.url ?? undefined,
				},
			],
			category: categories.map( ( category ) => {
				const link = `${ SITE_URL }${ category.uri }`;
				return {
					term: category?.slug ?? '',
					scheme: link,
					domain: link,
					name: category?.name ?? '',
				};
			} ),
		} );
	} );

	return feed;
}
