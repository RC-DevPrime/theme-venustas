# Collection 实际文件清单

基线：2026-11-23，本地静态引用。已读取入口／关键交互代码，并对下列文件提取实际字面量 render/include、asset_url；不是按名称归类。仅列静态可追溯关系，动态 app render、分支是否运行、外部注入不在此闭包内。调用行号用于定位，变更后须核对当前源码。

## JSON 模板索引

每行列出 order 中未 disabled 的 section type，按原顺序去重显示；不同实例／settings／blocks 仍可能不同。所有定义 section（含停用项）均计入后面的清单。线上是否分配这些模板未确认。

| 模板 | 本地启用 section 顺序 |
| --- | --- |
| [templates/collection.12v-heated-apparel.json](../../../../templates/collection.12v-heated-apparel.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.7-4v-heated-apparel.json](../../../../templates/collection.7-4v-heated-apparel.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.apex-riding-system.json](../../../../templates/collection.apex-riding-system.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.battery-collection.json](../../../../templates/collection.battery-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.best-seller.json](../../../../templates/collection.best-seller.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.bundle-deal.json](../../../../templates/collection.bundle-deal.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.campaign-collection.json](../../../../templates/collection.campaign-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.camping.json](../../../../templates/collection.camping.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.classic-heated-jacket.json](../../../../templates/collection.classic-heated-jacket.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.classic-heated-vest.json](../../../../templates/collection.classic-heated-vest.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.community.json](../../../../templates/collection.community.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.dotw-collection.json](../../../../templates/collection.dotw-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.down-insulation.json](../../../../templates/collection.down-insulation.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.dual-control-collection.json](../../../../templates/collection.dual-control-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.dual-control-heated-vest.json](../../../../templates/collection.dual-control-heated-vest.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.dualcontrol-heated-jacket.json](../../../../templates/collection.dualcontrol-heated-jacket.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.dualcontrol-heated-vest.json](../../../../templates/collection.dualcontrol-heated-vest.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.extended-heat-gear.json](../../../../templates/collection.extended-heat-gear.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.fellex-collection.json](../../../../templates/collection.fellex-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.for-her-collection.json](../../../../templates/collection.for-her-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.for-mom-collection.json](../../../../templates/collection.for-mom-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.golf.json](../../../../templates/collection.golf.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.graphene-textile.json](../../../../templates/collection.graphene-textile.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.heated-accessories.json](../../../../templates/collection.heated-accessories.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.heated-fleece-vest.json](../../../../templates/collection.heated-fleece-vest.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.heated-gloves-collection.json](../../../../templates/collection.heated-gloves-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.heated-hoodie-collection.json](../../../../templates/collection.heated-hoodie-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.heated-jacket-collection.json](../../../../templates/collection.heated-jacket-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.heated-scarf.json](../../../../templates/collection.heated-scarf.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.heated-socks.json](../../../../templates/collection.heated-socks.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.heated-vest-collection.json](../../../../templates/collection.heated-vest-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.hiking-collection.json](../../../../templates/collection.hiking-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.hunting.json](../../../../templates/collection.hunting.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.json](../../../../templates/collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.kids-collection.json](../../../../templates/collection.kids-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.limited-deals.json](../../../../templates/collection.limited-deals.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.mega-clearance-2.json](../../../../templates/collection.mega-clearance-2.json) | `collection-featured-banner`, `collection-list`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.mega-clearance-sale.json](../../../../templates/collection.mega-clearance-sale.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.member-club.json](../../../../templates/collection.member-club.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.men-s-collection.json](../../../../templates/collection.men-s-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.new-arrival.json](../../../../templates/collection.new-arrival.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.new-customer.json](../../../../templates/collection.new-customer.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.outlet.json](../../../../templates/collection.outlet.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.partner-community.json](../../../../templates/collection.partner-community.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.recycled-heated-jacket.json](../../../../templates/collection.recycled-heated-jacket.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.recycled-heated-vest.json](../../../../templates/collection.recycled-heated-vest.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.riding-vehicle.json](../../../../templates/collection.riding-vehicle.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.search-box.json](../../../../templates/collection.search-box.json) | `collection-featured-banner`, `collection-list`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.shop-recycled-heated-vest.json](../../../../templates/collection.shop-recycled-heated-vest.json) | `collection-featured-banner`, `collection-list`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.ski.json](../../../../templates/collection.ski.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.snowboarding.json](../../../../templates/collection.snowboarding.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.stay-indoors.json](../../../../templates/collection.stay-indoors.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.the-creators-edit.json](../../../../templates/collection.the-creators-edit.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.tiki-s-pick-collection.json](../../../../templates/collection.tiki-s-pick-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.unisex.json](../../../../templates/collection.unisex.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.volcano.json](../../../../templates/collection.volcano.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.waterproof-heated-jacket-2.json](../../../../templates/collection.waterproof-heated-jacket-2.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.waterproof-heated-jacket.json](../../../../templates/collection.waterproof-heated-jacket.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.women-s-collection.json](../../../../templates/collection.women-s-collection.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-vertical-slider`, `collection-products-recommendation` |
| [templates/collection.womens-long-jacket.json](../../../../templates/collection.womens-long-jacket.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |
| [templates/collection.work-outdoors.json](../../../../templates/collection.work-outdoors.json) | `collection-featured-banner`, `main-collection`, `collection-list-v2`, `collection-products-recommendation` |

JSON 模板数：61。独立 Liquid 输出：
- [templates/collection.quiz-targets-json.liquid](../../../../templates/collection.quiz-targets-json.liquid)

## Sections／Snippets／专用模板与调用点

下表的箭头目标为直接静态调用；`@L` 是调用方行号。模板统计为“定义实例数 / order 中启用实例数”，同模板多实例分别计数。未显示的资源仍可能由 layout 全局加载。

| 文件 | 模板统计 | 直接静态依赖（调用方位置） |
| --- | --- | --- |
| [sections/collection-faqs.liquid](../../../../sections/collection-faqs.liquid) | 43/0 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/collection-featured-banner.liquid](../../../../sections/collection-featured-banner.liquid) | 61/61 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/collection-list-v2.liquid](../../../../sections/collection-list-v2.liquid) | 61/61 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/collection-list.liquid](../../../../sections/collection-list.liquid) | 61/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/collection-products-recommendation.liquid](../../../../sections/collection-products-recommendation.liquid) | 61/61 | [product-item.liquid](../../../../snippets/product-item.liquid) @L106 |
| [sections/collection-vertical-slider.liquid](../../../../sections/collection-vertical-slider.liquid) | 61/18 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/main-collection.liquid](../../../../sections/main-collection.liquid) | 61/61 | [product-collection.liquid](../../../../snippets/product-collection.liquid) @L724 |
| [snippets/okendo-reviews-product-rating-summary.liquid](../../../../snippets/okendo-reviews-product-rating-summary.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-badge.liquid](../../../../snippets/product-badge.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-collection.liquid](../../../../snippets/product-collection.liquid) | — | [product-badge.liquid](../../../../snippets/product-badge.liquid) @L28；[product-variant-colors.liquid](../../../../snippets/product-variant-colors.liquid) @L124；[okendo-reviews-product-rating-summary.liquid](../../../../snippets/okendo-reviews-product-rating-summary.liquid) @L166；[product-card-promotion.liquid](../../../../snippets/product-card-promotion.liquid) @L258 |
| [snippets/product-item.liquid](../../../../snippets/product-item.liquid) | — | [product-badge.liquid](../../../../snippets/product-badge.liquid) @L31；[product-variant-colors.liquid](../../../../snippets/product-variant-colors.liquid) @L135；[okendo-reviews-product-rating-summary.liquid](../../../../snippets/okendo-reviews-product-rating-summary.liquid) @L186；[product-card-promotion.liquid](../../../../snippets/product-card-promotion.liquid) @L273 |
| [snippets/product-card-promotion.liquid](../../../../snippets/product-card-promotion.liquid) | — | [product-nav-promotion.liquid](../../../../snippets/product-nav-promotion.liquid) @L13 |
| [snippets/product-variant-colors.liquid](../../../../snippets/product-variant-colors.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [templates/collection.quiz-targets-json.liquid](../../../../templates/collection.quiz-targets-json.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |

## 资源与共享脚本

以下资源已核对实际加载标签或选择器／函数契约；vendor 库没有逐行审计。

- [assets/bootstrap-custom.css](../../../../assets/bootstrap-custom.css)
- [assets/bootstrap.bundle.min.js](../../../../assets/bootstrap.bundle.min.js)
- [assets/bootstrap.min.css](../../../../assets/bootstrap.min.css)
- [assets/collection.css](../../../../assets/collection.css)
- [assets/collection.js](../../../../assets/collection.js)
- [assets/global.js](../../../../assets/global.js)
- [assets/jquery.min.js](../../../../assets/jquery.min.js)
- [assets/main.js](../../../../assets/main.js)
- [assets/popup-cart.css](../../../../assets/popup-cart.css)
- [assets/popup-cart.js](../../../../assets/popup-cart.js)
- [assets/res-base.css](../../../../assets/res-base.css)
- [assets/res-font.css](../../../../assets/res-font.css)
- [assets/res-popup-cart.css](../../../../assets/res-popup-cart.css)
- [assets/res-product-item.css](../../../../assets/res-product-item.css)
- [assets/style.css](../../../../assets/style.css)
- [assets/swiper-bundle.min.css](../../../../assets/swiper-bundle.min.css)
- [assets/swiper-bundle.min.js](../../../../assets/swiper-bundle.min.js)
- [layout/theme.liquid](../../../../layout/theme.liquid)

外部数据／接口与消费者详见 architecture.md 和项目 module-map；此清单不把全局加载资源重复展开为 snippet 边。

## 配置依赖

- [config/settings_schema.json](../../../../config/settings_schema.json)：全局设置定义。
- [config/settings_data.json](../../../../config/settings_data.json)：本地配置与应用 embeds，不代表线上状态。
