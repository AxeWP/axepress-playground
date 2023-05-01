import { gql } from '@apollo/client';
import classNames from 'clsx';
import { HTMLAttributes } from 'react';
import { BlockContent, SkipNavLink } from '@/components';
import { UserMenu } from '@/features';
import { BlockContentFragFragment } from '@graphqlTypes';

import style from './Header.module.scss';

export const Header = ( { blocks, className, ...props } : HTMLAttributes<HTMLDivElement> & {
	blocks: BlockContentFragFragment['editorBlocks'],
} ) => {
	const classes = classNames(
		`relative site-header wp-block-template-part`,
		className,
		style.siteHeader,
	);

	return (
		<header className={classes} {...props}>
			<SkipNavLink />
			<BlockContent blocks={blocks} />
			<UserMenu />
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
