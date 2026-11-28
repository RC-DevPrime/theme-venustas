# Product Detail 实际文件清单

## 2026-11-28 促销行图标与文案同排

- snippets/product-nav-promotion.liquid L57–61：图标与文案包进 `.product-nav-new__panel-promotion-label`，折扣价仍为容器直接子元素；assets/style.css L1209 新增该 label 样式。
- 商品页导航（sections/product-nav-new.liquid L149）容器仍为 `white-space:nowrap`，单行显示行为不变；详见 [任务日志](../../logs/2026-11-28-promotion-row-icon-inline.md)。

基线：2026-11-23，本地静态引用。已读取入口／关键交互代码，并对下列文件提取实际字面量 render/include、asset_url；不是按名称归类。仅列静态可追溯关系，动态 app render、分支是否运行、外部注入不在此闭包内。调用行号用于定位，变更后须核对当前源码。

## JSON 模板索引

按相同启用顺序分组列出全部模板；section type 按 order 中未 disabled 的原顺序去重显示；不同实例／settings／blocks 仍可能不同。所有定义 section（含停用项）均计入后面的清单。线上是否分配这些模板未确认。

| 相同启用 section 顺序的模板组 | 本地启用 section 顺序 |
| --- | --- |
| [templates/product.36wh-battery.json](../../../../templates/product.36wh-battery.json)、[templates/product.54wh-battery.json](../../../../templates/product.54wh-battery.json)、[templates/product.74wh-battery.json](../../../../templates/product.74wh-battery.json) | `main-product`, `product-battery-banner`, `product-battery-power`, `product-battery-specs`, `product-battery-carry`, `product-battery-gear`, `product-batter-protections`, `product-battery-systems`, `product-battery-certification`, `product-comparison`, `product-review-section`, `product-featured-banner` |
| [templates/product.bundle-2118-max.json](../../../../templates/product.bundle-2118-max.json)、[templates/product.bundle-2118-pro.json](../../../../templates/product.bundle-2118-pro.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-battery-performance`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-comparison`, `product-review-section`, `product-review-blog-carousel`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.cooling-vest.json](../../../../templates/product.cooling-vest.json) | `cooling-vest-styles`, `main-product`, `cooling-vest-nav`, `product-cooling-hero`, `product-cooling-vs-bulk`, `product-versus`, `product-how-it-works`, `product-cooling-modes`, `product-feature-tiles`, `product-kit-options`, `product-spec-table`, `product-care-cards`, `product-faqs-section`, `product-in-the-field`, `product-review-section`, `product-cross-sell-banner`, `cooling-vest-sticky-atc` |
| [templates/product.em21-pro.json](../../../../templates/product.em21-pro.json)、[templates/product.EM21.json](../../../../templates/product.EM21.json)、[templates/product.EM27.json](../../../../templates/product.EM27.json)、[templates/product.EM29.json](../../../../templates/product.EM29.json)、[templates/product.EM31.json](../../../../templates/product.EM31.json)、[templates/product.EW22.json](../../../../templates/product.EW22.json)、[templates/product.EW28.json](../../../../templates/product.EW28.json)、[templates/product.EW30.json](../../../../templates/product.EW30.json)、[templates/product.EW32.json](../../../../templates/product.EW32.json)、[templates/product.EW34.json](../../../../templates/product.EW34.json)、[templates/product.EW40.json](../../../../templates/product.EW40.json)、[templates/product.EW54.json](../../../../templates/product.EW54.json)、[templates/product.EW68.json](../../../../templates/product.EW68.json)、[templates/product.EW72.json](../../../../templates/product.EW72.json)、[templates/product.EW74.json](../../../../templates/product.EW74.json)、[templates/product.KB11.json](../../../../templates/product.KB11.json)、[templates/product.KB13.json](../../../../templates/product.KB13.json)、[templates/product.KB15.json](../../../../templates/product.KB15.json)、[templates/product.KB17.json](../../../../templates/product.KB17.json)、[templates/product.KG10.json](../../../../templates/product.KG10.json)、[templates/product.KG12.json](../../../../templates/product.KG12.json)、[templates/product.KG14.json](../../../../templates/product.KG14.json)、[templates/product.KG16.json](../../../../templates/product.KG16.json)、[templates/product.KJ12.json](../../../../templates/product.KJ12.json)、[templates/product.KJ16.json](../../../../templates/product.KJ16.json)、[templates/product.ku19.json](../../../../templates/product.ku19.json)、[templates/product.KV10.json](../../../../templates/product.KV10.json)、[templates/product.KV14.json](../../../../templates/product.KV14.json)、[templates/product.M19.json](../../../../templates/product.M19.json)、[templates/product.M2136-MAX.json](../../../../templates/product.M2136-MAX.json)、[templates/product.M2136-PRO.json](../../../../templates/product.M2136-PRO.json)、[templates/product.M2136.json](../../../../templates/product.M2136.json)、[templates/product.M2167.json](../../../../templates/product.M2167.json)、[templates/product.M25.json](../../../../templates/product.M25.json)、[templates/product.M35.json](../../../../templates/product.M35.json)、[templates/product.M37.json](../../../../templates/product.M37.json)、[templates/product.M41.json](../../../../templates/product.M41.json)、[templates/product.M43.json](../../../../templates/product.M43.json)、[templates/product.M52.json](../../../../templates/product.M52.json)、[templates/product.M61.json](../../../../templates/product.M61.json)、[templates/product.M63.json](../../../../templates/product.M63.json)、[templates/product.M67-12V.json](../../../../templates/product.M67-12V.json)、[templates/product.M67.json](../../../../templates/product.M67.json)、[templates/product.M69.json](../../../../templates/product.M69.json)、[templates/product.M91.json](../../../../templates/product.M91.json)、[templates/product.M93.json](../../../../templates/product.M93.json)、[templates/product.MT01.json](../../../../templates/product.MT01.json)、[templates/product.sj01.json](../../../../templates/product.sj01.json)、[templates/product.U2138-MAX.json](../../../../templates/product.U2138-MAX.json)、[templates/product.U2138-PRO.json](../../../../templates/product.U2138-PRO.json)、[templates/product.U2138.json](../../../../templates/product.U2138.json)、[templates/product.U2139.json](../../../../templates/product.U2139.json)、[templates/product.U2169.json](../../../../templates/product.U2169.json)、[templates/product.U2169U.json](../../../../templates/product.U2169U.json)、[templates/product.U40.json](../../../../templates/product.U40.json)、[templates/product.U41G.json](../../../../templates/product.U41G.json)、[templates/product.U8999.json](../../../../templates/product.U8999.json)、[templates/product.W20.json](../../../../templates/product.W20.json)、[templates/product.W2036.json](../../../../templates/product.W2036.json)、[templates/product.W2136-Core.json](../../../../templates/product.W2136-Core.json)、[templates/product.W2136-MAX.json](../../../../templates/product.W2136-MAX.json)、[templates/product.W2136-PRO.json](../../../../templates/product.W2136-PRO.json)、[templates/product.W2136.json](../../../../templates/product.W2136.json)、[templates/product.W2166.json](../../../../templates/product.W2166.json)、[templates/product.W2167.json](../../../../templates/product.W2167.json)、[templates/product.W24L.json](../../../../templates/product.W24L.json)、[templates/product.W38.json](../../../../templates/product.W38.json)、[templates/product.W42.json](../../../../templates/product.W42.json)、[templates/product.W44.json](../../../../templates/product.W44.json)、[templates/product.W48.json](../../../../templates/product.W48.json)、[templates/product.W50.json](../../../../templates/product.W50.json)、[templates/product.W51.json](../../../../templates/product.W51.json)、[templates/product.W52.json](../../../../templates/product.W52.json)、[templates/product.W62.json](../../../../templates/product.W62.json)、[templates/product.W64.json](../../../../templates/product.W64.json)、[templates/product.W80.json](../../../../templates/product.W80.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-battery-performance`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-review-section`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.G02.json](../../../../templates/product.G02.json) | `main-product`, `size-chart-table`, `product-nav`, `product-image-content`, `product-battery-performance-v2`, `product-expand-image`, `product-row-layout-content`, `product-featured-content-icons`, `product-specification`, `product-included`, `product-review-section`, `product-review-blog-carousel`, `product-faqs-section`, `product-recommendation` |
| [templates/product.G03.json](../../../../templates/product.G03.json) | `main-product`, `size-chart-table`, `product-nav`, `product-image-content`, `product-battery-performance`, `product-expand-image`, `product-row-layout-content`, `product-featured-content-icons`, `product-specification`, `product-included`, `product-review-section`, `product-faqs-section`, `product-recommendation` |
| [templates/product.G12.json](../../../../templates/product.G12.json) | `main-product`, `size-chart-table`, `product-nav`, `product-image-content`, `product-expand-image`, `product-featured-content-icons`, `product-specification`, `product-review-section`, `product-faqs-section`, `product-recommendation` |
| [templates/product.HideInventory.json](../../../../templates/product.HideInventory.json)、[templates/product.ice-bag.json](../../../../templates/product.ice-bag.json)、[templates/product.json](../../../../templates/product.json) | `main-product`, `product-review-section`, `product-featured-banner` |
| [templates/product.HT01.json](../../../../templates/product.HT01.json)、[templates/product.S10.json](../../../../templates/product.S10.json)、[templates/product.SD01.json](../../../../templates/product.SD01.json)、[templates/product.SP02.json](../../../../templates/product.SP02.json) | `main-product`, `size-chart-table`, `product-nav`, `product-image-content`, `product-expand-image`, `product-battery-performance`, `product-row-layout-content`, `product-featured-content-icons`, `product-specification`, `product-included`, `product-review-section`, `product-faqs-section`, `product-recommendation` |
| [templates/product.M2117-Max.json](../../../../templates/product.M2117-Max.json)、[templates/product.M2117-Pro.json](../../../../templates/product.M2117-Pro.json)、[templates/product.M2117.json](../../../../templates/product.M2117.json)、[templates/product.M2117P-Max.json](../../../../templates/product.M2117P-Max.json)、[templates/product.M2118-Max.json](../../../../templates/product.M2118-Max.json)、[templates/product.M2118-Pro.json](../../../../templates/product.M2118-Pro.json)、[templates/product.W2117-Max.json](../../../../templates/product.W2117-Max.json)、[templates/product.W2117-Pro.json](../../../../templates/product.W2117-Pro.json)、[templates/product.W2117.json](../../../../templates/product.W2117.json)、[templates/product.W2117P-Max.json](../../../../templates/product.W2117P-Max.json)、[templates/product.W2118-Max.json](../../../../templates/product.W2118-Max.json)、[templates/product.W2118-Pro.json](../../../../templates/product.W2118-Pro.json)、[templates/product.W2118.json](../../../../templates/product.W2118.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-battery-performance`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-comparison`, `product-review-section`, `product-review-blog-carousel`, `product-faqs-section`, `product-recommendation`, `product-promo`, `footer-support-icon-list` |
| [templates/product.M2118.json](../../../../templates/product.M2118.json) | `main-product`, `heatingV-anchor-nav`, `product-new-heating`, `product-new-benefits`, `product-new-technology`, `product-new-heat-control`, `product-new-battery-runtime`, `product-new-battery`, `product-new-power-features`, `product-new-design-features`, `product-new-tested-worn`, `product-new-in-box`, `product-new-specifications`, `product-new-compare`, `product-new-faq`, `product-review-section`, `product-recommendation`, `product-promo`, `product-new-warranty-information`, `product-nav-new` |
| [templates/product.M2168-Max.json](../../../../templates/product.M2168-Max.json)、[templates/product.M2168-Pro.json](../../../../templates/product.M2168-Pro.json)、[templates/product.M2168.json](../../../../templates/product.M2168.json)、[templates/product.U9001-Max.json](../../../../templates/product.U9001-Max.json)、[templates/product.U9001-Pro.json](../../../../templates/product.U9001-Pro.json)、[templates/product.U9001.json](../../../../templates/product.U9001.json)、[templates/product.W2168-Max.json](../../../../templates/product.W2168-Max.json)、[templates/product.W2168-Pro.json](../../../../templates/product.W2168-Pro.json)、[templates/product.W2168.json](../../../../templates/product.W2168.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-battery-performance`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-comparison`, `product-review-section`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.M45.json](../../../../templates/product.M45.json)、[templates/product.M47.json](../../../../templates/product.M47.json)、[templates/product.W78.json](../../../../templates/product.W78.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-battery-performance`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-review-section`, `product-review-blog-carousel`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.MHP05.json](../../../../templates/product.MHP05.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-battery-performance`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-specification`, `product-included`, `product-review-section`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.MMJ01.json](../../../../templates/product.MMJ01.json)（严格解析失败，仅内存恢复清单）、[templates/product.MMP03.json](../../../../templates/product.MMP03.json)（严格解析失败，仅内存恢复清单） | `main-product`, `heatingV-anchor-nav`, `heatingM-hero`, `heatingM-core-technology`, `heatingM-connections`, `heatingM-video-comparison`, `heatingM-levels`, `heatingM-power-draw`, `heatingM-mid-layer`, `heatingM-riding-features`, `heatingP-12v-carousel`, `heatingM-off-bike`, `heatingM-layering`, `heatingM-specs`, `heating-prelaunch-faq`, `product-review-section`, `product-featured-banner`, `product-nav-new` |
| [templates/product.mv11.json](../../../../templates/product.mv11.json)、[templates/product.Volcano-Bundle.json](../../../../templates/product.Volcano-Bundle.json)、[templates/product.wv12.json](../../../../templates/product.wv12.json) | `main-product`, `heatingV-anchor-nav`, `heatingV-cold-performance`, `heatingV-volcano-chart`, `heatingV-4x-gear`, `heatingV-off-bike-runtime`, `heatingV-four-layers`, `heatingV-dual-battery-options`, `heatingV-runtime`, `heatingV-12v-vehicle`, `heatingV-cold-weather-rides`, `heatingV-video`, `heatingV-riding-position`, `heatingV-layering-compare`, `heatingV-specs`, `heating-prelaunch-faq`, `product-review-section`, `product-featured-banner`, `product-nav-new` |
| [templates/product.S11.json](../../../../templates/product.S11.json) | `main-product`, `size-chart-table`, `product-nav`, `product-image-content`, `product-expand-image`, `product-battery-performance`, `product-row-layout-content`, `product-featured-content-icons`, `product-specification`, `product-included`, `product-review-section`, `product-review-blog-carousel`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.SW03.json](../../../../templates/product.SW03.json) | `main-product`, `product-nav`, `product-hotspot`, `product-image-content`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-review-section`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |
| [templates/product.WR01.json](../../../../templates/product.WR01.json) | `main-product`, `product-nav`, `product-content-slider`, `product-image-content-expand`, `product-content-counter`, `product-video-with-icon-list`, `product-centered-image-slider`, `product-specification`, `product-included`, `product-review-section`, `product-faqs-section`, `product-recommendation`, `product-featured-banner`, `footer-support-icon-list` |

JSON 模板数：127。独立 Liquid 输出：
- [templates/product.gift-card-pro.liquid](../../../../templates/product.gift-card-pro.liquid)
- [templates/product.popup.liquid](../../../../templates/product.popup.liquid)

## Sections／Snippets／专用模板与调用点

下表的箭头目标为直接静态调用；`@L` 是调用方行号。模板统计为“定义实例数 / order 中启用实例数”，同模板多实例分别计数。未显示的资源仍可能由 layout 全局加载。

| 文件 | 模板统计 | 直接静态依赖（调用方位置） |
| --- | --- | --- |
| [sections/cooling-vest-nav.liquid](../../../../sections/cooling-vest-nav.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/cooling-vest-sticky-atc.liquid](../../../../sections/cooling-vest-sticky-atc.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/cooling-vest-styles.liquid](../../../../sections/cooling-vest-styles.liquid) | 1/1 | [cooling-vest.css](../../../../assets/cooling-vest.css) @L7 |
| [sections/footer-support-icon-list.liquid](../../../../sections/footer-support-icon-list.liquid) | 107/107 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heating-prelaunch-faq.liquid](../../../../sections/heating-prelaunch-faq.liquid) | 5/5 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-connections.liquid](../../../../sections/heatingM-connections.liquid) | 2/2 | [heatingM-comparison-card.liquid](../../../../snippets/heatingM-comparison-card.liquid) @L269 |
| [sections/heatingM-core-technology.liquid](../../../../sections/heatingM-core-technology.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-hero.liquid](../../../../sections/heatingM-hero.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-layering.liquid](../../../../sections/heatingM-layering.liquid) | 2/2 | [heatingP-button.liquid](../../../../snippets/heatingP-button.liquid) @L247 |
| [sections/heatingM-levels.liquid](../../../../sections/heatingM-levels.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-mid-layer.liquid](../../../../sections/heatingM-mid-layer.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-off-bike.liquid](../../../../sections/heatingM-off-bike.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-power-draw.liquid](../../../../sections/heatingM-power-draw.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-riding-features.liquid](../../../../sections/heatingM-riding-features.liquid) | 4/4 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingM-specs.liquid](../../../../sections/heatingM-specs.liquid) | 2/2 | [heatingM-care-instructions.liquid](../../../../snippets/heatingM-care-instructions.liquid) @L309 |
| [sections/heatingM-video-comparison.liquid](../../../../sections/heatingM-video-comparison.liquid) | 2/2 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingP-12v-carousel.liquid](../../../../sections/heatingP-12v-carousel.liquid) | 2/2 | [heating-12v-image.liquid](../../../../snippets/heating-12v-image.liquid) @L357；[heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L382 |
| [sections/heatingV-12v-vehicle.liquid](../../../../sections/heatingV-12v-vehicle.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-4x-gear.liquid](../../../../sections/heatingV-4x-gear.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-anchor-nav.liquid](../../../../sections/heatingV-anchor-nav.liquid) | 6/6 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-cold-performance.liquid](../../../../sections/heatingV-cold-performance.liquid) | 3/3 | [heatingV-cold-performance.css](../../../../assets/heatingV-cold-performance.css) @L10；[heatingV-cold-performance.js](../../../../assets/heatingV-cold-performance.js) @L11 |
| [sections/heatingV-cold-weather-rides.liquid](../../../../sections/heatingV-cold-weather-rides.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-dual-battery-options.liquid](../../../../sections/heatingV-dual-battery-options.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-four-layers.liquid](../../../../sections/heatingV-four-layers.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-layering-compare.liquid](../../../../sections/heatingV-layering-compare.liquid) | 3/3 | [heatingP-button.liquid](../../../../snippets/heatingP-button.liquid) @L80 |
| [sections/heatingV-off-bike-runtime.liquid](../../../../sections/heatingV-off-bike-runtime.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-riding-position.liquid](../../../../sections/heatingV-riding-position.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-runtime.liquid](../../../../sections/heatingV-runtime.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-specs.liquid](../../../../sections/heatingV-specs.liquid) | 3/3 | [heatingM-care-instructions.liquid](../../../../snippets/heatingM-care-instructions.liquid) @L148 |
| [sections/heatingV-video.liquid](../../../../sections/heatingV-video.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/heatingV-volcano-chart.liquid](../../../../sections/heatingV-volcano-chart.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/main-product.liquid](../../../../sections/main-product.liquid) | 127/127 | [global-vars.liquid](../../../../snippets/global-vars.liquid) @L1；[product-media.liquid](../../../../snippets/product-media.liquid) @L84；[product-heating-features.liquid](../../../../snippets/product-heating-features.liquid) @L200；[product-promotion-banner.liquid](../../../../snippets/product-promotion-banner.liquid) @L202；[choose-runtime.liquid](../../../../snippets/choose-runtime.liquid) @L226；[product-variant.liquid](../../../../snippets/product-variant.liquid) @L230；[comp-product-item.liquid](../../../../snippets/comp-product-item.liquid) @L573；[product-badge.liquid](../../../../snippets/product-badge.liquid) @L614；[size-chart-modal.liquid](../../../../snippets/size-chart-modal.liquid) @L913；[product-edit-option.liquid](../../../../snippets/product-edit-option.liquid) @L918 |
| [sections/product-batter-protections.liquid](../../../../sections/product-batter-protections.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-banner.liquid](../../../../sections/product-battery-banner.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-carry.liquid](../../../../sections/product-battery-carry.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-certification.liquid](../../../../sections/product-battery-certification.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-gear.liquid](../../../../sections/product-battery-gear.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-performance-v2.liquid](../../../../sections/product-battery-performance-v2.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-performance.liquid](../../../../sections/product-battery-performance.liquid) | 111/110 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-power.liquid](../../../../sections/product-battery-power.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-battery-specs.liquid](../../../../sections/product-battery-specs.liquid) | 3/3 | [battery-spec-item.liquid](../../../../snippets/battery-spec-item.liquid) @L199 |
| [sections/product-battery-systems.liquid](../../../../sections/product-battery-systems.liquid) | 3/3 | [battery-icons.liquid](../../../../snippets/battery-icons.liquid) @L286 |
| [sections/product-care-cards.liquid](../../../../sections/product-care-cards.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-centered-image-slider.liquid](../../../../sections/product-centered-image-slider.liquid) | 106/105 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-compare-tab.liquid](../../../../sections/product-compare-tab.liquid) | 111/0 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-comparison.liquid](../../../../sections/product-comparison.liquid) | 27/27 | [product-item.liquid](../../../../snippets/product-item.liquid) @L245 |
| [sections/product-content-counter.liquid](../../../../sections/product-content-counter.liquid) | 106/106 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-content-slider.liquid](../../../../sections/product-content-slider.liquid) | 106/106 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-cooling-hero.liquid](../../../../sections/product-cooling-hero.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-cooling-modes.liquid](../../../../sections/product-cooling-modes.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-cooling-vs-bulk.liquid](../../../../sections/product-cooling-vs-bulk.liquid) | 1/1 | [swiper-bundle.min.css](../../../../assets/swiper-bundle.min.css) @L10 |
| [sections/product-cross-sell-banner.liquid](../../../../sections/product-cross-sell-banner.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-expand-image.liquid](../../../../sections/product-expand-image.liquid) | 8/8 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-faqs-section.liquid](../../../../sections/product-faqs-section.liquid) | 115/115 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-feature-tiles.liquid](../../../../sections/product-feature-tiles.liquid) | 3/3 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-featured-banner.liquid](../../../../sections/product-featured-banner.liquid) | 105/105 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-featured-content-icons.liquid](../../../../sections/product-featured-content-icons.liquid) | 8/8 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-hotspot.liquid](../../../../sections/product-hotspot.liquid) | 105/105 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-how-it-works.liquid](../../../../sections/product-how-it-works.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-image-content-expand.liquid](../../../../sections/product-image-content-expand.liquid) | 106/106 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-image-content.liquid](../../../../sections/product-image-content.liquid) | 215/215 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-in-the-field.liquid](../../../../sections/product-in-the-field.liquid) | 1/1 | [swiper-bundle.min.css](../../../../assets/swiper-bundle.min.css) @L8 |
| [sections/product-included.liquid](../../../../sections/product-included.liquid) | 114/113 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-kit-options.liquid](../../../../sections/product-kit-options.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-nav-new.liquid](../../../../sections/product-nav-new.liquid) | 6/6 | [global-vars.liquid](../../../../snippets/global-vars.liquid) @L1；[product-nav-promotion.liquid](../../../../snippets/product-nav-promotion.liquid) @L194；[nav-product-variant.liquid](../../../../snippets/nav-product-variant.liquid) @L197；[size-chart-component.liquid](../../../../snippets/size-chart-component.liquid) @L210；[product-nav-new.js](../../../../assets/product-nav-new.js) @L215 |
| [sections/product-nav.liquid](../../../../sections/product-nav.liquid) | 114/114 | [nav-product-variant.liquid](../../../../snippets/nav-product-variant.liquid) @L641 |
| [sections/product-new-battery-runtime.liquid](../../../../sections/product-new-battery-runtime.liquid) | 1/1 | [product-new-battery-runtime-cards.liquid](../../../../snippets/product-new-battery-runtime-cards.liquid) @L67；[product-new-battery-runtime.css](../../../../assets/product-new-battery-runtime.css) @L2；[product-new-battery-runtime.js](../../../../assets/product-new-battery-runtime.js) @L3 |
| [sections/product-new-battery.liquid](../../../../sections/product-new-battery.liquid) | 1/1 | [heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L357 |
| [sections/product-new-benefits.liquid](../../../../sections/product-new-benefits.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-compare.liquid](../../../../sections/product-new-compare.liquid) | 1/1 | [sale-badge.liquid](../../../../snippets/sale-badge.liquid) @L352；[product-new-price.liquid](../../../../snippets/product-new-price.liquid) @L360；[heatingP-button.liquid](../../../../snippets/heatingP-button.liquid) @L378 |
| [sections/product-new-design-features.liquid](../../../../sections/product-new-design-features.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-faq.liquid](../../../../sections/product-new-faq.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-heat-control.liquid](../../../../sections/product-new-heat-control.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-heating.liquid](../../../../sections/product-new-heating.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-in-box.liquid](../../../../sections/product-new-in-box.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-power-features.liquid](../../../../sections/product-new-power-features.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-specifications.liquid](../../../../sections/product-new-specifications.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-new-technology.liquid](../../../../sections/product-new-technology.liquid) | 1/1 | [heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L379 |
| [sections/product-new-tested-worn.liquid](../../../../sections/product-new-tested-worn.liquid) | 1/1 | [heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L345 |
| [sections/product-new-warranty-information.liquid](../../../../sections/product-new-warranty-information.liquid) | 1/1 | [heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L121 |
| [sections/product-promo.liquid](../../../../sections/product-promo.liquid) | 14/14 | [heatingP-button.liquid](../../../../snippets/heatingP-button.liquid) @L297 |
| [sections/product-recommendation.liquid](../../../../sections/product-recommendation.liquid) | 115/115 | [product-item.liquid](../../../../snippets/product-item.liquid) @L120 |
| [sections/product-review-blog-carousel.liquid](../../../../sections/product-review-blog-carousel.liquid) | 20/20 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-review-section.liquid](../../../../sections/product-review-section.liquid) | 127/127 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-row-layout-content.liquid](../../../../sections/product-row-layout-content.liquid) | 8/7 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-spec-table.liquid](../../../../sections/product-spec-table.liquid) | 1/1 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-specification.liquid](../../../../sections/product-specification.liquid) | 114/114 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/product-versus.liquid](../../../../sections/product-versus.liquid) | 1/1 | [swiper-bundle.min.css](../../../../assets/swiper-bundle.min.css) @L7 |
| [sections/product-video-with-icon-list.liquid](../../../../sections/product-video-with-icon-list.liquid) | 106/106 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [sections/size-chart-table.liquid](../../../../sections/size-chart-table.liquid) | 8/8 | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/battery-icons.liquid](../../../../snippets/battery-icons.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/battery-spec-item.liquid](../../../../snippets/battery-spec-item.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/choose-runtime.liquid](../../../../snippets/choose-runtime.liquid) | — | [product-new-battery-runtime-cards.liquid](../../../../snippets/product-new-battery-runtime-cards.liquid) @L42 |
| [snippets/comp-product-item.liquid](../../../../snippets/comp-product-item.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/edit-product-variant.liquid](../../../../snippets/edit-product-variant.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/global-vars.liquid](../../../../snippets/global-vars.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/heating-12v-image.liquid](../../../../snippets/heating-12v-image.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/heating-icons.liquid](../../../../snippets/heating-icons.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/heatingM-care-instructions.liquid](../../../../snippets/heatingM-care-instructions.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/heatingM-comparison-card.liquid](../../../../snippets/heatingM-comparison-card.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/heatingP-button.liquid](../../../../snippets/heatingP-button.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/nav-product-variant.liquid](../../../../snippets/nav-product-variant.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/okendo-reviews-product-rating-summary.liquid](../../../../snippets/okendo-reviews-product-rating-summary.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-badge.liquid](../../../../snippets/product-badge.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-edit-option.liquid](../../../../snippets/product-edit-option.liquid) | — | [product-card-promotion.liquid](../../../../snippets/product-card-promotion.liquid) @L64；[edit-product-variant.liquid](../../../../snippets/edit-product-variant.liquid) @L68 |
| [snippets/product-heating-feature-icon.liquid](../../../../snippets/product-heating-feature-icon.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-heating-features.liquid](../../../../snippets/product-heating-features.liquid) | — | [product-heating-feature-icon.liquid](../../../../snippets/product-heating-feature-icon.liquid) @L22；[product-heating-features.css](../../../../assets/product-heating-features.css) @L12 |
| [snippets/product-item.liquid](../../../../snippets/product-item.liquid) | — | [product-badge.liquid](../../../../snippets/product-badge.liquid) @L31；[product-variant-colors.liquid](../../../../snippets/product-variant-colors.liquid) @L135；[okendo-reviews-product-rating-summary.liquid](../../../../snippets/okendo-reviews-product-rating-summary.liquid) @L186；[product-card-promotion.liquid](../../../../snippets/product-card-promotion.liquid) @L273 |
| [snippets/product-media.liquid](../../../../snippets/product-media.liquid) | — | [product-badge.liquid](../../../../snippets/product-badge.liquid) @L93 |
| [snippets/product-nav-promotion.liquid](../../../../snippets/product-nav-promotion.liquid) | — | [heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L57 |
| [snippets/product-new-battery-runtime-cards.liquid](../../../../snippets/product-new-battery-runtime-cards.liquid) | — | [product-new-price.liquid](../../../../snippets/product-new-price.liquid) @L194；[heating-icons.liquid](../../../../snippets/heating-icons.liquid) @L199；[heatingP-button.liquid](../../../../snippets/heatingP-button.liquid) @L204 |
| [snippets/product-new-price.liquid](../../../../snippets/product-new-price.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-promotion-banner.liquid](../../../../snippets/product-promotion-banner.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-variant-colors.liquid](../../../../snippets/product-variant-colors.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-variant.liquid](../../../../snippets/product-variant.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/sale-badge.liquid](../../../../snippets/sale-badge.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/size-chart-component.liquid](../../../../snippets/size-chart-component.liquid) | — | [size-chart-component.css](../../../../assets/size-chart-component.css) @L22；[size-chart-component.js](../../../../assets/size-chart-component.js) @L23 |
| [snippets/size-chart-modal.liquid](../../../../snippets/size-chart-modal.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [templates/product.gift-card-pro.liquid](../../../../templates/product.gift-card-pro.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [templates/product.popup.liquid](../../../../templates/product.popup.liquid) | — | [product-edit-option.liquid](../../../../snippets/product-edit-option.liquid) @L5 |

## 资源与共享脚本

以下资源已核对实际加载标签或选择器／函数契约；vendor 库没有逐行审计。

- [assets/bootstrap-custom.css](../../../../assets/bootstrap-custom.css)
- [assets/bootstrap.bundle.min.js](../../../../assets/bootstrap.bundle.min.js)
- [assets/bootstrap.min.css](../../../../assets/bootstrap.min.css)
- [assets/cooling-vest.css](../../../../assets/cooling-vest.css)
- [assets/global.js](../../../../assets/global.js)
- [assets/heatingV-cold-performance.css](../../../../assets/heatingV-cold-performance.css)
- [assets/heatingV-cold-performance.js](../../../../assets/heatingV-cold-performance.js)
- [assets/jquery.min.js](../../../../assets/jquery.min.js)
- [assets/main.js](../../../../assets/main.js)
- [assets/popup-cart.css](../../../../assets/popup-cart.css)
- [assets/popup-cart.js](../../../../assets/popup-cart.js)
- [assets/product-heating-features.css](../../../../assets/product-heating-features.css)
- [assets/product-nav-new.js](../../../../assets/product-nav-new.js)
- [assets/product-new-battery-runtime.css](../../../../assets/product-new-battery-runtime.css)
- [assets/product-new-battery-runtime.js](../../../../assets/product-new-battery-runtime.js)
- [assets/product.css](../../../../assets/product.css)
- [assets/product.js](../../../../assets/product.js)
- [assets/res-base.css](../../../../assets/res-base.css)
- [assets/res-font.css](../../../../assets/res-font.css)
- [assets/res-popup-cart.css](../../../../assets/res-popup-cart.css)
- [assets/res-product-item.css](../../../../assets/res-product-item.css)
- [assets/size-chart-component.css](../../../../assets/size-chart-component.css)
- [assets/size-chart-component.js](../../../../assets/size-chart-component.js)
- [assets/style.css](../../../../assets/style.css)
- [assets/swiper-bundle.min.css](../../../../assets/swiper-bundle.min.css)
- [assets/swiper-bundle.min.js](../../../../assets/swiper-bundle.min.js)
- [layout/theme.liquid](../../../../layout/theme.liquid)

外部数据／接口与消费者详见 architecture.md 和项目 module-map；此清单不把全局加载资源重复展开为 snippet 边。

## 配置依赖

- [config/settings_schema.json](../../../../config/settings_schema.json)：全局设置定义。
- [config/settings_data.json](../../../../config/settings_data.json)：本地配置与应用 embeds，不代表线上状态。
