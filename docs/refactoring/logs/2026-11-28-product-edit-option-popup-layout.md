# 2026-11-28 编辑选项弹窗移动端全屏与固定底部按钮

- 模块：跨模块（Collection 商品卡、index-product-tabs 的 product-item、Product Detail 的 product-edit-option 弹窗）
- 状态：完成（仅静态检查；未做浏览器或线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`；未提交、未推送、未发布
- 批准依据：用户 2026-11-28 在确认问题中选择“按方案实施（推荐）”，批准前已提交方案
- 批准范围：`snippets/product-edit-option.liquid`、`assets/style.css` 中该弹窗的布局样式及文档；不含 `product-update-popup`、购物车弹窗、JS、schema、后台配置

## 目标与源码证据

- 集合页卡片 `product-collection` 与 index-product-tabs 的 `product-item` 使用同一 Add 按钮（`.form-btn.popup-atc .btn-atc[data-popup-handle]`），由 `main.js` 的文档级委托加载商品页弹窗：`snippets/product-collection.liquid` L243–245、`snippets/product-item.liquid` L254–255、`assets/main.js` L1110–1135。
- 弹窗 HTML 来源为 `sections/main-product.liquid` L915–921 与 `templates/product.popup.liquid` L2–7，二者均渲染 `snippets/product-edit-option.liquid`；AJAX 结果注入 `#ajaxProductEditPopupHost` 内的 `.ajax-popup-wrap.popup-container`，模态根仍为 `.product-update.popup-modal`（`assets/main.js` L615–631）。
- 原样式 `.popup-modal .popup-content` 已是 `max-width:600px`、绝对定位居中（`assets/style.css` 原 L1574–1594）；`.popup-container` 以 `max-height:70vh; overflow-y:scroll` 承担滚动（原 L1614–1621），Add To Cart 位于滚动区内部，内容长时需滚到底。
- 移动端原规则 `.popup-modal.product-update .popup-content { width: calc(100% - 40px); }`（原 L1869–1871）仍是浮层卡片。
- `snippets/product-update-popup.liquid` 是购物车行编辑弹窗，价格取 `item`、初始数量为 `item.quantity`、多一个 ADD MORE，并内联在 `main-cart`／`popup-cart`；与本次两个入口不是同一条渲染链路，未纳入修改。

## 实际变更

1. `snippets/product-edit-option.liquid` L3：`.popup-content` 增加 `edit-option-popup` 类，仅用于隔离本弹窗的新布局，避免影响购物车 `product-update-popup` 及其他 `.popup-modal`。
2. `assets/style.css`：在弹窗基础样式后新增 `EDIT OPTION POPUP` 段。
   - 桌面：`.popup-content.edit-option-popup` 使用纵向 flex、`max-width:600px`、`max-height:90vh/90dvh`；`.popup-header` 固定；`.popup-container` 改为 flex 列并取消自身滚动；`.product-update-item` 成为唯一滚动区；`.bottom-container` 固定在弹窗底部，白色背景、上边框。
   - `@media (max-width:768px)`（沿用该弹窗现有断点）：`.popup-modal.product-update .popup-content.edit-option-popup` 改为 `position:fixed; inset:0; width:100%; height:100dvh`（保留 `100vh` 回退）、`max-height:none; margin:0; border-radius:0`；头部加 `safe-area-inset-top`，底部按钮容器加 `safe-area-inset-bottom`；容器上下 padding 清零。
3. `docs/refactoring/README.md`：新增本日志索引。

未改动 `assets/main.js`、`sections/main-product.liquid`、`templates/product.popup.liquid`、购物车弹窗与任何 schema；加购事件仍由 `main.js` 文档级委托处理，不依赖按钮所在滚动层级。

## 验证

- `git diff --check`：通过，无空白错误。
- `assets/style.css` 花括号静态计数：`{` 418／`}` 418，平衡。
- 检索确认 `edit-option-popup` 仅出现在 `snippets/product-edit-option.liquid` 与新 CSS 段，未命中购物车弹窗。
- 静态核对选择器作用域：新规则均以 `.popup-content.edit-option-popup` 为基准，未匹配 `.main-cart`／`#popup-cart` 的 `product-update-popup`。
- 未启动浏览器、未做响应式视觉或真实加购测试；`100dvh`、`env(safe-area-inset-*)`、flex 滚动高度行为属于静态判断。

## 文档与决策

- 新增本日志并在知识库入口索引；本次仅布局与样式，不改变模块职责、数据流或跨模块契约，未新增 ADR，未更新模块 architecture／files。
- 购物车弹窗差异已在本日志记录，后续若要求统一布局需另行批准。

## 风险、回退与遗留

- 风险：移动端改用 `position:fixed` 全屏，浏览器地址栏收放时以 `100dvh` 为准；极矮横屏下商品区可滚动、底部按钮仍固定，但可视商品区较小。桌面最大高度为 90vh，超出时仅商品区滚动。
- 回退：删除 `snippets/product-edit-option.liquid` 的 `edit-option-popup` 类与 `assets/style.css` 的对应两段规则即可，无需回退 JS。
- 遗留：未在真实主题中验证弹窗在 iOS／Android 的安全区、软键盘及长变体列表下的表现；等待用户审核后再决定是否发布或扩展至购物车弹窗。

## 后续

2026-11-28 后续：用户另行批准购物车行内编辑弹窗（`product-update-popup`）的同类改造，并选择只固定 Add To Cart；见 [购物车行内编辑弹窗移动端全屏与固定购买按钮](2026-11-28-cart-edit-popup-layout.md)。本日志中“购物车弹窗不变”仅指当时任务范围。

