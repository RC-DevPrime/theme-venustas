# Header 架构

## 2026-11-24 Bundles 与超限实验

用户明确要求继续当前单 section 嵌套结构，不压缩为固定设置，并自行测试超过50个区块是否能显示。新增 _header-nav-campaign 面板、四个 _header-nav-category 集合分类和一个既有底部按钮，动态区块总数由49增至55。该用户授权覆盖本次容量实验，取代下文历史记录中“不能继续堆叠”的本次执行限制，但不改变平台文档限制，也不代表已确认能保存或发布。

Bundles 数据复制旧 header-group.json 的 dislay_6_yaYK6A：clothing-extra-battery、complete-your-warmth、couple-family、clothing-extra-socks；总入口 bundle-deal。分类为独立可排序主题区块，设置集合、名称、标题、说明、图片比例、商品数和移动按钮文字。商品图片／标题／链接来自集合商品，按集合顺序默认前四个；未实现 New/Hot 角标。空集合不输出入口和商品区域，首个非空分类默认选中；全部为空时 JS 禁用该面板触发器。

活动面板复用 data-header-panel 与移动返回／关闭逻辑。新增局部 campaign 初始化：category 包装保留编辑器属性，CSS display:contents 将桌面链接、移动按钮及内容放入网格；不移动或克隆区块DOM。JS 在每个 campaign 内设置网格位置与当前分类，桌面悬停／聚焦切换预览、链接点击进入集合；移动按钮切换标题、说明、商品与当前分类按钮。固定桌面总按钮和移动顶部 Shop All 都使用旧 bundle-deal 链接；分类按钮始终指向当前集合。

复用 section 生命周期清理、键盘开关与焦点约束，未改旧 Header 或跨模块高度契约。见 [任务日志](../../logs/header/2026-11-24-bundles-navigation.md)。以下49/50为上一批历史状态。

## 2026-11-23 Men／Women 增量

沿用现有 group 与单一 section，新增 men、women 两个独立面板。顶级导航变量仍固定八个入口，new/men/women 使用同一 data-header-toggle 交互。每个新增面板含四列、两张移动可见推广卡和一个双链接 footer；四列分别为 Category、Style、Warmth & Runtime、Collections。原有 New 数据与旧代码保留。

新增 _header-nav-image-menu 为列内第四种内容块。原生菜单非空时以其第一层链接作为名称／地址／顺序来源，并按 URL 匹配最多八组上传图片；菜单为空时使用图片槽内初始文案。普通菜单 _header-nav-menu 非空菜单优先，否则显示最多四组初始文案／可选链接和说明。当前未提供六个真实菜单句柄，初始化未绑定菜单，也未编造分类／Style／Collections 目标地址；空地址显示非交互文本。图片缺失使用 Shopify 内置 collection-1 占位图，不读取集合图片。

分类图片映射采用固定设置槽，避免为每张图片新增动态区块；单 section 目前共49个嵌套区块（New17、Men16、Women16），平台上限50。footer 一个区块管理桌面左 Shop All 与右 Technology，移动仅 Technology，DOM 顺序放在双卡之前以保持键盘顺序。后续新增面板需先重新规划区块数量，不可直接继续堆叠。

两张1080×1350的推广图从本次 Figma 节点下载为 assets/header-new-volcano.jpg、header-new-apex.jpg，配置 preset_image 选择默认图；上传图片／产品图片优先。使用 asset_img_url 响应尺寸与懒加载，样式维持228:285。无 Figma 临时地址进入运行代码。详见 [实施日志](../../logs/header/2026-11-23-men-women-navigation.md)。下文 New 首批记录为历史基线。

## 2026-11-23 New 导航增量

当前本地入口：theme.liquid → header-group-new.json → header-new.liquid、原 search 与 popup-cart 配置。原 header-group.json、header.liquid 及旧 snippets/资源保留，未删除。只有 New 面板实现，其余七个顶级入口为固定链接，Help 等功能入口未实现。

新 Header 使用 /blocks/_header-nav-* 主题区块：面板 → 导航列 → 重点链接／菜单列表／特性导航，推广卡及底部按钮与列平级；通过 content_for 'blocks' 渲染。当前无需分类图片菜单，后续任务再补充该第四类型。导航名称和临时地址集中在 section 的 navigation_labels/navigation_paths 变量；普通菜单区块仍支持 Shopify 菜单。

header-new.css 与 header-new.js 只由新 section 加载；新交互使用 data-header-*，不使用旧 header-wrapper、nav-item、drop 绑定入口。为保持共享消费者可取高度，section 额外保留 shopify-section-group-header-group 类，根保留 nav.header，固定导航加等高占位；根高度变量与 header:heightchange 继续输出。未改写 Collection/Product 脚本。旧 group 下搜索与购物车数据复制保留，但本次无对应新 Header 按钮。

移动 Category 角色不输出折叠按钮并隐藏标题；其他列按配置展开，支持返回、关闭、Escape、Tab 焦点约束及编辑器选中区块展开。脚本在 section 卸载时清理监听和观察器。详见 [任务日志](../../logs/header/2026-11-23-new-navigation.md)。以下为旧实现基线，供回退与后续迁移参考。

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
