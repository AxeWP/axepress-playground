import { gql } from '@apollo/client';
import { WordPressBlocksViewer } from '@faustwp/blocks';
import { ContentBlock } from '@faustwp/blocks/dist/mjs/components/WordPressBlocksViewer';
import { flatListToHierarchical } from '@faustwp/core';
import { ListNode } from '@faustwp/core/dist/cjs/utils/flatListToHierarchical';
import { CoreColumn, CoreColumns, CoreGroup, DefaultBlock } from '@/blocks';
import { Parse } from '@/lib/parser';
import { BlockContentFragFragment } from '@graphqlTypes';

export const BlockContent = (
	{
		blocks,
		fallbackContent,
		isInnerBlock = false,
	} : {
		blocks: BlockContentFragFragment['editorBlocks'] | undefined,
		fallbackContent?: string,
		isInnerBlock?: boolean,
		},
): JSX.Element => {
	const hierarchicalBlocks = ! isInnerBlock ? flatListToHierarchical( blocks as ListNode[], {
		childrenKey: 'innerBlocks',
	} ) : blocks;

	return (
		<>
			{ !! hierarchicalBlocks?.length && (
				<WordPressBlocksViewer blocks={ hierarchicalBlocks as ContentBlock[] } fallbackBlock={DefaultBlock} />
			) }

			{ ! hierarchicalBlocks?.length && !! fallbackContent && (
				<Parse html={ fallbackContent } />
			) }
		</>
	);
};

BlockContent.fragments = {
	blockContent: gql`
		${ CoreGroup.fragments.entry }
		${ CoreColumns.fragments.entry }
		${ CoreColumn.fragments.entry }
		fragment BlockFrag on EditorBlock {
			__typename
			renderedHtml
			cssClassNames
			name
			id: clientId
			parentId: parentClientId
			innerBlocks {
				__typename
			}
			... on CoreGroup {
				...CoreGroupFrag
			}
			... on CoreColumns {
				...CoreColumnsFrag
			}
			... on CoreColumn {
				...CoreColumnFrag
			}
		}
		fragment BlockContentFrag on NodeWithEditorBlocks {
			editorBlocks {
				...BlockFrag
			}
		}
	`,
};
