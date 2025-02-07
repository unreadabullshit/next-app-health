'use client';

import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/kibo-ui/dropzone';
import { useState } from 'react';

export default function Home() {
	const [files, setFiles] = useState<File[] | undefined>();

	const handleDrop = (files: File[]) => {
		console.info(files);
		setFiles(files);
	};

	return (
		<div>
			<div className='flex h-screen w-full items-center justify-center bg-secondary p-8'>
				<Dropzone
					onDrop={handleDrop}
					src={files}
					multiple
					maxFiles={Infinity}
					onError={console.error}
				>
					<DropzoneEmptyState />
					<DropzoneContent />
				</Dropzone>
			</div>
		</div>
	);
}
