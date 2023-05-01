export const Loading = () => {
	/**
	 * Swap out `has-secondary-background-color` with a design token from your theme e.g. `has-secondary-background-color`.
	 */
	return (
		<div role="status" className="mx-auto max-w-lg animate-pulse">
			<div className="mx-auto mb-4 h-6 w-48 rounded-xl has-secondary-background-color"></div>
			<div className="mb-2.5 h-4 max-w-[360px] rounded-xl has-secondary-background-color"></div>
			<div className="mb-2.5 h-4 rounded-xl has-secondary-background-color"></div>
			<div className="mb-2.5 h-4 max-w-[330px] rounded-xl has-secondary-background-color"></div>
			<div className="mb-2.5 h-4 max-w-[300px] rounded-xl has-secondary-background-color"></div>
			<div className="h-4 max-w-[360px] rounded-xl has-secondary-background-color"></div>
			<span className="sr-only">Loading...</span>
		</div>
	);
};
