# Header 实际文件清单

## 2026-11-24 Sale 扩展

- sections/header-new.liquid：sale 加入可展开面板入口键。
- sections/header-group-new.json：新增 sale_panel → 五个 _header-nav-category；复用活动面板，不添加底部按钮区块。
- blocks/_header-nav-category.liquid：空内容标题回退集合标题，既有 Bundles 显式标题优先。
- 无新增业务文件、CSS/JS或依赖；旧 Header 与其他面板数据保留。见 [任务日志](../../logs/header/2026-11-24-sale-navigation.md)。

## 2026-11-24 Bundles 扩展

- sections/header-new.liquid：增加 bundles 面板入口键及 _header-nav-campaign 类型。
- sections/header-group-new.json：新增 bundles_panel → 四个 _header-nav-category + _header-nav-button，旧 dislay_6 集合与文字复制；原面板配置保留。
- blocks/_header-nav-campaign.liquid：活动面板与编辑器设置，content_for 子区块。
- blocks/_header-nav-category.liquid → snippets/header-new-product-card.liquid：集合分类与前四商品。
- assets/header-new.js：局部分类选择、网格位置、默认非空分类及编辑器选中；assets/header-new.css：活动导航桌面／移动样式。
- 旧 sections/header-group.json、header.liquid 和旧 Bundle snippets 未修改。

## 2026-11-23 Men／Women 扩展

- sections/header-new.liquid：固定导航中 new/men/women 启用面板入口；沿用 assets/header-new.js 的现有交互，本批未改脚本。
- sections/header-group-new.json：保留 New/search/popup-cart，新增 Men、Women 的独立四列配置与各自双卡、双链接 footer。
- blocks/_header-nav-column.liquid → 新增允许 _header-nav-image-menu；列内四类内容齐全。
- blocks/_header-nav-image-menu.liquid：新增菜单第一层输出、八组 URL 图片映射、缺图占位和初始内容；_header-nav-menu.liquid 增加四组初始链接回退。
- blocks/_header-nav-button.liquid：同一 footer 的两个独立链接及显示端；assets/header-new.css 增加图片菜单与双链接样式。
- blocks/_header-nav-promo.liquid → assets/header-new-volcano.jpg、header-new-apex.jpg（本次 Figma 原图，默认素材回退，可后台替换）。

详见 [任务日志](../../logs/header/2026-11-23-men-women-navigation.md)。以下首批 New 引用记录保留为历史。

## 2026-11-23 新增入口

- layout/theme.liquid 当前引用 sections/header-group-new.json；原 group 保留。
- sections/header-new.liquid → assets/header-new.css、assets/header-new.js、snippets/header-icons.liquid，以及嵌套主题区块。
- blocks/_header-nav-group.liquid → _header-nav-column、_header-nav-promo、_header-nav-button。
- blocks/_header-nav-column.liquid → _header-nav-featured、_header-nav-menu、_header-nav-feature。
- snippets/header-icons.liquid → heating-icons.liquid 的既有左右箭头；未新增 SVG 素材。
- header-group-new.json 的 New 面板使用三列、两推广卡与桌面底部按钮，推广图片／标题／地址来自旧 New 配置；search、popup-cart 数据原样保留。

以下为旧实现的静态引用基线，旧文件仍存在。

基线：2026-11-23，本地静态引用。已读取入口／关键交互代码，并对下列文件提取实际字面量 render/include、asset_url；不是按名称归类。仅列静态可追溯关系，动态 app render、分支是否运行、外部注入不在此闭包内。调用行号用于定位，变更后须核对当前源码。

## Group 编排

入口：[layout/theme.liquid](../../../../layout/theme.liquid) → [sections/header-group.json](../../../../sections/header-group.json)；order：header → search → popup-cart，本地三者均未停用。


## Sections／Snippets／专用模板与调用点

下表的箭头目标为直接静态调用；`@L` 是调用方行号。模板统计为“定义实例数 / order 中启用实例数”，同模板多实例分别计数。未显示的资源仍可能由 layout 全局加载。

