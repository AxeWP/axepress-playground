import { MAIN_CONTENT_ID } from 'constants/selectors';
import type { PropsWithoutRef, ReactNode } from 'react';

interface MainProps extends PropsWithoutRef<JSX.IntrinsicElements['main']> {
	children: ReactNode;
}

export const Main = ( {
	children,
	className,
	style,
	...props
} : MainProps,
) => {
	return (
		<main
			id={ MAIN_CONTENT_ID }
			className={className}
			tabIndex={ props?.tabIndex ?? -1 }
			style={style}
			{ ...props }
		>
			{ children }
		</main>
	);
};
