import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { userHandler, withSessionApiRoute } from '@/features';

const handler: NextApiHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	return userHandler( req, res );
};

export default withSessionApiRoute( handler );
