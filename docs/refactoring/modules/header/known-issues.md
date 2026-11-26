# Header 已知事项

2026-11-26 移动抽屉 Wishlist：桌面心形图标可正常打开 Swym 抽屉（用户实测），移动抽屉同一按钮点击无响应；原 `openWishlist()` 在 `swym.ui.open` 不可用时只置 `aria-busy` 且不重试，Swym 晚加载会让按钮永久失效。已改为：rAF 延后调用 + try/catch、缺失时点击 Swym 注入入口并重试 5 次、移动端 1s 后校验可见性、最终兜底跳 `/pages/swym-wishlist`。仅静态检查，手机实测与 `ui.open` 静默失败与否未确认。见 [日志](../../logs/header/2026-11-26-mobile-wishlist.md)。

2026-11-26 移动账户链接已配置：`header-group-new.json` 的 profile／orders／return_center／loyalty 分别写入 account.venustas.com／/profile、/orders、`https://venustas.returnscenter.com/`（无 `?ref=powr-io`，与 Help 面板默认值不同）与 account.venustas.com 的 `/pages/daacc659-…` 页面；四项不再走 Liquid 默认回退。桌面账户图标仍为 `routes.account_url`，Smile 的 `#smile-home` 入口未变。未浏览器验证登录态跳转与外部域名。见 [日志](../../logs/header/2026-11-26-account-links.md)。

2026-11-25 类名解耦：新导航改为 `<nav class="header-new">`，不再依赖 `.header` 基样式；collection／article／blog／main／page／product／index／cooling-vest-nav／heatingV-anchor-nav／index-banner-slider／tech-core 的 `.header` 选择器已改为 `.header-new`，`header-hide` 规则同步为 `nav.header-new.header-hide`。style.css 移除 213 条旧 header 规则、res-base.css 移除 37 条，main.js／global.js／popup-cart.js／index.js 内旧 header 逻辑已删。风险：没有浏览器实测，仍继承自 `.header` 的属性（除已补的 transition）已消失；Banner Slider 的“透明头”开关随旧标记移除（原值 false）；第三方应用或 PageFly 片段若依赖 `.header`／`.nav-mobile`／`.mega-*` 会失效。`global.js` 的 `MenuDrawer` 基类保留未用。见 [日志](../../logs/header/2026-11-25-header-class-decoupling.md)。

2026-11-25 旧导航已删除：sections/header.liquid、header-group.json、20 个旧导航专属文件与两个 layout 的 mega-menu.css 引用已移除，全仓无残留引用，header-group-new 的四个 section 文件均存在。遗留：assets/style.css 与 res-base.css 内仍保留 `.header .mega-menu`、`.nav-mobile` 等旧导航选择器（无匹配 DOM 的死样式），因与新导航共用 `.header` 基础规则且需视觉验证，本次未清除；旧导航用到的 shop_images 文件库资源未处理。另外扫描发现 templates/product.MMJ01.json、templates/product.MMP03.json 无法解析（同为 position 2051 line 73 附近），本次未改动它们，属既有问题，需单独修复以免影响主题上传。见 [日志](../../logs/header/2026-11-25-remove-legacy-header.md)。

2026-11-24 导航区块调整：Featured link 与 Category image menu 的同日改动已按用户要求全部还原，本仓库区块类型、schema、CSS 与 JSON 数据回到改动前状态。Gift 移动端 Shop All 复用 `shopify://pages/gift-guide`，页面句柄存在性未验证；image-menu 的图片仍按 `url_i` 匹配，Men／Women 的 `url_1..8` 全为空，移动端显示占位图，需补匹配地址后才会显示已上传图片。未浏览器实测。见 [日志](../../logs/header/2026-11-24-nav-block-cleanup.md)。

2026-11-24 移动账户：登录态由 `{% if customer %}` 决定，未登录展示 `routes.account_login_url` 链接；登录后四个链接默认展开、details 折叠、箭头旋转。四个链接仍取 section 设置默认值（Orders 复用账户页地址），登录态切换、键盘折叠和箭头方向未浏览器实测。见 [日志](../../logs/header/2026-11-24-mobile-account-menu.md)。

2026-11-24 功能入口：新 Header 已接入旧搜索弹层与购物车接口，先前“无搜索/购物车入口”为历史状态。预测搜索H-001仍待单独确认；Wishlist需应用加载，账户专用链接与后台登录态待商店验证，US/CA继续旧跨站跳转。没有浏览器或应用运行证据。见 [日志](../../logs/header/2026-11-24-header-utilities.md)。

2026-11-24 Accessories：本地确认用户已添加面板，但 section 硬编码下拉名单遗漏 accessories；当时改为配置驱动匹配。已配的空链接仍为非交互文本，具体目标应在编辑器补齐。Gift 的价格、礼品卡及指南地址未提供，不能据文案推断实际URL。静态修正不代表测试主题已同步或浏览器实测。

2026-11-24 顶级下拉失效：上述“遍历 section.blocks 读 settings.menu_key”的做法在主题块上无效（父 section 拿不到主题块 settings，block.type 也恒为 @theme），导致所有入口没有 data-header-toggle，下拉全部不显示。现由 assets/header-new.js 的 prepareNavToggles() 依据已渲染面板的 data-header-panel 在运行时升级导航项。遗留：无 JS 时导航退化为直达链接（移动端所有入口仍显示箭头）；桌面悬停／键盘、移动抽屉、无面板入口（Bundles／Sale）的实际跳转均未浏览器实测。见 [日志](../../logs/header/2026-11-24-nav-toggle-runtime.md)。

