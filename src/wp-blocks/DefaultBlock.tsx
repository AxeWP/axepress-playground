import { ContentBlock } from '@faustwp/blocks/dist/mjs/components/WordPressBlocksViewer';
import { Parse } from '@/lib/parser';

export const DefaultBlock = ( { renderedHtml }: ContentBlock ) => {
	return <Parse html={renderedHtml ?? ''} />;
};
