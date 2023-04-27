import { gql } from '@apollo/client';
import { sprintf, __ } from '@wordpress/i18n';
import cn from 'clsx';
import { Image as FeaturedImage, ImageType } from '@/components';
import styles from './EntryHeader.module.scss';

export const EntryHeader = ( {
	title,
	image,
	date,
	author,
	className,
	dateFormat,
}: {
	title: string;
	image?: ImageType;
	date?: string;
	author?: string;
	className?: string;
	dateFormat?: Intl.DateTimeFormatOptions;
} ): JSX.Element => {
	const hasText = title || date || author;

	const dateStringOptions = dateFormat || {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	const formattedDate = date
		? new Date( date ).toLocaleDateString( 'en-us', dateStringOptions )
		: null;

	const headerClasses = cn(
		'wp-block-post-title has-text-align-center py-12 h-[60vh] max-h-[480px] relative flex',
		className,
	);

	return (
		<header
			className={headerClasses}
			style={{
				marginBottom: 'var(--wp--preset--spacing--50)',
			}}
		>
			{image && (
				<>
					<FeaturedImage
						image={image}
						priority
						width={1200}
						height={675}
						fill
						className="inset-0 object-cover z-0"
						sizes="(max-width: 1200px) 100vw, 1200px"
					/>
					<div className={cn( 'absolute inset-0 z-0', styles.gradient )} />
				</>
			) }

			{ hasText && (
				<div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-12">
					{ title && (
						<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">{title}</h1>
					) }

					{ ( date || author ) && (
						<div className="mt-6 flex items-center justify-center">
							{ date && (
								<time dateTime={date}>{formattedDate}</time>
							) }
							{ date && author && (
								<>&nbsp;</>
							) }
							{ author && (
								<span>
									{ sprintf(
										/* translators: %s: Author name. */
										__( 'by %s', 'axepress-labs' ),
										author,
									) }
								</span>
							) }
						</div>
					) }
				</div>
			)}
		</header>
	);
};

EntryHeader.fragments = {
	headerWithMeta: gql`
		fragment EntryHeaderWithMetaFrag on ContentNode {
			date
			... on NodeWithTitle {
				title
			}
			... on NodeWithAuthor {
				author {
					node {
						name
					}
				}
			}
			... on NodeWithFeaturedImage {
				featuredImage {
					node {
						id
						sourceUrl
						altText
						mediaDetails {
							width
							height
						}
					}
				}
			}
		}
	`,
	headerWithoutMeta: gql`
		fragment EntryHeaderWithoutMetaFrag on ContentNode {
			... on NodeWithTitle {
				title
			}
			... on NodeWithFeaturedImage {
				featuredImage {
					node {
						id
						sourceUrl
						altText
						mediaDetails {
							width
							height
						}
					}
				}
			}
		}
	`,
};
