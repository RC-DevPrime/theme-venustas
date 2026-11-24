# 2026-11-24 移动端 My Account 登录态与折叠

- 模块：header
- 状态：待验证（仅静态检查）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`，未提交
- 批准依据：用户 2026-11-24 消息要求移动端 My Account 登录后四个链接默认展开可折叠、未登录展示 Sign In / Join 样式
- 批准范围：sections/header-new.liquid 移动端账户区、assets/header-new.css 对应样式；不改桌面端、不改链接配置项

## 目标与源码证据

原实现（sections/header-new.liquid 原 43–51 行）固定输出 `header-new__account-heading` 与 `header-new__account-links`，不看登录态，四个链接始终平铺、无折叠。样式在 assets/header-new.css 移动断点内（utility-row/account-links）。

## 实际变更

- header-new.liquid：移动抽屉账户区改为 `{% if customer %}` 分支。已登录输出 `<details class="header-new__account" open>`，summary 复用 `header-new__utility-row`（图标 + My Account + 右箭头），下方 `header-new__account-links` 保留 Profile / Orders / Return Center / Loyalty Hub 四个链接及原有 section 设置回退。未登录输出单个链接行（账户图标 + `Sign In / Join {{ shop.name }}`），指向 `routes.account_login_url`，无下拉。
- header-new.css：新增 summary 去 marker、`cursor:pointer`；右箭头默认 0°，`[open]` 时旋转 90°（展开为下箭头）；补 `summary:focus-visible` 轮廓；reduced-motion 下关闭箭头过渡；移除已废弃的 `header-new__account-heading` 选择器。
- 未改 header-new.js：折叠由原生 details/summary 完成，现有点击/焦点逻辑不拦截 summary。

## 验证

静态阅读 Liquid 分支、details 结构与移动断点样式顺序；确认抽屉内链接仍在既有 `a[href]` 关闭逻辑内，折叠内容在 Tab 捕获中因无布局被过滤。未做浏览器或真机验证，登录态/未登录态均未实机复现。

## 文档与决策

已更新本日志；模块档案（README／known-issues）本次同步简述。无新 ADR。

## 风险、回退与遗留

- 未登录态使用 `routes.account_login_url`，登录后跳转目标由 Shopify 决定，未验证。
- 四个链接仍取 section 设置／默认值；Orders 复用账户页地址，未接独立订单页。
- 回退：还原 header-new.liquid 账户区与 header-new.css 对应规则即可。
- 待确认：展开态箭头方向、账户区背景是否与 Help/Wishlist 行一致。
