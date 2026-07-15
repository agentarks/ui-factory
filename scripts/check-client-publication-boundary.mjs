import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const clientOutput = '.svelte-kit/output/client';
const sentinel = 'UI_FACTORY_UNPUBLISHED_WORKBENCH_SENTINEL_DO_NOT_BUNDLE';

async function findSentinel(directory) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			const match = await findSentinel(path);
			if (match) return match;
		} else if ((await readFile(path)).includes(sentinel)) {
			return path;
		}
	}
}

const match = await findSentinel(clientOutput);
if (match) {
	console.error(`Unpublished workbench fixture found in client build: ${match}`);
	process.exitCode = 1;
} else {
	console.log('Client build excludes the unpublished workbench fixture.');
}
