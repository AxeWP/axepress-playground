import { setConfig, FaustConfig } from '@faustwp/core';
import ApolloClientOptionsPlugin from '@/plugins/ApolloClientOptionsPlugin';
import possibleTypes from './possibleTypes.json';
import templates from './src/wp-templates/index';

const config: FaustConfig = {
	templates,
	experimentalPlugins: [
		new ApolloClientOptionsPlugin(),
	],
	possibleTypes,
};

export default setConfig( config );
