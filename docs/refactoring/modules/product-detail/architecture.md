# Product Detail 架构

基线：2026-11-23，仅本地静态代码／配置。

## 页面与数据

127 个 product JSON 均定义 main-product 和 product-review-section；不同 suffix 使用不同营销内容／导航。默认 product.json 仅按顺序启用 main-product、product-review-section、product-featured-banner，不能将所有 product-* 文件都算作默认商品页组成。

main-product include global-vars 设置 CAD 的 curSym；读取 product、variant、promo/custom/proviews metafields 与 shop.metaobjects.size_chart。schema blocks 控制标题、价格、运行时选择、变体、库存、加购、推荐配件、支持信息和 app 区域；可见内容依赖 block 配置而非仅文件存在。

核心静态分支：product-media、product-heating-features、product-promotion-banner、choose-runtime、product-variant、comp-product-item、product-badge、size-chart-modal、product-edit-option。choose-runtime 经 battery_comparison_group 读取 runtime 卡片。尺码和颜色依赖后台 metaobject／metafield，需保持空值与回退逻辑。

## 变体、加购和库存

- product-variant 输出 variant-radios 与变体 JSON；global.js 的 VariantSelects/VariantRadios 执行选项、隐藏 input、价格和导航同步，并抓取变体页面 HTML。
- main-product 有主商品表单及隐藏商品内容／编辑弹窗；product.popup 使用 layout none 输出相同 product-edit-option，用于共享编辑弹窗请求。main.js 含 URL 回退与弹窗加载逻辑。
- popup-cart.js 处理主区及跨页面加购、cart API 和刷新；product.js 也包含商品／导航加购路径，具体改动需核对实际绑定而非按名称认定唯一入口。
- product.js 的 venustasRegionalInventoryGate 暴露 update、canAddSelectedVariant、syncNavInventoryMarkup、refreshInventoryInfoForVariant 等能力，观察应用 DOM、同步主区／导航库存，根据区域状态控制加购；包含变体页面请求和 iframe 回退。
- main-product 中 availability 脚本将应用节点移动至展示槽。应用注入时机与 DOM 结构属于运行依赖，本地模板不能独立证明库存。

## 导航、附属模块及资源

product-nav 和 product-nav-new 由具体模板选择；新导航加载 product-nav-new.js，调用 nav-product-variant、size-chart-component 和 product-nav-promotion。不能把商品页内导航与站点 Header 混淆。

旧 product-nav 的 `.main-nav-header-section` 由 product.js 的 `nav_header_scroll` 在滚动后加 `.product-header-sticky` 固定定位，`top` 依赖 Header 高度变量 `--header-nav-height`（移动端 40px、≥1281 为 68px）与公告栏 `--announcement-current-height`（38px／0）；滚动态 Header 保持显示。调整 Header 高度、公告栏或这些变量时需同步该表达式。

layout 按 product 加载 product.css、product.js、product-new-battery-runtime.css/js；product-heating-features snippet 按其分支加载专用 CSS。main/global/popup-cart、Bootstrap、Swiper 仍为公共依赖；产品内容 sections 中还有各自的内联样式／脚本和静态引用，见 files.md。

product-review-section 动态 render app block；settings_data 配置 Okendo、多地点库存及其他应用。product.gift-card-pro 使用 layout none 跳转 `/a/gc/gift-card/`，不是普通商品详情布局。
