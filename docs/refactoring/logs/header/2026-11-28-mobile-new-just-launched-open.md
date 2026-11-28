# 2026-11-28 移动端 New 面板 Just Launched 默认展开

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-28 消息“移动端New的第一个子导航Just Launched要默认展开”，并在当次提问中选择“只改 New：仅 Just Launched 默认展开，Men／Women 的 Shop by Style 保持折叠”
- 批准范围：移动端列默认展开规则、`_header-nav-column` 列级默认展开设置、New 面板 `Just Launched` 列配置；不改桌面布局、不改 CSS、不改其它面板的列数据

## 目标与源码证据

- `sections/header-group-new.json` 的 `new_panel.block_order` 为 `quick`（New Arrival，`role: category`）、`launched`（Just Launched，`role: group`）、`just_in`（Just In，`role: group`），随后是两张 promo 与 `shop_all`。
- `assets/header-new.js` `preparePanel()` 原本只给 DOM 第一列写 `data-column-first`，`reset()` 用该值作为 `data-mobile-expanded` 初值，因此默认展开落在 `quick` 列。
- 但 `quick` 列是 `role: category`：`syncColumns()` 对 category 列隐藏折叠按钮并强制展开，`header-new.css` 在 ≤1280 隐藏 `.header-new__column-heading`，所以该列既无标题行也不参与折叠判断，其默认展开值不产生可见效果；`Just Launched` 作为第一个可折叠列仍然折叠。这就是用户看到“New 的第一个子导航没有展开”的原因。
- 历史规则见 [2026-11-25 移动端折叠](../../logs/header/2026-11-25-mobile-nav-accordion.md) 与 [2026-11-25 角色修正](../../logs/header/2026-11-25-mobile-column-role.md)：默认展开 = DOM 第一列，已移除列级 `mobile_open` 设置。

## 实际变更

- blocks/_header-nav-column.liquid：schema 新增 `mobile_default_open` checkbox（默认 false），列根节点输出 `data-mobile-default-open="{{ block.settings.mobile_default_open }}"`（未保存时输出 `false`）。
- assets/header-new.js：
  - `preparePanel()`：把 `data-column-first` 改为 `data-column-default-open`；面板内任一刻意开启 `data-mobile-default-open="true"` 时，只展开这些列，否则回退为“DOM 第一列展开”。
  - `reset()`：默认展开值改读 `data-column-default-open`。
- sections/header-group-new.json：`new_panel.launched` 列 settings 增加 `"mobile_default_open": true`（单处，未改其它列）。
- 未改 CSS、`syncColumns()`、点击折叠逻辑；第一列默认展开的旧行为在未配置新设置的面板上保持不变。

## 验证

- 静态核对：`node --check assets/header-new.js` 通过；`blocks/_header-nav-column.liquid` `{% %}` 6/6、`{{ }}` 10/10，schema 提取后可 `JSON.parse`，settings id 为 `title,role,mobile_default_open`；`sections/header-group-new.json` 去掉文件头注释后可 `JSON.parse`，`new_panel` 列顺序 `quick,launched,just_in,promo_1,promo_2,shop_all`，`launched.settings` 为 `{"title":"Just Launched","role":"group","mobile_default_open":true}`；`assets/header-new.css` 花括号 363/363。
- 手工推演（≤1280）：New 面板 `quick` 列因 category 无折叠行、内容照旧展开；`launched` 列默认展开（标题行箭头朝下、Volcano／Apex 两项可见），点击可折叠；`just_in` 列默认折叠。Men／Women／Accessories／Gift 面板无 `mobile_default_open`，仍按“第一列展开”处理，行为不变。桌面端 `media.matches` 为 false 时所有列展开。
- 未启动浏览器、未在主题编辑器或线上预览验证，实际移动端视觉与点击未实测。

## 文档与决策

- 新增本日志；更新 `docs/refactoring/modules/header/architecture.md`、`files.md` 中的默认展开规则，知识库入口 README 登记索引。
- 无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：`sections/header-group-new.json` 为后台自动生成文件，主题编辑器保存可能丢掉 `mobile_default_open`；若丢失，New 面板会退回“第一列展开”，表现为 Just Launched 再次折叠。列级设置在后台列设置里可见，可重新勾选。
- 风险：若同一面板给多列开启该设置，这些列会同时默认展开，本次未限制数量、未做互斥。
- 回退：移除 JS 的 `data-column-default-open` 逻辑恢复为 `data-column-first`，删除 Liquid 设置与 JSON 键即可。
- 遗留：New 面板首列仍为 `role: category`（无标题行）；是否改回 `group` 让 “New Arrival” 也显示折叠标题行未处理。
