# 产品卡片重构档案（product card）

> 状态：**P1 已实施（新组件 + 集合页开关），待预览主题验收**
> 基线：commit `138d1ec`（2026-11-27），实施日期 2026-11-27；仅静态检查，未启动浏览器、未做线上验证。
> 用途：本文件是产品卡片重构的**唯一参考文档**。旧卡片（`product-item` / `product-collection` / `search-product-item`）本次**不删除**，新卡片并行落地。

---

## 1. 结论摘要

现产品卡片不是"一个组件"，而是 **3 份高度重复的 Liquid 样板**（约 85%~90% 相同）、**4 个全局 CSS 来源**、**2 套 jQuery 事件约定**（`main.js` + `popup-cart.js`）拼起来的集合：

| 现状 | 影响 |
| --- | --- |
| `product-item`、`product-collection`、`search-product-item` 三份复制 | 改一处必须同步三处；已经出现行为漂移（见 §8.1） |
| 卡片类名 `.product-item` 被 JS/CSS/第三方应用当成钩子 | 不能直接改类名，否则色板、加购、弹窗、Swym 全部失效 |
| 样式分散在 `style.css`、`res-product-item.css`、`collection.css`、section 内联 `<style>` | 层叠顺序决定外观，存在大量被覆盖的死规则 |
| 无 section 级卡片设置（唯一传入的 `sale_badge_type` 还被组件内部覆盖） | 商家无法按页面控制卡片表现 |

**目标形态**：新增单一样板 `snippets/product-new-card.liquid` + `assets/product-new-card.css`（+ 必要的小型 `product-new-card.js`），类名前缀 `product-new-card`，旧卡片原样保留，用 section 设置逐页切换；验证通过后再谈删除旧卡片。

---

## 2. 范围

### 2.1 本次重构范围

- `snippets/product-item.liquid`（网格/滑块通用卡，调用点最多）
- `snippets/product-collection.liquid`（集合页专用，`product-item` 的复制变体）
- `snippets/search-product-item.liquid`（搜索结果卡，同样是复制变体）
- 它们依赖的：`product-variant-colors`、`product-badge`、`sale-badge`、`product-card-promotion`、`product-nav-promotion`、`okendo-reviews-product-rating-summary`

### 2.2 明确不在本次范围（后续可选复用新卡）

| 文件/位置 | 说明 |
| --- | --- |
| `snippets/product-media.liquid` | 商品详情页主图/角标，不是卡片 |
| `snippets/comp-product-item.liquid` | 详情页对比模块专用，`product.css` 独立样式 |
| `snippets/row-product-item.liquid` | `campaign-row-product-list` 横向商品行 |
| `snippets/reward-product-item.liquid` | 积分/奖励模块商品 |
| `snippets/tab-product-item.liquid` | **当前无任何引用**，疑似历史遗留 |
| `sections/gift-guide-*.liquid` 内建卡片 | 自建标记 + `sale-badge`，不走 `product-item` |
| 预测搜索 `.popular-product-item` | 独立结构，样式在 `style.css` |
| `snippets/header-new-product-card.liquid` | Header 活动位袖珍卡，已是新写法，可直接作为参考 |

---

## 3. 调用点清单

### 3.1 `product-item`（网格 / 滑块）

| 调用方 | 行 | 传入参数 |
| --- | --- | --- |
| `sections/index-product-tabs.liquid` | 51 | `sale_badge_type`、`badge_detail`、`section`、`image_loading`、`image_fetchpriority`、`image_sizes` |
| `sections/index-tab-product-list.liquid` | 26 | `sale_badge_type`、`badge_detail`、`section` |
| `sections/product-recommendation.liquid` | 120 | `sale_badge_type`、`badge_detail` |
| `sections/collection-products-recommendation.liquid` | 106/112 | 同上 |
| `sections/cart-products-recommendation.liquid` | 106/112 | 同上 |
| `sections/404-recommendation.liquid` | 101/107 | 同上 |
| `sections/product-quiz.liquid` | 899/1154 | 同上（1154 仅 `product`） |
| `sections/product-comparison.liquid` | 245 | `product` |
| `sections/campaign-tab-product-list.liquid` | 149 | `product` |
| `sections/campaign-large-scale-promotion.liquid` | 267 | `sale_badge_type`、`badge_detail` |
| `sections/campaign-flash-sale.liquid` | 550 | 同上 |
| `sections/for-her-bestsellers-slider.liquid` | 189 | `product` |
| `sections/main-article.liquid` | 888/898 | `product` |
| `sections/xmas-weekly-deals.liquid` | 159 | `image_loading`、`image_sizes` |
| `sections/xmas-top-up.liquid` | 44 | `image_loading`、`image_sizes` |
| `sections/xmas-collection-tabs.liquid` | 159 | `image_loading`、`image_sizes` |

