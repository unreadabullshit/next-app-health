'use client';

import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/kibo-ui/dropzone';
import { dropValidation } from '@/lib/utils';
import { useState } from 'react';
import { FileRejection } from 'react-dropzone';

export default function Home() {
	const [acceptedFiles, setAcceptedFiles] = useState<File[] | undefined>();
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[] | undefined>();

	return (
		<div>
			<div className='flex h-auto w-[400px] items-center justify-center p-8'>
				<Dropzone
					src={acceptedFiles}
					onDropAccepted={(accepted) => {
						setAcceptedFiles(accepted);
					}}
					onDropRejected={(rejected) => {
						setRejectedFiles(rejected);
					}}
					multiple
					maxFiles={Infinity}
					noClick
					noKeyboard
					preventDropOnDocument
					validator={dropValidation}
				>
					<DropzoneEmptyState />
					<DropzoneContent>
						{acceptedFiles && <span>{acceptedFiles.length} files accepted</span>}
						{rejectedFiles && <span>{rejectedFiles.length} files rejected.</span>}
					</DropzoneContent>
				</Dropzone>
			</div>

			<ol>
				{acceptedFiles?.map((file) => (
					<li key={file.path}>{file.path}</li>
				))}
			</ol>
		</div>
	);
}
