'use server';

import { mapRoutes } from '@/lib/analyzer';

export const upload = async (files: { _p: string; _f: File }[]) => {
	try {
		console.dir(mapRoutes(files), {
			depth: 3,
		});
	} catch (err) {
		console.info(err);
	}

	return null;
};
