import { __ } from '@wordpress/i18n';
import { MAIN_CONTENT_ID } from '@/constants';

export const SkipNavLink = () => {
	return (
		<a
			className={ 'sr-only' }
			href={ `#${ MAIN_CONTENT_ID }` }
		>
			{ __( 'Skip to main content', 'axepress-labs' ) }
		</a>
	);
};
