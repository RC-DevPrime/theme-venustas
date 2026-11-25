# 2026-11-25 Category image menu 按完整 URL（含查询参数）匹配图片

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“移动端下拉菜单的 header-new__image-menu-media 图片匹配要精确到问号后面，如 https://venustas.com/collections/men?filter.p.product_type=Heated+Vest，因为链接仅仅是 product_type 的值不同，是靠搜索条件来区分的”
- 批准范围：Category image menu 区块（blocks/_header-nav-image-menu.liquid）菜单链接与图片槽位的匹配逻辑及其说明；不改样式、DOM 结构、其它区块

## 目标与源码证据

- 原实现（本文件 20–31 行）：`match_url` 与 `image_url` 都经过 `split: '?' | first`，查询串被丢弃；Men／Women 的类别槽位 url_1–url_4 只有 `filter.p.product_type` 不同（Vest／Jacket／Hoodie／Pants），因此所有 `/collections/men?...` 菜单项都会命中第一个槽位，移动端图片固定为 Vests 的图。
- 槽位 5–8 使用 `shopify://collections/...`、`shopify://products/...` 简写，菜单链接是 `/collections/...`；原实现两边都不做协议归一，这类槽位实际也匹配不到。
- 编号与槽位对应关系只由 url_1..url_8 决定，schema 无其它匹配设置。

## 实际变更

- blocks/_header-nav-image-menu.liquid：
  - 匹配键改为“去掉站点域名、去掉 `#` 片段后的完整地址”，保留查询串；路径与查询参数分别解析。
  - 槽位要求其每个查询参数都能在菜单项地址中找到（逐参数精确比较，避免 `Heated+Vest` 误匹配 `Heated+Vest+Pro`）；菜单项可以带额外参数（如 `sort_by`），不受影响。
  - 多个槽位同时命中时，按匹配到的参数数量取最精确的一个（参数多者优先，同分取靠前槽位），不再一律取第一个。
  - 归一化：`shopify://collections/...` 等简写补成 `/collections/...`；`%20` 与 `+` 视为同一个空格；`://www.` 视为同一域名；比较前 strip 空白。
  - 菜单项地址没有查询串时，带查询条件的槽位不会命中（保持精确，不做路径兜底以免再次匹配到错误图片），结果回退占位图。
  - `menu` 设置 info 说明改为按含查询参数的完整地址匹配、参数最多者优先。
- 未改移动端／桌面样式、图片输出、badge 字段和无菜单时的初始内容路径。

## 验证

- 静态核对：`{% %}` 26/26、`{{ }}` 7/7、for/endfor 4/4、if/endif 16/16、unless/endunless 1/1；嵌套 `break` 只退出所属循环。
- 逐例手工推演：`/collections/men?filter.p.product_type=Heated+Vest` 命中 url_1；Jacket 命中 url_2；带 `&sort_by=manual` 时仍只命中对应 product_type 槽位；`/collections/heated-gloves` 命中 url_5；`/collections/men`（无查询串）不命中任何槽位 → 占位图。
- 未启动浏览器、未在主题编辑器或线上预览验证；真实菜单与后台槽位配置未实测。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 增加本次记录；知识库入口 README 登记索引。
- 无架构或跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：槽位参数必须与菜单项参数完全一致（空格编码除外），参数顺序不同不影响，但值不同即不匹配；若商家把菜单项存成不带查询串的 Collection 类型链接，该类槽位将显示占位图而不是错误图片。
- 回退：还原为只比较路径（去掉查询串）的旧匹配段即可。
- 遗留：参数值大小写与 `%2B` 等其它编码未做归一；未验证 Shopify 菜单返回的 link.url 是否保留自定义查询串，需在预览主题实测确认。
