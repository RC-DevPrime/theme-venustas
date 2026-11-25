# 2026-11-25 移动端列角色修正（Shop by Style 与其它面板首列）

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“Shop by Style 不是角色 role，只有 Shop by Category 是角色 role，只在 Men 和 Women 有；移动端不展示这个菜单，直接展示它的子集；但配件、Gift 的第一个菜单（如 Batteries & Power）也不是角色 role，移动端需要展示这个菜单，默认它的子集展开”
- 批准范围：列角色数据（仅 Men／Women 的 Shop by Style、New 的 New Arrival）与移动端列折叠判断逻辑；不改桌面布局、不改样式文件、不处理其它面板内容

## 目标与源码证据

- 上一轮把“DOM 第一列”当作不显示折叠按钮、直接展开的条件，导致 Accessories／Gift 的第一列（Batteries & Power、Gifts by Recipient）在移动端也丢了标题行；同时 Men／Women 的 “Shop by Style” 在 `sections/header-group-new.json` 里仍是 `role: category`，会被当作分类列强制展开、无标题，与第三个折叠列不一致。
- `role` 定义在 `blocks/_header-nav-column.liquid`（category／group），移动端样式仅在 `.header-new__column--category .header-new__column-content` 的内边距与 `.header-new__column--category:has(.header-new__image-menu) .header-new__featured` 字重中使用；桌面端由 `.header-new__column-heading` 正常显示，不受 role 影响。
- 数据中 `role: category` 原有 5 处：Men／Women 的 Shop by Category 与 Shop by Style、New 面板的 New Arrival。按用户规则，category 只保留 Shop by Category 两处。

## 实际变更

- sections/header-group-new.json：
  - Men 与 Women 的 “Shop by Style” 列 `role` 由 `category` 改为 `group`（2 处）。
  - New 面板 “New Arrival” 列 `role` 由 `category` 改为 `group`（1 处），使 category 角色只出现在 Men／Women 的 Shop by Category。
- assets/header-new.js：`syncColumns()` 中隐藏按钮与强制展开的条件由 `columnFirst` 改为 `columnRole === 'category'`；非 category 列（含各面板第一列，如 Batteries & Power）在移动端都显示标题行，第一列默认展开、其它默认折叠，逻辑仍由 `reset()` 写入的 `data-mobile-expanded` 控制。
- 未改 CSS、Liquid 区块标记或其它 JSON 数据；`mobile_open` 键仍为无 schema 的历史数据。

## 验证

- 静态核对：`node --check assets/header-new.js` 通过；`sections/header-group-new.json` 去掉文件头注释后可被 `JSON.parse` 解析；检索确认 `"role": "category"` 仅剩 Men／Women 的 Shop by Category 两处；CSS 花括号 338/338。
- 手工推演（移动端）：Men／Women 的 Shop by Category 无标题行、内容直接展开（featured 按钮 + 图片菜单）；Shop by Style 显示标题行、默认折叠；Accessories 的 Batteries & Power、Gift 的 Gifts by Recipient 显示标题行且默认展开；其余列折叠。桌面端所有列仍展开、role 样式不变。
- 未启动浏览器、未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；更新 `docs/refactoring/modules/header/architecture.md` 的两处现行规则与 `files.md`；知识库入口 README 登记索引。
- 无跨模块契约变化，不新增 ADR。

## 后续修正（同日）

- 用户补充：Accessories 的 Batteries & Power、Gift 的 Gifts by Recipient 这类第一列应“第一次进来默认展开，但仍然可以折叠”。
- 原实现把 `columnFirst` 直接并入 `expanded`，第一列即使被点击折叠也会立刻重新展开。现改为：`syncColumns()` 只保留 `role: category` 的强制展开，第一列展开仅由 `reset()` 写入的 `data-mobile-expanded = 'true'` 决定；点击标题后置为 `'false'` 即折叠，再次点击恢复。
- 影响文件：assets/header-new.js（`syncColumns()` 去掉 `first` 条件）；对应文档同步更新。

## 风险、回退与遗留

- 风险：`header-group-new.json` 为后台自动生成文件，之后在主题编辑器保存可能覆盖本次 role 数值；若线上数据仍是旧值，表现为 Shop by Style 又变成无标题展开。
- 回退：把三处 `role` 改回 `category`，并在 `syncColumns()` 恢复以第一列为条件即可。
- 遗留：New 面板第一列改为 group 后移动端会多出 “New Arrival” 标题行；如不需要该标题，可再确认是否把 New 面板首列移出折叠规则。`mobile_open` 历史键未清理。
