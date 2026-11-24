# 2026-11-24 桌面 Header 布局对齐 Figma（搜索保持弹层）

- 模块：header
- 状态：实现与定向静态检查；未浏览器实测
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas，feature/menu 未提交改动
- 批准依据：用户要求按 Figma 6175:2532 调整桌面端间距与宽度，并明确“搜索按钮按照 figma 来，点击后保持现有的弹层打开”
- 批准范围：sections/header-new.liquid、assets/header-new.css 及文档；不改搜索弹层（sections/search.liquid、predictive-search.js）、不改 group JSON、不影响移动端结构

## 目标与源码证据

Figma 6175:2532（Container4，1920×68）：左 Container5 从 x=100 起、宽 800.99 = 154（Logo）+32+615（8 项导航，项间距 30，Montserrat SemiBold 16/21 #161616）；右 SearchContainer 从 x=1270.87 到 1820.18（右留白 100），内部 SearchContainer（搜索胶囊 100×36、底 rgba(102,102,102,.06)、圆角 24、图标 18 + 间距 9 + “Search” 14/20 Medium #515151）、IconsContainer（Help 54×20 + 账户/心/购物车各 18，间距 16）、FlagContainer（旗 21.32×16 + 6 + 箭头 ~10×6）。

改前：header 高 67，`.header-new__bar` gap 24，Logo 154 + 导航 14/600 间距 clamp(12,1.5vw,30)，右侧 utilities gap 16、搜索胶囊 padding 8/12 且被 1200–1450 隐藏标签、cart 有 12px padding、地区箭头 gap 10。搜索入口是 `a.header-new__search[data-header-search]`，点击由 header-new.js 的 openSearch() 打开既有 .predictive-search 弹层。

## 实际变更

- sections/header-new.liquid：仅把 `--header-nav-height` 桌面值 67 改为 68；搜索入口结构保持链接 + data-header-search（未改成行内表单，点击仍打开既有弹层）。
- assets/header-new.css：
  - header 高 67→68，面板 max-height 的 var 回退同步 68；`.header-new__bar` gap 24→0（间距改由 margin 控制）。
  - 左半区：导航 margin-left 32、gap 30、align-items center、height auto；导航链接 16px/21px/600、颜色 #161616；Logo 保持 154。
  - 右侧：搜索胶囊固定 100×36、padding 0 12、14/500/20、margin-right 12（与 utilities gap 16 合成 28）；cart padding 12→0、18×18；地区模块 margin-left 12（合成 28）、内部 gap 10→6。
  - 1200–1599 收窄规则：导航 gap 18、utilities gap 12、搜索改为自适应宽（仅图标）、隐藏 Search 文本。
  - 移动端：移除已失效的 `.header-new__search--desktop` 与旧胶囊 padding 覆盖，改为隐藏桌面搜索胶囊；导航列表补 margin-left 0。

## 验证

Node 解析 Liquid schema 通过、`<div>` 15:15；CSS 花括号 259:259；无残留 `search--desktop` 选择器或类名；node --check assets/header-new.js 通过。未启动浏览器、未运行 theme check、未上传主题；1920 实测、1200–1599 收窄表现、移动端回归均未验证。

## 文档与决策

本日志、知识库索引、Header architecture 与 known-issues 增量。搜索行为保持不变（点击打开 .predictive-search 弹层），因此未引入行内搜索输入。

## 风险、回退与遗留

- 右侧搜索胶囊按“紧邻 Help、间距 28”实现；Figma 默认帧把胶囊放在 300 宽容器左端（Help 位置固定是为展开态预留），本次未做展开，故胶囊比该帧靠右约 200px，图标位置仍与 Figma 一致。
- 导航总宽 615 依赖 Montserrat 字体度量与浏览器渲染，实际可能略有出入；如需严格 800 需固定导航容器宽度。
- 1200–1599 下隐藏 Search 文本、搜索胶囊变为纯图标（与旧行为一致）。
- 回退：撤销两文件对应增量即可；搜索弹层与移动端未改动。
