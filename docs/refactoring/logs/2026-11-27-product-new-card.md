# 2026-11-27 产品卡片重构（product-new-card）

- 模块：跨模块（collection / product / 全局卡片）
- 状态：部分完成（P1 组件与集合页开关已实现，待预览主题验收）
- 环境／源码基线：`D:\zyl\theme-venustas`，commit `138d1ec`，未提交
- 批准依据：用户 2026-11-27 方案消息及随后补充的 Figma 链接与交互要求；计划在会话中批准
- 批准范围：新增卡片/弹窗/价格/特性/色板 snippet、公共选项面板样式、卡片 CSS/JS、`product.quick-add` 模板、集合页开关、文档更新；旧卡片不删除

## 目标与源码证据

旧卡片由 `snippets/product-item.liquid`、`snippets/product-collection.liquid`、`snippets/search-product-item.liquid` 三份高度重复实现组成；色板、价格、角标、促销、收藏、加购分别依赖 `main.js`、`popup-cart.js`、Swym、Okendo。详见 `docs/refactoring/product-card.md` §3–§8。

Figma：卡片 `6464:15704`、桌面 quick add `6472:18146`、移动端 `6479:22860`。

## 实际变更

新增：`product-new-card`、`product-new-card-media`、`product-new-card-quick-add`、`product-new-card-swatches`、`product-new-card-price`、`product-new-card-features`、`product-new-card-quick-add-dialog`、`templates/product.quick-add.liquid`、`assets/product-new-card.css`、`assets/product-new-card.js`、`assets/product-option-panel.css`。

修改：`layout/theme.liquid`（资源加载）、`sections/main-collection.liquid`（`product_card_style` 开关，默认 classic）、`sections/product-nav-new.liquid`（panel 公共类 + 迁移样式 + 价格覆盖）、`snippets/nav-product-variant.liquid`（可选 `show_color_new`，默认关闭）。

偏差：计划中“价格复用现有 snippet”改为按用户要求新建 `product-new-card-price`；其余按计划执行。

## 验证

- `node --check assets/product-new-card.js` 通过。
- `main-collection` schema 提取 `JSON.parse` 通过。
- Liquid 标签与 CSS 花括号计数平衡（静态）。
- 未执行浏览器、Theme Check、真实商品数据和线上预览。

## 文档与决策

- 更新 `docs/refactoring/product-card.md`，追加 §16 实施记录与已知限制。
- 未新增 ADR；公共样式抽取（`product-option-panel.css`）属于重构取舍，记录在本日志与卡片档案。

## 风险、回退与遗留

- 风险：nav 移动端弹窗依赖迁移后的公共样式，需预览回归；弹窗内尺码表依赖全局 `size-chart-component.js`；`Intl.NumberFormat` 与主题 money 格式可能存在细微差异。
- 回退：集合页切回 `Classic`；或移除 `theme.liquid` 新资源引用。
- 遗留：其它 section（首页 tabs、推荐位、搜索、文章等）尚未接入；旧卡片删除未执行；浏览器验收待用户完成。
