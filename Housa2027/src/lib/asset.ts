// Path to a file in /public. Plain <img> and CSS urls are not rewritten for the GitHub Pages sub-path
// (/Claude/housa2027), so prefix it here. Empty when running locally.
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
