# 竞智AI（jingzhi-ai）

大学生个性化竞赛智能推荐与成长规划平台，基于 Electron + React + Vite 的桌面应用。

> 仓库名只能使用 ASCII 字符，因此仓库地址为 `jingzhi-ai`，产品名为「竞智AI」。

## 版本

- **v2.0（当前）**：竞赛目录支持手动添加竞赛；匹配逻辑与界面同步优化
- v1.0：首个版本，含竞赛库、匹配推荐、备赛计划、日程与个人档案

## 直接使用（无需开发环境）

在 [Releases](https://github.com/3119668962/jingzhi-ai/releases/latest) 页面下载 Windows 便携版：

- `jingzhi-ai-2.0.0-portable-win-x64.exe`（Windows x64，106 MB，双击即可运行，无需安装）

> 注：GitHub 对文件名中的非 ASCII 字符会做过滤，因此发布资产使用英文文件名，应用内的产品名仍为「竞智AI」。

## 功能概览

- **竞赛库**：浏览、检索、按类别与难度筛选竞赛，查看官网与报名信息
- **智能匹配**：基于个人画像（专业、年级、技能、时间投入等）计算匹配度并排序推荐
- **竞赛详情**：赛事介绍、时间节点、备赛要点、相关资源
- **成长规划**：生成阶段性备赛计划，跟踪进度
- **日程管理**：报名截止、比赛时间等节点汇总
- **个人档案**：画像填写与维护、收藏管理
- **可选 AI 增强**：在设置中填入 OpenAI 兼容接口地址与 API Key 后，可对推荐结果做进一步润色；可选接入 Tavily 做联网检索（Key 仅保存在本地）

## 技术栈

| 层 | 技术 |
| --- | --- |
| 桌面容器 | Electron 45（`electron/main.cjs`、`electron/preload.cjs`） |
| 前端 | React 19 + Vite 8 |
| 图标 | lucide-react |
| 打包 | electron-builder（Windows portable / x64） |

## 目录结构

```
.
├─ electron/            # 主进程与 preload（窗口、本地存储、外部链接、AI/搜索代理）
├─ src/
│  ├─ main.jsx           # 应用入口
│  ├─ App.jsx            # 路由与全局状态
│  ├─ components/        # CompetitionCard、SettingsModal、Shell、ui
│  ├─ pages/             # Dashboard、Discover、CompetitionDetail、Plan、Schedule、Profile、Directory、Onboarding
│  ├─ lib/               # bridge（桌面/浏览器桥接）、matcher（匹配算法）、planner（规划生成）
│  ├─ data/              # competitions（竞赛库）、profile（画像模板）
│  └─ styles.css
├─ index.html
├─ vite.config.js
└─ package.json
```

## 本地开发

需要 Node.js 20 及以上（推荐 22 LTS）。

```bash
npm install        # 安装依赖
npm run dev        # 同时启动 Vite 与 Electron 窗口
npm run dev:vite   # 仅启动前端（浏览器预览，部分桌面能力不可用）
```

## 构建与打包

```bash
npm run build      # 构建前端到 dist/
npm run dist       # 构建并生成 Windows 便携版到 release/
```

## 数据与隐私

- 桌面端数据通过主进程持久化保存在本地；浏览器预览模式下使用 `localStorage`
- 大模型 / 搜索服务的 API Key 只保存在本机，不会写入仓库或上传

## 说明

为保证仓库轻量可维护，以下内容未纳入版本管理（见 `.gitignore`）：`node_modules/`、`dist/`、`release/`、`.runtime/` 以及随包附带的运行时 zip。安装包请从 Releases 下载。
