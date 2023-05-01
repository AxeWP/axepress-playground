import { gql } from '@apollo/client';
import { WordPressBlock, WordPressBlocksViewer } from '@faustwp/blocks';
import { ContentBlock } from '@faustwp/blocks/dist/mjs/components/WordPressBlocksViewer';
import { PropsWithChildren, createElement } from 'react';
import { Parse } from '@/lib/parser';
import { getClassNamesFromString, getStylesFromAttributes } from '@/utils/helpers';
import { BlockFragFragment, CoreBlockAttributes, CoreGroupFragFragment } from '@graphqlTypes';
import { DefaultBlock } from './DefaultBlock';

export const Tag = ( { name, className, style, children } : PropsWithChildren<{
	name: string;
	className?: string;
	style ?: React.CSSProperties;
}> ) => {
	return createElement( name, { style, className }, children );
};

export const CoreGroup: WordPressBlock<CoreGroupFragFragment & BlockFragFragment> & {
	fragments: {
		entry: ReturnType<typeof gql>;
		key: string;
	};
} = ( { attributes, innerBlocks, renderedHtml, cssClassNames } ) => {
	const tagName = attributes?.tagName ?? 'div';
	const styleObject = attributes?.style ? getStylesFromAttributes( attributes as undefined as CoreBlockAttributes & { style: string } ) : undefined;

	const renderedClassNames = getClassNamesFromString( renderedHtml ?? '' );
	const classNames = Array.from( new Set( [ ...renderedClassNames, ...cssClassNames || [], attributes?.className ] ) ).filter( Boolean ).join( ' ' );

	return <>
		{ !! innerBlocks?.length && (
			<Tag name={tagName} className={classNames} style={styleObject} >
				<WordPressBlocksViewer blocks={ innerBlocks as ContentBlock[] } fallbackBlock={DefaultBlock}/>
			</Tag>
		)}

		{ ! innerBlocks?.length && !! renderedHtml && (
			<Parse html={ renderedHtml } />
		) }
	</>;
};

CoreGroup.displayName = 'CoreGroup';

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
