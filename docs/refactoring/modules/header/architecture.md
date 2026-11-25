# Header 架构

2026-11-25 移动端导航折叠：所有导航列（含 `role: category`）都输出折叠按钮，但第一列（DOM 顺序）不显示按钮、直接展开，其余列显示标题行并默认折叠；默认展开值由 JS 按 `data-column-first` 计算，不再读取列级的 `mobile_open`（该设置已移除）。`_header-nav-button` 在 primary 仅桌面可见、secondary 移动可见时加 `--mobile-secondary`，CSS 用 `order: 3` 把 “Our Technology: Heatwave™ & PowerCore™” 排到推广卡（order 2）之后。详见[日志](../../logs/header/2026-11-25-mobile-nav-accordion.md)。

2026-11-25 类名解耦：`<nav class="header-new">` 不再带 `header` 类，样式全部由 header-new.css 提供（原 style.css `.header` 仅补充 transition，已并入）。所有页面脚本改用 `.header-new`：collection／article／blog 量高度、main.js 的 getHeaderHeight 与页面导航偏移、page／product／tech-core 的 `header-hide` 滚动隐藏（CSS 同步为 `nav.header-new.header-hide`）、cooling-vest-nav 偏移、heatingV-anchor-nav 滚动偏移、index-banner-slider 的 header 查询。旧 header 专属的 CSS（213 条）与 JS（公告 Swiper／marquee／倒计时、mega 与移动菜单、语言选择、`.icon-cart` 购物车、`HeaderDrawer`、透明头开关）已删除。详见[日志](../../logs/header/2026-11-25-header-class-decoupling.md)。

2026-11-25 旧导航删除：sections/header.liquid、sections/header-group.json 及全部 mega-menu 系列 snippet、assets/mega-menu.css 已删除，两个 layout 的 mega-menu.css 引用同步移除；入口仅剩 `layout/theme.liquid:358 → sections/header-group-new.json`（announcement_bar → header_new → search → popup-cart）。新导航保持 `<nav class="header header-new">`：`header` 类与 header group 位置是 collection.js／article.js／blog.js／main.js／global.js 的 `.header` 与 `--headerHeight` 锚点，`--headerHeight` 由 header-new.js 测量写入，清理时不可移除。共享样式 style.css／res-base.css 中的旧导航选择器因与新导航共用 `.header` 基础规则暂留（已无匹配 DOM）。详见[日志](../../logs/header/2026-11-25-remove-legacy-header.md)。

2026-11-24 公告栏独立：announcement-bar section 位于 header group 的 header 前，`.header-announcement` 固定 top:0、高 38；header 盒高改为 `--header-nav-height`（<1280 40、≥1280 68）+ `--announcement-current-height`，导航条整体下移，占位随 `.header` 实测高度；关闭/过期写 0，`ResizeObserver` 自动更新。公告样式与 Swiper／marquee／倒计时／关闭全部在 header-new.css／header-new.js，类名统一 `header-announcement`，旧 main.js 公告逻辑因选择器不匹配而不执行。移动抽屉 top 让出公告高度；panel 的 max-height 改用 `--headerHeight`。classic main.js 仅在自身 section 含 `.announcement-bar` 时写公告高度。详见[日志](../../logs/header/2026-11-24-announcement-bar-section.md)。

2026-11-24 桌面布局：按 Figma 6175:2532 对齐——header 高 68（--header-nav-height 同步）、bar 左右 100px（1920 下 min(100%-40px,1720px)）、左侧 Logo 154 + 32 间距 + 8 项导航（gap 30、16/21 #161616）合计约 800、右侧搜索胶囊 100×36 与 Help/账户/心/购物车/地区按 28/16/16/28 与图一致。搜索入口保持链接，点击仍打开既有 .predictive-search 弹层，未做行内展开。1200–1599 收窄导航间距并只留搜索图标。详见[日志](../../logs/header/2026-11-24-desktop-header-layout.md)。

2026-11-24 细节补充：移动 Help 行右侧加箭头（复用 .header-new__nav-chevron，utility-row 内 margin-left:auto）；桌面 Gift 面板底部 guide 块补 shopify://pages/gift-guide 后恢复渲染，因为 `_header-nav-button` 只有在 title 与 url 同时非空时才输出。详见[日志](../../logs/header/2026-11-24-mobile-help-chevron-gift-guide.md)。

