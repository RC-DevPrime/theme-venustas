# Header 实际文件清单

## 2026-11-26 条宽与下拉对齐

- assets/header-new.css：`.header-new__bar` 桌面宽 `min(100% - 100px,1720px)`；移动断点 1280（桌面从 1281 起）。≥1281 下拉内容与 Logo 左对齐，≥1521 改为与导航 New 对齐（`--header-bar-inset` + 186px），作用于 panel-inner 与 campaign-layout；Help 面板右侧 `max(50px,…)`。
- assets/header-new.js：`matchMedia('(max-width: 1280px)')`；sections/header-new.liquid 的 68px 高度改为 `min-width:1281px`。
- assets/style.css：`.predictive-search__bar` 同步 100px 内缩，搜索弹层 Logo 与 header Logo 对齐。

## 2026-11-26 顶部图标 hover

- snippets/header-icons.liquid：search／wishlist／cart／help-circle／help 等图标的固定深色改为 `currentColor`（drawer-close 白色保留）。
- assets/header-new.css：工具图标容器加颜色过渡，`@media (hover:hover)` 下 `.header-new__search／__mobile-search／__mobile-gift／__help／__cart／__utility-icon` hover 变 `#b93205`；Help 字标模拟字重的描边改为 currentColor。

## 2026-11-26 Help 链接与邮箱按钮

- sections/header-new.liquid：Help 六项 URL 统一 `append: ''` 转字符串并逐个补绝对地址回退（Registration 用 venustas.com 页面，Claim 未配置回退 Help Center），href 加 escape，`target="_blank" rel="noopener"` 新标签页打开。
- assets/header-new.js：焦点离开导航时不再自动关闭 Help 面板；Help 内 https 链接点击时 `window.open(...,'_blank')`，被拦截则 `location.assign` 回退，面板保持展开，由 Help 按钮／点击外部／Esc 关闭。
- assets/header-new.css：`.header-new__help-email:hover { background:#b93205 }` 并加过渡。

## 2026-11-26 桌面 predictive search 结构

- sections/search.liquid：删除 Bootstrap 栅格（logo 列、表单列、空列）与 `.container`／`.input-group`，新结构 `.predictive-search__bar` → `predictive-search.predictive-search__box` → `form.predictive-search__field`；保留 `#predictive-search` 与 `.inner-content` 供 JS 使用。
- assets/style.css：新增 `predictive-search__bar/box/field` 规则，搜索框 800px、输入 44 高胶囊；结果面板 `.predictive-search__results` 同为 800px。搜索条宽 `min(100%-40px,1720px)`、高跟随 `--header-nav-height`（≥1280 为 68），Logo 绝对定位左侧、搜索框居中 800。

## 2026-11-26 桌面 predictive search

- sections/search.liquid：搜索按钮与关闭入口改用 `header-icons` 的 search／close SVG，保留 `.icon-close` 供 header-new.js 关闭逻辑识别。
- assets/style.css：表单改 44 高胶囊（圆角 32、1px rgba(0,0,0,.2)、14/20 输入），`#predictive-search` 面板 min(1340px,100%-40px)、内边距 24/20/28，结果标题 14/20 #515151、词条白底边框、view-all 14/20。

## 2026-11-26 活动面板商品卡角标

- snippets/header-new-product-card.liquid：`product-menu-badge` 移入 `.header-new__campaign-product-media`，角标以图片容器定位。
- assets/header-new.css：图片容器加 `position:relative`；`.header-new__campaign-product-media .menu-badge` 设 top/right 8px、圆角 4、底色 #ff5d5f、白字 600。

## 2026-11-25 header-new.css 前移

- layout/theme.liquid：head 的 res-base/res-font 之后加载 header-new.css（唯一引用），保证首帧有样式。
- sections/header-new.liquid、sections/announcement-bar.liquid：删除各自的 header-new.css 输出；header-new.js 仍由 header-new section 以 defer 加载。

## 2026-11-25 移动端搜索弹层样式

- assets/header-new.css（`.header-new__search-*` 段）：抽屉满宽，搜索胶囊 44 高／圆角 32／1px 边框／图标 18，内容左右 20、区块间距 20，标题 14/20，词条两列间距 12，商品两列间距 16、图片 167:209、标题 14/20、主价 16、对比价 12，折扣角标 9/600 渐变压角。
- 未改 snippets/header-new-search-mobile.liquid 与 header-new.js；390 宽下内容宽度为 350。

## 2026-11-25 Category image menu 移动端标题

- blocks/_header-nav-image-menu.liquid：命中槽位后读取 `title_N` 作为移动端标题（`item_title_mobile`，空值回退菜单名），标题拆成 `--desktop`／`--mobile` 两个 span，两者都保留 badge，图片 alt 用移动端标题。
- assets/header-new.css：基础隐藏 `--mobile`，≤1199px 隐藏 `--desktop`、显示 `--mobile`；桌面端仍显示菜单名。

## 2026-11-25 移动端列角色修正

