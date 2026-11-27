# 2026-11-27 促销行空值礼卡兜底与状态配色

- 模块：Product Detail（共享促销组件）／Collection（两类商品卡片）
- 状态：完成（静态核对）
- 环境／源码基线：本地 `D:\zyl\theme-venustas`；未连接线上主题、未提交
- 批准依据：用户在 2026-11-27 会话中批准"促销行空值礼卡兜底与状态配色"方案（含所有位置显示），随后明确要求统一使用 gift-guide 文案 `Free $20 Gift Card Orders $200+`
- 批准范围：`product-nav-promotion` 分支与颜色、`product-card-promotion` 去掉空值保护、对应文档；不含 JSON／JS／后台配置

## 目标与源码证据

目标：`product.metafields.promo.cart_discount_text` 为空时展示礼卡促销行，并按空／非空切换颜色与图标。

- 改前 `product-nav-promotion` 在折扣价无法计算时把文案替换为 `fallback_text`，未传则整行 `hidden`（原 L39–43、L43 根节点）。
- `heating-icons` 已有 `gift` 图标（L62–65，`currentColor` 描边），无需新增 SVG。
- 三个消费方各有作用域颜色：`product-nav-new.liquid` L149–150（`#1a1a1a`）、`gift-guide-collection.liquid` L162–164（fallback 文字用品牌色）、`assets/style.css` L1205（卡片图标色）。
- `product-card-promotion` 改前仅在 metafield 非空时 render，卡片不会出现空值兜底。
- `gift-guide-collection.liquid` L376 原显式传 `fallback_text: 'Free $20 Gift Card Orders $200+'`；按用户"全部统一"要求改为使用组件默认文案，该参数已移除。

## 实际变更

1. `snippets/product-nav-promotion.liquid`
   - 分支改为按 metafield 文案是否为空判断：为空 → `fallback_text` 或默认 `Free $20 Gift Card Orders $200+`、图标 `gift`、颜色 `#1E7A46`；非空 → 保留元字段文案、图标 `promotion-tag`、颜色 `#FF5F00`。
   - 删除"折扣价为空即替换为 fallback_text"的旧逻辑：元字段存在但格式无法解析时保留原文案（不再被礼卡文案覆盖）。
   - 根节点内联 `style="color: {{ promotion_color }}"`，图标与文字节点内联 `color: inherit`，用于覆盖三处 section 作用域颜色，未使用 `!important`、未改各 section 样式块。
   - 根节点不再输出 `hidden`（默认文案恒存在）。
2. `snippets/product-card-promotion.liquid`
   - 移除 metafield 空值保护，所有卡片（`product-item` 与 `product-collection`）都输出促销行；空值显示绿色礼卡文案。
3. 文档：本日志；`collection/files.md`、`product-detail/files.md` 行号与依赖更新；知识库入口新增条目；上一条同主题日志追加替代说明。

## 验证

仅静态核对：

- 读取改动后 Liquid：`if`／`elsif`／`endif` 与 `liquid` 块闭合正常；空值分支在折扣计算之后执行，不影响折扣价。
- 空值路径 `promotion_discount_price == blank`，不输出价格 span，文案经 `escape`。
- `variant`／`uid`／`fallback_text` 缺省回退保持原行为；全站文案统一后 gift-guide 不再单独传文案。
- 内联样式优先于 `#shopify-section-...` 规则和 `[data-promotion-fallback]` 规则；图标与文字使用 `inherit`。
- 未执行浏览器、构建或主题检查（仓库无相关脚本／配置）；未验证各页面实际换行与溢出。

## 文档与决策

- 更新 [collection/files.md](../../modules/collection/files.md)、[product-detail/files.md](../../modules/product-detail/files.md) 的 snippet 依赖行号。
- 更新 [README.md](../../README.md) 条目；上一条日志 [2026-11-27-product-card-promotion.md](2026-11-27-product-card-promotion.md) 补充后续说明。
- 不新增 ADR：属共享组件的展示分支与配色调整，数据契约未变。

## 风险、回退与遗留

- 商品页导航所有商品现在都显示促销行（无元字段时为绿色礼卡文案），不再只在有促销时出现。
- `product-nav-new` 的促销行保持 `white-space: nowrap`（L149），文案变长后在窄屏可能溢出；卡片区域允许换行。
- `gift-guide-collection` 空值时由原红色文案变为绿色，文案统一为 `Free $20 Gift Card Orders $200+`；该 section 不再单独维护文案。
- 内联颜色会覆盖各 section 后续对促销行的颜色定制。
- 回退：恢复 `product-nav-promotion` 旧分支与根节点 `hidden`、恢复 `product-card-promotion` 空值保护即可。
- 遗留：未验证 metafield 实际填写格式与各页面视觉效果；等待下一步授权，不自动提交、推送或发布。

2026-11-27 后续：本日志的空值兜底与"非空 #FF5F00"统一配色已失效，改为按元字段前缀分支（Extra／Free／其它，空值不显示），并新增商品页导航折后价实时重算；详见 [促销行前缀分支与选中变体折扣价](2026-11-27-product-promotion-prefix-logic.md)。