2026-11-24 Help 面板：Help 入口不再直达 help_link，改为仅点击触发的面板：桌面右对齐 347px 卡片、移动抽屉内 Help 页（复用 data-header-panel/showPanel、panel-top 返回行，用 data-help-open 例外保留抽屉 Logo）。内容为 6 行固定文案（Order Tracking、Returns & Exchanges、Warranty Registration、Warranty Claim、User Manuals、Help Center）+ mailto 按钮 + 电话说明；前五项与 Help Center 使用主题已有地址作默认回退（aftership、returnscenter、shopify://pages/warranty-registration、zendesk User-Manual、help_link），Warranty Claim 默认空值且可在 section 设置配置；行 hover 为 #f5f5f5。图标集中在 header-icons（5 个用户 SVG + 复用 help-circle）。详见[日志](../../logs/header/2026-11-24-help-panel.md)。

2026-11-24 移动抽屉修正：按旧样式从左边缘滑出，全高、89%宽且最大600px；内部独立滚动，外侧40px橙色圆角关闭按钮复用旧close-nav-mobile图片。My Account固定显示Profile、Orders、Return Center、Loyalty Hub，不再按登录态替换成访客入口。详见[日志](../../logs/header/2026-11-24-mobile-drawer.md)。此前390px居中留白抽屉为历史实现。

## 2026-11-24 功能入口接入

新 Header 已接入旧 Logo、搜索、账户、Wishlist、购物车、US/CA与Help链接，详情见 [日志](../../logs/header/2026-11-24-header-utilities.md)。图标集中header-icons，Help使用用户SVG且不实现下拉。购物车调用现有openCart与cart:updated，不使用旧icon-cart绑定；Wishlist通过SwymCallbacks；地区切换保留旧域名跳转，不使用icon-local双重初始化。搜索打开既有section并管理关闭／键盘与滚动，H-001旧缺口未扩展修复。

两端共用原导航数据。为完整Logo/八导航/搜索/图标布局，CSS/JS统一1199px移动断点，桌面67px、移动56px，继续输出旧高度变量／事件。移动抽屉增加遮罩和登录态账户区，进入导航面板时隐藏底部工具区；图片sizes同步断点和最大390px抽屉。所有旧业务组件文件保留。

## 2026-11-24 Bundles／Sale 面板恢复

ed170a6“Update from Shopify … by Yaoyao zhang”把 sections/header-group-new.json 整体回写，覆盖掉 c202258 新增的两个 _header-nav-campaign，Bundles／Sale 因此没有可展开面板。本地已从 c202258 增量恢复 bundles_panel（menu_key bundles，入口集合 bundle-deal）与 sale_panel（menu_key sale，category_1／2／4／5／6 对应 campaign、deal-of-the-week、mega-clearance-sale、new-customer、outlet），纯新增 177 行，既有 New／Men／Women／Accessories／Gift 未改，header_new 现为 7 个块。运行时匹配无需改动代码。后台再次整体保存仍可能覆盖本地配置。详见 [日志](../../logs/header/2026-11-24-restore-bundles-sale-panels.md)。

## 2026-11-24 Accessories／Gift 与自动关联

用户已在 group 添加 Accessories，但原 section 的 navigation_panel_keys 固定名单不包含 accessories，顶级入口因此仍输出普通链接，已有面板不会被展开。当时改为遍历当前 section.blocks，以 settings.menu_key 标准化后匹配顶级名称，意图不再维护第二份名单；菜单名称与顺序仍沿用八项变量，没有接入原生主菜单。

2026-11-24 修正：该 section.blocks 方案不成立。本 section 的块是 blocks/_header-nav-* 主题块，父 section 遍历时 block.settings 为空、block.type 恒为 @theme，has_panel 恒 false，所有顶级入口退化为普通链接，下拉全部失效。现改为：section 只输出 li[data-nav-key] 加普通 a 链接，assets/header-new.js 在初始化时按 data-nav-key 与 data-header-panel 匹配，把对应链接原位升级为 button[data-header-toggle]，面板仍是唯一数据源，新增面板无需第二份名单。详见 [日志](../../logs/header/2026-11-24-nav-toggle-runtime.md)。

Accessories 保留已配置的 Batteries & Power 三项及说明，补齐 Heated Accessories 五项，移除完全空白的第三列；两列 role=group、mobile_open=false。Gift 三列为 Gifts by Recipient、Gift by Price、Gift Card，均使用普通分组折叠、默认关闭，不将 Price 做成下一级页面。两面板复用现有双推广卡素材，移动显示。未提供的链接保持空值，编辑器可维护；旧 Header 保留。详见 [任务日志](../../logs/header/2026-11-24-accessories-gift-navigation.md)。

## 2026-11-24 Sale 增量

