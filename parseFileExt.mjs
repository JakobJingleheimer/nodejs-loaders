import path from 'node:path';


export default function parseFileExt(resolvedUrl) {
  const url = new URL(resolvedUrl);

  const ext = path.extname(url.pathname);
  const base = path.basename(url.pathname, ext);

  return {
    base,
    ext: ext.slice(1),
  };
}