### 3.2 `product-collection`

| 调用方 | 行 | 参数 |
| --- | --- | --- |
| `sections/main-collection.liquid` | 724 | `sale_badge_type`、`badge_detail` |

### 3.3 `search-product-item`

| 调用方 | 行 | 参数 |
| --- | --- | --- |
| `sections/main-search.liquid` | 780、907 | `product`、`badge_detail` |
| `templates/search.ajax.liquid` | 13 | `product`、`badge_detail`（AJAX 返回 HTML） |

### 3.4 参数现状

| 参数 | 实际行为 | 证据 |
| --- | --- | --- |
| `sale_badge_type` | **无效**。三个卡片 snippet 开头都 `assign sale_badge_type = 'discount'` 覆盖传入值 | `product-item.liquid:3`、`product-collection.liquid:3`、`search-product-item.liquid:3` |
| `badge_detail` | **无效**。全仓无读取 | 仅出现在 render 参数 |
| `section` | **无效**。卡片未使用 | `index-tab-product-list.liquid:26` |
| `image_loading` / `image_fetchpriority` | 仅 `product-item` 支持；`product-collection`、`search-product-item` 写死 `lazy` | `product-collection.liquid:67,83,100` |
| `image_sizes` | 仅 `product-item` 支持，且多数调用点未传（默认 `(max-width:768px) 100vw, 50vw`） | `product-item.liquid:6` |

---

## 4. 当前 DOM 结构（`product-item`）

```text
div.product-item[data-product-id]
├── div.product-image[data-link=product.url]        ← 整块可点，JS 跳转
│   ├── span.badge.sale-badge                       ← 折扣角标（组件内重算，未复用 sale-badge）
│   ├── span.badge.new-badge                        ← render product-badge
│   ├── img[data-variant].active                    ← 每个颜色值一张图，最多 N 张同时输出
│   ├── img.hover-image                             ← media[1] / media[0]
│   └── 其它应用注入节点（BSS 等）
└── div.product-details.position-relative
    ├── div.top
    │   ├── div.block-variant-options > render product-variant-colors
    │   ├── div.wishlist-button > button.swym-button
    │   ├── div.custom-label > span（custom_tag 或回退 "FASHION | CONVENIENT"）+ span.in-cart-badge（空，无 JS）
    │   ├── a.product-title（桌面/移动两套重复标题）
    │   └── render okendo-reviews-product-rating-summary
    └── div.bottom
        ├── div.footer-details
        │   ├── div.price-container（现价 "From"、划线价）
        │   └── form.atc-form 或 div.form-btn.popup-atc > button.btn-atc
        └── render product-card-promotion（促销行，可能为空）
```

`product-collection` 的差异（不是单纯换样式）：

| 项目 | `product-item` | `product-collection` |
| --- | --- | --- |
| 外层 | `.product-details > .top / .bottom` | `.product-details > .inner-c + .footer-details` |
| 标题 | 一个 `a`，内部桌面/移动两个截断容器 | 桌面、移动两个独立 `a`（重复链接） |
| 评分 | 仅 Okendo | Proviews 块 + Okendo（两套评价） |
| 无默认变体且缺货 | `<form>` 内 disabled 按钮 | 无 `<form>` 的纯 button |
| 图片 | 支持 `loading`/`fetchpriority`/`sizes` 参数 | 全部写死 `loading="lazy"`，无 `fetchpriority`，无 `width/height` |
| 促销行位置 | `.bottom` 内、footer 之后 | `.product-details` 内、footer 之后 |

