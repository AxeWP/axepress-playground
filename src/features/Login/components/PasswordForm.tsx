import { __ } from '@wordpress/i18n';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { usePasswordLogin } from '../hooks';

export const PasswordForm = () => {
	// get the redirectTo from the query params.
	const router = useRouter();
	const { redirectTo } = router.query;

	const [ usernameEmail, setUsernameEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );
	const { login, isLoading, errors } = usePasswordLogin();

	return (
		<form
			className="mt-8 space-y-8"
			onSubmit={( e ) => {
				e.preventDefault();

				login( usernameEmail,
					password, redirectTo as string || '/my-account' );
			}}
		>
			<fieldset className="relative">
				<label className="ml-3 has-small-font-size font-bold tracking-wide" htmlFor="usernameEmail">
					{ __( 'Username or Email', 'axepress-labs' ) }
				</label>
				<input
					id="usernameEmail"
					type="string"
					className="w-full px-4 has-small-font-size py-2 border-b rounded-2xl border-neutral focus:outline-none focus:border-secondary"
					disabled={isLoading === true}
					placeholder="mail@yourmail.com"
					value={usernameEmail}
					onChange={( e ) => setUsernameEmail( e.target.value )}
				/>
			</fieldset>

			<fieldset className="mt-8 content-center">
				<label className="ml-3 has-small-font-size font-bold tracking-wide" htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					className="w-full content-center has-small-font-size px-4 py-2 border-b rounded-2xl border-neutral focus:outline-none focus:border-secondary"
					disabled={isLoading === true}
					value={password}
					onChange={( e ) => setPassword( e.target.value )}
				/>
			</fieldset>
			<div className="flex flex-row-reverse text-sm">
				<a href="#to-do" className="text-indigo-400 hover:text-blue-500">
					{ __( 'Forgot your password?', 'axepress-labs' ) }
				</a>
			</div>

			{!! errors?.length && errors.map( ( error, index ) => (
				<p key={`${ error.name }-${ index }` } className="has-secondary-color font-bold has-text-align-center">
					{error.toString()}
				</p>
			) ) }

			<fieldset className="">
				<button type="submit"
					className="has-primary-background-color has-background wp-element-button w-full rounded-full tracking-wide shadow-lg hover:shadow-md font-semibold  cursor-pointer transition ease-in duration-500"
				>
					{ __( 'Sign in', 'axepress-labs' ) }
				</button>
			</fieldset>
		</form>
	);
};
