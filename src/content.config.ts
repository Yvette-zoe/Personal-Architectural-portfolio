import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const infoCardSchema = z.object({
	label: z.string(),
	text: z.string(),
});

const projectContentSchema = z.object({
	background: z.string().optional(),
	concept: z.string().optional(),
	highlights: z.array(z.string()).optional(),
});

/** 建筑项目内容集合 */
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/index.md' }),
	schema: z.object({
		title: z.string(),
		slug: z.string().optional(),
		/** 列表序号，如 01、02 */
		displayId: z.string().optional(),
		subtitle: z.string().optional(),
		year: z.number(),
		location: z.string(),
		category: z.string(),
		featured: z.boolean().default(false),
		order: z.number().default(0),
		description: z.string(),
		infoCards: z.array(infoCardSchema).optional(),
		tags: z.array(z.string()).optional(),
		content: projectContentSchema.optional(),
	}),
});

export const collections = { projects };
