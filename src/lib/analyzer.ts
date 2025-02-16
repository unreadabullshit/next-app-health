import { ParsedRouteSchema, parsedRouteSchema } from './schemas';

export function mapRoutes(files: { _p: string; _f: File }[]) {
	const routes: {
		route: ParsedRouteSchema['route'];
		files: ParsedRouteSchema['file'][];
	}[] = [];

	for (const file of files) {
		const parsed = parsedRouteSchema.safeParse({
			source: file._p,
		});

		if (parsed.success) {
			const idx = routes.findIndex(
				(r) => r.route.app === parsed.data.route.app
			);

			if (idx !== -1) {
				routes[idx].files.push(parsed.data.file);
			} else {
				routes.push({
					route: parsed.data.route,
					files: [parsed.data.file],
				});
			}

			continue;
		}

		// console.error(parsed.error.issues);
	}

	return routes;
}
