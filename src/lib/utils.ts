import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const dropValidation = (file: File) => {
	if (file instanceof DataTransferItem) return null;

	if (file.path.includes('node_modules')) {
		return {
			code: 'node_modules',
			message: 'forbidden node_modules dir',
		};
	}

	if (file.path.includes('.next')) {
		return {
			code: '.next',
			message: 'forbidden .next dir',
		};
	}

	if (file.path.includes('.git')) {
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
