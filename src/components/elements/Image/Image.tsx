import cn from 'clsx';
import NextImage from 'next/image';
import { PropsWithoutRef, CSSProperties } from 'react';
import { EntryHeaderWithMetaFragFragment } from '@graphqlTypes';

// There's probably a better way to infer this type.
type IntermediaryFragType = EntryHeaderWithMetaFragFragment & {__typename: 'Post'};
export type ImageType = IntermediaryFragType['featuredImage']['node'];

export const Image = ( {
	image,
	width,
	height,
	className,
	priority,
	fill,
	...props
}: PropsWithoutRef<{
	image?: ImageType,
	width: number,
	height: number,
	className?: string,
	priority?: boolean,
	fill?: boolean,
	sizes?: string,
	style?: CSSProperties,
}> ) => {
	const src = image?.sourceUrl;
	const { altText = '' } = image;
	const originalWidth = image?.mediaDetails?.width;
	const originalHeight = image?.mediaDetails?.height;

	const maxWidth = 1200; // From tailwind.config.js

	const imageProps : {
		width?: number,
		height?: number,
		fill?: boolean,
		sizes?: string,
	} = {};

	// Set the width and the height of the component
	if ( width && height ) {
		imageProps.width = width;
		imageProps.height = height;
	} else if ( width ) {
		imageProps.width = width;
		imageProps.height = originalHeight * ( width / originalWidth );
	} else if ( height ) {
		imageProps.width = originalWidth * ( height / originalHeight );
		imageProps.height = height;
	}

	// If there is no width or height, fill the container
	if ( fill || ! imageProps.width || ! imageProps.height ) {
		imageProps.fill = true;
		imageProps.sizes = `(max-width: ${ Math.min( imageProps?.width || maxWidth, maxWidth ) }px) 100vw, ${ Math.min( imageProps?.width || maxWidth, maxWidth ) }px`;
		delete imageProps.width;
		delete imageProps.height;
	}

	return src ? (
		<NextImage
			className={cn(
				className,
				imageProps?.fill && 'object-cover',
			)}
			src={src}
			{...props}
			alt={altText || ''}
			priority={priority}
			{...imageProps}
		/>
	) : null;
};