---

## 5. 数据与状态

| 状态 | 来源 | 说明 |
| --- | --- | --- |
| 当前变体 | `product.selected_or_first_available_variant` | 卡片用"首个可选变体"，不是用户上次选择 |
| 价格 | `product.price_min`（`price_varies`）否则 selected variant 价格 | 促销行也用同一基准（`product-card-promotion.liquid:8-11`），保持一致 |
| 划线价 | `selected_variant.compare_at_price` | 未判断 compare 是否为 nil，见 §8.2 |
| 颜色选项 | 选项名 `color` / `colour`（大小写不敏感） | `product-item.liquid:35-42`、`product-variant-colors.liquid:5-11` |
| 颜色图 | 该颜色值下第一张有图的变体图 | 与色板 `data-color` 的变体 id 可能不同，见 §8.3 |
| 色板素材 | 优先级：metaobject 色值/图（`shopify.color-pattern` → `custom.color`）→ `images['颜色名.png']` / handle 名 → 颜色名文字当 CSS 色值 | `product-variant-colors.liquid:44-102` |
| 角标 | `sale-badge` 逻辑内联复制 + `product-badge`（tag=`new`） | 两套折扣计算，数值口径一致 |
| 促销行 | `product.metafields.promo.cart_discount_text`；`Extra...`→红色促销图标 + 计算折后价；`Free...`→绿色；其它→黑色礼盒图标 | `product-nav-promotion.liquid` |
| 评分 | Okendo `product.metafields.okendo.StarRatingSnippet` + `data-oke-star-rating` | 依赖 Okendo 脚本渲染 |
| 愿望单 | Swym Wishlist Plus：`.swym-button.swym-add-to-wishlist-view-product` + `data-product-id`/`data-variant-id`/`data-product-url` | 变体切换只改 `data-variant-id` |
| 默认变体加购 | 原生 `{% form 'product' %}` + `popup-cart.js` AJAX | 提交后刷新购物车/开抽屉 |
| 多变体加购 | `button[data-popup-handle]` → `main.js` 拉取 `?view=popup` 页面 HTML → 弹窗选规格 | 依赖 `templates/product.popup.liquid` 和 `sections/main-product.liquid` 的弹窗容器 |
| 售罄 | `current_variant.available == false` → 按钮 disabled / `Sold Out` | 色板切换**不更新**这个状态 |

---

## 6. 样式来源与层叠

| 文件 | 作用 | 加载 |
| --- | --- | --- |
| `assets/style.css:987-1208` | `.product-item` 主结构、角标、价格、促销行、Swym | 全局（`layout/theme.liquid:256`） |
| `assets/res-product-item.css` | 各断点图片高度 250px、色板尺寸、价格排列 | 全局（`theme.liquid:290`） |
| `assets/collection.css:316-356` | 集合页网格间距/移动 2 列 | 仅 collection 模板 |
| `sections/main-collection.liquid:3-108` | `.grid`、`.g-col-*`、`.grid-row-*`、`.grid-column-*` | **全局 `<style>`（未按 section 隔离）** |
| `assets/index-product-tabs.css:56` | 滑块内卡片 `flex:1;min-width:0` | 首页/模板条件加载 |
| `assets/article.css:150-306` | 文章页卡片覆盖 | 仅 article 模板 |

关键事实：

1. `style.css:993-1004` 同一规则里先写 `height:500px` 再写 `height:auto !important`，`width` 重复两次 → 前值无效。
2. `style.css` 的 `height:auto !important` 会让 `res-product-item.css` 的 `height:250px` 和 `collection.css:330` 的 `.max-height … height:650px` **全部失效**（后者无 `!important`）。移动端实际高度由 `aspect-ratio: 10 / 13` 决定。
3. `main-collection` 的 `.grid { grid-template-columns: repeat(3,1fr) }` **未限定作用域**，会影响其他页面同名类。
4. 断点：≥1280 三列（9 列内容区内的 3 列）；900–1279 两列；≤768 两列。**769–899 无覆盖，仍为三列**（静态推断）。
5. 卡片图片容器比例 `10/13`，图片固有 `400×533`（0.75），存在轻微裁切。

