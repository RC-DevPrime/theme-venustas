# 2026-11-28 商品编辑弹窗恢复 Standard／Tall 尺码切换

- 模块：Product Detail（`product-edit-option` 编辑弹窗与 `main.js` 弹窗逻辑）
- 状态：完成（仅静态检查；未做浏览器或线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\master\theme-venustas`，分支 `master`，基线 commit `992020e`；未提交、未推送、未发布
- 批准依据：用户 2026-11-28 提供 “Size : L / Standard / Tall” 截图并说明 `product-edit-option.liquid` 缺该区分、`product-update-popup` 已有；在本次定位后的确认中选择“A. 复用购物车弹窗的 JS 切换”
- 批准范围：`assets/main.js` 的 AJAX 商品弹窗初始化、对应文档；不改两个弹窗的 Liquid、不改购物车弹窗现有逻辑、不改 CSS、不改 `product-size-toggle.liquid`

## 目标与源码证据

- 两个弹窗的选项结构一致：`snippets/product-edit-option.liquid:90` 与 `snippets/product-update-popup.liquid:90` 都 `render 'edit-product-variant'`；该 snippet 只输出 `fieldset.variant-size` 与 `.nav-variants-selector`，没有 Standard／Tall 标记。
- 购物车弹窗：`assets/main.js:1147` 的 `CART_SCOPES = ['.main-cart', '#popup-cart']`，点击 `.update-btn` 后 `initPopupItem` → `initVariantTypeToggleForItem`（`assets/main.js:1309`）按选项值是否含 `LT` 在 legend 后插入 `.variant-type-toggle` 并显示／隐藏对应尺码。
- 商品弹窗：`sections/main-product.liquid:915` 输出 `#productEditPopupHTML`，集合／搜索／活动卡片的 `.popup-atc` 按钮由 `assets/main.js:1110` 触发 `loadPopupFromProductPage` 拉取 `?view=popup`（`templates/product.popup.liquid`）后注入 `#ajaxProductEditPopupHost`；`openPopup` → `refreshPopupVariantUI`（`assets/main.js:885`）只处理可用状态与兜底选中，从未初始化尺码切换。
- 旧路径同样不覆盖该弹窗：`assets/product.js:3304` 的 `.variant-size` 初始化被 `if (enabled_option_indicator)`（`product.metafields.custom.size_option_indicator`）门控，且只在 `document.ready` 处理当时 DOM，AJAX 注入的弹窗不会被再处理。
- 历史残留证明该功能曾在本地存在但未进入 `master`：`snippets/product-size-toggle.liquid` 当前无任何 `render`；`sections/main-product.liquid:915` 的 `data-size-option-indicator` 与 `layout/theme.liquid:412-420` 的 `standardSizes`／`tallSizes` 无消费方；带 `{% render 'product-size-toggle' %}` 与 `customElements.define('product-size-toggle')` 的版本只存在于分支 `feature/test` 的 commit `166c1b8`（`git merge-base --is-ancestor` 返回非 0，`master` 未合入）。

## 实际变更

1. `assets/main.js`：新增 `initPopupSizeToggle($popup)`，在 `openPopup` 中先于 `refreshPopupVariantUI` 调用。逻辑与购物车弹窗一致：仅处理第一个 `fieldset.variant-size`；值含 `LT`（不区分大小写）归为 Tall；无 Tall 值时不插入任何按钮；否则在 legend 后插入 `.variant-type-toggle`（Standard／Tall），按类型显示／隐藏 `.nav-variants-selector` 及其 `.nav-variants-option`，并调用 `refreshPopupVariantUI` 补选可用尺码。
2. 同文件补充两处防御：事件用 `.off('click.popupSize')`／`.on('click.popupSize')` 命名空间绑定，缓存弹窗重复打开不会叠加处理器；切换后若该类型下没有可购买的可见尺码，则回退到上一个类型，避免 `variantMatchesSelections` 在缺少 Size 选择时匹配到被隐藏的错误尺码并加购。
3. 文档：新增本日志；`modules/product-detail/architecture.md` 补充两条弹窗尺码切换路径与 `product-size-toggle.liquid` 未被引用的现状。

## 验证

- `node --check assets/main.js` 通过（exit 0）；`git diff --check` 无空白错误。
- 静态核对：`initPopupSizeToggle` 只被 `openPopup` 调用，未影响购物车 `CART_SCOPES` 分支；注入结构与购物车弹窗同名同 class，`popup-cart.css:231-254` 的 `.popup-container .variant-type-toggle` 规则对 AJAX 弹窗外层 `ajax-popup-wrap popup-container` 生效。
- 静态推演：初始类型取当前选中尺码（`.selected` 优先，其次 `checked` radio）；切 Tall 时隐藏标准码并清除其 `.selected`，`ensureValidSelections` 从 `:visible` 且未 disabled 的选项中补选；无候选则回退。
- 未启动浏览器，未验证真实商品（LT／XLT 等命名、部分尺码售罄）、移动端样式与加购结果。

## 文档与决策

- 新增本日志；更新 [product-detail/architecture.md](../modules/product-detail/architecture.md) 的变体段落；知识库入口增加索引。
- 只复用既有 `.variant-type-toggle` 机制，不恢复 `feature/test` 的 custom element 方案，不改数据结构，不新增 ADR。

## 风险、回退与遗留

- 风险：尺码类型判定沿用现有规则“选项值含 `LT`”，若商品使用 `TALL` 等不含 `LT` 的写法不会分组；与购物车弹窗保持一致，未单独扩展。
- 风险：弹窗内价格／主图是否随切换刷新取决于现有 `refreshPopupVariantUI`，本次未改动；如需同步刷新应另批。
- 遗留：`snippets/product-size-toggle.liquid`、`data-size-option-indicator`、`theme.liquid` 的 `standardSizes`／`tallSizes` 仍是未使用残留，本次保留未清理。
- 回退：还原 `assets/main.js` 本次差异即可，Liquid 无改动。
