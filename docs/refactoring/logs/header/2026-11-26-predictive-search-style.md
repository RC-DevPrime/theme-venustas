# 2026-11-26 桌面 predictive search 样式更新与图标替换

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“assets/style.css 关于 #predictive-search 的样式要改成新版的，搜索图标和关闭图标更新成新的，从 header-icons 拿”
- 批准范围：桌面 predictive search 弹层的样式与两个图标；不改搜索请求逻辑、结果渲染模板、移动端 header-new 搜索抽屉
- 设计参考：Figma 搜索输入组件 6177:3352（Montserrat Medium 14/20、#515151、左右 12、圆角 32、1px rgba(0,0,0,.2) 边框、搜索图标 18、关闭图标 20）

## 目标与源码证据

- 桌面搜索弹层由 `sections/search.liquid` 输出：`.predictive-search` 固定层 + `.wrapper` 白色条 + Bootstrap 栅格里的 logo 列与表单列，表单内是 `<button>` + `<input>` + 关闭 `<img class="icon icon-close">`；结果面板为 `#predictive-search`。
- 图标原先引用两个 Shopify CDN 的 png（search-icon.png、add_2x…png），与新版图标的 1.2px 线性风格不一致。
- 原样式：表单 `padding:8px 14px;border-radius:8px`、输入 16px、图标 22/16px；`#predictive-search` 宽 60%、最大 1200、内边距 30/50、下方圆角 10；结果标题无字号、词条为 #F9F9F9 无边框；view-all 16px、边框 #b9b9b9。

## 实际变更

- sections/search.liquid：
  - 搜索提交按钮内改为 `<span class="icon">{% render 'header-icons', icon: 'search' %}</span>`，按钮补 `aria-label="Search"`。
  - 关闭元素由 `<img>` 改为 `<span class="icon icon-close" role="button" tabindex="0" aria-label="Close search">{% render 'header-icons', icon: 'close' %}</span>`，保留 `.icon-close` 供 header-new.js 的点击／键盘关闭逻辑识别。
- assets/style.css：
  - 表单改为 44 高胶囊：flex + gap 9、内边距 0 12、圆角 32、1px rgba(0,0,0,.2) 边框、底色 #F5F5F5；输入 14/20、500、#1a1a1a、placeholder #515151；提交按钮 18×18、去掉右侧 20px 外边距。
  - 图标统一 `.predictive-search .icon` 18×18、内部 SVG 100%，关闭图标 20×20；移除旧的按 img 尺寸的 `:first-child`／`:last-child` 规则。
  - `predictive-search` 元素改为占满所在栅格列。
  - `#predictive-search` 面板改为 `min(1340px, 100% - 40px)` 居中、内边距 24/20/28、下圆角 8，与新版 header 的内容宽度一致。
  - 结果区：标题 14/20 500 #515151、下间距 12；词条白底 + 1px #e5e7eb 边框、圆角 4、14/20 #1a1a1a、hover #f5f5f5；view-all 14/20 #1a1a1a、上边框 #e5e7eb、16 间距。
- 未改 predictive-search.js、结果模板、header-new 的移动端搜索抽屉。

## 验证

- 静态核对：style.css 花括号 402/402；search.liquid `{% %}` 12/12、`{{ }}` 4/4；全仓 `icon-close` 引用仍能被 header-new.js 的 `closest('.predictive-search .icon-close')` 命中。
- 手工推演：打开桌面搜索 → 表单为 44 高胶囊、图标 18/20；结果面板宽度随视口在 1340 内、左右各 20；词条与标题为新字号；关闭可点击、可 Esc／Enter（header-new.js 既有逻辑）。
- 未启动浏览器、未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记；未改架构文档（结构与交互未变）。
- 无 ADR。

## 风险、回退与遗留

- 风险：`predictive-search` 元素由 50% 改为 100% 后，表单会占满 Bootstrap 表单列，桌面视觉比原来更宽；`#predictive-search` 由 60%/1200 改为 1340 上限，若设计另有宽度需要再调。结果商品卡（popular-product-item／custom-tag）沿用旧样式，本次未改。
- 回退：还原 search.liquid 的两个图标标签与 style.css 对应规则即可。
- 遗留：桌面搜索弹层保留原有 logo 列与 `.predictive-search` 结构；若新版设计有独立的桌面搜索结果稿，需要提供 Figma 节点再继续对齐。