- sections/header-group-new.json：Men／Women 的 “Shop by Style”、New 面板的 “New Arrival” 由 `role: category` 改为 `role: group`；仅 Men／Women 的 “Shop by Category” 保留 category 角色。
- assets/header-new.js：`syncColumns()` 的隐藏按钮条件由“第一列”改为“role = category”，category 列在移动端始终展开；其余列显示标题行，第一列只在初始化时展开、点击标题可折叠，其它列默认折叠。
- 桌面端不受角色改动影响（role 只用于移动端内容内边距与图片菜单下 featured 字重）。

## 2026-11-25 移动端导航折叠与 Technology 位置

- blocks/_header-nav-column.liquid：折叠按钮改为所有列输出（含 category 角色），移除 `data-mobile-open` 与 `mobile_open` 设置；`role` 仍控制移动端内容内边距与 featured 字重。
- assets/header-new.js：`preparePanel()` 写 `data-column-first`；`reset()` 只默认展开第一列；`syncColumns()` 去掉 category 特例，第一列隐藏按钮、其余列按展开状态切换，桌面端全部展开。
- blocks/_header-nav-button.liquid + assets/header-new.css：primary 仅桌面可见、secondary 移动可见时加 `--mobile-secondary`，移动端 `order: 3` 排在推广卡之后。
- 未改 sections/header-group-new.json（后台自动生成）；其中残留的 `mobile_open` 键已无 schema。

## 2026-11-25 Category image menu 完整地址匹配

- blocks/_header-nav-image-menu.liquid：菜单链接与图片槽位改为按含查询参数的完整地址匹配（路径 + 逐参数精确比较，参数最多者优先），`shopify://` 简写补成路径、`%20`／`+` 与 `www.` 归一；不再只比较路径导致所有 `/collections/men?...` 命中第一个槽位。

## 2026-11-25 活动商品卡标题与 Menu list 徽标

- snippets/header-new-product-card.liquid → assets/header-new.css：`.header-new__campaign-product-title` 两行截断（-webkit-line-clamp）。
- blocks/_header-nav-menu.liquid：Menu list 区块已存在“菜单非空用菜单链接、为空回退四个初始链接”；本次增加徽标解析：标题或地址末尾的 `#文本` 直接作为徽标（无词表），输出 `.header-new__badge` 并从标题／href 去掉该段，全小写徽标首字母大写；`menu` 设置 info 同步说明。
- 未新增资产或依赖；徽标样式复用 assets/header-new.css:221 `.header-new__badge`。

## 2026-11-25 旧导航删除

旧 header section、旧 header group 与全部 mega-menu 片段已删除，共 20 个文件：sections/header.liquid、sections/header-group.json、assets/mega-menu.css、snippets/mega-menu*（4）、snippets/header-mega-*（11）、snippets/product-item-mega-menu*（2）、snippets/product-menu-badge.liquid；并移除 theme.liquid 与 theme.pagefly.liquid 中的 mega-menu.css 引用。当前入口只有 `layout/theme.liquid → sections/header-group-new.json`，order：announcement_bar → header_new → search → popup-cart，四个 section 文件均存在。下方 2026-11-23 基线表格与“旧文件仍存在”的描述已过时，仅作历史记录。详见 [日志](../../logs/header/2026-11-25-remove-legacy-header.md)。

## 2026-11-24 公告栏独立

- sections/announcement-bar.liquid：新公告 section（header group），设置、两类区块、38px 高度变量、header-announcement 标记。
- sections/header-group-new.json：announcement_bar 置于 header_new 前，迁移 3 条公告与 #000/#fff、autoplay 4。
- assets/header-new.css：header 40/68 与公告高度叠加、导航条/抽屉偏移、40px 控件、公告全部样式。
- assets/header-new.js：公告 Swiper／marquee／倒计时／关闭／section 重载，measure 不再写 --header-nav-height。
- sections/header-new.liquid：nav 40/68（1280 断点）、headerHeight 叠加公告；assets/main.js 的旧 section:load 仅在旧 header 内有公告时写高度。详见 [日志](../../logs/header/2026-11-24-announcement-bar-section.md)。

## 2026-11-24 功能入口

- sections/header-new.liquid → header-icons、header-new-localization；group设置初始化旧Logo/功能链接。
- header-icons → 旧图标路径、icon_currency旗帜与用户Help SVG，无新SVG文件。
- assets/header-new.js → window.openCart、cart:updated、SwymCallbacks、既有.predictive-search；国家菜单使用旧原生站点链接。
- header-new.css、_header-nav-image-menu/_header-nav-promo及header-new-product-card的sizes统一1199px断点。
- 未修改旧 header.liquid、main.js/global.js/popup-cart.js 或搜索section。见 [日志](../../logs/header/2026-11-24-header-utilities.md)。

## 2026-11-24 Accessories／Gift

- sections/header-new.liquid：按当前面板 menu_key 自动生成下拉入口，移除硬编码入口名单。
- sections/header-group-new.json：修正用户现有 Accessories 两列与移动默认收起，补齐 Gift 三列与两面板的双推广卡，复用既有块与样式／脚本。
- 无新增业务文件或全局依赖，见 [任务日志](../../logs/header/2026-11-24-accessories-gift-navigation.md)。

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
- blocks/_header-nav-column.liquid → _header-nav-featured、_header-nav-image-menu、_header-nav-menu、_header-nav-feature。
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
