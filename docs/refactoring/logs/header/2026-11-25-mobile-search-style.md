# 2026-11-25 移动端 Header 搜索弹层按 Figma 调整

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“移动端 header 点击 search 页面样式调整，主要是字体、间距，弹窗宽度 350”，Figma 节点 6312:7106（Menu-搜索-Mobile，390×852）
- 批准范围：移动端搜索弹层（snippets/header-new-search-mobile.liquid 的渲染样式）在 assets/header-new.css 中的样式；不改 Liquid 结构、搜索逻辑、桌面 predictive search

## 目标与源码证据

- 移动端搜索由 `snippets/header-new-search-mobile.liquid` 输出 `.header-new__search-layer`，只在 ≤1199px 由 header-new.js 的 `openSearch()` 打开（桌面仍用 `.predictive-search`）。
- 原样式：抽屉 `width:min(89vw,100vw - 40px);max-width:600px`，表单 `margin:24px 22px 28px;padding:0 16px;border-radius:28px` 无边框，图标 24px，输入 16px；内容标题 16/24、词条 16/22 且 flex 换行、商品标题 16/24、主价 20、对比价 14；商品列间距 22/20、条目间距 8。
- Figma（6312:7106）实测：屏幕 390；Search Bar 高 84、内边距 20，输入胶囊 350×44、圆角 32、边框 rgba(0,0,0,.2)、底色 #f5f5f5、左右 12、图标 18、占位文字 14/20 Medium #515151；内容区左右 20、区块间距 20；小节标题 14/20 Medium #515151；词条两列、间距 12、内边距 4/12、边框 #e5e7eb、圆角 4、文字 14/20 #1a1a1a；商品两列间距 16、条目间距 5、图片 167×209、标题 14/20 letter-spacing -0.14、主价 16 Bold、对比价 12 #777；角标文字 9/600、白色、内边距 4、右下圆角 4、橙红渐变。

## 实际变更

- assets/header-new.css（搜索弹层样式段）：
  - 抽屉改为满宽（`width:100%;max-width:100%`），390 宽下左右各 20 的内宽正好 350。
  - 搜索表单：外边距 20、内边距 0 12、高 44、圆角 32、1px rgba(0,0,0,.2) 边框；图标 18px；输入 14/20、字重 500、占位色 #515151。
  - 内容区改为纵向 flex、`gap:20px`、左右下 20 内边距；两个 h2 统一 14/20、500、#515151，去掉旧的 margin 间距。
  - 词条改为两列 grid、间距 12，chip 内边距 4/12、边框 #e5e7eb、圆角 4、14/20。
  - 商品网格间距 16，条目间距 5，图片比例 167/209，标题 14/20/-0.14，主价 16 Bold、对比价 12 #777。
  - 折扣角标改为 9/600、内边距 4、仅右下圆角 4、橙红渐变（与原 header badge 接近的色标）。
- 未改 Liquid、JS 或搜索数据结构。

## 验证

- 静态核对：CSS 花括号 344/344；选择器均落在 `.header-new__search-*`，无同名规则重复覆盖；390 宽下表单与内容宽度均为 350，与 Figma 的 20 边距一致。
- 未启动浏览器、未做截图比对；字体渲染、圆角与间距需在真实移动端或预览主题确认。

## 文档与决策

- 新增本日志，`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记；未改架构文档。
- 无 ADR。

## 风险、回退与遗留

- 风险：抽屉改为满宽后，在 768–1199 平板宽度打开搜索会占满屏幕（原为 89vw、最大 600）；如希望保留侧栏效果需再确认宽度规则。若“350”指抽屉面板本身而非内容宽度，也需改为固定 350 并保留暗色遮罩。
- 回退：还原该样式段为 `width:min(89vw,...)` 及原间距、字号即可。
- 遗留：Figma 的 IconX 组件为 Code Connect 组件，本次沿用现有 close 图标；词条两列为 `max-content` 自适应，未做横向滚动。
