import { gql } from '@apollo/client';
import classNames from 'clsx';
import { HTMLAttributes } from 'react';
import { BlockContent } from '@/components';
import { BlockContentFragFragment } from '@graphqlTypes';

export const Footer = ( { blocks, className, ...props } : HTMLAttributes<HTMLDivElement> & {
	blocks: BlockContentFragFragment['editorBlocks'];
} ) => {
	const classes = classNames(
		'site-footer wp-block-template-part',
		className,
	);

	return (
		<footer role="contentinfo" className={classes} {...props}>
			<BlockContent blocks={blocks} />
		</footer>
	);
};

Footer.fragments = {
	footerTemplateArea: gql`
		fragment FooterTemplateAreaFrag on RootQuery {
			footer: templatePartArea(area: FOOTER) {
				activeTemplatePart {
					editorBlocks( flat: false ) {
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
