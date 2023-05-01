import '../../faust.config';
import { WordPressBlock, WordPressBlocksProvider } from '@faustwp/blocks';
import { FaustProvider } from '@faustwp/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { StrictMode } from 'react';
import blocks from '@/blocks';
import type { AppProps } from 'next/app';

// Styles
import '../styles/index.css';
import '../styles/wordpress.scss';

const App = ( { Component, pageProps }: AppProps ) => {
	const router = useRouter();

	return (
		<StrictMode>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<FaustProvider pageProps={ pageProps }>
				<WordPressBlocksProvider
					config={{
						blocks: blocks as unknown as WordPressBlock[],
					} }
				>
					<Component { ...pageProps } key={router.asPath}/>
				</WordPressBlocksProvider>
			</FaustProvider>
		</StrictMode>
	);
};

export default App;
