# 2026-11-26 移动抽屉 Wishlist 点击无响应修复

- 模块：header
- 状态：部分完成（代码与静态检查完成；移动端真实点击未验证，需用户在手机预览确认）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息确认“桌面端头部心形图标能正常打开 wishlist”，并要求按已提交方案修改（先提交方案、后获批准）
- 批准范围：仅 `assets/header-new.js` 的 `openWishlist()` 及其定时器清理；不改 Liquid 结构、CSS、其它面板与桌面端行为

## 目标与源码证据

- `sections/header-new.liquid:68`（移动抽屉行）与 `:151`（桌面图标）都是 `<button data-header-wishlist>`；`assets/header-new.js` 的委托 `click()` 命中后调用 `openWishlist()`。
- 旧 header（commit `071c7d5`）在 `SwymCallbacks` 内直接给按钮绑定 `swat.ui.open()`，无抽屉参与；`config/settings_data.json` 中 Wishlist Plus 的 `wishlist-app-embed` 已启用且 `show_ui: true`，说明 SDK 与 UI 均开启。
- 桌面端同一函数可用（用户实测），因此问题只出现在移动抽屉路径：进入 `openWishlist()` 前抽屉处于展开态（`body` overflow 锁定、`[data-drawer-open]` 存在），需要先 `close()` 拆掉抽屉再调用 Swym。
- 原实现只有两个分支：`swym.ui.open` 可用则关抽屉后调用；否则仅置 `pendingWishlist` 与 `aria-busy`，不轮询、不兜底。Swym 晚于首次点击加载时，`SwymCallbacks` 已执行过，按钮会永久停留在“点了没反应”的状态。

## 实际变更

`assets/header-new.js`：

- `openWishlist()` 重写：
  - 统一 `settle()` 清理定时器、`pendingWishlist` 与 `aria-busy`。
  - `swym.ui.open` 可用时，先 `close()` 抽屉，再用 `requestAnimationFrame` 延后一帧调用，避免与抽屉拆除（body 滚动解锁、`visibility` 切换）在同一个 tick 内竞争；调用带 try/catch，抛错则跳到 wishlist 页。
  - 仅移动端（`matchMedia('(max-width: 1280px)')`）额外在 1s 后检查 `.swym-ui-component`／`#swym-wishlist` 是否真的可见，不可见则跳 `/pages/swym-wishlist`；桌面端不改变现有行为。
  - `ui.open` 不可用时：先点击 Swym 注入的 `.swym-wishlist`／`a[href="#swym-wishlist"]`；不存在则每 300ms 重试（最多 5 次）等待 SDK 就绪，仍失败跳 `/pages/swym-wishlist`（旧 header 改造前使用的同一地址，线上返回 200）。
- `close()` 与 `destroy()` 增加 `wishlistTimer` 清理，避免抽屉关闭或 section 卸载后仍延迟跳转。

## 验证

- `node --check assets/header-new.js` 通过。
- 静态核对：定时器在 `settle()`／`close()`／`destroy()` 三处清理；桌面分支与原逻辑等价（先关抽屉后调用），只多了 rAF 与 try/catch。
- 未启动浏览器，未在手机或主题预览实测点击；`ui.open` 在移动端是抛错还是静默失败尚未确认，1s 可见性判定为启发式。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/known-issues.md` 增加对应条目。未改架构文档，无 ADR。

## 后续修正（同日，第二版）

- 用户反馈第一版无效：移动端点 Wishlist 后页面滚到 footer（邮箱输入框），地址栏只加 `#swym-list`，仍无抽屉；桌面正常。
- 原因：第一版兜底里 `document.querySelector('.swym-wishlist, a[href="#swym-wishlist"]')` 命中了 Swym 注入在页面底部的入口锚点，`launcher.click()` 触发页面内跳转（滚到底部 / 写入 `#swym-list`），抽屉仍未打开；同时 `SwymCallbacks` 往往晚于首次点击，按钮没有重试。
- 实际变更（仍仅 `assets/header-new.js`）：
  - 删除“点击 Swym 页面入口锚点”分支（这是 footer 跳动与 `#swym-list` 的直接来源）。
  - 删除 1s 可见性猜测与相应的自动跳转。
  - 保留：`settle()` → `close()` → `requestAnimationFrame` 内调用 `ui.open()`；API 未就绪时置 `aria-busy` 并每 250ms 重试（最多 12 次，约 3s），仍失败才跳 `/pages/swym-wishlist`。
- 待验证：手机端是否出现抽屉；若仍不出现，说明 `_swat.ui.open` 在移动端不渲染，下一步改为移动端直接打开 `/pages/swym-wishlist` 或改渲染容器方案（需另提方案）。

## 风险、回退与遗留

- 风险：若移动端 `ui.open()` 实际已打开、但 Swym 根节点选择器与 `.swym-ui-component`／`#swym-wishlist` 不匹配，1s 后会误跳 wishlist 页（仍能看到收藏，不算失效）；反之若节点常驻可见，则静默失败仍不会被兜底。
- 风险：`/pages/swym-wishlist` 为线上已存在页面，但预览主题是否保留该页面模板（`templates/page.swym.liquid`）未验证。
- 回退：还原 `openWishlist()` 与 `close()`／`destroy()` 的定时器清理即可。
- 遗留：需手机实测；若仍无响应，下一步改用 Swym 文档支持的自定义入口 `<a href="#swym-wishlist" class="swym-wishlist">`（需同步改 `sections/header-new.liquid` 两个按钮与样式）。
