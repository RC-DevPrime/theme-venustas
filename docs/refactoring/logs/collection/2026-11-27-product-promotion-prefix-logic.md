# 2026-11-27 促销行按前缀分支与选中变体折扣价

- 模块：Product Detail（共享促销组件、商品页导航）／Collection（两类商品卡片）
- 状态：完成（静态核对）
- 环境／源码基线：本地 `D:\zyl\theme-venustas`；未连接线上主题、未提交
- 批准依据：用户在 2026-11-27 会话中批准"按前缀决定图标／颜色，Extra 用选中变体算价，且商品页导航实时重算"
- 批准范围：`product-nav-promotion` 分支、`product-card-promotion`、`product-nav-new.js` 促销价重算、相关死代码与文档；不含卡片色块实时重算、JSON、后台配置

## 目标与源码证据

目标：元字段为空不显示；`Extra` 开头用促销图标／橙色并按当前选中变体算折后价；`Free` 开头用礼物图标／绿色；其它开头黑色文字 + 礼物图标。商品页切换变体后折后价需实时更新。

- 改前 `product-nav-promotion` 对空值统一输出礼卡文案（`Free $20 Gift Card Orders $200+`），颜色只区分空／非空。
- `product-nav-new.js` 的 `syncAvailability`（L177–198）已在变体／数量变化时用 `variants` JSON 更新导航价格，但不更新促销行。
- 卡片色块点击仅更新隐藏变体 ID 与图片（`main.js` L147–166），卡片主价格不随之变化。
- 礼品集合复用同一 snippet（`gift-guide-collection.liquid` L376），不再传参。
- `heating-icons` 的 `promotion-tag`（L100–107）与 `gift`（L62–65）可分别用于 Extra／Free 及其它。

## 实际变更

1. `snippets/product-nav-promotion.liquid`
   - 前缀判断：`slice 0,5 == 'Extra'`、`slice 0,4 == 'Free'`。
   - `Extra`：`promotion-tag` + `#FF5F00`，沿用 `%`／`$` 解析，价格基准改为 `product.selected_or_first_available_variant`；删除 `variant` 参数与最低价变体逻辑。
   - `Free`：`gift` + `#1E7A46`。
   - 其它非空前缀：`gift` + `#1a1a1a`（文字与图标同为黑色）。
   - 空值：整行不输出（移除 `hidden` 属性与默认礼卡文案、`fallback_text` 参数）。
   - 新增 `data-promotion-type`／`data-promotion-value`（仅折扣价可计算时），供导航 JS 重算。
   - 删除 `data-promotion-fallback`，保留内联颜色以覆盖三处 section 作用域颜色。
2. `snippets/product-card-promotion.liquid`：删除最低价变体计算，只调用 `product-nav-promotion` 并传 `uid`。
3. `assets/product-nav-new.js`：`syncAvailability` 中按 `data-promotion-type/value` 用当前变体价重算 `[data-nav-promotion-discount-price]`，百分比向下取整与 Liquid 整数除法一致，金额下限 0；使用与导航价格相同的 `formatTotal`。
4. 死代码清理：`product-nav-new`、`gift-guide-collection`、`style.css` 的促销行 `[hidden]` 规则，gift-guide 的 `[data-promotion-fallback]` 颜色规则。
5. 文档：本日志；`collection/files.md`、`product-detail/files.md` 行号更新；知识库入口新增条目；上一条兜底日志追加替代说明。

## 验证

仅静态核对：

- Liquid：`if`／`elsif`／`endif` 与 `liquid` 块闭合；空值在输出前直接跳过；前缀切分与原有折扣解析兼容；`escape` 保留。
- JS：`promotion?.` 可选链在促销行不存在时安全返回；`selectedVariant` 为函数级变量；百分比／金额两条重算分支与 Liquid 舍入、下限一致；未改动其他价格与按钮逻辑。
- CSS：删除的选择器仅作用于促销行 `hidden`／fallback，未影响其他节点。
- 未执行浏览器、Liquid 渲染器或 JS 运行验证（仓库无构建／主题检查配置）。

## 文档与决策

- 更新 [collection/files.md](../../modules/collection/files.md)、[product-detail/files.md](../../modules/product-detail/files.md)。
- 更新 [README.md](../../README.md)；[2026-11-27-product-card-promotion-fallback.md](2026-11-27-product-card-promotion-fallback.md) 标注被本逻辑替代。
- 不新增 ADR：组件内展示分支与价格基准调整，数据契约未新增。

## 风险、回退与遗留

- 商品页导航折后价由 JS 重算，CAD 下初始 Liquid 为 `C$xx`、JS 使用 `Intl`（如 `CA$xx`）；导航主价格本身也由同一 JS 格式化，初始化后两处一致。
- 卡片与主集合网格的促销价仍按服务端 `selected_or_first_available_variant` 渲染；卡片色块切换不重算（与卡片主价格不更新的现状一致）。
- 价格变化商品（`price_varies`）卡片主价格用 `price_min`，促销价用首可售变体，仍可能存在差异。
- "其它开头"图标颜色按"与文字同为黑色"实现；如设计要求绿色需另行调整。
- 回退：恢复 `product-nav-promotion` 旧分支与 `hidden`、`product-card-promotion` 的变体参数、删除 JS 重算块即可。
- 遗留：未验证真实元字段文案格式、各页面换行与线上渲染；等待下一步授权，不自动提交、推送或发布。
