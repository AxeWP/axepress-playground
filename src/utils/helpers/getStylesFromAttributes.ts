import { compileCSS } from '@wordpress/style-engine';
import { getStyleObjectFromString } from './getStyleObjectFromString';
import type { CoreBlockAttributes } from '@graphqlTypes';

export const getStylesFromAttributes = ( attributes: CoreBlockAttributes & {
	style: string;
} ) => {
	return {
		...( attributes?.style && getStyleObjectFromString(
			compileCSS(
				JSON.parse( attributes.style ),
			),
		) ),
	};
};
