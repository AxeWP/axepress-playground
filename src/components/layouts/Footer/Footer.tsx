import { gql } from '@apollo/client';
import classNames from 'clsx';
import { HTMLAttributes } from 'react';
import { BlockContentFragFragment } from '@graphqlTypes';
import { BlockContent } from 'components/elements';

export const Footer = ( { blocks, className, ...props } : HTMLAttributes<HTMLDivElement> & {
	blocks: BlockContentFragFragment['editorBlocks'];
} ) => {
	const classes = classNames(
		'has-global-padding mb-4',
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