2026-11-24 Bundles／Sale 面板丢失：ed170a6 “Update from Shopify … by Yaoyao zhang” 后台保存回写 sections/header-group-new.json，覆盖掉 c202258 加的两个 _header-nav-campaign，导致该两项无可展开面板。已从 c202258 增量恢复 bundles_panel／sale_panel（纯新增 177 行，原有五个面板未改）。恢复内容为旧配置，集合商品、分类文案与编辑器表现未验证；后台若再次整体保存仍可能覆盖本地配置，改配置前先确认该文件与线上主题一致。见 [日志](../../logs/header/2026-11-24-restore-bundles-sale-panels.md)。

2026-11-24 Help 面板：Order Tracking／Returns & Exchanges／Warranty Registration／User Manuals／Help Center 已使用主题里已有的默认地址（Liquid default 回退：aftership、returnscenter、shopify://pages/warranty-registration、zendesk User-Manual、help_link），Warranty Claim 无现成地址仍为不可点击文本，需要时在 help_warranty_claim_url 配置。Help 仅点击触发（data-header-no-hover，跳过 pointerenter，--help 面板不受 pointerleave 自动关闭影响），行 hover 为 #f5f5f5。桌面卡片右边缘按 max 1720 的 bar 对齐，1200–1259 窄桌面与移动抽屉 Help 页、返回、Esc／外点关闭均未浏览器实测。见 [日志](../../logs/header/2026-11-24-help-panel.md)。

2026-11-24 桌面布局：header 高 68、左侧约 800（Logo 154 + 32 + 8 项导航 gap 30、16/21）、右侧图标间距 16 与 28，均按 Figma 6175:2532 静态实现。搜索胶囊按“紧邻 Help”实现（Figma 默认帧的 300 宽容器是为展开态预留，本次不做展开，故胶囊比该帧靠右约 200px），点击仍打开既有 .predictive-search 弹层。导航总宽依赖字体度量，可能需要浏览器实测微调；1200–1599 只显示搜索图标。见 [日志](../../logs/header/2026-11-24-desktop-header-layout.md)。

2026-11-24 移动 Help 箭头／Gift Guide 按钮：移动 Help 行已加右侧箭头（复用 .header-new__nav-chevron，util-row 内 margin-left:auto）。桌面 Gift 面板底部按钮此前因 guide 块 url 为空而不渲染（_header-nav-button 需 title 与 url 同时存在），现已设为 shopify://pages/gift-guide；该页面句柄按 templates/page.gift-guide.json 推断，需后台确认，若不同则在编辑器改 Link。见 [日志](../../logs/header/2026-11-24-mobile-help-chevron-gift-guide.md)。

2026-11-24 Sale：复用活动组件接入五分类后共61块，仍为用户授权超限实验，未确认平台能接受保存／上传／显示。旧 Sale nav_1 是Liquid字串，已用设计中的首项文案及运行时集合标题回退，避免显示原字串。新增分类 new-customer 的集合与数据来自旧配置；真实商品和浏览器展示仍待验证。见 [任务日志](../../logs/header/2026-11-24-sale-navigation.md)。以下55块为 Sale 添加前历史状态。

2026-11-24 Bundles 实验：用户明确要求不控制在50以内，现配置55个嵌套区块。该配置保留供用户测试；静态语法通过不证明 Shopify 接受超限保存、上传或显示。四个集合来自旧 Bundle Sale，本地未确认集合实际商品；空集合隐藏对应入口，全部为空禁用 Bundles 面板。此前用户报告测试主题看不到新 Header 配置，尚未获得该主题环境的排查证据，不将本次新增视为已修复该问题。见 [任务日志](../../logs/header/2026-11-24-bundles-navigation.md)。

2026-11-23 Men／Women：实现与静态验证完成，尚无后台菜单句柄及分类图片，暂展示可编辑初始文案和统一占位图；部分目标链接为空，Best Sellers 临时指向各自总集合。当前 Header section 已用49/50个动态区块，后续面板新增需先规划容量。两张默认推广图已本地化。见 [任务日志](../../logs/header/2026-11-23-men-women-navigation.md)。

2026-11-23 增量：本地入口已切换 header-group-new。新 New 面板完成静态校验，见 [实施日志](../../logs/header/2026-11-23-new-navigation.md)。New Color 与 Just In 样例条目暂指向已有 New Arrivals 集合，需商家配置实际目标；其他七个入口地址为临时值。H-002 的旧 header schema 未修复，H-001 的搜索缺口仍保留；新 Header 未提供搜索入口。以下历史事项继续保留，均不代表新入口线上已复现。

环境：2026-11-23 本地工作区，未做浏览器或线上复现。状态均为待审核，未修复。

| ID | 分类 | 证据 | 影响边界／下一步 |
| --- | --- | --- | --- |
| H-001 | 已确认本地依赖缺口 | assets/predictive-search.js:28 请求 section_id=predictive-search，:42 查找响应包装；sections 下不存在 predictive-search.liquid | 本地响应实现缺失；线上是否存在额外文件及搜索实际表现未确认，需核对完整主题和预期响应 |
| H-002 | 已确认严格解析失败 | sections/header.liquid:1147 的 schema Image Link label 后为尾逗号；提取 schema 用 Python json.loads 失败 | 不是注释头造成；Shopify 导入／编辑器实际行为未验证，不推断已导致线上故障 |
| H-003 | 已确认跨模块耦合，非故障结论 | header 内 :root；main.js:updateHeaderDependentUI；collection.js:1–13；product.js 对 nav.header 操作 | 高度与显隐修改会影响筛选和商品导航；具体改动前搜索所有消费者 |
| H-004 | 待评估维护风险 | header 同时输出桌面／移动分支，main/global/popup-cart 共享绑定 | 生命周期、键盘与重复监听需按具体方案核验；没有运行证据，不认定现有交互有 bug |

没有性能数据；不依据文件长度、使用 jQuery 或全局资源存在就宣称性能故障。
