# 2026-11-28 促销行图标与文案同排（Free 文案换行）

- 模块：跨模块（collection 卡片、product-detail 商品页导航、gift-guide 共用 snippet）
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-28 提供移动端卡片截图并指出“移动端的 Free 文案和图标是分开的，不能和 Extra 的样式一样么”
- 批准范围：`snippets/product-nav-promotion.liquid` 促销行的内部结构与 `assets/style.css` 中对应的一个组件样式；不改前缀判断、颜色、图标映射、折扣价计算与三处使用方各自的容器规则

## 目标与源码证据

- 促销行结构为容器 `.product-nav-new__panel-promotion`，直接子元素依次是图标 span、文案 span、可选的折扣价 span（`snippets/product-nav-promotion.liquid` L56–62）。
- 卡片作用域 `style.css` L1186–1196：容器 `display:flex; flex-wrap:wrap; gap:4px`；`gift-guide-collection.liquid` L162–167 同样是 flex + wrap；商品页导航 `product-nav-new.liquid` L149 为 `flex` + `white-space:nowrap`。
- 因为 `flex-wrap:wrap`，图标与文案是各自独立的 flex item：文案较短时（`Extra 20% Off In Cart`）与图标同处第一行、折扣价换到第二行；文案较长时（`Free $20 Gift Card Orders $200+`）文案的 max-content 超宽，被挤到第二行，第一行只剩图标 —— 即截图中的表现。
- 折扣价必须继续能换行（否则 Extra 的单行文案 + 价格会溢出或挤压），所以不能简单去掉 `flex-wrap`，需要把“图标 + 文案”合并为一个 flex item。

## 实际变更

- `snippets/product-nav-promotion.liquid`：图标 span 与文案 span 包进新的 `<span class="product-nav-new__panel-promotion-label">`；折扣价 span 仍是容器的直接子元素，保持原有换行行为。前缀分支、颜色、图标、折扣价输出均未改。
- `assets/style.css` L1209–1215：新增 `.product-nav-new__panel-promotion-label`（块级、`min-width:0`），并让 label 内的图标 `float:left` + `margin-right:4px`；文字按普通行内流环绕图标——第一行从图标右侧开始，换行后的行回到 label 左边缘（与图标左对齐），换成悬挂缩进效果。
- 三处使用方（`style.css` 卡片、`gift-guide-collection.liquid`、`product-nav-new.liquid`）的容器规则未改；新类全局唯一，无其它组件引用。

## 验证

- 静态核对：`assets/style.css` 花括号 407/407；`snippets/product-nav-promotion.liquid` `{% %}` 13/13、`{{ }}` 5/5；span 开合 4/4（label、icon、text、price）。
- 手工推演：Free 文案在窄卡片下与图标同排，图标浮在第一行左侧，第二行及以后从图标左边缘开始；Extra 仍为图标 + 单行文案在第一行、折扣价在第二行并与图标左对齐；商品页导航沿用 `white-space:nowrap`，不换行、行为不变；`min-width:0` 允许 label 在容器内收缩，避免横向溢出。
- 未启动浏览器，未在移动端实机或主题编辑器验证。

## 文档与决策

- 新增本日志；collection 与 product-detail 模块 files.md 各加一条日期记录，知识库入口 README 登记索引。
- 无数据契约或接口变化，不新增 ADR。

## 后续修正（同日）

- 用户看图反馈：Extra 换行后的“· $119.99”与图标左对齐，而 Free 的第二行“Orders $200+”缩进在文字列，要求两者都左对齐。
- 原实现用 `inline-flex` 把图标与文案并排，文案是整体一块，换行后各行都从文字列开始。现改为 label 内图标 `float:left`、文字按行内流环绕：第一行从图标右侧 4px 开始，第二行及以后从 label 左边缘开始，与图标左对齐；图标高度 14px 小于首行行盒（12px 字号 `line-height:normal` ≈14.6px），因此第二行不会被浮动推开。
- 折扣价仍是容器直接子元素，Extra 的“· $119.99”换行位置不变。

## 风险、回退与遗留

- 风险：图标改为浮动，单行文案时与旧的中心对齐相差约 0.5px；gift-guide 促销行字号 14px、行高 1.4，图标 14px 与首行顶部对齐会略偏上（该处不在本次要求范围）。
- 风险：换行后各行从图标左边缘开始（悬挂缩进）是本轮要求的对齐方式；若首行行盒高度小于图标 14px（字体或 line-height 被改小），第二行会被浮动推开，需要同步调整图标高度或行高。
- 回退：还原上述两个文件的本次差异即可。
- 遗留：其它使用 `.product-nav-new__panel-promotion` 的场合（商品页抽屉）不换行，长文案仍靠 `nowrap` 单行显示。
