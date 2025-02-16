import { z } from 'zod';
import { checkNextAppRouterReservedFilename } from './utils';

export const parsedRouteSchema = z
	.object({
		source: z.string(),
	})
	.transform((value, ctx) => {
		const appIndex = value.source.indexOf('/app/');

		if (appIndex === -1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'FILE NOT INSIDE "/app" DIR',
				fatal: true,
			});

			return z.NEVER;
		}

		const pathFromApp = value.source.slice(appIndex + 5); // +5 to skip '/app/'
		const pathParts = pathFromApp.split('/'); // ...path from /app/ with filename
		const filename = pathParts.pop() || '';
		const appPath = `/${pathParts.join('/')}`; // ...path from /app/ without filename
		const urlPath = pathParts.reduce((acc, act) => {
			// filtering off "(group)" from url
			if (/^\(.*\)$/.test(act)) {
				return acc;
			}

			if (acc.endsWith('/')) {
				return `${acc}${act}`;
			}

			return `${acc}/${act}`;
		}, '/');

		const reservedFilename = checkNextAppRouterReservedFilename(filename);

		if (!reservedFilename) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'NON RESERVED NEXT ROUTER FILENAME',
				fatal: true,
			});

			return z.NEVER;
		}

		return {
			...value,
			file: {
				name: filename,
				ignored: filename.startsWith('_'),
			},
			route: {
				app: appPath,
				url: urlPath,
				ignored: pathParts.some((part) => part.startsWith('_')),
			},
		};
	});
export type ParsedRouteSchema = z.infer<typeof parsedRouteSchema>;
