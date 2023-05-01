import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSessionApiRoute, loginHandler } from '@/features';
import { LoginInput, LoginProviderEnum, OAuthProviderResponseInput } from '@graphqlTypes';

const getProviderInput = async ( provider: string, req: NextApiRequest ) : Promise<LoginInput> => {
	const providerEnum = provider.toUpperCase() as LoginProviderEnum;

	switch ( providerEnum ) {
	// We need a different `case` for each provider type.
	case LoginProviderEnum.Password :
		return {
			provider: providerEnum,
			credentials: {
				username: req.body.username,
				password: req.body.password,
			},
		};
		// OAuth2 Providers share the same input shape.
	default: {
		const input = {
			provider: providerEnum,
			oauthResponse: {
				code: req.query.code as string,
			} as OAuthProviderResponseInput,
		};

		// If there is a state, add it to the input.
		if ( req.query?.state ) {
			input.oauthResponse.state = req.query.state as string;
		}

		return input;
	}
	} // end switch
};

const handler: NextApiHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	const provider = req.query?.provider as string || '';
	const input = await getProviderInput( provider, req );

	return loginHandler( req, res, input );
};

export default withSessionApiRoute( handler );
