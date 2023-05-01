import { gql } from '@apollo/client';
import classNames from 'clsx';
import { HTMLAttributes } from 'react';
import { BlockContent, SkipNavLink } from '@/components';
import { BlockContentFragFragment } from '@graphqlTypes';

export const Header = ( { blocks, className, ...props } : HTMLAttributes<HTMLDivElement> & {
	blocks: BlockContentFragFragment['editorBlocks'],
} ) => {
	const classes = classNames(
		`relative site-header wp-block-template-part`,
		className,
	);

	return (
		<header className={classes} {...props}>
			<SkipNavLink />
			<BlockContent blocks={blocks} />
		</header>
	);
};

Header.fragments = {
	headerTemplateArea: gql`
		fragment HeaderTemplateAreaFrag on RootQuery {
			header: templatePartArea(area: HEADER ) {
				activeTemplatePart {
					editorBlocks( flat:false ) {
						__typename
						renderedHtml
						clientId
						parentClientId
					}
				}
			}
		}
	`,
};