---

## 7. 交互契约（新卡片必须兼容或显式替换）

| 选择器 / 属性 | 消费方 | 行为 |
| --- | --- | --- |
| `.product-item .product-image[data-link]` | `main.js:170-175` | 点击整块图片 `window.location.href` |
| `.product-item .variant-option-block .variant-colors li` | `main.js:147-166` | 切换 `.on`、写 `product-main-id`、写 Swym 变体、切 `img.active` |
| `.view-all-options-btn` / `.variant-colors-dropdown` | `main.js:217-337` | 桌面 hover 展开、触屏点击展开、MutationObserver 支持 AJAX 追加 |
| `.product-main-id` | `main.js`、`popup-cart.js` | 隐藏变体 id，加购提交 |
| `.btn-atc`、`.atc-overlay`、`.atc-spinner` | `popup-cart.js`、`main.js:464-480` | loading 态：文字 `visibility:hidden`、遮罩 `display:flex` |
| `.form-btn.popup-atc .btn-atc[data-popup-handle]` | `main.js:1110-1135` | 打开规格弹窗 |
| `.swym-button[data-product-id][data-variant-id][data-product-url]` | Swym 脚本 | 收藏 |
| `[data-oke-star-rating]` | Okendo 脚本 | 星级 |
| `.product-nav-new__panel-promotion` | 卡片 CSS | 促销行排版 |
| `.product-item`（根类） | `main.js:273-336`、CSS、BSS 等 | 初始化下拉、下拉关闭、应用样式 |

> 结论：换标记时必须保留这些类名/属性，或同步改造 `main.js`、`popup-cart.js` 和 Swym/Okendo 契约。新卡片建议**保留**加购/愿望单/评分契约，只替换媒体区、标题、价格和色板逻辑。

---

## 8. 现状问题清单

### 8.1 P0：结构重复导致的行为漂移

| 问题 | 证据 |
| --- | --- |
| 三份卡片模板复制，改动不同步 | `product-item` 有 `.top/.bottom`、支持 loading 参数；`product-collection` 没有；`search-product-item` 又是另一份 |
| 两套评价系统并存 | `product-collection.liquid:127-137` 渲染 Proviews；`product-item.liquid:139-147` 同段被注释；两者都渲染 Okendo |
| 缺货按钮实现不同 | `product-item.liquid:228-252` 表单 + disabled；`product-collection.liquid:225-241` 无表单按钮 |
| 折扣角标重复实现，未复用 `sale-badge` | `product-item.liquid:14-29`、`product-collection.liquid:11-26`、`search-product-item.liquid:11-26`；而 `sale-badge.liquid` 已存在且 Header/礼盒在用 |

### 8.2 P0/P1：逻辑与显示缺陷

| # | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| 1 | 点击色板会冒泡到 `.product-image` 的跳转处理器 | `main.js:147` 未 `stopPropagation`；`main.js:170` 在 document 上监听（静态推断，需浏览器确认） | 选颜色直接跳详情页 |
| 2 | 切换色板不更新价格、划线价、售罄态、角标 | `main.js:159-164` 只改隐藏 id / Swym id / 图片 | 卡片显示与所选变体不符 |
| 3 | 色板 id 与图片 `data-variant` 可能不是同一变体 | `product-variant-colors.liquid:30` 取该颜色**第一个**变体；`product-item.liquid:52-58` 取**第一张有图**的变体 | 图片切不过去 |
| 4 | 未判断 `compare_at_price` 是否存在 | `product-item.liquid:216`、`product-collection.liquid:194` 用 `!=` 比较，nil 也会输出空价格块 | 空节点、间距异常 |
| 5 | 图片 `sizes` 默认 50vw，实际桌面约 25vw | `product-item.liquid:6`；集合页 3 列（`main-collection.liquid:150-165`） | 移动端/桌面重复下载过大图 |
| 6 | 集合页图片无 `width/height` | `product-collection.liquid:60-84` | CLS |
| 7 | `product-collection` 图片全部 `lazy`，首屏图也不 eager | 同上 | 首屏 LCP 变慢 |
| 8 | `sale_badge_type` 设置无效 | §3.4 | 商家设置无反馈 |
| 9 | 硬编码文案/标签/CDN 图标 | `product-item.liquid:162`（"FASHION \| CONVENIENT"）、`240/256`（购物车 PNG）、`244`（"Add"/"Sold Out"） | 非服饰类商品标签错误；外链图标不可控；无多语言 |
| 10 | 整块图片用 `div[data-link]` 跳转 | `product-item.liquid:11`、`main.js:170` | 不支持键盘、Ctrl/Cmd 新窗口、SEO 无语义 |

