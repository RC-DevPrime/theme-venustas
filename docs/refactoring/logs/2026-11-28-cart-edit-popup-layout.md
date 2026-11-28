# 2026-11-28 购物车行内编辑弹窗移动端全屏与固定购买按钮

- 模块：跨模块（Header 购物车抽屉、主购物车页；`product-update-popup`）
- 状态：完成（仅静态检查；未做浏览器或线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`；未提交、未推送、未发布
- 批准依据：用户 2026-11-28 在先提交方案后选择“只固定 Add To Cart”
- 批准范围：`snippets/product-update-popup.liquid`、`assets/style.css` 中该弹窗的布局样式及文档；不含 `assets/main.js`、其他弹窗、schema、后台配置

## 目标与源码证据

- 购物车行内弹窗在 [main-cart.liquid:84](../../../sections/main-cart.liquid#L84)、[main-cart.liquid:135](../../../sections/main-cart.liquid#L135)（桌面／移动两份）与 [popup-cart.liquid:112](../../../sections/popup-cart.liquid#L112) 渲染 `product-update-popup`，根节点为 `.product-update.popup-modal`。
- 弹窗支持 ADD MORE：`main.js` 每次点击克隆 `.product-update-item` 并插入最后一个 item 之后（原 L1502–1548），因此一个弹窗可能有多个商品项；若让单个 `.product-update-item` 滚动，多个商品会各自产生滚动区。
- 原结构：`.popup-content > .popup-header + .popup-container`，`.popup-container` 内为若干 `.product-update-item`，底部 `.col-12 > .bottom-container` 同时包含 ADD MORE 与 Add To Cart；`.popup-container` 以 `max-height:70vh; overflow-y:scroll` 滚动，购买按钮会随内容滚走。
- 桌面基础宽度原本取 `.popup-modal .popup-content` 的 600px；popup-cart.css 的 730px 规则需要 `.popup-container` 祖先，行内购物车弹窗没有该祖先，未命中。移动端仍受 `.popup-modal.product-update .popup-content { width: calc(100% - 40px) }` 影响。
- `#popup-cart` 为固定抽屉，`.cart` 是 `z-index:2` 的层叠上下文；静态核对未发现祖先 `transform`，移动端 `position:fixed` 全屏可覆盖视口。

## 实际变更

1. `snippets/product-update-popup.liquid`：
   - `.popup-content` 增加 `cart-edit-popup` 类。
   - 将 Add To Cart 从 `bottom-container` 移出，放到 `.popup-container` 之后的 `.cart-atc-footer`，作为`.popup-content` 的直接子级；移除了按钮原有的 `mt-lg-4 mt-md-4 mt-sm-3`，间距交给固定区 padding 控制。
   - 原底部容器的 ADD MORE 保留在滚动区，class 改为 `cart-add-more-row`，避免命中 `bottom-container` 的边框和固定布局；ADD MORE 的位置、图标和点击逻辑不变。
2. `assets/style.css`：
   - 将上一轮 `edit-option-popup` 的公共规则（纵向 flex、`max-width:600px`、`max-height:90vh/90dvh`、header 固定、`overflow:hidden`）扩展为同时匹配 `cart-edit-popup`。
   - `cart-edit-popup` 的 `.popup-container` 设为唯一滚动区（`flex:1; min-height:0; max-height:none; overflow-y:auto`），商品项与 ADD MORE 一起滚动。
   - `.cart-add-more-row` 增加上下 12px 间距；`.cart-atc-footer` 固定在弹窗底部，白色背景、上边框，桌面 padding `16px 24px 20px`。
   - `@media (max-width:768px)` 的全屏根规则同时匹配 `cart-edit-popup`；header 加 `safe-area-inset-top`，容器上下 padding 清零；`.cart-atc-footer` 移动端 padding `12px 20px calc(12px + env(safe-area-inset-bottom))`。
3. 文档：新增本日志；上一轮日志补充后续说明，避免“购物车弹窗不变”被误读为当前状态；知识库入口增加索引。

未修改 `assets/main.js`：ADD MORE、Remove、保存更新继续通过 `.find('.product-update-item')`、`.after()`、`.closest()` 工作；购物车保存按钮仍由 `CART_SCOPE .btn-main` 的文档级委托处理。

## 验证

- `git diff --check`：通过（已清理移动按钮时带入的行尾空格）。
- `assets/style.css` 花括号静态计数：422／422，平衡；`product-update-popup.liquid` 的 `<div>`／`</div>` 为 20／20，结构闭合。
- 检索确认 `cart-edit-popup`、`cart-add-more-row`、`cart-atc-footer` 仅用于本弹窗；`bottom-container` 不再出现在该 snippet 的 ADD MORE 区域。
- 静态核对事件链：ADD MORE 仍在 `.popup-container` 内，克隆插入点不受影响；Add To Cart 移出滚动区后仍是 `.product-update.popup-modal` 后代且位于 `.main-cart`／`#popup-cart` 内，`main.js` 保存处理器仍可命中。
- 未启动浏览器，未验证购物车抽屉层叠、真实滚动与移动端安全区。

## 文档与决策

- 本次为上一轮弹窗改造的追加范围：按用户选择只固定 Add To Cart，ADD MORE 保留在滚动区。上一轮日志已补链接说明。
- 未改变购物车数据流、事件绑定或跨模块契约，未新增 ADR，未更新模块 architecture／files。

## 风险、回退与遗留

- 风险：购物车弹窗位于 `#popup-cart` 的 `.cart` 层叠上下文内，移动端全屏依赖 `position:fixed`；若后续给祖先增加 `transform`／`filter`，fixed 会改为相对该祖先。ADD MORE 现在需要滚动到列表底部才能看到，符合本次“只固定 Add To Cart”的选择。
- 桌面宽度固定 600px，而购物车抽屉本身宽 580px；弹窗按视口居中，可能略宽于抽屉背景。
- 回退：还原 `product-update-popup.liquid` 的 `.popup-content` 类、ATC 位置与 `bottom-container` 结构，并删除 `style.css` 中 `cart-edit-popup`／`cart-add-more-row`／`cart-atc-footer` 规则即可。
- 遗留：未在真实主题中验证 iOS／Android 安全区、长变体列表、多个 ADD MORE 商品时的滚动与保存表现；等待审核后再决定是否发布。
