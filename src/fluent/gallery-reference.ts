import pages from './gallery-reference.json';

export function galleryReference(name: string) {
  return (pages as Record<string, {title: string; category: string; description: string; image?: string; source: string | null; examples: {source: string; content: string | null}[]}>)[name];
}
