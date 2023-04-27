import { getWpHostname } from '@faustwp/core';

/**
 * Converts the WordPress server URL to an internal one.
 *
 * @param {string} url - WordPress url.
 */
export function getInternalUrl( url: string ) {
	const regex = new RegExp( `/^\/(?!\/)|^#|^(https?:\/\/)?(www\.)?${ getWpHostname() }`, 'i' ); // eslint-disable-line no-useless-escape

	return regex.test( url ) ? url.replace( regex, '' ) : '';
}
