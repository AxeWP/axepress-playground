declare namespace NodeJS {
  export interface ProcessEnv {
		NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_WORDPRESS_URL: string;
		FAUSTWP_SECRET_KEY: string;
		SECRET_COOKIE_PASSWORD: string;
  }
}
