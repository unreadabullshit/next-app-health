import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

function Browser({
	className,
	children,
	searchBar,
}: {
	children?: ReactNode;
	className?: string;
	searchBar: ReactNode;
}) {
	return (
		<div
			className={cn(
				'dark:dots-neutral-800 dots-gray-300 relative h-full w-full flex-1 rounded-lg border bg-white text-neutral-950 text-sm shadow-gray-200 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:shadow-none',
				className
			)}
		>
			<div
				className={
					'flex w-full items-center justify-between rounded-t-lg border-inherit border-b bg-inherit px-4 py-2'
				}
			>
				<Dots />

				{searchBar}
			</div>
			<div
				className={
					'absolute top-0 left-0 mt-12 h-[calc(100%_-_3rem)] w-full'
				}
			>
				{children}
			</div>
		</div>
	);
}

function Dots() {
	return (
		<div className={'flex gap-2'}>
			<div
				className={'h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-800'}
			/>
			<div
				className={'h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-800'}
			/>
			<div
				className={'h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-800'}
			/>
		</div>
	);
}

export { Browser };
