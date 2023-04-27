import { CoreImageAttributes } from '@graphqlTypes';
// From https://github.com/blakewilson/faust-gutenberg-decode-demo/blob/main/utils/getImageSizeProps.js

export const getImageSizeFromAttributes = ( attributes: CoreImageAttributes ) : {
	width: number;
	height: number;
} => {
	const sizeSlug = attributes?.sizeSlug;
	if ( sizeSlug ) {
		return {
			width: attributes?.width ? attributes?.width : imageSizeToWidth[ sizeSlug ],
			height: attributes?.height
				? attributes?.height
				: imageSizeToHeight[ sizeSlug ],
		};
	}
	return {
		width: attributes?.width ?? 600,
		height: attributes?.height ?? 600,
	};
};

const imageSizeToWidth : {
	[ key: string ]: number;
} = {
	thumbnail: 150,
	medium: 300,
	large: 600,
	'full-size': 2560,
};

const imageSizeToHeight : {
	[ key: string ]: number;
} = {
	thumbnail: 150,
	medium: 300,
	large: 600,
	'full-size': 2560,
};
