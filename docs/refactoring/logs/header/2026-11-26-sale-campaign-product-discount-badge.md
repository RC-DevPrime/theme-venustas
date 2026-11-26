# 2026-11-26 Sale 活动面板商品卡折扣角标

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master，主题目录 theme-venustas；未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息先要求“bundle 导航和 sale 导航的产品卡片…加上折扣标签，放在左上角”，随后限定“在 sale 导航的产品卡片，加上折扣标签，放在左上角”；本次提交方案后经选择确认为“Sale 仅（按方案实施）”与“贴角 0,0（推荐）”
- 批准范围：Sale 活动面板商品卡的折扣角标；不改 Bundles 显示、不改角标判定逻辑、不改卡片标题／图片／hover，不改 JS、schema 与 JSON 配置

## 目标与源码证据

- `sections/header-group-new.json:1129` 起为 `sale_panel`（`_header-nav-campaign`，`menu_key: sale`），含 4 个 `_header-nav-category`；桌面与移动抽屉使用同一批面板。
- `blocks/_header-nav-category.liquid:14-16` 循环集合商品并渲染共用的 `snippets/header-new-product-card.liquid`。
- `snippets/header-new-product-card.liquid:8-15` 图片容器 `.header-new__campaign-product-media`；`assets/header-new.css:846-853` 该容器 `position: relative; overflow: hidden; border-radius: 6px`，可直接作为绝对定位基准。
- `snippets/sale-badge.liquid` 按 `selected_or_first_available_variant` 比较 `compare_at_price` 与 `price`，输出 `.badge.sale-badge`；`assets/style.css:1006-1020` 已定义 `position:absolute; top:0; left:0; z-index:3`、渐变底色与内边距，即左上角贴角样式。
- 样式加载顺序：`layout/theme.liquid:256` 的 style.css 早于 `:289` 的 header-new.css，同特异性时后者可覆盖。
- 历史：`logs/header/2026-11-24-sale-navigation.md:13` 曾明确排除逐商品 $30 OFF 角标；本次用户明确要求折扣角标，按新需求实施，不改写旧日志结论。
- 共用约束：同一卡片 snippet 同时用于 Bundles 面板，故需按面板限定显示范围，不能只靠 Liquid 判断父面板设置（嵌套主题块拿不到父块 settings）。

## 实际变更

- `snippets/header-new-product-card.liquid`：在 `.header-new__campaign-product-media` 内、`product-menu-badge` 之前新增 `{%- render 'sale-badge', product: product -%}`，使角标以图片容器定位，无图占位时同样生效。
- `assets/header-new.css`：新增
  - `.header-new__campaign-product-media > .sale-badge { display: none; }`
  - `[data-header-panel="sale"] .header-new__campaign-product-media > .sale-badge { display: flex; }`
  - 仅依赖模板已有的 `data-header-panel="sale"`（`blocks/_header-nav-campaign.liquid:1` 由 `menu_key` 输出），不改 Liquid 结构。
- 位置沿用 style.css 的 `top:0; left:0`，未新增定位声明；`z-index:3` 保证覆盖商品图。未改 `snippets/sale-badge.liquid`、`snippets/product-menu-badge.liquid`。

## 验证

- 静态核对：新增 Liquid 为成对 `{%- -%}` 输出标签，与其它 section 的 `render 'sale-badge'` 写法一致；header-new.css 新增两组规则花括号闭合，选择器特异性 0,2,0 与全局 `.badge.sale-badge` 相同且后加载，Sale 内 0,3,0 覆盖回 `display:flex`。
- 手工推演：无折扣商品不输出角标；有折扣时角标位于图片容器左上角（0,0），Bundles 面板隐藏；横版 236:189 与竖版 228:285 均以同一容器定位；桌面与移动抽屉共用同一 DOM。
- 本次环境 `pwsh` 启动即报 `SetNamedSecurityInfoW failed (Win32 5): grantWrite(D:\zyl\master)`，未执行 shell 语法检查；改用文件阅读核对，未启动浏览器、未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；更新 `docs/refactoring/modules/header/files.md` 与知识库入口 README。
- 功能逻辑与依赖关系未变化，不改 architecture／module-map；无 ADR。

## 风险、回退与遗留

- 风险：多规格商品仍按首变体判断折扣（沿用 `sale-badge` 现状）；角标带 `aria-hidden="true"`，读屏不朗读（与主题其它商品卡一致）；Bundles 卡片会输出隐藏的角标标记；实际字号与遮挡效果未浏览器验证。
- 回退：删除 snippet 中新增的 render 行，并删除 header-new.css 两条作用域规则即可。
- 遗留：若后续需要 Bundles 也显示，删除 `display:none` 规则或把选择器改为 `bundles`；若需 8px 内缩或更小字号，另行确认。
