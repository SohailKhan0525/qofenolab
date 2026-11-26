import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const project = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(project, 'out');
const target = path.resolve(project, '../../docs/labs/qofeno');
const page = await readFile(path.join(output, 'index.html'), 'utf8');
if (!page.includes('/qofenolab/labs/qofeno/_next/')) {
  throw new Error('Missing GitHub Pages base path in the built HTML.');
}
await stat(path.join(output, '_next/static'));
await mkdir(target, {recursive: true});

// Next exports HTML plus React Server Component text for app-router navigation.
// This lab has a single route; GitHub Pages handles repository-level 404 pages.
const entries = (await readdir(output)).filter(name => !['404', '404.html', '_not-found'].includes(name));
const notices = await Promise.all(['young-serif', 'public-sans'].map(async name => {
  const license = await readFile(path.join(project, 'src/app/fonts', `${name}-OFL.txt`), 'utf8');
  return `${name}\n\n${license.trim()}\n`;
}));
await writeFile(path.join(target, 'font-licenses.txt'), notices.join('\n'));

// Publish content-addressed assets before their referring document. Leave other
// lab files, including prompt.txt and skill.txt, under the editor's control.
const byDependency = entries.filter(name => name !== 'index.html').concat('index.html');
for (const name of byDependency) {
  const source = path.join(output, name);
  const dest = path.join(target, name);
  const temporary = dest + '.incoming';
  await rm(temporary, {recursive: true, force: true});
  await cp(source, temporary, {recursive: true});
  if (name === '_next') await rm(dest, {recursive: true, force: true});
  await rename(temporary, dest);
}
