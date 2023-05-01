# How to: Add Server Side Authentication with Headless Login for WPGraphQL.

The following tutorial will walk you through setting up server-side authentication in your NextJS app, using [API routes](https://nextjs.org/docs/api-routes/introduction). We'll be handling session management with [`iron-session`](https://github.com/vvo/iron-session).

> You can also follow along by reviewing this branch's [commit history](https://github.com/AxeWP/axepress-playground/commits/demo/server-side-auth).

## Prerequesties
- _See the [README.md](./README.md#prerequesites) for the project prerequisites._
- An OAuth2 Client ID and secret. For this example, we'll be using [Google OAuth2](https://developers.google.com/identity/protocols/oauth2).

## 0. (Optional) Add support for your Block Theme.

We've squashed in the `demo/block-theme-support` branch to add support for the [FrostWP theme](https://wordpress.org/themes/frostwp/). You can support a different block theme by following the steps in the [HowTo.md](https://github.com/AxeWP/axepress-playground/blob/demo/block-theme-support/HowTo.md).

## 1. Install and activate Headless Login for WPGraphQL.

Download and install the latest [release zip](https://github.com/AxeWP/wp-graphql-headless-login/releases/download/0.1.0/wp-graphql-headless-login.zip), then head over to your WordPress admin and activate the plugin.

## 2. Configure your Headless Login provider settings.
Head over to your WordPress Admin and navigate to `WPGraphQL > Settings > Headless Login`, and configure your [settings](https://github.com/AxeWP/wp-graphql-headless-login/docs/settings.md).

For this example, we'll be configuring the [Google OAuth2 provider](https://developers.google.com/identity/protocols/oauth2) and the Password Provider.

### Google Settings
We'll input our OAuth2 Client ID and Secret we created in the [Google Developer Console](https://console.developers.google.com/), and set the `REDIRECT URI` to `http://localhost:3000/api/auth/login/google`. That URI is the path to our login API route, which we'll create in [Step 6](#6-create-your-api-routes).

> Note, make sure to add that URI to the list of `Authoried redirect URIs` in the Google Developer Console!

We'll also turn on the `Login existing users`, and `create new users` setting, so that our demo will work without needing to manually create users on WordPress.

> Note: when you're done, run `yarn prepare` to regenerate types from the GraphQL schema. 

## 3. Create a `Login` and `My Account` page in WordPress.

We'll leverage FaustJS's [Template Hierarchy](https://faustjs.org/docs/templates) feature to use those WordPress pages to control our frontend (SEO, page content, etc).

## 4. Add the `iron-session` and `jsonwebtoken` packages.

We'll be using [`iron-session`](https://github.com/vvo/iron-session) to handle session management, and [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) to help authenticate the JWT token we'll be receiving from WordPress.

```bash
yarn add iron-session jsonwebtoken
```

For Typescript support, we'll also need to install the types.
```bash
yarn add -D @types/jsonwebtoken
```

Next, we'll define a cookie password in our .env file that `iron-session`.

```bash
# .env.local
... rest of file

# Iron Session Cookie Password
SECRET_COOKIE_PASSWORD='complex_password_at_least_32_characters_long';
```

Lastly, we'll create a `config` object for `iron-session` to use throughout our app.

```ts
// src/features/Login/config.ts
import { IronSessionOptions } from 'iron-session';

// And some more iron-session stuff:
export const ironOptions : IronSessionOptions = {
	cookieName: 'axepress-playground-session',
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieOptions: {
		// the next line allows to use the session in non-https environments like
		// Next.js dev mode (http://localhost:3000)
		secure: process.env.NODE_ENV === 'production',
	},
};
```

## 5. Scaffold your frontend components.

First, we need to create the `wp-template` files for our [`page-login`](./src/wp-templates/page-login.tsx) and [`page-my-account`](./src/wp-templates/page-my-account.tsx) hierarchies. We'll also add a [Login/Logout button](./src/features/Login/components/UserMenu.tsx) to our site Header.

Inside the Login page, we need a Password Form and links to our Google Provider authentication URL. We can grab them from WPGraphQL:

```tsx
// src/features/Login/components/OAuth2ClientList
import { __, sprintf } from '@wordpress/i18n';
import { LoginClientFragFragment } from '@graphqlTypes';

export const OAuth2ClientList = ( { clients } : {
	clients: LoginClientFragFragment[] | undefined
} ) => {
	if ( ! clients?.length ) {
		return null;
	}

	return (
		<div className="wp-block-group has-text-align-center">
			{ clients.map( ( client ) => {
				if ( ! client?.authorizationUrl ) {
					return null;
				}

				return (
					<a
						key={client.provider}
						href={client.authorizationUrl}
						className="has-regular-font-size hover:shadow-lg cursor-pointer transition ease-in duration-300"
						target="_blank"
					>
						{ sprintf(
							// translators: %s: Client name.
							__( 'Login with %s', 'axepress-labs' ),
							client?.name,
						) }
					</a>
				);
			} ) }
		</div>
	);
};

OAuth2ClientList.fragments = {
	client: gql`
		fragment LoginClientFrag on LoginClient {
			clientId
			authorizationUrl
			name
			provider
			isEnabled
			order
		}
	`,
};
```

Lastly, we'll create a local [`apolloClient.ts`](./src/lib/apolloClient.ts), since the one bundled with FaustJS is sadly not extensible.

## 6. Create your API routes.

Now it's finally time to start handling our authentication logic 🎉.

We'll use [API routes](https://nextjs.org/docs/api-routes/introduction) to keep our authentication logic on the server side and limit the chances of exposing user data to the client. (You can use [Next Middlewares](https://nextjs.org/docs/api-routes/api-middlewares) to accomplish the same thing.).

We'll also use [`iron-session`](https://github.com/vvo/iron-session) which will store our session data in an encrypted `httpOnly` cookie that similarly can only be accessed on the server side.

We'll need three API routes: one to handle logging the user into WordPress and creating the session, one to handle logging the user out, and one to verify the user's session is still valid.

### Login API Route

We'll create a [Dynamic API Route](https://nextjs.org/docs/api-routes/dynamic-api-routes) at `/api/auth/login/[provider]` that will handle logging the user into WordPress. We'll use the `provider` query parameter to determine which provider to use, and depending on the provider, we'll shape the input that needs to get sent to WPGraphQL.

```ts
// src/pages/api/auth/login/[provider].ts

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

	return loginHandler( req, res, input ); // We'll get to this next.
};

export default withSessionApiRoute( handler );
```

Next, we need to create our `loginHandler()` function, which will [send off the GraphQL mutation](./src/features/Login/utils/authenticate.ts) and then create the session. We'll also return the user data, with the `authToken` and `refreshToken` stripped out so they don't get leaked to the client.

```ts
// src/features/Login/utils/loginHandler.ts

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
```
### Logout API Route

This route is much simpler, since we don't need to send any data to WordPress. We'll just clear the session and send a success response.

```ts
// src/features/Login/utils/logoutHandler.ts

export const logoutHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	req.session.destroy();

	return res.status( 200 ).json( { isLoggedIn: false } );
};
```

```ts
// src/pages/api/auth/logout.ts

const handler: NextApiHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	return logoutHandler( req, res );
};

export default withSessionApiRoute( handler );

```

### User API Route

We'll use the `src/pages/api/auth/user.ts` route to verify a user's session is still valid. We'll check if their JWT `authToken` is still valid, and if not, we'll try to refresh it.

```ts
// src/features/Login/utils/isTokenExpired.ts

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
```
```ts
// src/features/Login/utils/refreshAuthToken.ts
import { getApolloClient } from '@/lib/apolloClient';

export const refreshAuthToken : ( refreshToken: string ) => Promise<string> = async ( refreshToken: string ) => {
	const variables = {
		refreshToken,
	};

	const client = getApolloClient();

	const {
		data,
	} = await client.mutate<RefreshAuthTokenMutation>( {
		mutation: REFRESH_TOKEN_MUTATION,
		variables,
	} );

	return data?.refreshToken?.authToken ?? '';
};
```

```ts
// src/features/Login/utils/userHandler.ts

export const userHandler: NextApiHandler = async ( req: NextApiRequest, res: NextApiResponse ) => {
	const user : UserSession = req.session?.user || {} as UserSession;

	// If the user doesn't have a refresh token, they're not logged in.
	if ( ! user?.refreshToken ) {
		req.session.user = {
			...user,
			isLoggedIn: false,
		};

		await req.session.save();

		return res.status( 401 ).json( {
			error: 'User is not logged in.',
			user: user?.userData,
			isLoggedIn: user?.isLoggedIn,
		} );
	}

	// If the user is missing an auth token or it is expired, try to refresh it.
	if ( ! user?.authToken || isTokenExpired( user.authToken ) ) {
		try {
			const authToken = await refreshAuthToken( user.refreshToken );

			// If the auth token is empty, log the user out.
			if ( ! authToken ) {
				req.session.destroy();

				return res.status( 401 ).json( {
					error: 'User is not logged in.',
					user: undefined,
					isLoggedIn: false,
				} );
			}

			user.authToken = authToken;
			user.isLoggedIn = true;

			// update the user session.
			req.session.user = user;

			await req.session.save();

			return res.status( 200 ).json( {
				user: user?.userData,
				isLoggedIn: user.isLoggedIn,
			} );
		} catch ( error ) {
			// This means the mutation failed, so the user is not logged in.
			// We don't destroy the session here, because we want to keep the stale data in case the server fixes itself.

			user.isLoggedIn = false;

			req.session.user = user;

			await req.session.save();

			return res.status( 401 ).json( {
				error: __( 'User is not logged in.', 'axepress-labs' ),
				user: user?.userData,
				isLoggedIn: user.isLoggedIn,
			} );
		}
	}

	// If the user has an auth token and it's not expired, they're logged in.
	return res.status( 200 ).json( { user } );
};
```

## 7. Use the API Routes in your app.

Now let's create some React hooks to make it easy to use the API routes in our app, and then update our frontend components to use them.

> Sadly, we cannot currently use FaustJS's auth hooks as they currently are not extensible.

- `usePasswordLogin()` : We'll use [this hook](./src/features/Login/hooks/usePasswordLogin.ts) to handle logging in via our [PasswordForm](./src/features/Login/components/PasswordForm.tsx).
- `useLogout()` : Similar to the previous one, we'll use [this hook](./src/features/Login/hooks/useLogout.ts) to handle logging out in our [UserMenu](./src/features/Login/components/UserMenu.tsx).
- `useAuth()` : [This hook](./src/features/Login/hooks/useAuth.ts) will be used to check if a user is currently authenticated, and optionally redirect them to a different page.

We can then use the `useAuth` hook to create an [Authentication gateway](./src/features/Login/providers/AuthenticationProvider.tsx) using React Context.

```tsx
// src/features/Login/providers/AuthenticationProvider.tsx

export const AuthenticationProvider = ( { redirectTo, redirectOnError = true, children } : PropsWithChildren<{
	redirectTo?: string;
	redirectOnError?: boolean;
}> ) => {
	const [ showChildren, setShowChildren ] = useState( ! redirectTo );

	const { isAuthenticated, isLoading, error, userData } = useAuth( { redirectTo, redirectOnError } );

	useEffect( () => {
		if ( ! redirectTo ) {
			return;
		}

		const show = shouldShowChildren( isAuthenticated, isLoading, redirectOnError );

		if ( showChildren !== show ) {
			setShowChildren( show );
		}
	}, [ isAuthenticated, isLoading, redirectOnError, redirectTo, showChildren ] );

	return (
		<AuthenticationContext.Provider value={ { isAuthenticated, isLoading, error, userData } }>
			{ showChildren ? children : <Loading /> }
		</AuthenticationContext.Provider>
	);
};
```
We'll use this provider to [sends guests from the dashboard to the login page](./src/wp-templates/page-my-account.tsx) and [vice versa](./src/wp-templates/page-login.tsx).

## 8. That's it!

You now have a working authentication system for your Headless WordPress site. Run `yarn dev` or `yarn build && yarn start` to see it in action.

> Note: Your `first load JS` might be getting pretty large around now. That's because FaustJS loads _all the `wp-templates`_ on every page that uses them. Try loading them (or their inner components) dynamically, and let us know how it goes.

From here, you can add more features, such as syncing data from the OAuth2 provider on login, support for Woocommerce Sessions and customer data, or a "Forgot Password" form.
