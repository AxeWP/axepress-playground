import { gql } from '@apollo/client';
import { WordPressBlock } from '@faustwp/blocks';
import cn from 'clsx';
import { getStyleObjectFromString } from '@/utils/helpers';
import { BlockFragFragment, CoreColumnFragFragment } from '@graphqlTypes';
import { BlockContent } from 'components/elements';

export const CoreColumns: WordPressBlock<CoreColumnFragFragment & BlockFragFragment> & {
	fragments: {
		entry: ReturnType<typeof gql>;
		key: string;
	};
} = ( { attributes, innerBlocks, renderedHtml, cssClassNames } ) => {
	const styleObject = attributes?.style ? getStyleObjectFromString( attributes.style ) : undefined;

	const classNames = cn( attributes?.className, cssClassNames );

	return (
		<div style={{ ...styleObject }} className={classNames}>
			<BlockContent blocks={innerBlocks} fallbackContent={renderedHtml ?? ''} />
		</div>
	);
};

CoreColumns.fragments = {
	entry: gql`
		fragment CoreColumnsFrag on CoreColumns {
			attributes {
				className
				style
			}
		}
	`,
	key: `CoreColumnsFragment`,
};
