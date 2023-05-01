export const getClassNamesFromString = ( html: string ): string[] => {
	// we only want to match the first use of class.
	const classNames = html.match( /class=".*?"/g )?.[ 0 ]?.split( ' ' ).map( ( className ) => {
		return className.replace( 'class="', '' ).replace( '"', '' );
	} );

	return classNames || [];
};
