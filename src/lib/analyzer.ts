// type Reference = `${string}#${'default'}`

// const something: Reference = 'caminho#default'

// interface Route {
//   group: unknown[]
// }

const next_route_files = [
	'layout',
	'loading',
	'not-found',
	'error',
	'global-error',
	'route',
	'template',
	'default',
	'page',
] as const;

export const mapRoutes = (files: { _p: string; _f: File }[]) => {
	const routes: {
		original_path: string;
		route_path: string;
		url_path: string;
		ignored: boolean;
		route_file: (typeof next_route_files)[number][];
	}[] = [];

	for (const file of files) {
		const parsed = parseRoutePath(file._p);

		console.info(parsed)
	}

	return routes;
};

const parseRoutePath = (path: string) => {
	const appIndex = path.indexOf('/app/');

	if (appIndex === -1) {
		return null;
	}

	const afterApp = path.slice(appIndex + 5); // +5 to skip '/app/'
	const pathParts = afterApp.split('/');
	const filename = pathParts.pop() || '';
	const pathInsideAppDir = `/${pathParts.join('/')}${pathParts.length ? '/' : ''}`;

	const urlPath = pathParts.reduce((acc, act) => {
		if (/^\(.*\)$/.test(act)) {
			return acc;
		}

		return `${acc}/${act}`;
	}, '');

	return {
		route: {
			original: path,
			path: pathInsideAppDir,
			url: urlPath,
			ignored: pathParts.some((part) => part.startsWith('_')),
		},
		file: {
			name: filename,
			ignored: filename.startsWith('_'),
		},
	};
};
