import { NextApiRequest, NextApiResponse } from 'next';
import { LoginInput } from '@graphqlTypes';
import { authenticate } from './authenticate';
import type { UserSession } from '../types';

export const loginHandler = async ( req: NextApiRequest, res: NextApiResponse, input: LoginInput ) => {
	const { login: data, errors } = await authenticate( input );

	// Store the session data.
	const user = {
		...data,
		isLoggedIn: errors?.length === 0,
	} as UserSession;

	req.session.user = user;
	await req.session.save();

	if ( errors?.length ) {
		// send an error response.
		return res.status( 401 ).json( {
			user,
			errors,
		} );
	}

	// send a success response.
	res.status( errors?.length ? 401 : 200 ).json( {
		user: {
			...user,
			authToken: undefined,
			refreshToken: undefined,
		},
		errors,
	} );
};

