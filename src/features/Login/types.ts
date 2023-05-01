import { LoginMutation, UserDataFragFragment } from '@graphqlTypes';

export type UserSession = LoginMutation['login'] & {
	isLoggedIn: boolean;
	userData: UserDataFragFragment | undefined;
};

declare module 'iron-session' {
	interface IronSessionData {
		user: UserSession;
	}
}