### 8.3 P1：可访问性与冗余

- 卡片标题重复输出两套（桌面/移动各一份），`product-collection` 还是两个独立 `<a>` 指向同一 URL。
- 角标 `aria-hidden="true"`，折扣信息对读屏不可见（是否算装饰需确认）。
- 色板 `li` 无 `role`/`tabindex`/键盘操作；`title` 提示不是可访问名称。
- 死代码：`span.in-cart-badge`（无任何 JS 更新）、`product-item` 内 Proviews 注释块、`res-product-item.css` 高度规则、`style.css` 的 `height:500px`、`tab-product-item.liquid`。
- 卡片无 section 设置：是否显示评分/愿望单/促销/角标都写死。

### 8.4 P2：维护性

- 促销行靠字符串前缀（`Extra`/`Free`）解析金额，货币符号只处理 CAD。
- hover 图固定取 `media[1]`，若第二张是视频则无 hover 效果，且不判断媒体类型。
- `product-label` 回退值对电池/配件类目语义错误。

---

## 9. 重构目标与验收

### 9.1 目标（不含视觉改版）

1. **单一来源**：一份卡片 Liquid + 一份 CSS，通过参数覆盖网格/滑块/搜索三种场景。
2. **行为对齐**：现卡片已有的能力（色板、hover 换图、折扣角标、New 角标、促销行、Okendo、Swym、快速加购、售罄）全部保留。
3. **修掉 §8.2 的 1–6 与 9–10**；视觉默认与现网一致（除非提供设计稿）。
4. **可回退**：旧卡片文件不动，section 设置切换；关闭开关即恢复旧卡片。
5. **性能不劣化**：图片按实际展示宽度出图；非首屏 lazy；首屏可 eager/high。
6. **可访问性**：媒体区为真实链接；色板可键盘操作；标题只输出一次。

### 9.2 验收清单（静态 + 后续浏览器）

- [ ] 网格、滑块、搜索结果三种上下文布局正确（桌面 3 列 / 移动 2 列 / 滑块单卡宽度）
- [ ] 无颜色选项、单颜色、≤5 色、>5 色（下拉）、无色板图、metaobject 色值/色图 六种数据路径正常
- [ ] 单变体 / 多变体 / 全售罄 / 部分售罄：按钮文案、disabled、加购路径正确
- [ ] 促销 metafield 为空 / `Extra 10%` / `Extra $20` / `Free shipping` / 其它文本 五种情况
- [ ] CAD / USD 货币符号与价格
- [ ] 无图商品、无 tag、无 custom_tag、无 Okendo 数据不产生空节点
- [ ] Swym 收藏、Okendo 星级仍由各自脚本接管
- [ ] 弹窗加购、AJAX 追加卡片（load more / 搜索 / 筛选）后色板仍可用
- [ ] 键盘：Tab 可到图片链接、色板、按钮；焦点可见
- [ ] `prefers-reduced-motion` 下无多余动效

---

## 10. 目标结构

### 10.1 文件

