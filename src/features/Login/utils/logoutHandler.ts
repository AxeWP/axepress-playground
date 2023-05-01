import { NextApiRequest, NextApiResponse } from 'next';

export const logoutHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	req.session.destroy();

	return res.status( 200 ).json( { isLoggedIn: false } );
};
