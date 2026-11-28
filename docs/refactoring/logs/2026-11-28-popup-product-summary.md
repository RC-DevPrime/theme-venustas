# 2026-11-28 编辑弹窗商品信息区：价格、特性与促销行

- 模块：跨模块（Product Detail、Collection 商品卡弹窗、Header／购物车行内编辑弹窗）
- 状态：完成（仅静态检查；未做浏览器或线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`；未提交、未推送、未发布
- 批准依据：用户 2026-11-28 要求“两个弹窗主图继续优化，主图右边展示标题、价格、特性值、折扣价”，确认“保留现有大图与列结构”“temperature · custom_tag”“移除 Save 标签”并批准实施；随后要求“购物车弹窗改为行总价（更适合、主流做法）”
- 批准范围：`snippets/product-edit-option.liquid`、`snippets/product-update-popup.liquid` 的信息区标记，`assets/style.css` 的弹窗信息区样式，`assets/main.js` 中购物车弹窗的价格刷新，及文档；不改图片结构、变体与数量位置、schema

## 目标与源码证据

- 两个弹窗结构相同：图片 4/12 列 + 右侧 8/12 列（标题、价格、变体、数量）。见 [product-edit-option.liquid:18](../../../snippets/product-edit-option.liquid#L18)、[product-update-popup.liquid:18](../../../snippets/product-update-popup.liquid#L18)。
- 编辑弹窗价格原用 `product.final_line_price`、`product.quantity`、`product.total_discount`，这些是 line item 字段，`product` 对象上取不到值；购物车弹窗原用 `item.final_line_price` 等行字段。
- `assets/main.js` L1234–1261：变体切换时更新 `.product-price .final .money`、`.original .money` 与 `.product-featured-image img`；原标记没有 `.money`，切换变体价格不刷新。该价格刷新只在 `.main-cart`／`#popup-cart`（购物车弹窗）作用域绑定，不影响商品页弹窗。
- `assets/popup-cart.css` L255–284：`.product-price` 为 `text-align:right`、18px/600，`.original` 16px/500 `#999`；弹窗内需覆盖为左对齐、24px/700。
- `snippets/product-card-promotion.liquid` → `product-nav-promotion.liquid`：输出 `.product-nav-new__panel-promotion`，尺寸与图标样式只在 `product-nav-new` 的 scoped `{% style %}` 内，弹窗原本没有对应样式。
- 移动端摘要为 float + `display:contents` 重排（`assets/style.css` L2024 起），新增行需同样右移 110px 才能与标题、价格对齐。
- 设计稿（用户提供 551×115 预览）只有标题、价格、划线价、特性、促销四行；Figma MCP 无桌面会话，未读取原始节点，字号按稿近似取 24/14/14。

## 实际变更

1. `product-edit-option.liquid` 价格区：`active_variant.price` 单价，`price_varies` 为真时输出 `.price-from` 的 `From `；`active_variant.compare_at_price > price` 时显示划线价，否则 `.original` 带 `hidden`；删除 Save 计算与 `.discounted`。
2. `product-update-popup.liquid` 价格区：行总价 `item.final_line_price`，行划线价 `item.quantity × active_variant.compare_at_price`；行总价是确定值，不加 `From`；同样保留 `.final .money`、`.original .money`，无 compare 时 `.original` 带 `hidden`。
3. 两个 snippet 在价格后新增特性行 `.product-popup-features`：`product.metafields.custom.temperature` 与 `custom_tag`（`.value | default: ... | strip_html | strip`），存在时用 ` · ` 连接，都为空不输出；之后 `{% render 'product-card-promotion', product: product %}`，空促销 metafield 时片段自身不输出。
4. `assets/main.js`：
   - `updatePriceImageForPopup` 改为接收当前 `.product-update-item`，价格、划线价、图片都在该 item 内查找（原实现取整个弹窗第一个，ADD MORE 多个商品时会更新错行）；新增 `quantity` 参数，价格与划线价都乘以数量（默认 1）；
   - `refreshItemState` 传入当前 item 与 `.nav-quantity__input` 值；
   - `initPopupItem` 新增 `.nav-quantity__input` 的 `change` 监听，数量增减时立即按当前变体重算行总价。
5. `assets/style.css` 新增 `POPUP PRODUCT SUMMARY` 段（约 L1697）：价格左对齐、baseline 对齐、24px/700 红 `#B93205`，划线价 14px/500 `#999` 并补 `[hidden]{display:none}`，特性 14px `#515151`，促销 14px/600、图标 16px；`max-width:768px` 段补充特性/促销 `margin-left:110px`、12px 字号、14px 图标。
6. 文档：新增本日志；更新 product-detail 与 header 的 files 清单、知识库入口。

## 验证

- `node --check assets/main.js` 通过。
- `assets/style.css` 花括号静态计数 468／468；两个 snippet 的 `{{ }}`、`{% %}` 计数平衡（10/10、21/21 与 11/11、21/21）。
- 静态核对选择器契约：`.product-price .final .money`、`.original .money`、`.product-featured-image img`、`fieldset.variant`、`.product-update-item`、`.nav-quantity__input` 均存在。
- 静态推演：编辑弹窗 `price_varies` 输出 From；购物车弹窗行总价随变体与数量重算；无 compare 时划线价带 `hidden`，jQuery `.show()` 可移除隐藏；temperature／custom_tag 单个为空不输出多余分隔符；促销 metafield 为空时无促销行。
- 未启动浏览器、未在主题编辑器或线上预览验证；24/14/14 字号与 551×115 稿为目测近似，未读取 Figma 原始数值。

## 文档与决策

- 新增本日志；更新 [product-detail/files.md](../modules/product-detail/files.md)、[header/files.md](../modules/header/files.md) 的 snippet 依赖行，知识库入口增加索引。
- 购物车弹窗价格基准由单价改回行总价（用户确认），属本次范围内的调整；不新增 ADR。

## 风险、回退与遗留

- 风险：购物车弹窗行总价初始值来自 `item.final_line_price`（含行折扣）；切换变体后 main.js 以“变体价 × 数量”重算，原行折扣不会带入，显示可能与换变体前的折后合计略有差异。
- 风险：编辑弹窗切换变体时 main.js 只替换 `.money` 文本，`From` 前缀仍保留，可能出现“From + 具体变体价”。
- 风险：main.js 用 `Shopify.formatMoney` 更新价格时不含 CAD 的 `C` 前缀（沿用其既有行为，非本次引入）。
- 风险：促销行复用 `.product-nav-new__panel-promotion` 类，后续改动 product-nav-promotion 结构需同步弹窗样式。
- 回退：还原两个 snippet、`assets/style.css` 与 `assets/main.js` 本次差异即可。
- 遗留：未在真实弹窗中验证移动端 float 与新增行对齐、长促销文案换行、多商品 ADD MORE 场景。