| 文件 | 内容 |
| --- | --- |
| `snippets/product-new-card.liquid` | 唯一卡片样板（媒体、标题、价格、色板、评分、愿望单、加购、促销） |
| `snippets/product-new-card-media.liquid`（可选拆分） | 图片/角标/hover 图，便于详情页复用 |
| `assets/product-new-card.css` | 全部 `product-new-card__*` 样式，`theme.liquid` 全局加载 |
| `assets/product-new-card.js` | 色板切换 + 价格/售罄同步；事件委托，零 jQuery 依赖 |
| `snippets/product-new-card-variants.liquid`（可选） | 输出变体 JSON（`application/json`），供 JS 更新价格 |

> 不新建 `.svg` 文件；图标统一走 `snippets/heating-icons.liquid`。当前 **没有购物车图标**，按项目规则需由你提供 SVG 后再替换现在的 CDN PNG。

### 10.2 参数接口（草案）

```liquid
{% render 'product-new-card',
  product: product,
  layout: 'grid',                # grid | slider | search
  image_loading: 'lazy',
  image_fetchpriority: 'auto',
  image_sizes: '(min-width: 1280px) 25vw, (min-width: 900px) 33vw, 50vw',
  show_rating: true,
  show_wishlist: true,
  show_promotion: true,
  show_swatches: true,
  sale_badge_type: 'discount'    # discount | percent，本次真正生效
%}
```

### 10.3 DOM / 命名（草案）

```text
article.product-new-card
├── div.product-new-card__media
│   ├── a.product-new-card__media-link[href]
│   │   ├── img.product-new-card__image.is-active
│   │   └── img.product-new-card__image-hover（仅当第二媒体为图片）
│   ├── render sale-badge / product-badge
│   └── div.product-new-card__wishlist（Swym 按钮）
├── div.product-new-card__body
│   ├── div.product-new-card__swatches（product-variant-colors 新版本）
│   ├── p.product-new-card__label（custom_tag，空则不输出，不再用假回退）
│   ├── a.product-new-card__title（单份，2 行截断）
│   ├── div.product-new-card__rating（Okendo）
│   ├── div.product-new-card__price（现价/From/划线价）
│   ├── div.product-new-card__actions（表单/弹窗按钮）
│   └── div.product-new-card__promotion（render product-card-promotion）
```

### 10.4 CSS 策略

- 全部规则限定在 `.product-new-card` 下，不新增全局工具类，不覆盖 `.product-item`。
- 不复制 `style.css` 的 Bootstrap 显示类写法；用容器查询/断点控制桌面/移动排版。
- 颜色、圆角、字体复用现有变量（`--color-brand`、`--font-primary`、`--button-border-radius`）。
- 图片容器用 `aspect-ratio: 10 / 13`，`img { width:100%; height:100%; object-fit:cover }`；`width/height` 属性必填。
- 移动端断点沿用项目默认 `max-width: 767px`（卡片旧样式用 768，新样式按新规则）。

### 10.5 JS 策略

- 只做现有 CSS 做不到的事：色板切换图片、同步价格/划线价/售罄按钮。
- 事件委托绑在 `document`，但作用域判断 `.closest('.product-new-card')`，天然支持 AJAX 追加和多实例。
- 色板点击 `preventDefault()` + 阻断冒泡（媒体区是链接，必须阻断）。
- 价格数据通过内联 JSON（每个卡片一段 `<script type="application/json">`）读取，避免额外请求。
- 不接管加购：继续复用 `{% form 'product' %}` 与 `data-popup-handle` 契约，降低回归风险。

### 10.6 上线开关（需要改 section，属业务代码，需单独批准）

- 在首批接入的 section 增加 `product_card_version`（`classic` / `new`），默认 `classic`。
- 首期建议只接 `main-collection`，验证后再开首页/推荐位。
- 旧 snippet 不删除、不改名；回退只改设置。

---

## 11. 分阶段实施

| 阶段 | 内容 | 改动文件 | 审批 |
| --- | --- | --- | --- |
| P0 | 本文件定稿；确认 §14 问题 | 仅文档 | 已授权（纯文档） |
| P1 | 新建 `product-new-card` 样板 + CSS + JS（不接入任何页面） | 新增 snippet/asset | 需业务代码批准 |
| P2 | `main-collection` 加开关并接入，集合页验证 | section + 设置 | 需批准 |
| P3 | 首页 tabs、推荐位、404、购物车推荐、文章页接入 | 多个 section | 需批准 |
| P4 | 搜索页 / AJAX 搜索接入 | main-search + search.ajax | 需批准 |
| P5 | 评估删除旧卡片、旧 CSS、`res-product-item.css` 死规则 | 多文件 | 需单独批准 |

