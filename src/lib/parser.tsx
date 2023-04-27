import Parser, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import Link from 'next/link';
import { Image as FeaturedImage, ImageType } from '@/components';
import { getImageSizeFromAttributes, getInternalUrl, getStyleObjectFromString } from '@/utils/helpers';

const options: HTMLReactParserOptions = {
	replace: ( domNode ) => {
		if ( domNode instanceof Element ) {
			const {
				attribs,
				children,
				name,
				type,
			} = domNode;
			const { class: className, style, ...attributes } = attribs;

			const styleObject = style ? getStyleObjectFromString( style ) : undefined;

			// Image Component
			if ( type === 'tag' && name === 'img' ) {
				const internalUri = getInternalUrl( attribs?.src );
				const { width, height } = getImageSizeFromAttributes( attribs );

				if ( internalUri ) {
					const imageAttributes = {
						sourceUrl: attribs?.src,
						mediaDetails: {
							width,
							height,
						},
					} as ImageType;

					const shouldFill = width && height ? false : true;

					return ( <FeaturedImage
						{...attributes}
						image={imageAttributes}
						height={height}
						width={width}
						className={className}
						fill={ shouldFill }
						style={styleObject}
					/>
					);
				}
			}

			// Link component
			if ( type === 'tag' && name === 'a' ) {
				const internalUri = getInternalUrl( attribs.href );

				if ( internalUri ) {
					return (
						<Link
							{...attributes}
							className={className}
							href={internalUri}
							style={styleObject}
						>
							{domToReact( children, options )}
						</Link>
					);
				}
			}
		}
	},
};

export const Parse = ( { html }: { html: string } ) => {
	return <>
		{ Parser( html, options ) }
	</>;
};
