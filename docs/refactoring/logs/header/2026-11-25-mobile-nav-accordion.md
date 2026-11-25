# 2026-11-25 移动端导航列折叠规则与 Technology 位置

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“移动端 Men／Women 的 Our Technology: Heatwave™ & PowerCore™ 要放在推广图片下面；Shop by Style 要像第三个折叠菜单一样可折叠，现在移动端显示错了；多出来的 New Arrivals 自己处理；移动端每个导航默认展开第一个，其它都折叠”，并确认“第一列保持无标题、直接展开，其余列显示标题并可折叠”
- 批准范围：移动端导航列折叠行为、footer 在移动端的排列顺序及其相关样式／区块标记；不改桌面端布局、不改 `sections/header-group-new.json` 数据、不处理用户自行删除的 New Arrivals 菜单项

## 目标与源码证据

- 原规则：`blocks/_header-nav-column.liquid` 只在 `role != 'category'` 时输出折叠按钮，`assets/header-new.js` 的 `syncColumns()` 对 category 列强制 `expanded`、并隐藏按钮；因此 `role: category` 的 “Shop by Style” 在移动端永远展开且没有标题行，与第三个折叠列（role group）表现不一致。
- 原默认值来自各列的 `mobile_open` 设置（本地数据多为 true），`reset()` 直接写入 `mobileExpanded`，移动端所有列都展开。
- `Our Technology: Heatwave™ & PowerCore™` 是 `_header-nav-button` 的 secondary link（primary “Shop all Men’s／Women’s” 仅桌面可见）。CSS 移动端 `.header-new__footer--paired { order: 1 }`、`.header-new__promo { order: 2 }`，所以该链接排在推广卡之前；区块 DOM 顺序（footer 在两张 promo 之前）保持不变。

## 实际变更

- blocks/_header-nav-column.liquid：折叠按钮改为所有列都输出（含 category 角色），初始 `aria-expanded="false"`；移除 `data-mobile-open` 与 `mobile_open` 设置。角色设置保留，仍控制移动端内容内边距与图片菜单下的 featured 字重。
- assets/header-new.js：
  - `preparePanel()` 给每列写入 `data-column-first`（DOM 中第一个列为 true）。
  - `reset()` 的移动端默认展开改为“仅第一列展开”，不再读取已移除的 `mobile_open`。
  - `syncColumns()` 去掉 category 特例：第一列不显示折叠按钮（无标题、直接展开），其余列显示按钮并按 `data-mobile-expanded` 开合；桌面端仍全部展开。
- blocks/_header-nav-button.liquid：当 primary 仅桌面可见、secondary 在移动端可见时，footer 增加 `header-new__footer--mobile-secondary`。
- assets/header-new.css：移动端新增 `.header-new__footer--mobile-secondary { order: 3 }`，使该 Technology 链接排在两张推广卡（order 2）之后；其他 footer（同时显示两个按钮的）仍保持 order 1。
- 未改 `sections/header-group-new.json`；其中残留的 `mobile_open` 键已无对应 schema，会被忽略（该文件为后台自动生成，改动易被覆盖）。

## 验证

- 静态核对：`_header-nav-column.liquid` `{% %}` 6/6、`{{ }}` 9/9；`_header-nav-button.liquid` `{% %}` 19/19、`{{ }}` 10/10；header-new.css 花括号 338/338；`node --check assets/header-new.js` 通过。
- 手工推演：移动端 Men 面板第一列（Shop by Category）无标题、内容展开；Shop by Style、Warmth & Runtime、Collections 显示标题行且默认折叠，点击可各自开合；桌面端 `media.matches` 为 false 时所有列展开、按钮不可见；footer 在移动端 order 3 位于两张 promo 之后，桌面端规则未变。
- 未启动浏览器、未在主题编辑器或线上预览验证；实际移动端视觉与点击行为未实测。

## 文档与决策

- 新增本日志；更新 `docs/refactoring/modules/header/files.md` 与 `architecture.md` 中“Category 角色不输出折叠按钮”的旧结论；知识库入口 README 登记索引。
- 无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：折叠行为完全依赖 header-new.js；脚本未执行时移动端会显示所有列内容与按钮。`mobile_open` 设置已删除，后台旧数据被忽略，商家不能再单独让某一列默认展开。
- 回退：还原上述四个文件即可；`mobile_open` 设置与 `data-mobile-open` 需一并恢复。
- 遗留：New Arrivals 重复项由用户自行在菜单中删除，本次未做标题去重；移动端列内若有多个折叠列同时展开的情况未做互斥处理。
