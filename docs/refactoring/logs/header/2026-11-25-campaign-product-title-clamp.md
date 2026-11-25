# 2026-11-25 Header 活动商品卡标题两行省略

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“snippets/header-new-product-card.liquid 如果标题超过两行，显示省略号”
- 批准范围：header 活动面板商品卡标题的两行截断样式；不改商品卡结构、图片、尺寸或链接

## 目标与源码证据

- 现状：`snippets/header-new-product-card.liquid:16` 输出 `<span class="header-new__campaign-product-title">`，标题无行数限制，长标题会撑高卡片并挤压网格行高。
- 样式：`assets/header-new.css` 的 `.header-new__campaign-product-title`（桌面 13/18px）与 ≤1199px 覆盖（14/18px）原本只有 `overflow-wrap: anywhere`，没有截断规则。
- 断点：标题卡在桌面与 ≤1199px 移动面板共用同一类名，只由 `header-new.css` 提供，无其他引用方。

## 实际变更

- `assets/header-new.css`：`.header-new__campaign-product-title` 增加 `display: -webkit-box`、`-webkit-box-orient: vertical`、`-webkit-line-clamp: 2`、`overflow: hidden`。超过两行时由 `-webkit-line-clamp` 自动加省略号；两行以内高度不变。移动断点只覆盖字号／行高，截断规则随基类继承，无需重复声明。
- 未改 `snippets/header-new-product-card.liquid`，也无需改：截断是纯展示样式，Liquid 输出保持不变。

## 验证

- 静态阅读确认：选择器唯一、两条断点共用、`-webkit-line-clamp` 需要 `display: -webkit-box` 与 `overflow: hidden` 同组生效，花括号平衡。
- 未启动浏览器、未截图、未做视觉或交互测试；主流行 Chrome／Safari／Firefox（≥ Chromium 对齐实现）支持该组合，未在真机验证。

## 文档与决策

- 本日志为唯一文档改动，并在项目知识库入口登记索引。
- 功能逻辑、依赖关系和架构未变，不更新模块 architecture／files／module-map，不新增 ADR。

## 风险、回退与遗留

- 风险：`-webkit-line-clamp` 为 WebKit 前缀实现，极旧浏览器会退化为不截断（仅表现为原有多行），不影响布局可用性。
- 回退：删除该规则中的四行截断声明即可恢复原行为。
- 遗留：省略号的确切视觉（两行末尾截断位置）需在预览主题确认；未获授权不发布线上。
