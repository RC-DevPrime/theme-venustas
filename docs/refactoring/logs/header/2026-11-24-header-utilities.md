# 2026-11-24 Header 功能入口

- 模块：header
- 状态：本地实现和定向静态校验；浏览器、应用及主题同步待验证
- 环境／源码基线：D:/zyl/theme-venustas；保留上批 Accessories/Gift 未提交改动及所有面板配置
- 批准依据：用户要求按 Figma 补充购物车、Help 等图标与 Logo，图标从旧 Header 和用户 SVG 获取、由 header-icons 管理，相关逻辑放入 header-new.js；Help 下拉不实现
- 批准范围：Logo、搜索、账户、Wishlist、购物车、US/CA切换、Help入口；复用既有组件，不改旧 Header，不提交／推送／发布

## 目标与源码证据

Figma file lKrjxX1me3oajXobNizmhj 节点6226:4729，读取 design context 与返回截图；移动登录／未登录及国家列表按用户截图。旧 header.liquid 提供账户/Wishlist/购物车SVG、搜索/菜单/关闭图片来源及国家站点链接，用户提供 Help 两条path。旧 group 的 logo=shopify://shop_images/main-header-logo.png、Support Help/Returns 和 popup-cart Loyalty链接用于初始化。

popup-cart.js 的 openCart() 已管理购物车弹层／刷新，cart:updated 的 detail 为购物车数据。旧 .header .icon-cart 直接绑定点击，故新按钮使用 data-header-cart 调用函数并监听更新，不重复绑定。旧 main.js 搜索初始化受 header-wrapper 条件限制，新 Header 无此类；新脚本独立打开／关闭既有 search section。旧 global.js .icon-local 绑定不复用，新地区按钮以 data 属性管理展开、使用旧 US/CA 原生站点链接。

## 实际变更

- sections/header-new.liquid：桌面完整工具栏、Logo、移动抽屉账户/Help/Wishlist/国家入口、遮罩及必要链接设置。Help只跳转帮助中心。
- snippets/header-icons.liquid：复制旧图标／素材来源，加入用户完整Help与圆形Help变体，旗帜复用icon_currency；新增header-new-localization.liquid用于两端同源US/CA列表。
- assets/header-new.js：调用现有openCart（模块缺失时回退/cart），监听cart:updated更新数量；SwymCallbacks对接Wishlist并清理迟到点击状态；搜索复用既有弹层，关闭/遮罩/Escape/Tab焦点及滚动恢复；国家列表原生链接＋展开状态，延续section卸载清理。
- assets/header-new.css：完整布局及移动灰底工具区域，67px桌面/56px移动高度；CSS与JS统一1199px移动断点，窄屏Logo自适应，抽屉宽度至多390px。
- sections/header-group-new.json：仅新增功能入口设置，从旧配置初始化Logo/帮助/退货/Loyalty/站点链接，面板数据保留。
- 分类图片菜单、推广卡和活动商品卡的 sizes 提示同步1199断点与抽屉实际宽度，避免平板显示移动图时仍选1px提示产生低清图片。

无新图标文件／库，无Figma临时资源URL进入运行代码。Profile/Orders未配置专用链接时均回退原生account_url；Help不添加未实现下拉的交互。

## 验证

node --check assets/header-new.js、schema/设置引用与既有区块保留检查、git diff --check 通过。隔离目录 Shopify CLI theme check（LiquidHTMLSyntaxError、ValidSchema、JSONSyntaxError、ValidSettingsKey）返回 []。静态复审修复320px窄屏Logo拥挤，检查新按钮避开旧绑定和section生命周期。未运行浏览器、应用联调、上传或全量构建。

## 文档与决策

更新 Header 档案及项目模块关系。复用现有购物车/搜索/应用契约，没有迁移全站共享功能，无新增ADR。

## 风险、回退与遗留

Wishlist依赖现有应用加载，账户状态与链接依赖商店；US/CA仍跨旧域名，不改市场模型。H-001预测搜索响应section缺口为旧问题，本批只接入旧搜索弹层与原生表单，不宣称预测建议已修复。后台资源和运行效果未验证；保留既有超50区块实验，不新增导航块。回退本批功能入口、脚本/样式和新增本地化snippet即可恢复导航版本，旧 Header 未修改。
