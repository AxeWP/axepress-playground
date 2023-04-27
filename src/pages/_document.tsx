import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

class MyDocument extends NextDocument {
	static async getInitialProps( ctx: DocumentContext ) {
		const initialProps = await NextDocument.getInitialProps( ctx );

		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta name="application-name" content={SITE_TITLE} />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="default" />
					<meta name="apple-mobile-web-app-title" content={SITE_TITLE} />
					<meta name="description" content={SITE_DESCRIPTION} />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-tap-highlight" content="no" />
					<meta name="theme-color" content="#FFFFFF" />

					<link rel="preconnect" href={process.env.NEXT_PUBLIC_WORDPRESS_URL} />
					<link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_WORDPRESS_URL} />

					{ /* The Web App Manifest */}
					<link rel="manifest" href="/manifest.json" />

					{ /* RSS Feeds */}
					<link
						href={`${ SITE_URL }/api/feeds/feed.json`}
						rel="alternate"
						type="application/feed+json"
						title={`${ SITE_TITLE } JSON Feed`}
					/>
					<link
						href={`${ SITE_URL }/api/feeds/rss.xml`}
						rel="alternate"
						type="application/rss+xml"
						title={`${ SITE_TITLE } XML Feed`}
					/>
					<link
						href={`${ SITE_URL }/api/feeds/feed.atom`}
						rel="alternate"
						type="application/atom+xml"
						title={`${ SITE_TITLE } Atom Feed`}
					/>

					{ /* Favicons */}
					<link
						href="public/icons/favicon-16x16.png"
						rel="icon"
						type="image/png"
						sizes="16x16"
					/>
					<link
						href="public/icons/favicon-32x32.png"
						rel="icon"
						type="image/png"
						sizes="32x32"
					/>
					<link rel="apple-touch-icon" href="public/icons/apple-touch-icon.png"></link>
					<link rel="shortcut icon" href="/favicon.ico"></link>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
