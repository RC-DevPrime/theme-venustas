# 2026-11-27 桌面顶级导航可点击与链接配置

- 模块：Header
- 状态：完成（静态核对）
- 环境／源码基线：本地 `D:\zyl\theme-venustas`；未连接线上主题、未提交
- 批准依据：用户在 2026-11-27 会话中批准"桌面顶级导航保留悬停面板，点击跳转，8 个链接提供配置，默认对齐各面板 Shop All"
- 批准范围：`sections/header-new.liquid` 链接设置与 href、`assets/header-new.js` 顶级导航交互、Header 文档；不含区块 schema／header-group-new.json、不含 CSS

## 目标与源码证据

目标：桌面端 8 个顶级导航（New／Men／Women／Kids／Accessories／Bundles／Gift／Sale）在悬停展开面板的同时可以单独点击跳转，链接由商家配置。

- `sections/header-new.liquid` L14–16 固定输出 8 个标签与硬编码路径；L32–43 的 `<ul data-header-main-list>` 是桌面／移动共用的顶级入口。
- `assets/header-new.js` 原 `prepareNavToggles()`（L260–280）在初始化时把有面板的 7 个 `<a>` 替换成 `button[data-header-toggle]`，导致桌面点击只能开关面板；Kids 无面板，仍是链接。
- 面板由主题块 `blocks/_header-nav-group.liquid`／`_header-nav-campaign.liquid` 输出，父 section 读不到块设置；当前交互靠 `data-nav-key` 与 `data-header-panel` 运行时匹配。
- 各面板已有移动 Shop All 设置：womens／heated-accessories／bundle-deal／gift guide 等，与 section 内硬编码路径（women／accessories／bundles／gift／sale）不一致。
- `assets/header-new.css` 已支持 `a.header-new__nav-link[aria-expanded='true']` 的下划线与颜色，无按钮专属依赖。

## 实际变更

1. `sections/header-new.liquid`
   - 新增 8 个 `url` 设置：`nav_link_new`／`men`／`women`／`kids`／`accessories`／`bundles`／`gift`／`sale`，默认对齐各面板 Shop All：
     `/collections/new-arrivals`、`/collections/men`、`/collections/womens`、`/collections/kids`、`/collections/heated-accessories`、`/collections/bundle-deal`、`/pages/heated-apparel-gift-guide`、`/collections/campaign`。
   - 循环按 `nav_link_<menu_key>` 读取设置；为空回退原硬编码路径；非绝对 URL 继续拼接 `routes.root_url` 以保留本地化前缀。
2. `assets/header-new.js`
   - `prepareNavToggles()` 改为 `prepareNavItems()`：不再替换 `<a>`，只补 `aria-expanded`／`aria-controls`／`data-nav-panel`，并在桌面 `pointerenter` 打开对应面板。
   - 主列表 `pointerover`／`focusin`：导航项悬停／聚焦改为打开面板，不再按普通链接关闭。
   - 点击：移动端拦截导航链接并打开面板（保持原有抽屉二级菜单）；桌面端放行链接跳转。
   - `showPanel()` 同步导航链接 `aria-expanded`；ArrowDown 从顶级项进入面板；Esc 关闭后焦点回到对应链接。
3. 文档：本日志；Header `README.md`、`architecture.md`、`files.md`、`known-issues.md` 增量更新；知识库入口新增条目。

## 验证

仅静态核对：

- `node --check assets/header-new.js` 通过。
- 提取 `{% schema %}` 后 `JSON.parse` 通过，设置数 26，8 个 `nav_link_*` 默认值与计划一致。
- 逐行核对：`data-nav-key` ↔ `data-header-panel` 匹配、`data-nav-panel` 只加在顶级链接、移动端点击分支在通用 `a[href]` 之前、绝对 URL 不拼 `routes.root_url`。
- 未执行浏览器、主题检查或线上验证；悬停、键盘、触屏与移动抽屉实际表现未实测。

## 文档与决策

- 更新 [Header README](../../modules/header/README.md)、[架构](../../modules/header/architecture.md)、[文件清单](../../modules/header/files.md)、[已知事项](../../modules/header/known-issues.md)。
- 不新增 ADR：交互从 button 恢复为 anchor 属既有 DOM 契约的调整，未改变面板数据源或跨模块契约。

## 风险、回退与遗留

- 桌面触屏设备没有 hover：点击会直接跳转，面板只能通过键盘（聚焦或 ArrowDown）打开。
- 有面板的顶级项从 button 恢复为 a 后，桌面点击不再切换面板；悬停／聚焦已负责展开。
- 设置默认值只在商家未保存该设置时生效；线上 Header section 若曾保存过整体设置，需要在新字段中显式填写或确认默认生效。
- 绝对 URL 时 `request.path == nav_href` 不成立，当前页下划线不显示；相对 URL 不受影响。
- `navigation_paths` 中的旧 Women 路径 `/collections/women` 仍作为空设置回退；要修正需在后台填写或后续单独处理。
- 回退：恢复 `prepareNavToggles()`、移除 8 个设置与 schema，即可回到原按钮开关行为。
- 遗留：未验证主题编辑器保存、实际点击跳转与移动抽屉表现；未提交、未推送、未发布。