| 文件 | 模板统计 | 直接静态依赖（调用方位置） |
| --- | --- | --- |
| [sections/header.liquid](../../../../sections/header.liquid) | — | [icon_currency.liquid](../../../../snippets/icon_currency.liquid) @L231；[mega-menu.liquid](../../../../snippets/mega-menu.liquid) @L449；[header-mega-mobile-display-1.liquid](../../../../snippets/header-mega-mobile-display-1.liquid) @L676；[header-mega-mobile-display-2.liquid](../../../../snippets/header-mega-mobile-display-2.liquid) @L678；[header-mega-mobile-display-3.liquid](../../../../snippets/header-mega-mobile-display-3.liquid) @L680；[header-mega-mobile-display-4.liquid](../../../../snippets/header-mega-mobile-display-4.liquid) @L682；[header-mega-mobile-display-5.liquid](../../../../snippets/header-mega-mobile-display-5.liquid) @L684；[header-mega-mobile-display-6.liquid](../../../../snippets/header-mega-mobile-display-6.liquid) @L686 |
| [sections/popup-cart.liquid](../../../../sections/popup-cart.liquid) | — | [global-vars.liquid](../../../../snippets/global-vars.liquid) @L1；[free-shipping-progress.liquid](../../../../snippets/free-shipping-progress.liquid) @L34；[product-update-popup.liquid](../../../../snippets/product-update-popup.liquid) @L116；[cart-item-discounts.liquid](../../../../snippets/cart-item-discounts.liquid) @L193；[cart-discount-codes.liquid](../../../../snippets/cart-discount-codes.liquid) @L348 |
| [sections/search.liquid](../../../../sections/search.liquid) | — | [search-recommendations.liquid](../../../../snippets/search-recommendations.liquid) @L49；[predictive-search.js](../../../../assets/predictive-search.js) @L1 |
| [snippets/cart-discount-codes.liquid](../../../../snippets/cart-discount-codes.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/cart-item-discounts.liquid](../../../../snippets/cart-item-discounts.liquid) | — | [icon-discount.liquid](../../../../snippets/icon-discount.liquid) @L4 |
| [snippets/edit-product-variant.liquid](../../../../snippets/edit-product-variant.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/free-shipping-progress.liquid](../../../../snippets/free-shipping-progress.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/global-vars.liquid](../../../../snippets/global-vars.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/header-mega-bundle-panel.liquid](../../../../snippets/header-mega-bundle-panel.liquid) | — | [header-mega-bundle-product-card.liquid](../../../../snippets/header-mega-bundle-product-card.liquid) @L22 |
| [snippets/header-mega-bundle-product-card.liquid](../../../../snippets/header-mega-bundle-product-card.liquid) | — | [product-menu-badge.liquid](../../../../snippets/product-menu-badge.liquid) @L16 |
| [snippets/header-mega-desktop-display-6.liquid](../../../../snippets/header-mega-desktop-display-6.liquid) | — | [header-mega-bundle-panel.liquid](../../../../snippets/header-mega-bundle-panel.liquid) @L55 |
| [snippets/header-mega-mobile-bundle-category.liquid](../../../../snippets/header-mega-mobile-bundle-category.liquid) | — | [header-mega-bundle-product-card.liquid](../../../../snippets/header-mega-bundle-product-card.liquid) @L13 |
| [snippets/header-mega-mobile-display-1.liquid](../../../../snippets/header-mega-mobile-display-1.liquid) | — | [mega-menu-link.liquid](../../../../snippets/mega-menu-link.liquid) @L48；[product-item-mega-menu.liquid](../../../../snippets/product-item-mega-menu.liquid) @L96 |
| [snippets/header-mega-mobile-display-2.liquid](../../../../snippets/header-mega-mobile-display-2.liquid) | — | [mega-menu-d2-product-loop.liquid](../../../../snippets/mega-menu-d2-product-loop.liquid) @L43；[mega-menu-d2-mobile-product-rows.liquid](../../../../snippets/mega-menu-d2-mobile-product-rows.liquid) @L247 |
| [snippets/header-mega-mobile-display-3-4.liquid](../../../../snippets/header-mega-mobile-display-3-4.liquid) | — | [mega-menu-link.liquid](../../../../snippets/mega-menu-link.liquid) @L88 |
| [snippets/header-mega-mobile-display-3.liquid](../../../../snippets/header-mega-mobile-display-3.liquid) | — | [header-mega-mobile-display-3-4.liquid](../../../../snippets/header-mega-mobile-display-3-4.liquid) @L1 |
| [snippets/header-mega-mobile-display-4.liquid](../../../../snippets/header-mega-mobile-display-4.liquid) | — | [header-mega-mobile-display-3-4.liquid](../../../../snippets/header-mega-mobile-display-3-4.liquid) @L1 |
| [snippets/header-mega-mobile-display-5.liquid](../../../../snippets/header-mega-mobile-display-5.liquid) | — | [mega-menu-link.liquid](../../../../snippets/mega-menu-link.liquid) @L87 |
| [snippets/header-mega-mobile-display-6.liquid](../../../../snippets/header-mega-mobile-display-6.liquid) | — | [header-mega-mobile-bundle-category.liquid](../../../../snippets/header-mega-mobile-bundle-category.liquid) @L49 |
| [snippets/icon-discount.liquid](../../../../snippets/icon-discount.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/icon_currency.liquid](../../../../snippets/icon_currency.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/mega-menu-d2-mobile-product-rows.liquid](../../../../snippets/mega-menu-d2-mobile-product-rows.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/mega-menu-d2-product-loop.liquid](../../../../snippets/mega-menu-d2-product-loop.liquid) | — | [product-item-mega-menu-display-2.liquid](../../../../snippets/product-item-mega-menu-display-2.liquid) @L19 |
| [snippets/mega-menu-link.liquid](../../../../snippets/mega-menu-link.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/mega-menu.liquid](../../../../snippets/mega-menu.liquid) | — | [mega-menu-link.liquid](../../../../snippets/mega-menu-link.liquid) @L23；[product-item-mega-menu.liquid](../../../../snippets/product-item-mega-menu.liquid) @L68；[mega-menu-d2-product-loop.liquid](../../../../snippets/mega-menu-d2-product-loop.liquid) @L157；[header-mega-desktop-display-6.liquid](../../../../snippets/header-mega-desktop-display-6.liquid) @L462 |
| [snippets/product-item-mega-menu-display-2.liquid](../../../../snippets/product-item-mega-menu-display-2.liquid) | — | [product-menu-badge.liquid](../../../../snippets/product-menu-badge.liquid) @L79 |
| [snippets/product-item-mega-menu.liquid](../../../../snippets/product-item-mega-menu.liquid) | — | [product-menu-badge.liquid](../../../../snippets/product-menu-badge.liquid) @L81 |
| [snippets/product-menu-badge.liquid](../../../../snippets/product-menu-badge.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |
| [snippets/product-update-popup.liquid](../../../../snippets/product-update-popup.liquid) | — | [edit-product-variant.liquid](../../../../snippets/edit-product-variant.liquid) @L90 |
| [snippets/search-recommendations.liquid](../../../../snippets/search-recommendations.liquid) | — | 无字面量 snippet／asset_url 调用（不代表无数据或 JS 依赖） |

## 资源与共享脚本

以下资源已核对实际加载标签或选择器／函数契约；vendor 库没有逐行审计。

- [assets/bootstrap-custom.css](../../../../assets/bootstrap-custom.css)
- [assets/bootstrap.bundle.min.js](../../../../assets/bootstrap.bundle.min.js)
- [assets/bootstrap.min.css](../../../../assets/bootstrap.min.css)
- [assets/global.js](../../../../assets/global.js)
- [assets/jquery.min.js](../../../../assets/jquery.min.js)
- [assets/main.js](../../../../assets/main.js)
- [assets/mega-menu.css](../../../../assets/mega-menu.css)
- [assets/popup-cart.css](../../../../assets/popup-cart.css)
- [assets/popup-cart.js](../../../../assets/popup-cart.js)
- [assets/predictive-search.js](../../../../assets/predictive-search.js)
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