新增 Sale 面板实例，复用 _header-nav-campaign、_header-nav-category、header-new-product-card 和现有 CSS/JS。旧 Sale 有效集合按原顺序为 campaign、deal-of-the-week、mega-clearance-sale、new-customer、outlet；空的第三槽跳过。首项旧 nav_1 保存的是未求值Liquid字串，初始化分类名使用用户设计的 Fall Mega Sale，其他分类名采用旧配置。内容标题为空时回退实际集合标题，不把旧字串直接输出；原 Bundles 显式标题仍优先。

Sale 分类图片使用现有 portrait（228:285，object-fit:cover），默认每集合前四商品。没有桌面底部按钮区块；移动顶部 Shop All 使用旧 campaign 总集合，移动当前分类按钮直接使用所选集合。保留空集合隐藏、默认首个非空、分类切换及键盘处理。不新增折扣角标映射。

面板1＋分类5增加6块，当前共61个嵌套区块，按用户前述明确授权保留供超限测试。未改旧 Header、其他面板配置、CSS或JS。见 [任务日志](../../logs/header/2026-11-24-sale-navigation.md)。下文55与49为历史记录。

## 2026-11-24 Bundles 与超限实验

用户明确要求继续当前单 section 嵌套结构，不压缩为固定设置，并自行测试超过50个区块是否能显示。新增 _header-nav-campaign 面板、四个 _header-nav-category 集合分类和一个既有底部按钮，动态区块总数由49增至55。该用户授权覆盖本次容量实验，取代下文历史记录中“不能继续堆叠”的本次执行限制，但不改变平台文档限制，也不代表已确认能保存或发布。

Bundles 数据复制旧 header-group.json 的 dislay_6_yaYK6A：clothing-extra-battery、complete-your-warmth、couple-family、clothing-extra-socks；总入口 bundle-deal。分类为独立可排序主题区块，设置集合、名称、标题、说明、图片比例、商品数和移动按钮文字。商品图片／标题／链接来自集合商品，按集合顺序默认前四个；未实现 New/Hot 角标。空集合不输出入口和商品区域，首个非空分类默认选中；全部为空时 JS 禁用该面板触发器。

活动面板复用 data-header-panel 与移动返回／关闭逻辑。新增局部 campaign 初始化：category 包装保留编辑器属性，CSS display:contents 将桌面链接、移动按钮及内容放入网格；不移动或克隆区块DOM。JS 在每个 campaign 内设置网格位置与当前分类，桌面悬停／聚焦切换预览、链接点击进入集合；移动按钮切换标题、说明、商品与当前分类按钮。固定桌面总按钮和移动顶部 Shop All 都使用旧 bundle-deal 链接；分类按钮始终指向当前集合。

复用 section 生命周期清理、键盘开关与焦点约束，未改旧 Header 或跨模块高度契约。见 [任务日志](../../logs/header/2026-11-24-bundles-navigation.md)。以下49/50为上一批历史状态。

## 2026-11-23 Men／Women 增量

沿用现有 group 与单一 section，新增 men、women 两个独立面板。顶级导航变量仍固定八个入口，new/men/women 使用同一 data-header-toggle 交互。每个新增面板含四列、两张移动可见推广卡和一个双链接 footer；四列分别为 Category、Style、Warmth & Runtime、Collections。原有 New 数据与旧代码保留。

新增 _header-nav-image-menu 为列内第四种内容块。原生菜单非空时以其第一层链接作为名称／地址／顺序来源，并按 URL 匹配最多八组上传图片；菜单为空时使用图片槽内初始文案。普通菜单 _header-nav-menu 非空菜单优先，否则显示最多四组初始文案／可选链接和说明。当前未提供六个真实菜单句柄，初始化未绑定菜单，也未编造分类／Style／Collections 目标地址；空地址显示非交互文本。图片缺失使用 Shopify 内置 collection-1 占位图，不读取集合图片。

2026-11-24 调整：Gift 移动端 Shop All 复用桌面 Shop the Gift Guide 链接。同日曾删除 _header-nav-featured 并改 image-menu 为顺序匹配，均按用户要求完整还原；featured／image-menu 代码与数据与改动前一致。详见 [日志](../../logs/header/2026-11-24-nav-block-cleanup.md)。

分类图片映射采用固定设置槽，避免为每张图片新增动态区块；单 section 目前共49个嵌套区块（New17、Men16、Women16），平台上限50。footer 一个区块管理桌面左 Shop All 与右 Technology，移动仅 Technology，DOM 顺序放在双卡之前以保持键盘顺序。后续新增面板需先重新规划区块数量，不可直接继续堆叠。

