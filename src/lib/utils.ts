import { type ClassValue, clsx } from 'clsx';
import { FileWithPath } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const dropValidation = (file: FileWithPath) => {
	if (file instanceof DataTransferItem) return null;

	if (file.path?.includes('node_modules')) {
		return {
			code: 'node_modules',
			message: 'forbidden node_modules dir',
		};
	}

	if (file.path?.includes('.next')) {
		return {
			code: '.next',
			message: 'forbidden .next dir',
		};
	}

	if (file.path?.includes('.git')) {
		return {
			code: '.git',
			message: 'forbidden .git dir',
		};
	}

	if (file.name.startsWith('.env')) {
		return {
			code: 'env',
			message: 'forbidden env file',
		};
	}

	return null;
};

export const renderBytes = (bytes: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)}${units[unitIndex]}`;
};
