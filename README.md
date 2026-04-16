# 华夏营造 · 中国古代建筑成就

中国古代建筑（1911 年以前）信息可视化作品：收录 **49 处**代表性建筑（民居、官府、皇宫、桥梁），含交互地图、数据大屏、专题与工艺、朝代时间轴、营造拾趣，以及基于本地数据的营造助手问答。

## 如何运行

1. 用浏览器直接打开 `index.html`（首页）或者点击[华夏营造 - 中国古代建筑成就 · 1911年以前](https://mikeshi2022.github.io/Huaxia-Architecture---Ancient-Chinese-Architectural-Achievements/)即可浏览。
2. **推荐**通过本地 HTTP 访问整站（例如 VS Code Live Server、`npx serve`），避免个别环境下 `file://` 路径或模块策略带来的差异。
3. **需要联网**：首页背景视频、ECharts 中国地图 GeoJSON（`geo.datav.aliyun.com`）、部分页面引用的 **jsDelivr**（ECharts、Pannellum）及外链媒体；离线环境可能无法加载地图或脚本。

## 页面导览


| 文件                                                                                        | 说明                                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| `index.html`                                                                              | 首页                                           |
| `dashboard.html`                                                                          | 数据大屏（地图、类型占比、朝代/省份分布、列表与轮播等）                 |
| `topics.html`                                                                             | 四大专题入口                                       |
| `topic-minju.html` / `topic-guanfu.html` / `topic-huangong.html` / `topic-qiaoliang.html` | 民居 / 官府 / 皇宫 / 桥梁专题                          |
| `craft.html` / `craft-detail.html`                                                        | 建筑工艺词云与工艺详情                                  |
| `timeline.html`                                                                           | 可筛选的朝代时间轴                                    |
| `overview.html`                                                                           | 营造拾趣（今日一筑、故事、文学、知识小测等）                       |
| `ai-chat.html`                                                                            | 营造助手（基于本项目 `data.js` 内数据的规则匹配与说明，非外接大模型 API） |
| `detail.html`                                                                             | 建筑详情（可通过 `?name=` 指定建筑名称）                    |


## 技术说明

- **前端**：HTML5、CSS3、原生 JavaScript（IIFE 模块化）。
- **可视化**：ECharts 5（地图散点、柱状图、饼图等）；部分实景预览使用 Pannellum（CDN）。
- **数据**：集中于 `js/data.js`（建筑点位、工艺、时间轴配置等）；各页面逻辑见 `js/*.js`。

### 主要脚本


| 文件                                                                     | 作用        |
| ---------------------------------------------------------------------- | --------- |
| `js/data.js`                                                           | 建筑与工艺等数据集 |
| `js/main.js`                                                           | 数据大屏主逻辑   |
| `js/home.js`                                                           | 首页交互      |
| `js/timeline.js`                                                       | 朝代时间轴页    |
| `js/overview.js`                                                       | 营造拾趣      |
| `js/ai-chat.js`                                                        | 营造助手问答逻辑  |
| `js/detail.js` / `js/craft.js` / `js/craft-detail.js` / `js/topics.js` | 详情与专题页    |


样式位于 `css/`（`style.css` 为全局，另有 `home.css`、`ai-chat.css` 等）。

## 数据与声明

页脚说明：**《营造法式》《清式营造则例》及各地文物保护名录**；建筑示意图采用公开图片。中国省级示意底图数据来自 **阿里云 DataV**；地图审图号等以地图与资质公示方最新说明为准。

## 浏览器建议

推荐使用 **Chrome** 或 **Edge** 等现代浏览器（较新版本），以获得完整地图与动画表现。