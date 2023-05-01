import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { logoutHandler, withSessionApiRoute } from '@/features';

const handler: NextApiHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	return logoutHandler( req, res );
};

export default withSessionApiRoute( handler );
