import { getCollection, type CollectionEntry } from 'astro:content';
import { getProjectAssets, type ProjectAssets } from '../lib/projectImages';

export type ProjectEntry = CollectionEntry<'projects'>;

export function getProjectSlug(entry: ProjectEntry | string): string {
	if (typeof entry === 'string') {
		return entry.replace(/\/index$/, '').replace(/^projects\//, '');
	}
	return entry.data.slug ?? getProjectSlug(entry.id);
}

export function getDisplayId(entry: ProjectEntry, index: number): string {
	return entry.data.displayId ?? String(index + 1).padStart(2, '0');
}

export function resolveProjectAssets(entry: ProjectEntry): ProjectAssets | undefined {
	return getProjectAssets(getProjectSlug(entry));
}

export function sortProjects(entries: ProjectEntry[]): ProjectEntry[] {
	return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
	const entries = await getCollection('projects');
	return sortProjects(entries).filter((e) => resolveProjectAssets(e));
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
	return (await getAllProjects()).filter((e) => e.data.featured);
}

export function projectUrl(slug: string): string {
	const base = import.meta.env.BASE_URL;
	return `${base}works/${slug}/`;
}

export function getAdjacentProjects(
	projects: ProjectEntry[],
	slug: string,
): { prev: ProjectEntry | null; next: ProjectEntry | null; isLast: boolean } {
	const index = projects.findIndex((p) => getProjectSlug(p) === slug);
	return {
		prev: index > 0 ? projects[index - 1]! : null,
		next: index < projects.length - 1 ? projects[index + 1]! : null,
		isLast: index === projects.length - 1,
	};
}