---

## 12. 风险与回退

| 风险 | 说明 | 缓解 |
| --- | --- | --- |
| 第三方应用依赖 | Swym、Okendo、BSS、Proviews 可能按 `.product-item` 或特定属性注入 | 新卡保留必要类名钩子；上线前在预览主题逐项确认 |
| 加购契约 | `popup-cart.js` / `main.js` 依赖 `.btn-atc`、`.atc-overlay`、`.form-btn.popup-atc`、`product-main-id` | P1 原样保留这些结构与属性 |
| 样式冲突 | 全局 `style.css` 可能命中新卡内部的通用类（如 `.badge`、`.price-container`） | 新类名 + 作用域，不复用旧通用类 |
| 数据缺失 | 无图、无变体图、无 tag、无 metafield | 每种空值输出前判断，不渲染空占位 |
| 回退 | 视觉/行为不符 | section 开关切回 `classic`；新文件独立，删除即可 |

---

## 13. 静态验证约定

- Liquid 语法、`{% schema %}` JSON、CSS/JS 语法。
- 逐条核对：空值分支、货币、售罄、色板数量、促销前缀、图片回退。
- 不启动浏览器、不截图、不做视觉比对；响应式按 CSS 静态推断。
- 交付时列出改动文件与检查结论。

---

## 14. 待确认问题（按优先级）

1. **有没有 Figma 设计稿？** 桌面 + 移动。没有则按"结构重构、视觉不变"执行。
2. 色板点击后的期望：只切图（现状）还是**同时更新价格、划线价、售罄状态、加购变体**？
3. 是否保留"整块图片跳详情页"？建议改为媒体区真实 `<a>`（支持新窗口/键盘）。
4. 移动端网格是否仍为 2 列、图片比例是否仍为 `10/13`？
5. 卡片需要哪些商家可控项（显示评分/愿望单/促销/角标/色板）？还是全部固定？
6. 购物车图标 SVG 由你提供吗？没有则暂留现有 CDN PNG。
7. 评价系统是否可统一为 Okendo，并移除 `product-collection` 的 Proviews 块？
8. 首期接入页面是否限定 `main-collection`？
9. `custom_tag` 为空时：不显示标签，还是保留某个通用文案？（现为 "FASHION | CONVENIENT"）

---

## 15. 变更记录

| 日期 | 变更 | 说明 |
| --- | --- | --- |
| 2026-11-27 | 初版 | 基于 `138d1ec` 源码静态核对；旧卡片保留，新卡片方案待确认 |
| 2026-11-27 | P1 实施 | 新增 `product-new-card` 组件、quick add 弹窗、公共选项面板样式；集合页增加 `product_card_style` 开关（默认 classic） |

---

## 16. P1 实施记录（2026-11-27）

### 16.1 新增文件

| 文件 | 说明 |
| --- | --- |
| `snippets/product-new-card.liquid` | 卡片编排：媒体、色板、收藏、标题、特性、评分、价格、促销 |
| `snippets/product-new-card-media.liquid` | 主图、hover 图、`sale-badge`（左上）、`product-badge`（右上）、quick add |
| `snippets/product-new-card-quick-add.liquid` | 单变体原生 `.atc-form`；多变体 `data-quick-add` 触发器 |
| `snippets/product-new-card-swatches.liquid` | 色板按钮（沿用旧数据逻辑）、每色 New 胶囊、>5 色展开 |
| `snippets/product-new-card-price.liquid` | 新价格 snippet：现价、划线价、`From`、JS 更新钩子 |
| `snippets/product-new-card-features.liquid` | `custom.temperature` + `custom.custom_tag` 合成特性行 |
| `snippets/product-new-card-quick-add-dialog.liquid` | 弹窗内容：摘要、`nav-product-variant`、尺码表入口、CTA、详情链接 |
| `templates/product.quick-add.liquid` | `{% layout none %}`，供 `?view=quick-add` 拉取 |
| `assets/product-new-card.css` | 卡片壳、媒体、角标、quick add、容器查询、弹窗壳 |
| `assets/product-new-card.js` | `<product-new-card>` 色板联动、弹窗加载/默认 L/选项/加购 |
| `assets/product-option-panel.css` | 从 `product-nav-new` 抽出的移动端选项面板公共样式 |

