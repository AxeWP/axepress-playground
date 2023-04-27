import Head from 'next/head';
import { useEffect } from 'react';

export const GlobalStylesheet = ( { stylesheet }: {
	stylesheet: string;
} ) => {
	useEffect( () => {
		const style = document.createElement( 'style' );
		style.innerHTML = stylesheet;
		const head = document.getElementsByTagName( 'head' )[ 0 ];
		head.appendChild( style );
	}, [ stylesheet ] );

	if ( ! stylesheet ) {
		return null;
	}

	return (
		<Head>
			<style id="globalStyles" dangerouslySetInnerHTML={ {
				__html: stylesheet,
			} } />
		</Head>
	);
};
