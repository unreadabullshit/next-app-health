// type Reference = `${string}#${'default'}`

// const something: Reference = 'caminho#default'

// interface Route {
//   group: unknown[]
// }

const next_route_filenames = [
	{ filename: 'layout', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'loading', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'not-found', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'error', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'global-error', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'route', supports: ['js', 'ts'] },
	{ filename: 'template', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'default', supports: ['js', 'jsx', 'tsx'] },
	{ filename: 'page', supports: ['js', 'jsx', 'tsx'] },
] as const;

export function mapRoutes(files: { _p: string; _f: File }[]) {
	const routes: unknown[] = [];

	for (const file of files) {
		const parsed = parseRoutePath(file._p);

		if (parsed) {
			console.info(parsed);
		}
	}

	return routes;
}

function parseRoutePath(path: string) {
	const app_index = path.indexOf('/app/');

	let ignored_file = false;
	let ignored_path = false;

	if (app_index === -1) return null;

	const path_from_app = path.slice(app_index + 5); // +5 to skip '/app/'
	const path_after_app_parts = path_from_app.split('/'); // path rest from /app/ + filename
	const filename = path_after_app_parts.pop() || '';
	const path_after_app = `/${path_after_app_parts.join('/')}`; // path rest from /app/ - filename
	const url_path = path_after_app_parts.reduce((acc, act) => {
		if (act.startsWith('_')) {
			ignored_path = true;
		}

		// filtering off "(group)" from url
		if (/^\(.*\)$/.test(act)) {
			return acc;
		}

		if (acc.endsWith('/')) {
			return `${acc}${act}`;
		}

		return `${acc}/${act}`;
	}, '/');
	const splitted_filename = filename.split('.');

	if (splitted_filename.length !== 2) return null;

	const have_next_router_filename = next_route_filenames.some((p, _i, _arr) => {
		if (splitted_filename[0].startsWith('_')) {
			ignored_file = true;

			return (
				// @ts-expect-error
				splitted_filename[0].slice(1) === p.filename && p.supports.includes(splitted_filename[1])
			);
		}

		// @ts-expect-error
		return splitted_filename[0] === p.filename && p.supports.includes(splitted_filename[1]);
	});

	if (!have_next_router_filename) return null;

	return {
		route: {
			original: path,
			path: path_after_app,
			url: url_path,
			ignored: ignored_path,
		},
		file: {
			name: filename,
			ignored: ignored_file,
		},
	};
}
