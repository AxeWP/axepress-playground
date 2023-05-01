import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { ironOptions } from '../config';

export const withSessionApiRoute = ( handler: NextApiHandler ) => withIronSessionApiRoute( handler, ironOptions );
