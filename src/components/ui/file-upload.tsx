import { cn, renderBytes } from '@/lib/utils';
import { IconUpload } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';

const mainVariant = {
	initial: {
		x: 0,
		y: 0,
	},
	animate: {
		x: 20,
		y: -20,
		opacity: 0.9,
	},
};

const secondaryVariant = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
};

export type DropzoneProps = DropzoneOptions & {
	accepted?: File[];
	rejected?: FileRejection[];
	className?: string;
};

export const FileUpload = ({
	accepted,
	rejected,
	className,
	...props
}: DropzoneProps) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		...props,
	});

	return (
		<div
			className={cn(
				'rounded-lg border border-dashed bg-white dark:bg-black',
				isDragActive
					? 'border-green-400'
					: 'border-neutral-200 dark:border-neutral-800',
				className
			)}
			{...getRootProps()}
		>
			<motion.div
				whileHover='animate'
				className='group/file relative block h-full w-full overflow-hidden rounded-lg p-10'
			>
				<input {...getInputProps} className='hidden' />
				<div className='flex h-full flex-col items-center justify-start'>
					<p className='relative z-20 font-bold font-sans text-base text-neutral-700 dark:text-neutral-300'>
						Upload your Next app
					</p>
					<p className='relative z-20 mt-2 font-normal font-sans text-base text-neutral-400 dark:text-neutral-400'>
						Drag and drop your Next app dir here to upload
					</p>

					<div className='relative mx-auto my-auto w-full max-w-xl'>
						{(accepted?.length ?? 0) + (rejected?.length ?? 0) > 0 && (
							<motion.div
								layoutId={'file-upload'}
								className={cn(
									'relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 md:h-24 dark:bg-neutral-900',
									'shadow-sm'
								)}
							>
								<div className='flex w-full items-center justify-between gap-4'>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className='max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300'
									>
										{accepted?.length} files ready
									</motion.p>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className='w-fit flex-shrink-0 rounded-lg px-2 py-1 text-neutral-600 text-sm shadow-input dark:bg-neutral-800 dark:text-white'
									>
										{renderBytes(
											(accepted || []).reduce((acc, act) => {
												return acc + act.size;
											}, 0)
										)}
									</motion.p>
								</div>

								<div className='mt-2 flex w-full flex-col items-start justify-between text-neutral-600 text-sm md:flex-row md:items-center dark:text-neutral-400'>
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
										className='rounded-md bg-red-50 px-1 py-0.5 text-red-400 dark:bg-neutral-800 '
									>
										{rejected?.length} files ignored
									</motion.p>

									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										layout
									>
										ignore rules
									</motion.p>
								</div>
							</motion.div>
						)}
						{(accepted?.length ?? 0) + (rejected?.length ?? 0) === 0 && (
							<motion.div
								layoutId='file-upload'
								variants={mainVariant}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 20,
								}}
								className={cn(
									'relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900',
									'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]'
								)}
							>
								{isDragActive ? (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className='flex flex-col items-center text-neutral-600'
									>
										Drop it
										<IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
									</motion.p>
								) : (
									<IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
								)}
							</motion.div>
						)}
						{(accepted?.length ?? 0) + (rejected?.length ?? 0) === 0 && (
							<motion.div
								variants={secondaryVariant}
								className='absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-sky-400 border-dashed bg-transparent opacity-0'
							/>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
};
