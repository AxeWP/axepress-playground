import { JwtPayload, decode } from 'jsonwebtoken';

export const isTokenExpired: ( token: string ) => boolean = ( token ) => {
	const decodedToken = decode( token ) as JwtPayload;

	if ( ! decodedToken?.exp ) {
		return false;
	}

	const expiresAt = new Date( ( decodedToken.exp as number ) * 1000 );
	const now = new Date();

	return now.getTime() > expiresAt.getTime();
};

