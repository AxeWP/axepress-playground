import { getWordPressProps, WordPressTemplate } from '@faustwp/core';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { WordPressTemplateProps } from '@/types';

const Page = ( props: WordPressTemplateProps ) => {
	return <WordPressTemplate {...props} />;
};

export const getStaticProps: GetStaticProps = ( ctx ) => {
	return getWordPressProps( { ctx } );
};

export const getStaticPaths: GetStaticPaths = () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export default Page;
