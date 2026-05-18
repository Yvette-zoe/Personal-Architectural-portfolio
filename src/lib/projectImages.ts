/** 项目图片：public/images/projects/（thumb_*.png、project_*_*.png） */
const base = import.meta.env.BASE_URL;

function img(name: string): string {
	return `${base}images/projects/${name}`;
}

export interface ProjectAssets {
	thumb: string;
	gallery: string[];
}

export const projectImages: Record<string, ProjectAssets> = {
	'project-01': {
		thumb: img('thumb_01.png'),
		gallery: [
			img('project_01_01.png'),
			img('project_01_02.png'),
			img('project_01_03.png'),
			img('project_01_04.png'),
		],
	},
	'project-02': {
		thumb: img('thumb_02.png'),
		gallery: [img('project_02_01.png'), img('project_02_02.png'), img('project_02_03.png')],
	},
	'project-03': {
		thumb: img('thumb_03.png'),
		gallery: [img('project_03_01.png'), img('project_03_02.png'), img('project_03_03.png')],
	},
	'project-04': {
		thumb: img('thumb_04.png'),
		gallery: [
			img('project_04_01.png'),
			img('project_04_02.png'),
			img('project_04_03.png'),
			img('project_04_04.png'),
		],
	},
	'project-05': {
		thumb: img('thumb_05.png'),
		gallery: [img('project_05_01.png'), img('project_05_02.png'), img('project_05_03.png')],
	},
};

export function getProjectAssets(slug: string): ProjectAssets | undefined {
	return projectImages[slug];
}
