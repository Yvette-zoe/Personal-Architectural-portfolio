// @ts-check
import { defineConfig } from 'astro/config';

// 部署到 GitHub Pages 前，请将 site 与 base 改为你的用户名与仓库名
// 用户站（username.github.io）时 base 设为 '/'
export default defineConfig({
	site: 'https://Yvette-zoe.github.io',
	base: '/Personal-Architectural-portfolio/',
	output: 'static',
});
