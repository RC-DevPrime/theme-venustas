# 2026-11-27 商品卡片底部促销行

- 模块：Collection（共享卡片、主集合网格）／Product Detail（复用 `product-nav-promotion`）
- 状态：完成（静态核对）
- 环境／源码基线：本地 `D:\zyl\theme-venustas`；未连接线上主题、未提交
- 批准依据：用户在 2026-11-27 会话中批准"合并方案：两类商品卡片底部促销行"（含主集合网格）
- 批准范围：`product-item` 与 `product-collection` 两类卡片、`product-nav-promotion` 可选参数、`heating-icons` 可选 `uid`、`style.css` 卡片样式、对应文档；不含 JSON／JS／后台配置

## 目标与源码证据

目标：在商品卡片最底部（价格／Add 行之下）展示促销信息，复用现有促销组件。

- `snippets/product-item.liquid`：`.bottom` L188，价格／加购位于 `.footer-details` L191–273，此前无底部内容。
- `snippets/product-collection.liquid`（主集合网格，`main-collection.liquid` L724 调用）：`.product-details` L107 直接包含 `.inner-c` L108–168 与 `.footer-details` L169–257，无 `.bottom`。
- 两卡价格基准均为 `product.price_min`（L193／L171），而促销 snippet 原用 `selected_or_first_available_variant`（原 L11）。
- `snippets/product-nav-promotion.liquid` 已封装 metafield 解析、折扣价计算与无促销 `hidden`，`gift-guide-collection` L376 已有复用先例。
- `product-nav-new.liquid` L149–152 与 `gift-guide-collection.liquid` L166–187 的促销样式均为 section 作用域，卡片内无样式。
- `heating-icons` 的 `promotion-tag` clipPath id 原仅用 `section.id`（原 L102/L106），同一 section 多卡片会重复 id。
- `assets/style.css` 由 `layout/theme.liquid` L256 全局加载；`.product-item .product-details` 为 column + `space-between`，`.inner-c` 有 `flex:1`（L1160–1170），`.footer-details` 之后的元素自然位于卡片底部。
- 主集合商品列表由 `collection.js` 的 `filterCollection` 整段替换 `.main-collection-product-list` HTML，促销行随服务端 section HTML 生成，无需改 JS。

## 实际变更

1. 新增 `snippets/product-card-promotion.liquid`：metafield 为空时不输出；按 `product.variants | sort: 'price' | first` 取最低价变体；调用 `product-nav-promotion` 并传 `variant`、`uid: product.id`。
2. `snippets/product-nav-promotion.liquid`：`selected_variant = variant | default: product.selected_or_first_available_variant`（旧调用不变）；图标 render 透传 `uid`；注释补充两个可选参数。
3. `snippets/heating-icons.liquid`：`promotion-tag` 的 clipPath id 支持可选 `uid` 后缀，未传时输出与改前一致。
4. `snippets/product-item.liquid`：`.footer-details` 之后、`.bottom` 内新增一次 `product-card-promotion` render（L273）。
5. `snippets/product-collection.liquid`：`.footer-details` 之后新增一次 render（L258）。
6. `assets/style.css`：PRODUCT ITEM CARD 区块新增 `.product-item .product-nav-new__panel-promotion`（flex 换行、gap 4px、12px/600、`#1a1a1a`、`margin-top:6px`）、`[hidden]`、图标 14px 与 svg 铺满规则（L1186–1211）。
7. 文档：本日志；`collection/files.md`、`product-detail/files.md`、`project/module-map.md`、`collection/known-issues.md` 增量更新。

与原方案一致，无追加范围。促销价按最低价变体计算，与卡片 `price_min` 基准对齐。

## 验证

仅静态核对：

- 逐行读取改动后的 Liquid：`liquid`／`if`／`render` 标签闭合正常，两处插入点均在 `.footer-details` 之后、父容器闭合之前。
- `variant` 未传时 `default` 回退原表达式；`uid` 未传时 clipPath id 与原输出一致。
- CSS：`[hidden]` 选择器特异性高于基础规则且位于其后，可覆盖 `display:flex`；无 `!important`、无全局 reset。
- `product-card-promotion` 仅在 metafield 非空时输出，无促销商品不产生可见占位。
- 未执行浏览器、构建、主题检查（仓库无 `package.json`／`.theme-check.yml`／`shopify.theme.toml`）；未验证线上 metafield 数据分布与实际渲染。

## 文档与决策

- 更新 [collection/files.md](../../modules/collection/files.md)：新增 `product-card-promotion` 行，更新两卡依赖。
- 更新 [product-detail/files.md](../../modules/product-detail/files.md)：`product-item` 依赖与 `product-nav-promotion` 的图标行号。
- 更新 [module-map.md](../../project/module-map.md)：说明两类卡片共用促销行，但组件仍不可互换。
- 更新 [collection/known-issues.md](../../modules/collection/known-issues.md) C-003 状态。
- 不新增 ADR：属于现有组件复用与可选参数扩展，未改变架构或数据契约。

## 风险、回退与遗留

- 风险：卡片高度增加；同一网格仅部分商品有促销时，行内卡片排布可能变化（静态未验证）。
- 风险：`price_min` 与最低价变体在存在不可售变体时可能不同，促销价与 "From" 价仍有边缘差异。
- 风险：长促销文案在窄卡片换行占两行。
- 风险：`product-item` 被 18 个 section 复用，推荐位、campaign、xmas、article、quiz、comparison 等卡片均会出现促销行。
- 回退：删除两处 render、`assets/style.css` 中 4 条规则及 `product-card-promotion.liquid`；`variant`／`uid` 参数向后兼容，可保留。
- 遗留：未验证商品 `promo.cart_discount_text` 的实际填写格式与线上覆盖比例；未做浏览器／移动端实测。等待下一步授权，不自动提交、推送或发布。

2026-11-27 后续：空值兜底改为显示礼卡文案（原"空值不输出"已失效），`product-item`／`product-collection` 卡片均会输出促销行；详见 [促销行空值礼卡兜底与配色](2026-11-27-product-card-promotion-fallback.md)。
