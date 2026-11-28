# 2026-11-28 商品页导航粘顶位置修正

- 模块：Product Detail（`product-nav` 与站点 Header／公告栏的定位关系）
- 状态：完成（仅静态检查；未做浏览器或线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`；未提交、未推送、未发布
- 批准依据：用户 2026-11-28 提供滚动截图并说明“桌面端的位置出问题了，应该在公告栏和 header 底下，header 为 68px，公告栏为 38，移动端也出错了，header 为 40，公告栏为 38”，随后在确认中选择“保留 header，导航在其下方”
- 批准范围：`sections/product-nav.liquid` 的粘顶样式、`assets/product.js` 的 `nav_header_scroll`、文档；不改 Header、公告栏结构、锚点滚动逻辑、其他导航 section

## 目标与源码证据

- 故障：`sections/product-nav.liquid` 的 `.product-header-sticky` 写死 `position: fixed; top: 0; z-index: 4`，粘顶后导航落在视口顶部，被固定在顶部的公告栏（38px，`z-index: 100001`）与 Header 覆盖，同时压住页面内容。
- Header：[assets/header-new.css:1](../../../assets/header-new.css#L1) 固定 `top: 0`，高度 `--header-nav-height + --announcement-current-height`；[sections/header-new.liquid:5](../../../sections/header-new.liquid#L5) 设置 `--header-nav-height` 移动端 40px、≥1281 为 68px。
- 公告栏：[sections/announcement-bar.liquid:18](../../../sections/announcement-bar.liquid#L18) 在 `:root` 输出 `--announcement-current-height: 38px`（无公告时为 0），`header-new.css:1205` 固定 `top: 0`、`z-index: 100001`。
- 滚动逻辑：[assets/product.js:2657](../../../assets/product.js#L2657) 的 `nav_header_scroll` 在越过阈值后给 `.main-nav-header-section` 加 `product-header-sticky`，原实现同时给 `nav.header-new` 加 `header-hide`（`product-nav.liquid` 中对应 `display:none`），因此滚动态只剩公告栏 + 导航。
- 旧粘顶位置实际为 0，公告栏 38px 覆盖其顶部，表现为截图中的错位。

## 实际变更

1. `sections/product-nav.liquid`：`.product-header-sticky` 的 `top` 改为 `calc(var(--header-nav-height, 40px) + var(--announcement-current-height, 0px))`，即桌面 68+38=106px、移动端 40+38=78px，无公告时只让出 Header 高度。
2. `assets/product.js` 的 `nav_header_scroll`：移除滚动态对 `nav.header-new` 的 `header-hide` 加/除，Header 保持显示，导航固定在公告栏 + Header 下方。
3. 文档：新增本日志、补充 product-detail 架构说明、登记知识库入口。

## 验证

- `node --check assets/product.js` 通过；`git diff --check` 无空白错误。
- 静态核对：`header-hide` 在 `assets/product.js` 已无写入；`product-nav.liquid` 中的 `nav.header-new.header-hide` 规则保留（`assets/page.js` 仍用于 page-nav-header 页面，未改）。
- 静态推演：有公告时 top=106/78，无公告时 top=68/40；z-index 4 低于 Header（100000）与公告栏（100001），三者不重叠。
- 未启动浏览器，未验证真实滚动、移动端底部购买条与粘顶条的叠加、Header 收起交互。

## 文档与决策

- 新增本日志；[product-detail/architecture.md](../modules/product-detail/architecture.md) 补充粘顶位置依赖 Header 高度变量；知识库入口增加索引。
- 不改数据结构与跨模块契约，不新增 ADR。

## 风险、回退与遗留

- 风险：Header 现在常驻，滚动态永久占用 106px（桌面）／78px（移动）视口高度，这是本次确认的行为。
- 风险：top 依赖 Header 的 `--header-nav-height` 与公告栏的 `--announcement-current-height`；若后续更换 Header 高度或改用其他测量方式，需同步该表达式（fallback 为 40px，仅能覆盖移动端）。
- 遗留：导航链接点击仍按 `offset().top - 50` 滚动（`product.js` L1319 附近），粘顶条 + Header 更高时会遮住目标段落顶部，本次未改；如需精确对齐需另批。
- 回退：还原 `sections/product-nav.liquid` 与 `assets/product.js` 本次差异即可。
