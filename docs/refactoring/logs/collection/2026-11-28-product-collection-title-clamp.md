# 2026-11-28 集合商品卡标题重写与行数限制

- 模块：collection
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-28 消息“把这个文件的标题优化一下，移动端，标题超过3行显示省略号，桌面端超过两行显示省略号”，随后要求“整个title代码优化，样式重写”
- 批准范围：snippets/product-collection.liquid 的标题标记与 assets/collection.css 中对应样式；其它卡片（product-item、row-product-item、column-product-item、search-product-item 等）仍用各自标题实现，未改

## 目标与源码证据

- 原实现是两个重复锚点：`d-lg-block d-md-block d-sm-none`（≥900px 显示）配 `body-lg`，`d-lg-none d-md-none d-sm-block`（≤899px 显示）配 `body`，靠工具类切换字号，无行数限制；同一标题在 DOM 中出现两次。
- 断点不一致：bootstrap-custom.css 的 sm ≤899、md ≥900、lg ≥1280；res-font.css 的字号断点为 ≤767／768–1279／≥1280。
- 现成工具类不能直接复用：`.excerpt-2/3` 带 `display:-webkit-box !important`，而 style.css 在 bootstrap-custom.css 之后加载，会把 `d-sm-none` 的 `display:none !important` 覆盖掉，导致两个标题同时可见。
- `.product-item .product-title`（style.css:1084）给标题 `padding-right:24px`，为 `.product-details` 右上角绝对定位的 Swym 收藏按钮留位；该值需要在新样式里保留。
- `.inner-c`（style.css:1166）为 `display:flex; flex-direction:column`，标题锚点是弹性项；行数限制写在锚点内的 `span` 上，不依赖弹性项上的 `-webkit-box` 行为。
- `main-collection.liquid:724` 是 product-collection 的唯一调用点；collection.js 的 `filterCollection` 只替换 `.main-collection-product-list` 的 HTML，不读取标题节点。

## 实际变更

- snippets/product-collection.liquid：两个锚点合并为一个 `<a class="product-collection-title">`，标题文本放入 `<span class="product-collection-title__text">`，并补 `escape`。
- assets/collection.css 末尾新增：
  - `.main-collection .product-collection-title`：`display:block`、`padding:0 24px 8px 0`；8px 与原 `pb-2`（0.5rem）一致，24px 与原 `.product-item .product-title` 一致。
  - `.main-collection .product-collection-title__text`：`display:-webkit-box`、`overflow:hidden`、`-webkit-box-orient:vertical`、`-webkit-line-clamp:3`／`line-clamp:3`、`overflow-wrap:break-word`、14px／700／1.4em。
  - `@media only screen and (min-width: 900px)`：改为 16px／1.6em 与 2 行。
- 未改 Liquid 结构以外的内容、未加 JS、未改其它卡片。

## 验证

- 静态核对：`assets/collection.css` 花括号 83/83；`snippets/product-collection.liquid` `{% %}` 108/108、`{{ }}` 37/37；`product-collection-title` 在片段中出现 2 处（锚点与 span 各 1）。
- 手工推演：≤899px 标题最多 3 行、≥900px 最多 2 行，超出显示省略号；`overflow-wrap:break-word` 让无空格长串也能换行；`escape` 后 `&`、引号等按实体输出；筛选 AJAX 替换商品列表后新结构自动套用同样样式。
- 未启动浏览器，未在主题编辑器或线上预览验证；实际渲染与截断效果未实测。

## 文档与决策

- 新增本日志；更新 collection 模块 README、files.md，知识库入口 README 登记索引。
- 无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：768–899px 区间原先显示移动标题（`.body` 在 768–1279 为 1.6em 行高），现统一 1.4em，行高差异约 1–2px/行。
- 风险：行数限制依赖 `-webkit-line-clamp`，Firefox 68+ 支持；更旧的浏览器不裁剪，内容完整显示、不破版。
- 风险：标题不再带 `product-title` 类；已检索脚本无读取该节点，CSS 中 `.product-title` 规则均属其它组件作用域；若后续平台／应用以 `.product-title` 选择集合卡片标题需重新加回。
- 回退：还原 `snippets/product-collection.liquid` 与 `assets/collection.css` 本次差异即可。
- 遗留：标题高度随行数变化，卡片标题区不等高；如需等高可再评估最小高度。
