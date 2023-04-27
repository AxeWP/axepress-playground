import { getWordPressProps, WordPressTemplate } from '@faustwp/core';
import { GetStaticProps } from 'next';
import { WordPressTemplateProps } from '@/types';

const Page = ( props : WordPressTemplateProps ) => {
	return <WordPressTemplate {...props} />;
};

export const getStaticProps: GetStaticProps = ( ctx ) => {
	return getWordPressProps( { ctx } );
};

export default Page;
