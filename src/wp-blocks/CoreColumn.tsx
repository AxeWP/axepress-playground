import { gql } from '@apollo/client';
import { WordPressBlock, WordPressBlocksViewer } from '@faustwp/blocks';
import { ContentBlock } from '@faustwp/blocks/dist/mjs/components/WordPressBlocksViewer';
import { getClassNamesFromString, getStylesFromAttributes } from '@/utils/helpers';
import { BlockFragFragment, CoreBlockAttributes, CoreColumnFragFragment } from '@graphqlTypes';
import { DefaultBlock } from './DefaultBlock';

export const CoreColumn: WordPressBlock<CoreColumnFragFragment & BlockFragFragment> & {
	fragments: {
		entry: ReturnType<typeof gql>;
		key: string;
	};
} = ( { attributes, innerBlocks, renderedHtml, cssClassNames } ) => {
	const styleObject = attributes?.style ? getStylesFromAttributes( attributes as CoreBlockAttributes & { style: string } ) : undefined;

	const renderedClassNames = getClassNamesFromString( renderedHtml ?? '' );
	const classNames = Array.from( new Set( [ ...renderedClassNames, ...cssClassNames || [], attributes?.className ] ) ).filter( Boolean ).join( ' ' );

	return (
		<div style={styleObject} className={classNames}>
			<WordPressBlocksViewer blocks={ innerBlocks as ContentBlock[] } fallbackBlock={DefaultBlock}/>
		</div>
	);
};

CoreColumn.displayName = 'CoreColumn';

CoreColumn.fragments = {
	entry: gql`
		fragment CoreColumnFrag on CoreColumn {
			attributes {
				className
				style
			}
		}
	`,
	key: `CoreColumnFragment`,
};
