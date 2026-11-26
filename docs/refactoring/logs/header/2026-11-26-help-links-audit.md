# 2026-11-26 Help 面板链接、邮箱按钮与 Header 图标功能检查

- 模块：header
- 状态：完成（仅静态检查；筛选、商店应用相关项需线上验证）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“help 每个项的链接没有配置，点击没反应，邮箱按钮 hover 变主题色，点击出现邮箱弹窗（mailto），检查新 header 每个图标的功能和跳转是否正常”
- 批准范围：Help 面板的六项链接、邮箱按钮样式与行为、新 header 图标的有无跳转检查；不改其它面板结构与样式

## 目标与源码证据

- Help 项原用 `section.settings.help_*_url | default: …` 直接取值：URL 设置未配置时返回 nil 才能走默认值；若后台保存过空值，可能得到空 href 或被 `blank` 判断成 `<span>`，点击无反应。Warranty Registration 的默认值 `shopify://pages/warranty-registration` 是写死在 Liquid 里的字面量，Shopify 只解析 URL 设置对象，字面量 `shopify://` 会原样输出成无效 href；Warranty Claim 没有默认值，固定输出 `<span>`。
- 关闭逻辑：`header-new.js` 的 `click()` 对任意 `a[href]` 先调用 `this.close()`，会同步给 Help 面板加 `hidden`；在点击默认动作（导航 / mailto）前把链接隐藏，存在被浏览器取消跳转的风险，Help 面板内所有链接都会受影响。
- 邮箱按钮 `mailto:` 本身没问题，缺 hover 主题色。

## 实际变更

- sections/header-new.liquid（Help 面板）：
  - 六个 URL 先统一 `append: '' | strip` 转成字符串再判断空值，避免 URL 对象/空值差异；每个都有绝对地址回退：Order Tracking（aftership）、Returns（returnscenter）、Warranty Registration（https://venustas.com/pages/warranty-registration）、Warranty Claim（未配置时回退 Help Center）、User Manuals、Help Center（`help_link` 为空时 zendesk）。
  - 链接输出加 `| escape`。
- assets/header-new.js：`click()` 中对 Help 面板内的链接不再立即关闭面板，避免隐藏导致导航/mailto 被取消；`mailto:` 链接点击后 400ms 再关闭；其它区域链接保持原有关闭行为。
- assets/header-new.css：`.header-new__help-email` 增加 `transition:background .2s ease` 与 `:hover { background:#b93205 }`（主题色）。

## 图标功能检查（静态）

- Logo：`href="{{ routes.root_url }}"`（桌面、抽屉各一处），正常。
- 移动菜单按钮：`data-header-mobile-open` → `openDrawer()`；关闭 `data-header-mobile-close`；面板返回 `data-header-mobile-back`。
- 搜索：移动 `header-new__mobile-search` 与桌面 `header-new__search` 均 `data-header-search`，≤1199 打开 `[data-header-search-layer]`，桌面打开 `.predictive-search`；找不到层时回退链接 `/search`。
- Help：桌面字标与移动工具行都是 `data-header-toggle="help"`，本机面板；链接见上。
- 账户：桌面图标 → `routes.account_url`；移动登录态为 details（Profile／Orders／Return Center／Loyalty Hub，均可回退 account_url 或 `#smile-home`），未登录 → `routes.account_login_url`。
- Wishlist：`data-header-wishlist` → `openWishlist()`，依赖 Swym（`window._swat`）；应用未就绪时按钮置 `aria-busy` 等待 `SwymCallbacks` 后重试。
- 购物车：`data-header-cart`；有 `window.openCart` 与 `#popup-cart` 时开弹层，否则跳 `/cart`；角标随 `cart:updated` 更新。
- Gift：`data-header-gift` + `href="#smile-home"`，依赖 Smile 应用 iframe；找不到启动器时退回锚点跳转。
- 国家切换：`data-header-country-toggle` + 菜单链接 `country_us_url`／`country_ca_url`，空值回退 venustas.com／venustas.ca。
- 主导航：有面板的入口由 JS 换成 button（`aria-expanded`／`aria-controls`），无面板的保持链接；面板内各区块链接/按钮均输出 href。

## 验证

- 静态核对：header-new.js `node --check` 通过；header-new.css 花括号 346/346；header-new.liquid `{% %}` 65/65、`{{ }}` 28/28。
- 未启动浏览器、未在主题编辑器或线上预览验证；Help 链接实际跳转、mailto 弹窗、Swym／Smile／购物车弹层依赖真实环境。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记；未改架构文档。
- 无 ADR。

## 后续修正（同日）

- 用户确认：Help 六项地址不变，改为在新标签页打开。
- sections/header-new.liquid：`.header-new__help-link` 的 `<a>` 增加 `target="_blank" rel="noopener"`；无 URL 时仍输出 `<span>`。
- assets/header-new.js：Help 面板内 `target="_blank"` 的链接与 `mailto:` 一样延迟 400ms 关闭面板，避免新标签页打开后下拉仍停留在页面上；同一标签页导航的 Help 链接仍不预先关闭，防止跳转被取消。

## 风险、回退与遗留

- 风险：Help Center／Warranty 页面按上线地址写死，若店铺页面路径不同需在主题设置里重新选；“Warranty Claim 未配置时回退 Help Center”为本次假设，需要商家确认目标页面。
- 回退：还原 header-new.liquid 的 Help 赋值段、header-new.js 的 `a[href]` 分支与 CSS hover 即可。
- 遗留：Wishlist（Swym）与 Gift（Smile）无法静态验证，需线上确认；账户与 Help 的 URL 仍由主题设置覆盖，空值才有回退。
