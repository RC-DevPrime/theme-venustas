# 2026-11-26 移动端 New 面板快捷按钮下方间距

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，分支 master（HEAD 976a9a5）；未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“继续优化 header，移动端这个 New 导航的这两个按钮没有下边距，因为我为了适配 men 和 women，这个下边距我就给了 0，请只修复下移动端 New 的这两个按钮的下边距”
- 批准范围：仅移动端（抽屉布局）New 面板首列两个 Featured 按钮的下方间距；不改 Men／Women 面板、不改桌面布局、不改 Liquid／JS／JSON

## 目标与源码证据

- New 面板首列 `sections/header-group-new.json:66-94`：`role: category`，子块只有两个 `_header-nav-featured`（New Arrival、New Color），没有 `_header-nav-image-menu`。
- Men／Women 首列 `sections/header-group-new.json:245-309`、`:481-...`：同款两个 Featured 按钮之后还有 `_header-nav-image-menu`。
- `assets/header-new.css:566-568` 的 `.header-new__column--category .header-new__column-content { padding: 20px 20px 0 20px }` 把内容区下内边距设为 0。此值对三个面板同时生效：Men／Women 的图片菜单自带 `margin-top/margin-bottom: 20px`（`:578-585`）不受影响，New 首列只有按钮，尾部因此没有任何间距。
- 抽屉布局断点为 `≤1280`（`:406` 起的媒体查询），该区间内 category 列的列折叠按钮由 `assets/header-new.js:357-362` 隐藏、内容强制展开，所以按钮行直接接在面板顶栏之后、下一列折叠行之前。
- 面板外层带 `data-header-panel="{{ block.settings.menu_key | handleize }}"`（`blocks/_header-nav-group.liquid:1`），New 面板 `menu_key: "new"`（`sections/header-group-new.json:60`），可据属性精确定位。

## 实际变更

- `assets/header-new.css`：在 `≤1280` 媒体查询内、原 category 内边距规则之后新增一条：

  ```css
  [data-header-panel='new'] .header-new__column--category .header-new__column-content {
    padding-bottom: 20px;
  }
  ```

- 取 20px 与同区块既有间距一致：内容区左右内边距 20px、图片菜单上下外边距 20px。Men／Women 因选择器带面板限定不受影响。
- 未改 Liquid、JavaScript、JSON，未改按钮本身样式（`assets/header-new.css:650` 起的 `.header-new__featured a` 规则）。

## 验证

- 静态核对：新增规则位于 `@media (max-width: 1280px)` 块内，仅对 `data-header-panel="new"` 生效；选择器特异性 0-3-0 高于原 0-2-0 声明，后者写在前面，覆盖成立。
- 文件花括号配平 363/363；`git diff` 仅 1 文件 4 行新增。
- 未启动浏览器、未在主题编辑器或线上预览验证，实际间距与视觉仍待用户确认。

## 风险、回退与遗留

- 风险：20px 为按相邻间距推定，设计若为其它值需调整；若后续给 New 首列加 `_header-nav-image-menu`，其 20px 下外边距会与本次下内边距叠加成 40px。
- 回退：删除该 4 行规则即可恢复 `padding-bottom: 0`。
- 遗留：Men／Women 首列维持 0 下内边距（由图片菜单自身外边距撑开），如后续去掉图片菜单会出现同样缺少尾距的问题。
