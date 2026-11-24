# 项目架构

基线：2026-11-23，本地静态分析。证据：layout、61 个 collection JSON 模板、127 个 product JSON 模板、三个模块入口及其静态依赖。文件清单包含实际调用行；未对全仓库每个功能做审计。

## 技术栈与目录

Shopify Online Store 2.0：Liquid 服务端渲染，JSON 模板／section group 编排，section schema 管理后台内容，CSS、原生 JavaScript 与 jQuery 实现展示和交互。`config/settings_schema.json` 的 theme_info 为 Venustas，版本字段 1.1.0；不能据此推断部署版本或上游主题。

| 目录 | 初始化文件数 | 实际作用 |
| --- | ---: | --- |
| layout | 3 | theme、theme.pagefly、password 三个布局 |
| templates | 280 | 页面编排，含 customers 子目录、JSON 模板及 Liquid 专用输出 |
| sections | 317 | 页面模块、header/footer group 和各类落地页内容 |
| snippets | 147 | Liquid 渲染片段：菜单、商品卡片、变体、价格、购物车等 |
| assets | 81 | 主题及第三方 CSS/JS、字体等；不是源代码构建目录的证据 |
| blocks | 2 | featured-image-item、product-hotspot-item 主题 block |
| config | 2 | settings_schema 定义全局设置；settings_data 保存配置／应用 embed |
| locales | 1 | 翻译资源 |
| docs | — | 原有 SHOPIFY_ARCHITECTURE.md 为 0 字节；本知识库另建，不覆盖 |

数量是初始化文件快照，不是长期约束。根目录未发现 package.json、锁文件或 .theme-check 配置；未识别到可据以运行的项目构建／测试脚本，不推断仓库外没有开发工具。

## 主渲染与资源关系

2026-11-24 功能入口增量：header-new.js 调用既有 openCart、监听 cart:updated、通过 SwymCallbacks 打开 Wishlist，独立管理旧 search section 弹层和国家菜单，避免复用旧Header选择器导致重复绑定。Help只实现链接；桌面/移动高度与共享事件保留。见Header功能入口日志。

2026-11-24 Accessories/Gift 增量：顶级入口改为按实际面板 menu_key 自动关联，修复用户手动添加面板未生效；新增/补齐两个分组后总计76块。复用已有块、样式与脚本，跨模块高度协议不变。

2026-11-24 Sale 增量：复用 Bundles 活动组件增加五个 Sale 集合，不配置 Sale 桌面底部按钮，图片使用现有 portrait 比例；当前61块，继续用户授权的超限测试。无新资源或跨模块协议变更。

2026-11-24 增量：同一 Header section 新增 Bundles 活动面板，分类读取旧 Bundle Sale 集合，详见 Header 技术档案。按用户明确要求保留55个嵌套区块作超限显示实验，不切换多 section 架构；平台保存／显示仍待验证。下文49/50是上一批历史状态。

`layout/theme.liquid` → `sections 'header-group-new'` → `content_for_layout`（当前模板）→ `sections 'footer-group'`。2026-11-23 用户批准切换本地测试入口；旧 header-group 保留。新 Header 实现八个固定入口和 New/Men/Women 面板，使用嵌套主题区块，不使用元对象；search 与 popup-cart 配置复制保留。以下旧资源关系继续适用，新增 header-new.css/js 由新 section 加载。Men/Women 图片菜单与初始化回退设置、49/50区块容量见 Header 架构与 ADR-0003。

- `sections/header-group.json` 顺序为 header、search、popup-cart；三者均未标记 disabled。
- JSON 模板的 section `type` 指向 `sections/{type}.liquid`；`order` 决定编排，`disabled` 决定本地配置是否停用。定义存在不等于启用，更不等于线上页面实际使用。
- Liquid 通过 render/include 调用 snippets，通过 asset_url 加载 assets；还依赖 settings、section/block settings、Shopify 对象、metafields、metaobjects 和 app blocks。
- 全局 CSS 包含 bootstrap.min、bootstrap-custom、style、mega-menu、popup-cart、res-base、res-font、res-product-item、res-popup-cart；字体在 layout 内声明。
- 全局 JS 的标签顺序：jquery → bootstrap.bundle → swiper-bundle → main → 按模板的脚本 → global → 其他按模板脚本 → popup-cart（详见 layout 实际条件）。这些外部脚本使用 defer；顺序及 ready 时机是共享依赖的一部分。
- product 页加载 product.css、product-new-battery-runtime.css/js 和 product.js；collection/search 页加载 collection.css；仅 collection 页加载 collection.js。
- AOS、Odometer 由 layout 对 page/product 条件加载。不能因资源存在就断言所有页面加载。
- `layout/theme.pagefly.liquid` 单独输出 content_for_layout，不能假定它复用 theme 的 header group／全局资源；`password.liquid` 另有独立布局。

## 公共能力和外部边界

- main.js 同时包含导航／公告、共享商品交互、商品弹窗加载和色卡回退；global.js 同时包含通用 custom elements、变体渲染和 Header 国家切换。模块边界跨文件，不能按资源名直接拆分。
- popup-cart.js 负责 Header 购物车入口、跨页面加购及购物车片段刷新，发出 `cart:updated`。
- `product-badge`、`product-variant-colors` 等由列表／商品／推荐区复用；`product-menu-badge` 则被菜单商品卡片调用。不是所有商品卡片都使用同一个 snippet。
- theme 输出 `content_for_header`，include `pagefly-app-header`，render `globo.preorder.custom`。main-product 和 product-review-section 有动态 app block render。
- settings_data 中记录了 Okendo、多地点库存、Globo、Wishlist、PageFly、Klaviyo 等 app embeds 的配置。配置存在或 disabled=false 只证明本地配置，不证明应用在线、订阅有效或运行输出。
- 库存由应用注入，product.js 含 DOM 观察、变体请求及 iframe 回退；仅查看原始 HTML 无法代表最终库存状态。

## 证据与局限

[模块关系](module-map.md) 和各模块 files.md 记录入口及调用点。专用 Liquid 输出如 `product.popup`、`product.gift-card-pro`、`collection.quiz-targets-json` 不走普通页面结构。线上分配、外部应用行为、请求返回与视觉表现待后续明确授权核验。

版本管理限制：`.gitignore:5` 忽略根 AGENTS.md，当前该文件不在 Git 跟踪内；知识库的跨机器自动阅读入口需审核后纳入版本管理。本次不修改忽略规则。
