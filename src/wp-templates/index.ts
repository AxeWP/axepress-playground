import FrontPage from './front-page';
import Index from './main';
import Page from './page';
import Login from './page-login';
import MyAccount from './page-my-account';
import Singular from './singular';

const templates = {
	'front-page': FrontPage,
	'page-login': Login,
	'page-my-account': MyAccount,
	Page,
	Singular,
	Index,
};

export default templates;
