# 2026-11-27 商品卡片促销价按卡片展示价计算

- 模块：Collection（商品卡片）／Product Detail（共享促销组件）
- 状态：完成（静态核对）
- 环境／源码基线：本地 `D:\zyl\theme-venustas`；未连接线上主题、未提交
- 批准依据：用户 2026-11-27 消息"对于产品卡片，折扣价产品卡片展示的价格来计算折扣价"
- 批准范围：`snippets/product-card-promotion.liquid` 的价格基准、`snippets/product-nav-promotion.liquid` 的可选价格参数与输出；不含导航 JS、gift-guide 卡片、后台配置

## 目标与源码证据

问题：卡片显示 `From $129.99`，促销行却按首可售变体 `$139.99` 算 30% 得到 `$97.99`，两者不一致。

- `snippets/product-item.liquid`（原 L193）与 `snippets/product-collection.liquid`（原 L171）：卡片价格 `display_price = product.price_min`，`product.price_varies` 为真时显示 `From`，否则显示 `selected_or_first_available_variant.price`。
- `snippets/product-card-promotion.liquid` 只把 `product` 传给促销组件，未传价格。
- `snippets/product-nav-promotion.liquid` 折扣计算使用 `selected_variant.price`，与卡片的 `price_min` 基准不一致。
- 促销组件此前已被用户加入 `product.price_varies` 时输出 `From` 的逻辑。

## 实际变更

1. `snippets/product-card-promotion.liquid`
   - 计算卡片展示价：`price_varies` 时用 `product.price_min`，否则用 `selected_or_first_available_variant.price`。
   - 通过 `price` 参数传给 `product-nav-promotion`。
2. `snippets/product-nav-promotion.liquid`
   - 新增可选 `price` 参数：`promotion_base_price = price`，为空回退 `selected_variant.price`；百分比／金额折扣都改用该基准。
   - 保留 `product.price_varies` 时在折后价前输出 `From `；清理了原手写换行造成的多余空白。
   - 商品页导航、gift-guide 等未传 `price` 的调用方行为不变。

## 验证

仅静态核对：

- 算术：`$129.99 × 70% = 90.993 → 9099 分 → $90.99`（Liquid 整数除法），与卡片 `From $129.99` 对齐。
- `price` 未传 / 为空时回退选中变体价；`price_varies` 为真时继续输出 `From`。
- `product-card-promotion` 的 8 行 Liquid 与 `render` 标签闭合；schema 未改动。
- 未执行浏览器或主题检查；未验证真实商品的 `price_min` 与卡片实际渲染。

## 文档与决策

- 本日志；`collection/files.md`、`product-detail/files.md` 的行号更新；知识库入口新增条目。
- 不新增 ADR：属现有组件的价格基准参数化。

## 风险、回退与遗留

- `price_min` 可能来自不可售变体，卡片本身也使用该值，促销价与之保持一致；若后续改用别的展示价，两侧需一起调整。
- gift-guide 卡片不使用 `product-card-promotion`，仍按选中变体价计算；其自身价格也是 `product.price`，不受本次影响。
- 商品页导航未传 `price`，仍按选中变体价；当前 `assets/product-nav-new.js` 没有促销价重算逻辑，修改价格基准不会引入新的运行时差异。
- 回退：删除 `price` 参数与 `promotion_base_price`，恢复使用 `selected_variant.price` 即可。
- 遗留：未浏览器实测；未提交、未推送、未发布。
