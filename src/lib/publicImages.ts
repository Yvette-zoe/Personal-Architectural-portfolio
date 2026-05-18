/** public/ 目录下的静态图片路径（需与 public/images/projects/ 内文件名一致） */
const base = import.meta.env.BASE_URL;

export const publicImages = {
	avatar: `${base}images/projects/avatar.jpg`,
	wechatQr: `${base}images/projects/wechat_qr.jpg`,
	/** 首页顶栏背景（与 App.tsx home_main_bg 一致） */
	navBackground: `${base}images/projects/home_main_bg.jpg`,
	homeBackgrounds: Array.from({ length: 7 }, (_, i) => {
		const n = String(i + 1).padStart(2, '0');
		return `${base}images/projects/home_bg_${n}.jpg`;
	}),
} as const;
