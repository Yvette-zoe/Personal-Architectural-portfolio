# 个人建筑作品集

基于 [Astro](https://astro.build) 的静态建筑作品集网站，构建时自动将图片转为 WebP 并生成多尺寸，适合部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 `http://localhost:4321`）。

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库（例如 `architecture-portfolio`）。
2. 修改 `[astro.config.mjs](astro.config.mjs)`：
  - `site`: `https://你的用户名.github.io`
  - `base`: `/你的仓库名/`（若为用户主页仓库 `username.github.io`，则 `base` 设为 `'/'`）
3. 推送代码到 `main` 分支。
4. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
5. 首次 push 后 Actions 会自动构建并发布。

站点地址示例：`https://你的用户名.github.io/architecture-portfolio/`

## 添加新项目

```
src/content/projects/my-project/index.md   # 元数据与正文
src/assets/projects/my-project/
  cover.jpg
  gallery-01.jpg
  gallery-02.jpg
```

1. 编写 `index.md`（`slug` 需与 assets 子目录名一致）：

```yaml
---
title: 项目名称
slug: my-project
year: 2025
location: 城市
category: 公共建筑
featured: true
order: 3
description: 一句话项目简介
---

正文 Markdown（可选）…
```

1. 图片放入 `src/assets/projects/my-project/`。
2. 在 `src/lib/projectImages.ts` 中 import 并注册到 `projectImages`。
3. 运行 `npm run dev` 或 push 触发部署。

## 图片规范（控制仓库体积）

提交前建议：


| 项目   | 建议                      |
| ---- | ----------------------- |
| 最长边  | ≤ 2400px                |
| 格式   | JPEG 质量 80–85，或 WebP    |
| 单张体积 | 优化后约 200–800 KB         |
| 避免   | 未压缩 TIFF、单张 > 5MB 的 PNG |


图片放在 `src/assets/projects/<slug>/`，构建时通过 `astro:assets` 自动生成 WebP 与响应式尺寸。

## 项目结构

```
src/
  assets/projects/<slug>/   # cover.jpg、gallery-*.jpg
  content/projects/<slug>/    # index.md
  lib/projectImages.ts        # slug → 图片注册
  components/
  layouts/
  pages/
  styles/
```

## 脚本


| 命令                | 说明            |
| ----------------- | ------------- |
| `npm run dev`     | 开发服务器         |
| `npm run build`   | 生产构建到 `dist/` |
| `npm run preview` | 预览构建结果        |


