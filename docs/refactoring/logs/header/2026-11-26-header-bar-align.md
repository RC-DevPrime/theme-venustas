# 2026-11-26 Header 条宽度 100px 与下拉文案左对齐

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“.header-new__bar 的 width 改为 min(100% - 100px,1720px)；让导航 New 和下拉菜单的文案左对齐，再调整一下”
- 批准范围：桌面 header 条宽度、导航面板内容左边距、搜索弹层条宽度与 Help 面板右对齐；不改导航项顺序、下拉内容与移动端布局

## 目标与源码证据

- 桌面条宽原为 `min(100% - 40px, 1720px)`（assets/header-new.css:63）；导航 “New” 的起始位置 = 条左边缘 + Logo 154 + 导航列表 margin-left 32 = 条左 + 186（`.header-new__logo` 154、`.header-new__nav-list` margin-left 32）。
- 下拉面板 `.header-new__panel-inner` 原为 `min(100% - 40px, 1340px)` 居中，与条不同宽、不同起点；宽屏（如 1920）下左右只需差几像素，但在 1200–1800 区间会相差最多一百多像素，导致 New 与下拉第一列文案不对齐。
- 搜索弹层 `.predictive-search__bar` 也用同一组 40px/1720 参数，Help 面板右侧定位用 `max(20px,(100% - 1720px)/2)`，条宽改 100px 后会与右侧工具区错位。

## 实际变更

- assets/header-new.css：
  - `.header-new__bar`：宽度改为 `min(100% - 100px, 1720px)`；≤1199px 移动端在媒体查询里覆盖回 `min(100% - 40px, 1720px)`，保持移动端左右 20px。
  - `.header-new__panel-inner`：宽度改为与条一致 `min(100% - 100px, 1720px)`，加 `padding-left: calc(154px + 32px)`（Logo 宽度 + 导航左间距），使下拉第一列文案起点与导航 “New” 对齐；移动端媒体查询补 `padding-left:0`，保持原有 100% 宽布局。
  - `.header-new__panel--help`：右侧定位由 `max(20px, …)` 改为 `max(50px, calc((100% - 1720px)/2))`，跟随新条宽与右侧工具区对齐。
- assets/style.css：`.predictive-search__bar` 宽度同步改为 `min(100% - 100px, 1720px)`，搜索弹层的 Logo 与 header Logo 保持同一左边缘。

## 验证

- 静态核对：header-new.css 花括号 349/349；style.css 403/403；检索 `1720` 相关规则已全部按新参数调整。
- 手工推演（1920）：条宽 1720、左边 100，New 起点 286；面板内容起点 100 + 186 = 286，对齐。1440：条宽 1340、左 50，New 236；面板 50 + 186 = 236，对齐。Help 面板右边缘：1920 为 100、1440 为 50，与条右边缘一致。
- 未启动浏览器，实际对齐与窄桌面（1200–1400）下面板内容是否溢出需预览确认。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记。
- 无 ADR。

## 后续修正（同日）

- 首版把 186px 缩进放在 `.header-new__panel-inner` 的 `padding-left` 上，但 CSS 末尾已有 `@media (min-width:1200px)`／`(min-width:1534px)` 两条更高优先级的规则同时设置面板的 width／margin-left，实际生效的是那两条（内容左边缘跟 Logo 或 ≥1534 才跟 New），所以截图里仍未对齐。
- 现改为：基础 `.header-new__panel-inner` 恢复 `width:min(100% - 40px,1340px);margin:0 auto`、去掉 padding；删除 ≥1534 的单独规则，用一条 ≥1200 的规则统一计算：
  - `--header-bar-inset: max(50px, (100% - 1720px)/2)`（新 bar 宽 `min(100% - 100px,1720px)` 的左右留白）
  - `--header-panel-inset: calc(var(--header-bar-inset) + 186px)`（Logo 154 + 导航 margin 32）
  - `margin-left: var(--header-panel-inset)`，`width: min(1340px, 100% - panel-inset - bar-inset)`。
  - 同时作用于 `.header-new__campaign-layout`，Sale／Bundles 面板也按同一条左边缘对齐。
- 推演：1920 下 bar 左 100、内容左 286；1440 下 50→236；与导航 New 的起点一致。

## 后续修正 2（同日）

- 用户补充：1520 宽时下拉内容与 header Logo 左对齐；1280 宽时显示移动端 header。
- 断点调整：移动端断点由 1199 改为 1280（CSS 中的 5 处 `@media (max-width: …)`、header-new.js 的 `matchMedia`、图片 `sizes` 的 1199 均改为 1280；`sections/header-new.liquid` 的 68px 高度断点改为 `min-width:1281px`，保证 1280 仍是 40px 移动头部）；桌面规则起点同步改为 1281。
- 下拉对齐：`@media (min-width:1281px)` 下内容左边缘先取 `--header-bar-inset`（即 Logo 左边缘，条宽 100px 内缩）；`@media (min-width:1521px)` 再改为 `bar-inset + 186px`（导航 New）。因此 1281–1520 与 Logo 对齐、1521 起与 New 对齐；1920 下仍为 New。
- 影响文件：assets/header-new.css、assets/header-new.js、sections/header-new.liquid、snippets/header-new-product-card.liquid、blocks/_header-nav-image-menu.liquid、blocks/_header-nav-promo.liquid（仅 sizes 提示）。

## 风险、回退与遗留

- 风险：面板内容起点右移 186px 且不再限制 1340，宽屏下促销卡会贴到条右边缘、内容整体变宽；1200–1400 窄桌面下 4 列 + 2 促销卡可能更早出现横向溢出（改前该区间已偏紧）。移动端已在媒体查询恢复 100% 宽与无缩进。
- 回退：还原 `.header-new__bar`、`.header-new__panel-inner`、`.header-new__panel--help` 与 `.predictive-search__bar` 四处宽度/内边距即可。
- 遗留：Sale／Bundles 等活动面板使用 `.header-new__campaign-layout`（1340 居中），本次未随条宽调整；若也要与对应导航项左对齐，需要按同样思路单独处理。
