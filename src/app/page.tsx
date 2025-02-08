'use client';
import { FileUpload } from '@/components/ui/file-upload';
import { dropValidation } from '@/lib/utils';
import { useState } from 'react';
import { FileRejection } from 'react-dropzone';

export default function Home() {
	const [acceptedFiles, setAcceptedFiles] = useState<File[] | undefined>();
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[] | undefined>();

	return (
		<div className='flex h-full flex-1'>
			<div className='flex flex-1 flex-col'>
				<FileUpload
					onDropAccepted={(accepted) => {
						console.info(accepted.length);
						setAcceptedFiles(accepted);
					}}
					onDropRejected={(rejected) => {
						console.info(rejected.length);

						setRejectedFiles(rejected);
					}}
					className='h-full w-full'
					accepted={acceptedFiles}
					rejected={rejectedFiles}
					maxFiles={Infinity}
					validator={dropValidation}
					multiple
					noClick
					noKeyboard
					preventDropOnDocument
				/>
				<div>dropped files stats or warnings about privacy idk</div>
				<button className='py-8'>submit</button>
			</div>
			<div className='flex flex-1 flex-col'></div>
		</div>
	);
}

// import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/kibo-ui/dropzone';
// import { useState } from 'react';

// export default function Home() {
// 	const [acceptedFiles, setAcceptedFiles] = useState<File[] | undefined>();
// 	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[] | undefined>();

// 	return (
// 		<div className='flex flex-1 h-full'>
// 			<div className='flex flex-col bg-blue-50 flex-1'>
// 				<Dropzone
// 					onDropAccepted={(accepted) => {
// 						setAcceptedFiles(accepted);
// 					}}
// 					onDropRejected={(rejected) => {
// 						setRejectedFiles(rejected);
// 					}}
// 					className='h-full'
// 					src={acceptedFiles}
// 					maxFiles={Infinity}
// 					validator={dropValidation}
// 					multiple
// 					noClick
// 					noKeyboard
// 					preventDropOnDocument
// 				>
// 					<DropzoneEmptyState />
// 					<DropzoneContent />
// 				</Dropzone>
// 				<div>dropped files stats or warnings about privacy idk</div>
// 				<button className='bg-blue-500 py-8'>submit</button>
// 			</div>
// 			<div className='flex flex-col bg-red-50 flex-1'>

// 			</div>
// 		</div>
// 	);
// }
