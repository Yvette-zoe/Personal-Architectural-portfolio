/** 全站图片优化默认参数（astro:assets） */
export const IMAGE_QUALITY = 80 as const;

export const IMAGE_FORMAT = 'webp' as const;

/** 列表卡片封面：多宽度 + sizes */
export const CARD_IMAGE = {
	widths: [400, 640, 960, 1280] as const,
	sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
} as const;

/** 详情画廊：多宽度 + sizes */
export const GALLERY_IMAGE = {
	widths: [640, 960, 1280, 1920] as const,
	sizes: '(max-width: 1200px) 100vw, min(1120px, 96vw)',
	/** lightbox 使用的最大输出宽度 */
	lightboxWidth: 1920,
} as const;
