# 2026-11-28 集合促销 Box 移动端背景图

- 模块：collection
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户提供主题编辑器截图（Main Collection → Promotion Box - Image／Promotion Box - Sale）并要求“这两张图需要提供移动端上传入口”；随后在方案确认中选择“批准实施（两块 background_image）”与“≤899px”
- 批准范围：sections/main-collection.liquid 中 promotion_image 与 promotion_sale 两个块的背景图设置、渲染与切换样式；未改 promotion_video、未改 Sale 的 element_image、未改 main-search.liquid 中同名组件

## 目标与源码证据

- 两个块原先只有一个 `background_image`，渲染为绝对定位、`object-fit:cover` 的 `.bg-image`，两端共用同一张图。改动后：块定义 @L835／@L965，移动图字段 @L845／@L975，渲染 @L612–645／@L660–693。
- 展示比例差异明显：桌面端是三列网格中的一格，移动端 `@media only screen and (max-width: 899px)` 内 `.products-row > .promotion-box` 变为整行、固定 `height:298px`，同图会被大幅裁切。
- 参考既有约定：product-battery-certification 使用桌面／移动双图 + `--desktop`／`--mobile` 类在移动断点切换，移动图未配置时回退桌面图；符合 AGENTS 的 Banner 图片规则（类切换，不用 `<picture>`）。

## 实际变更

- schema：两个块的 `background_image` 后各新增 `image_picker`，id `background_image_mobile`，label "Mobile Background Image"，并加 `info` 说明留空时使用桌面图。
- Liquid：两个块内新增 `{% assign promotion_bg_mobile = block.settings.background_image_mobile | default: block.settings.background_image %}`；原桌面图 class 补 `promotion-box__bg--desktop`；新增 `bg-image promotion-box__bg--mobile` 的 `<img>`（同样的 480/768/1024/1600 srcset、`sizes="100vw"`、`loading="lazy"`、alt），仅在回退值非空时输出（桌面图保持原有输出方式）。
- 样式（`{% style %}`）：新增 `#shopify-section-{{ section.id }} .promotion-box .promotion-box__bg--mobile{display:none}`（@L69–71）；在 `max-width:899px` 内隐藏 `--desktop`、显示 `--mobile`（@L291–296）。断点沿用本节既有移动端布局断点。
- 未加 JS，未改截图外的块与其它 section。

## 验证

- 提取 `{% schema %}` 后 `ConvertFrom-Json` 解析成功；逐块检查设置 id 无重复，新增字段只出现在 promotion_image 与 promotion_sale。
- 类名统计：`--desktop` 标记 2 处（两个块）、`--mobile` 标记 2 处；CSS 中 `--mobile` 两条（默认隐藏 + 移动显示）、`--desktop` 一条（移动隐藏）。
- 静态推演：≥900px 只显示桌面图，≤899px 只显示移动图；移动图未上传时移动端回退桌面图；图片仍为绝对定位铺满卡片，不影响网格行高。
- 未启动浏览器、未在主题编辑器或线上预览验证；实际裁切效果与图片加载顺序未实测。

## 文档与决策

- 新增本日志；更新 collection 模块 files.md 与 README，知识库入口 README 登记索引。
- 无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：隐藏的一张图仍可能被浏览器预取（项目既有 Banner 类切换方式同样如此）；若要求严格只下载一张需改用 `<picture>`，与既有约定冲突，未采用。
- 风险：`img_url` 沿用原写法，未补 width/height 属性，卡片高度由网格与固定 298px 决定，不受影响。
- 回退：删除两个 schema 字段、`--mobile` `<img>` 与两条切换样式即可恢复原状。
- 遗留：main-search.liquid 中同类 promotion box 未同步移动图入口；如需要需另立批准范围。
