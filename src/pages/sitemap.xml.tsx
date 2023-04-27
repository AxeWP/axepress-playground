import { getSitemapProps } from '@faustwp/core';
import { GetServerSidePropsContext } from 'next';

export default function Sitemap() {} // eslint-disable-line @typescript-eslint/no-empty-function

export const getServerSideProps = ( ctx: GetServerSidePropsContext ) => {
	return getSitemapProps( ctx, {
		frontendUrl: process.env.NEXT_PUBLIC_SITE_URL,
	} );
};

