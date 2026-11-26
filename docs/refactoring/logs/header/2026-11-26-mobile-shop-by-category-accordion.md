# 2026-11-26 Men／Women 移动端 Shop by Category 折叠

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master，主题目录 theme-venustas；未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“继续优化移动端 header的men导航和women导航，加上Shop by Category折叠菜单，New Arrivals，Best Sellers作为按钮显示在Shop by Category上面，默认展示Shop by Category第一个菜单，子集是现在的六个图片”；提交方案后经选择确认为“按方案实施（推荐）”
- 批准范围：Men／Women 首列图片菜单的移动端折叠行、默认展开与按钮位置；不改桌面布局、不改列折叠逻辑、不改 JSON 配置、不改图片项内容

## 目标与源码证据

- `sections/header-group-new.json` 中 Men／Women 首列 `role: category`，子块顺序为两个 `_header-nav-featured`（New Arrivals、Best Sellers）加一个 `_header-nav-image-menu`（六个分类图片）。
- `assets/header-new.js` 的 `syncColumns()` 对 category 列在 ≤1280 强制展开并隐藏列标题/折叠按钮，图片网格直接显示；`docs/refactoring/logs/header/2026-11-25-mobile-column-role.md` 记录此前规则为“移动端不展示这个菜单，直接展示它的子集”，本次按新需求改为显示可折叠的菜单行，原列级规则不变。
- `blocks/_header-nav-image-menu.liquid` 仅被 Men／Women 使用（`sections/header-group-new.json:269`、`:505`），因此改动局限在这两个面板。
- Figma「11.12 Menu优化」的 Men（展开/折叠）、Women（展开/折叠）移动帧只有两个快捷按钮加 3×2 六图，没有 Shop by Category 行；本行为新增，样式按现有移动折叠行推定，无对应设计稿。

## 实际变更

- `blocks/_header-nav-image-menu.liquid`：
  - 新增块设置 `Mobile accordion title`（`mobile_accordion_title`，默认 `Shop by Category`，空值回退同文案）。
  - 在图片 `<ul>` 前输出 `button[data-header-image-menu-toggle]`，`aria-expanded="true"`，`aria-controls` 指向图片列表；`<ul>` 增加 `HeaderImageMenu-{{ section.id }}-{{ block.id }}` id 并保留 `block.shopify_attributes`。
- `assets/header-new.css`：
  - 基础 `.header-new__image-menu-toggle { display: none }`，桌面端不出现折叠行。
  - ≤1280 显示为与其它折叠列同款的全宽行：白底、下边框 `#e5e7eb`、`padding:16px`、16/600；`.header-new__column--category` 下用 `margin: 20px -20px 0` 抵消内容区 20px 内边距铺满抽屉；右侧 12px chevron 展开时向下、`aria-expanded="false"` 时向右。
  - 未改图片网格、按钮、列折叠相关规则。
- `assets/header-new.js`：
  - 点击 `[data-header-image-menu-toggle]` 时切换 `aria-expanded` 与图片列表 `hidden`（仅移动端）。
  - `reset()` 在初始化与断点变化时把列表恢复为展开，保证桌面端始终显示六图、移动端默认展开。
- 未改 `_header-nav-column.liquid`、`syncColumns()`、`sections/header-group-new.json`。

## 验证

- 静态核对：新增 Liquid 标签成对，按钮 `aria-controls` 与列表 id 使用同一 `section.id`／`block.id`；schema JSON 在 `menu` 与 `Category 1` 之间插入合法对象。
- 手工推演（390 宽）：Men／Women 首列内容宽度 307（抽屉 347 − 左右 20），两个 Featured 按钮占一行；折叠行以 307 + 40 负边距铺满 347，高 52（16 + 20 + 16）；下方图片保持 3 列 92 宽网格；收起时 `hidden` 由 `.header-new[data-header-new] [hidden]` 生效；桌面按钮 `display:none`，图片与原来一致。
- 未执行 shell 验证：本环境 `pwsh` 启动即报 `SetNamedSecurityInfoW failed (Win32 5): grantWrite(D:\zyl\master)`；未启动浏览器、未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；更新 `docs/refactoring/modules/header/files.md`、`architecture.md` 与知识库入口 README。
- 折叠行是现有移动导航的展示补充，未改变跨模块契约或数据依赖，不新增 ADR。

## 风险、回退与遗留

- 风险：无 Figma 稿，行高、字号与边框按现有折叠行推定；负边距依赖 category 内容区固定 20px 内边距，后续改内边距需同步；折叠状态在关闭抽屉后保留，跨断点切换会重置为展开；`hidden` 生效依赖 `.header-new[data-header-new] [hidden]` 规则；静态检查不能证明浏览器实际布局与键盘操作。
- 回退：删除图片菜单块中的按钮、`mobile_accordion_title` 设置与列表 id，删除新增 CSS 规则和 JS 两处分支即可恢复原状。
- 遗留：若实际需求是“六个分类各自折叠、默认展开第一个”，或需要行内缩、字号调整，需另行确认。

## 同日修正（用户澄清）

- 用户说明 Shop by Category 在桌面原本就存在，只是移动端隐藏了该菜单；现在放出该菜单，Featured link 位于其上方，默认展开第一个菜单，子集是现有六张图片。
- 因此移除刚新增的 `Mobile accordion title` 设置与 Liquid `accordion_title` 读取：按钮文案改为 `<span data-header-image-menu-title>`，由 `header-new.js` 的 `reset()` 读取同列 `.header-new__column-heading`（桌面列标题）同步，无 JS 时保留 `Shop by Category` 回退，避免出现第二份可编辑标题。
- 布局、默认展开与“只折叠六张图片、按钮保持可见”的行为不变；仍未修改 `_header-nav-column.liquid`、`syncColumns()` 与 `sections/header-group-new.json`。
