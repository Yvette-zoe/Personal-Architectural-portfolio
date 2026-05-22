# 个人建筑作品集

基于 React + Webpack 的建筑作品集单页应用，支持明暗主题、移动端作品详情与 CDN 图片加载，通过 GitHub Actions 部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3266`。

## 部署到 GitHub Pages

1. 仓库：`Yvette-zoe/Personal-Architectural-portfolio`
2. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**
3. 推送 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布

站点地址：`https://Yvette-zoe.github.io/Personal-Architectural-portfolio/`

生产构建在 GitHub Actions 中会自动设置 webpack `publicPath` 为 `/Personal-Architectural-portfolio/`。

## 修改项目内容

在 `src/App.tsx` 中编辑 `projects` 数组（标题、描述、图片 CDN 地址、详情正文等）。

项目文案参考见 `assets/项目详情页内容.md`。

## 项目结构

```
src/
  App.tsx              # 主应用与路由
  index.tsx            # 入口
  components/          # 页面组件（预留拆分）
  hooks/               # 主题等 hooks
  styles/index.css     # Tailwind 样式
public/images/         # 本地图片备份（线上主要使用 CDN）
```

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建到 `dist/` |
| `npm run preview` | 本地预览构建结果 |
| `npm run typecheck` | TypeScript 检查 |

## 更新代码并部署

```bash
git add .
git commit -m "描述本次修改"
git push origin main
```

推送后 GitHub Actions 会自动重新构建并发布。