### 16.2 修改文件

| 文件 | 变更 |
| --- | --- |
| `layout/theme.liquid` | 全局加载公共面板 CSS、卡片 CSS/JS、`size-chart-component` CSS/JS |
| `sections/main-collection.liquid` | 新增 `product_card_style`（classic/new，默认 classic）；按设置渲染 |
| `sections/product-nav-new.liquid` | panel 增加 `product-option-panel` 类；移除已迁移到公共样式的规则；补 20px 价格覆盖 |
| `snippets/nav-product-variant.liquid` | 新增可选 `show_color_new`（默认 false，nav 行为不变）；色板可选 New 胶囊 |

### 16.3 关键实现

- 卡片宽度 `100%`、`min-width: min(170px, 100%)`；容器查询 `max-width:219px` 切换窄卡规格（18px 色板、15px 标题、16px 价格等）。
- Figma 规格：媒体 `10/13`；`$X OFF` 角标 padding 4/6、右下圆角 4；色板 25px / 间距 12 / 外环 2px；New 胶囊 32×15；标题 18/1.25；特性 14/20；价格 18/14；促销 13。
- 弹窗：桌面 620px 居中、高度自适应、无内部滚动条；移动端全宽底部弹出、内容滚动、CTA 固定；无数量选择。
- 默认尺码：优先当前颜色下**有库存的 L**，否则该颜色第一个可售尺码，再否则第一个变体；无 L 时回退。
- 尺码表：复用 `size-chart-component`，按 `size_chart.target_products` 匹配；按钮由 JS 移入 Size legend。
- Regular/Tall：仅当存在含 `LT` 的尺码时注入分段控制，按 Figma 使用 `Regular` / `Tall`。
- 加购：单变体走现有 `.atc-form`（`popup-cart.js`）；弹窗内由新 JS 提交 `/cart/add.js`，成功后 `refreshCart()` + `openCart(false)`，失败在弹窗内提示。
- 色板点击同步主图、价格/划线价、quick add 目标颜色、Swym `data-variant-id`，不再触发跳转。
- 旧卡片文件、CSS、JS 全部保留；关闭开关即回退。

### 16.4 静态验证

- `node --check assets/product-new-card.js`：通过。
- `main-collection` schema 提取 `JSON.parse`：通过（settings 4 项）。
- 新增/修改 Liquid 文件 `if/for/case/form/paginate/comment` 标签计数平衡；CSS `{}` 计数平衡。
- 未执行：浏览器、Shopify Theme Check、线上预览、真实商品数据渲染。

### 16.5 已知限制

- 卡片初始价格按商品级 `price_varies` 渲染；切换色板后按该颜色的价格区间更新，首屏与个别颜色可能短暂不一致（点击后纠正）。
- 折扣角标仍按初始变体渲染，切换颜色不更新角标；促销行的折后价同样按商品级价格计算，切换颜色后不重算。
- 弹窗价格更新使用 `Intl.NumberFormat`（与 `product-nav-new.js` 一致），极端货币格式可能与主题 `money` 过滤器略有差异。
- 弹窗内尺码表依赖全局加载的 `size-chart-component.js`；snippet 内注入的 `<script>` 不会执行。
- Regular/Tall 用 `LT` 字符串识别，沿用旧弹窗规则。
- 未在浏览器验证 nav 移动端弹窗样式迁移后的外观；需在预览主题回归 PDP。

### 16.6 回退

- 集合页：`Main Collection` 设置中把 `Product card style` 切回 `Classic`。
- 整体停用：移除 `theme.liquid` 中的新 CSS/JS 引用；旧卡片不受影响。

