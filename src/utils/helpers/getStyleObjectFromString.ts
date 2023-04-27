/**
 * Formats a string to camel case.
 *
 * @param str
 */
const formatStringToCamelCase = ( str: string ) => {
	const splitted = str.split( '-' ).filter( ( word ) => !! word );
	if ( splitted.length === 1 ) {
		return splitted[ 0 ];
	}

	return (
		splitted[ 0 ] +
		splitted
			.slice( 1 )
			.map( ( word ) => {
				return word[ 0 ].toUpperCase() + word.slice( 1 );
			} )
			.join( '' )
	);
};

/**
 * Converts a CSS string to an object.
 *
 * @param str
 */
export const getStyleObjectFromString = ( str: string ) : Record<string, string> => {
	const style: { [key: string]: string } = {}; // add index signature here

	str.split( ';' ).forEach( ( el ) => {
		// eslint-disable-next-line @wordpress/no-unused-vars-before-return
		const [ property, ...value ] = el.split( ':' );

		if ( ! property ) {
			return;
		}

		const formattedProperty = formatStringToCamelCase( property.trim() );
		style[ formattedProperty ] = value.join( ':' ).trim();
	} );

	return style;
};
