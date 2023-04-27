import { gql } from '@apollo/client';
import { WordPressBlock, WordPressBlocksViewer } from '@faustwp/blocks';
import { ContentBlock } from '@faustwp/blocks/dist/mjs/components/WordPressBlocksViewer';
import cn from 'clsx';
import { PropsWithChildren, createElement } from 'react';
import { Parse } from '@/lib/parser';
import { getStyleObjectFromString } from '@/utils/helpers';
import { BlockFragFragment, CoreGroupFragFragment } from '@graphqlTypes';
import { DefaultBlock } from './DefaultBlock';

export const Tag = ( { name, className, styleObj, children } : PropsWithChildren<{
	name: string;
	className?: string;
	styleObj?: Record<string, string>;
}> ) => {
	return createElement( name, { style: { ...styleObj }, className }, children );
};

export const CoreGroup: WordPressBlock<CoreGroupFragFragment & BlockFragFragment> & {
	fragments: {
		entry: ReturnType<typeof gql>;
		key: string;
	};
} = ( { attributes, innerBlocks, renderedHtml, cssClassNames } ) => {
	const tagName = attributes?.tagName ?? 'div';
	const styleObject = attributes?.style ? getStyleObjectFromString( attributes.style ) : undefined;

	const classNames = cn( attributes?.className, cssClassNames );

	return <>
		{ !! innerBlocks?.length && (
			<Tag name={tagName} className={classNames} styleObj={styleObject} >
				<WordPressBlocksViewer blocks={ innerBlocks as ContentBlock[] } fallbackBlock={DefaultBlock}/>
			</Tag>
		)}

		{ ! innerBlocks?.length && !! renderedHtml && (
			<Parse html={ renderedHtml } />
		) }
	</>;
};

CoreGroup.fragments = {
	entry: gql`
		fragment CoreGroupFrag on CoreGroup {
			renderedHtml
			cssClassNames
			attributes {
				className
				style
				tagName
			}
		}
	`,
	key: `CoreGroupFragment`,
};
