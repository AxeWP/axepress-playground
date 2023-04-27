import { gql } from '@apollo/client';
import { WordPressBlock } from '@faustwp/blocks';
import { getStyleObjectFromString, getImageSizeFromAttributes } from '@/utils/helpers';
import { CoreImageAttributes, CoreImageFragFragment } from '@graphqlTypes';
import { Image as DisplayImage, ImageType } from 'components/elements';

export const CoreImage: WordPressBlock<CoreImageFragFragment> & {
	fragments: {
		entry: ReturnType<typeof gql>;
		key: string;
	};
} = ( { attributes } ) => {
	const {
		style,
		src,
		alt,
		caption,
		className,
	} = attributes || {};
	const styleObject = style ? getStyleObjectFromString( attributes?.style ?? '' ) : undefined;
	const imageSize = getImageSizeFromAttributes( attributes as CoreImageAttributes );

	const imageAttributes = {
		sourceUrl: src,
		mediaDetails: {
			width: imageSize.width,
			height: imageSize.height,
		},
		altText: alt || '',
	} as ImageType;

	const shouldFill = imageSize.width && imageSize.height ? false : true;

	return (
		<figure style={{ ...styleObject }} className={ className || ''}>
			<DisplayImage
				image={imageAttributes}
				height={imageSize.height}
				width={imageSize.width}
				fill={shouldFill}
				style={styleObject}
			/>
			{caption && <figcaption>{caption}</figcaption>}
		</figure>
	);
};

CoreImage.fragments = {
	entry: gql`
		fragment CoreImageFrag on CoreImage {
			attributes {
				alt
				src
				caption
				className
				sizeSlug
				width
				height
				style
			}
		}
	`,
	key: `CoreImageFragment`,
};
