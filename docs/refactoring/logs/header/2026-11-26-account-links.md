# 2026-11-26 移动账户四个链接配置

- 模块：header
- 状态：完成（仅写入配置值并静态校验，未浏览器／线上验证）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题
- 批准依据：用户 2026-11-26 消息“header-group-new.json 配置 profile_link／orders_link／return_center_link／loyalty_link，旧 header 打开的地址分别是 …，帮我配置下”
- 批准范围：仅 `sections/header-group-new.json` 中 `header_new.settings` 的四个 URL 值；不改 Liquid、CSS、JS 与其它设置

## 目标与源码证据

- `sections/header-new.liquid` 第 53–56 行，登录态移动抽屉 My Account 的 Profile／Orders／Return Center／Loyalty Hub 取 `section.settings.profile_link`、`orders_link`、`return_center_link`、`loyalty_link`，空值时分别回退 `routes.account_url`（前两项）、`https://venustas.returnscenter.com/?ref=powr-io`、`#smile-home`。
- 四项在 `sections/header-new.liquid` schema（第 229–248 行）中均为 `url` 类型设置；对应 `templates` 侧值原为空字符串，实际点击落在默认回退上。
- 桌面账户图标仍为 `routes.account_url`，不受这四项影响；`#smile-home` 的 Smile 启动器另有独立入口（Gift 按钮与购物车会员链接），本次不改。

## 实际变更

`sections/header-group-new.json`（`sections.header_new.settings`）：

| 设置 | 原值 | 新值 |
| --- | --- | --- |
| `profile_link` | 空 | `https://account.venustas.com/profile` |
| `orders_link` | 空 | `https://account.venustas.com/orders` |
| `return_center_link` | 空 | `https://venustas.returnscenter.com/` |
| `loyalty_link` | 空 | `https://account.venustas.com/pages/daacc659-e05e-4631-8c8a-09c6370fe146` |

- 按用户给出的地址按语义对位（`/profile`→Profile、`/orders`→Orders、returnscenter→Return Center、`/pages/daacc659…`→Loyalty Hub），未按用户列举顺序机械对位。
- 中文与 en dash 等原有字符未改动（edit 仅替换四行值）。

## 验证

- `node` 读取文件、剥离首部注释后 `JSON.parse` 通过；输出 `header_new.settings` 四项与上表一致，`help_hours` 等 UTF-8 字符显示正常。
- 未启动浏览器、未在主题编辑器预览或线上确认跳转；账户子页是否需登录、returnscenter 域名可用性属外部环境。

## 文档与决策

- 新增本日志；未改模块 architecture／known-issues／files（仅配置值变化，结构未变）。
- 无 ADR。

## 风险、回退与遗留

- 偏差提示：Return Center 按用户提供地址写为 `https://venustas.returnscenter.com/`，与 Help 面板默认值 `…/?ref=powr-io` 的追踪参数不同；若需保留 powr 归因参数，仅需在该值后补 `?ref=powr-io`。
- Loyalty Hub 改为账户页 URL 后，不再回退 `#smile-home` 锚点；Smile 会员入口（Gift 按钮、购物车文案）未受影响，若线上希望两者一致需另行确认。
- 回退：将四项还原为空字符串即恢复原默认回退行为。
- 遗留：登录态下的实际跳转、外部域名可用性未验证。

## 补充核查（同日，用户提问 loyalty 地址是否随用户变化）

- 结论：`/pages/daacc659-e05e-4631-8c8a-09c6370fe146` 不是按用户生成的地址，而是 Shopify 客户账户“全页扩展”路由 `/account/pages/{extensionIdOrHandle}` 中的扩展页面 ID（UUID），同一店铺对所有用户一致；用户差异由登录态与账户数据决定，不由 URL 决定。依据：Shopify 文档与开发者社区说明该路由为 `{{ routes.account_url }}/pages/{extensionIdOrHandle}`（[文档](https://shopify.dev/docs/apps/build/customer-accounts/full-page-extensions/build-new-pages)、[社区回复](https://community.shopify.dev/t/checkout-ui-extension-deep-link-join-loyalty-to-a-customer-account-ui-extension-full-page-account-pages/32907/2)）。
- 静态核对：`https://account.venustas.com/pages/daacc659…` 未登录时 302 跳转 Shopify 客户账户 OAuth 授权页，说明该子域为 new customer accounts；同一 UUID 路径在 `https://venustas.com/pages/…` 返回 404，说明它不是 Online Store 页面 handle。未在登录态确认实际渲染内容。
- 变更风险：该 ID 属应用侧资源（疑为 Smile Loyalty Hub 等客户账户扩展页），应用重装或扩展页面重建后 ID 可能变化，届时需重新复制地址；主题编辑器的 URL 选择器无法选取此类应用页，只能存绝对地址。