两张1080×1350的推广图从本次 Figma 节点下载为 assets/header-new-volcano.jpg、header-new-apex.jpg，配置 preset_image 选择默认图；上传图片／产品图片优先。使用 asset_img_url 响应尺寸与懒加载，样式维持228:285。无 Figma 临时地址进入运行代码。详见 [实施日志](../../logs/header/2026-11-23-men-women-navigation.md)。下文 New 首批记录为历史基线。

## 2026-11-23 New 导航增量

当前本地入口：theme.liquid → header-group-new.json → header-new.liquid、原 search 与 popup-cart 配置。原 header-group.json、header.liquid 及旧 snippets/资源保留，未删除。只有 New 面板实现，其余七个顶级入口为固定链接，Help 等功能入口未实现。

新 Header 使用 /blocks/_header-nav-* 主题区块：面板 → 导航列 → 重点链接／菜单列表／特性导航，推广卡及底部按钮与列平级；通过 content_for 'blocks' 渲染。当前无需分类图片菜单，后续任务再补充该第四类型。导航名称和临时地址集中在 section 的 navigation_labels/navigation_paths 变量；普通菜单区块仍支持 Shopify 菜单。

header-new.css 与 header-new.js 只由新 section 加载；新交互使用 data-header-*，不使用旧 header-wrapper、nav-item、drop 绑定入口。为保持共享消费者可取高度，section 额外保留 shopify-section-group-header-group 类，根保留 nav.header，固定导航加等高占位；根高度变量与 header:heightchange 继续输出。未改写 Collection/Product 脚本。旧 group 下搜索与购物车数据复制保留，但本次无对应新 Header 按钮。

移动端折叠（2026-11-23 原实现已被 2026-11-25 取代）：原为 Category 角色不输出折叠按钮并隐藏标题、其他列按 `mobile_open` 展开；现为所有列都输出按钮，第一列无按钮且展开、其余列默认折叠，且不再读取 `mobile_open`。仍支持返回、关闭、Escape、Tab 焦点约束及编辑器选中区块展开。脚本在 section 卸载时清理监听和观察器。2026-11-23 的原始规则见 [任务日志](../../logs/header/2026-11-23-new-navigation.md)；现行规则见 [2026-11-25 日志](../../logs/header/2026-11-25-mobile-nav-accordion.md)。以下为旧实现基线，供回退与后续迁移参考。

基线：2026-11-23，仅本地源码。

## 渲染与配置

theme.liquid → header-group.json → header.liquid、search.liquid、popup-cart.liquid（本地均启用）。group 保存 block 数据及顺序，header schema 保存设置结构，config 保存全局设置，菜单对象由 Shopify 提供。

header 顶部根据 announcement_bar 开关、非空公告及倒计时时间计算公告数量，输出 :root 高度变量；main.js 用 Swiper 管理公告并刷新相关布局。导航读取 `section.settings.main_menu.links`，清理标题中的 `#` 标记后匹配 block.settings.menu_tag。schema 的 display 类型实际拼写为 `dislay_1` 至 `dislay_6`，不能直接“纠正拼写”破坏现有配置。

桌面菜单由 mega-menu 分派；移动端由 header 分派到六种 header-mega-mobile-display snippets；display 3/4 复用 3-4 片段，display 2 复用商品 loop／mobile rows，display 6 使用 bundle category／panel／card。菜单商品从 block 的 collection/product 配置取得，非普通 Collection 页面入口。

## 样式与交互

- 样式分布在 header 内联高度变量、style.css、mega-menu.css 和 res-base.css；layout 全局加载，依赖 Bootstrap 公共类和 res-font。
- main.js 管桌面 hover、移动开关／层级、公告、搜索展开、Header 高度事件及共享商品行为。
- global.js 的 initHeaderLocalizationSwitcher 绑定 `.header .icon-local`，Header 输出 icon_currency；国家／币种运行结果依赖市场配置，尚未验证。
- search section 加载 predictive-search.js 并渲染 search-recommendations；预测请求 `/search/suggest?...&section_id=predictive-search`，提取 `#shopify-section-predictive-search`。本地没有目标 section，见问题档案。
- popup-cart.js 监听 `.header .icon-cart`，管理加购、cart API 与购物车 HTML 刷新；popup-cart section 复用运费进度、商品编辑和折扣 snippets。

## 外部消费者

main.js 更新 Header 依赖导航位置；collection.js 独立计算 Header 高度设置筛选 sticky 偏移；product.js 操作 nav.header 显隐。重构 DOM／高度协议需同时评估这些文件，不能只看 Header 目录式命名。

完整静态边见 [files.md](files.md)。动态分支、应用注入与线上配置不在已验证运行范围。
