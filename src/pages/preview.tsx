import { WordPressTemplate } from '@faustwp/core';
import { WordPressTemplateProps } from '@/types';

const Preview = ( props: WordPressTemplateProps ) => {
	return <WordPressTemplate {...props} />;
};

export default Preview;
