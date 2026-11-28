# Header 架构与文件地图

> **用途**：想改 header 的任何功能，先在这张图里定位文件，再看行号。
> **范围**：`sections/header-group.json` 这个 section group 下的全部内容（Header / 搜索浮层 / 购物车抽屉）。
> **最后校准**：2026-11-28，基于当前仓库实际行号（`sections/header.liquid` 1670 行）。

---

## 0. 一句话结构

Header **不是一个文件**，而是「1 个入口 + 1 个 JSON 配置 + 3 个 section + 20 个 snippet + 7 个 CSS/JS」。

```
layout/theme.liquid:362  ──{% sections 'header-group' %}──►  sections/header-group.json
                                                              ├─ header      → sections/header.liquid
                                                              ├─ search      → sections/search.liquid
                                                              └─ popup-cart  → sections/popup-cart.liquid
```

`header-group.json` 是**主题编辑器写出来的配置文件**（文件头注释已声明：手改会被覆盖）。所有公告文案、菜单绑定、mega menu 块、Logo 都从这里读，Liquid 代码只负责渲染。

---

## 1. 渲染链路图

```
layout/theme.liquid
└── L362: {% sections 'header-group' %}
    │
    └── sections/header-group.json                      ← 配置源（编辑器可覆盖）
        │   order: ["header", "search", "popup-cart"]
        │
        ├── sections/header.liquid                      ← 主文件 1670 行
        │   ├── L1-18    统计公告数量（决定是否渲染公告栏 & 高度变量）
        │   ├── L20-33   注入 CSS 变量 --header-nav-height / --announcement-current-height
        │   ├── L35-158  公告栏（Swiper 轮播 + 跑马灯 + 倒计时 + 关闭）
        │   ├── L160-322 桌面 header（logo / nav-items / nav-icons）  ← ≥1280px
        │   ├── L324-398 移动 header（汉堡 / logo / gift-wish-cart）  ← <1280px
        │   ├── L401-459 .drops 下拉容器（普通二级 + mega 外壳）
        │   ├── L462-761 移动抽屉 .nav-mobile（搜索 / 手风琴 / mega / 账户 / 货币）
        │   ├── L766-778 Swym wishlist 绑定脚本
        │   └── L781-1670 {% schema %}（8 种 block：dislay_1~6 + 2 种公告）
        │       │
        │       ├─ 桌面 mega ──► snippets/mega-menu.liquid（按 block.type 分发 1~6）
        │       └─ 移动 mega ──► snippets/header-mega-mobile-display-{1..6}.liquid
        │
        ├── sections/search.liquid                      ← 搜索浮层
        │   └── snippets/search-recommendations.liquid   ← Trending / Popular
        │
        └── sections/popup-cart.liquid                  ← 购物车抽屉
```

---

## 2. 目录树（只列与 header 相关的文件）

```
layout/
└── theme.liquid                    471 行    L362 挂载 header group；L256/263 加载 style.css / mega-menu.css；L402/420 加载 main.js / popup-cart.js

sections/
├── header-group.json               408 行    ★ 配置真相：settings + 所有 blocks
├── header.liquid                  1670 行    ★ 主文件（含 schema）
├── search.liquid                    96 行    搜索浮层
└── popup-cart.liquid               638 行    购物车抽屉

snippets/                          （桌面 mega 系列）
├── mega-menu.liquid                582 行    分发器 + display 1/2/3/4/5 内联实现
├── mega-menu-link.liquid            20 行    单个链接（支持 Title#Badge）
├── mega-menu-d2-product-loop.liquid 28 行    display2 商品循环（可手动挑品）
├── product-item-mega-menu.liquid   147 行    商品卡（display1 / display5 用）
├── product-item-mega-menu-display-2.liquid 143 行  商品卡（display2 专用）
├── product-menu-badge.liquid        31 行    商品角标 Hot / Best Seller / New
├── header-mega-desktop-display-6.liquid    82 行   display6 桌面（bundle 货架）
├── header-mega-bundle-panel.liquid  28 行    display6 单个分类面板
└── header-mega-bundle-product-card.liquid 34 行   bundle 商品卡

snippets/                          （移动 mega 系列）
├── header-mega-mobile-display-1.liquid    103 行   图文列 + 商品行
├── header-mega-mobile-display-2.liquid    321 行   分 tab + 商品行（最复杂）
├── header-mega-mobile-display-3.liquid      1 行   只是个转发 → display-3-4
├── header-mega-mobile-display-3-4.liquid  419 行   display 3 / 4 共用实现
├── header-mega-mobile-display-4.liquid      1 行   只是个转发 → display-3-4
├── header-mega-mobile-display-5.liquid    129 行   菜单列 + 双图
├── header-mega-mobile-display-6.liquid     84 行   bundle 手风琴
├── header-mega-mobile-bundle-category.liquid 21 行  bundle 单个 <details> 分类
├── mega-menu-d2-mobile-product-rows.liquid 82 行   display2 移动商品行

snippets/                          （共用零件）
├── icon_currency.liquid           327 行    货币符号 SVG（USD/CAD…）
└── search-recommendations.liquid  106 行    搜索浮层的推荐内容

assets/
├── style.css                    3347 行   L892-1133 公告栏 / L1134-2061 header 主体 / L2377-2591 搜索浮层 / L2821+ 移动覆盖
├── mega-menu.css                 766 行   L1-110 d1 / L111-156 d2 / L157-234 d3 / L235-244 d4 / L245-311 d5 / L312-600 d6 / L601-733 角标 / L734+ 响应式
├── res-base.css                  150 行   响应式覆盖：L2 手机 / L43 平板 768-1279 / L112 桌面 1280+
├── main.js                      2384 行   L1-342 公告 / L343-553 导航交互 / L555-567 语言 / L597-640 高度同步
├── popup-cart.js                 951 行   L29-34 点购物车图标打开抽屉
├── predictive-search.js           85 行   搜索联想（/search/suggest）
├── search.css                    426 行   搜索浮层 + 搜索页样式
└── search.js                      92 行   搜索页交互（非 header）
```

---

## 3. 文件职责表

### 3.1 入口与配置

| 文件 | 作用 | 何时改它 |
|---|---|---|
| `layout/theme.liquid` | 挂载 `header-group`（L362）、引入 CSS/JS | 新增 header 专用 CSS/JS 文件时 |
| `sections/header-group.json` | header 的**全部后台配置**：logo、菜单句柄、公告块、dislay 块 | 改文案/加公告/改菜单绑定/改 display 配置。**注意会被编辑器覆盖**，改完要同步到线上主题 |

### 3.2 Section

| 文件 | 作用 | 何时改它 |
|---|---|---|
| `sections/header.liquid` | 公告栏 + 桌面导航 + 移动抽屉的 DOM 骨架 + 8 种 block schema | 改结构、加图标、改菜单循环、改 block 设置项 |
| `sections/search.liquid` | 搜索浮层（点搜索图标淡入） | 改搜索框布局、推荐位 |
| `sections/popup-cart.liquid` | 购物车抽屉 | 改购物车抽屉（独立功能，通常不动） |

### 3.3 Snippet — 桌面 mega menu

| 文件 | 作用 |
|---|---|
| `mega-menu.liquid` | **分发器**：`dislay_1`→内联、`dislay_2`→内联、`dislay_3`→内联、`dislay_4`→内联、`dislay_5`→内联、`dislay_6`→转发给 `header-mega-desktop-display-6` |
| `mega-menu-link.liquid` | 单个菜单链接，自动解析 `标题#角标` |
| `mega-menu-d2-product-loop.liquid` | display2 的商品网格循环（支持 collection 或手选 product_list） |
| `product-item-mega-menu.liquid` | 商品卡：多图切换（按第一个 option）、hover 图、`menu_product_name` 自定义标题 |
| `product-item-mega-menu-display-2.liquid` | display2 专用商品卡（体积更小的变体） |
| `product-menu-badge.liquid` | 读商品 tag → `Menu-Hot` / `Menu-Best Seller` / `Menu-New` → 角标文案 |
| `header-mega-desktop-display-6.liquid` | display6 桌面：左侧 4 个分类 + 右侧面板（含 `aria-expanded` 状态） |
| `header-mega-bundle-panel.liquid` | display6 的一个分类面板（标题/副标题/商品网格/View All） |
| `header-mega-bundle-product-card.liquid` | bundle 商品卡（可用 `custom.menu_product_image` metafield 换图） |

### 3.4 Snippet — 移动 mega menu

| 文件 | 作用 | 备注 |
|---|---|---|
| `header-mega-mobile-display-1.liquid` | 菜单列（手风琴）+ 商品行 | |
| `header-mega-mobile-display-2.liquid` | 分 tab 的菜单 + 商品行 | 最复杂，含 6 组 nav/collection |
| `header-mega-mobile-display-3-4.liquid` | display 3/4 的共用实现 | 改 3 或 4 都改这里 |
| `header-mega-mobile-display-3.liquid` / `-4.liquid` | 1 行转发 | **不要在这两个文件里写逻辑** |
| `header-mega-mobile-display-5.liquid` | 菜单列 + 双图 | |
| `header-mega-mobile-display-6.liquid` | bundle 手风琴（`<details>` 分组） | |
| `header-mega-mobile-bundle-category.liquid` | bundle 的单个分类 `<details>` | |
| `mega-menu-d2-mobile-product-rows.liquid` | display2 移动端商品行 | |

### 3.5 CSS / JS

| 文件 | 区域 | 负责什么 |
|---|---|---|
| `style.css` | L892-1133 | 公告栏（Swiper/跑马灯/倒计时/关闭按钮） |
| | L1134-2061 | header 主体：fixed 定位、logo、nav-items、图标、货币切换、drops、mega 外壳、语言下拉、移动抽屉 |
| | L2377-2591 | 搜索浮层 |
| | L2821-3068 | 移动端媒体查询覆盖（header + 公告跑马灯） |
| `mega-menu.css` | 全部 | 6 种 display 的桌面布局 + 商品角标 + 移动 bundle |
| `res-base.css` | L23-39 / L64-108 / L133-140 | header 在 手机 / 平板 / 桌面 三档的 padding、图标尺寸、显隐 |
| `main.js` | L1-342 | 公告 Swiper（自动播放、hover 暂停、跑马灯测宽、高度回写） |
| | L295-341 | 倒计时 + 过期自动隐藏 |
| | L343-417 | 桌面 hover 打开下拉、居中定位、鼠标离开缓冲判定 |
| | L419-426 | `.mega-nav` tab 切换（通用） |
| | L428-444 | 打开/关闭搜索浮层 |
| | L446-463 | 移动抽屉开关（`body.menu-open`） |
| | L465-480 | 移动 mega 面板 push/back |
| | L482-498 | 移动手风琴（点链接直接跳转） |
| | L500-532 | display2 / display6 的 tab 切换 |
| | L534-551 | 移动 bundle 分类切换时同步 View All 链接 |
| | L555-567 | 语言下拉（US/CA） |
| | L597-608 | 关闭公告栏 + 广播高度变化 |
| | L611-640 | **header 高度同步**：`.sticky-top`、`.nav-mobile` 高度、`.header-nav-section` 顶部 |
| `popup-cart.js` | L29-34 | 点 `.header .icon-cart` → `openCart()` |
| `predictive-search.js` | 全部 | 搜索联想请求 `/search/suggest` |

---

## 4. `header.liquid` 内部地图（1670 行）

| 行号 | 内容 | 改什么来这里 |
|---|---|---|
| 1-18 | 统计有效公告条数 → `announcement_bar_count` | 公告渲染条件 |
| 20-33 | `:root` 注入 `--announcement-height` / `--announcement-current-height` / `--header-nav-height` / `--headerHeight` | 改 header 整体高度（37px / 40px / 54.7px / 61.2px） |
| 35 | `<nav class="header">` | 根节点 class |
| 36-158 | 公告栏 | 轮播、箭头、关闭、倒计时 DOM |
| 43-48 / 145-149 | 左右箭头（仅公告 >1 条时出现） | 箭头样式/位置 |
| 63-96 | 单条公告（含 `[u]…[/u]` 下划线替换、跑马灯、箭头图标） | 公告排版 |
| 102-136 | 倒计时公告（`data-set-date`） | 倒计时 DOM |
| 154-156 | 关闭按钮 | |
| 160-322 | **桌面 header**（容器 `d-lg-flex d-md-none d-sm-none`，即仅 ≥1280 显示） | |
| 163-174 | Logo | |
| 176-224 | 一级导航循环 | 一级菜单渲染逻辑 |
| 188-190 | 解析 `标题#标签` → `clean_title` / `link_tag` | New 标签 |
| 197-204 | 用 `clean_title` 匹配 `block.settings.menu_tag` 找 mega 块 | **导航↔块 的绑定点** |
| 206-222 | 导航 `<a>`（`data-drop` 触发下拉 / `active` 判定） | 高亮、下拉开关 |
| 228-319 | 右侧图标区 | |
| 229-246 | `.icon-local` 货币切换（`d-lg-none d-md-none d-sm-none`，桌面上实际隐藏） | |
| 248-257 | 搜索按钮 | |
| 259-263 | Wishlist（Swym） | |
| 265-270 | 账户 | |
| 272-289 | 购物车 + 数量角标 | |
| 292-317 | 语言/国家下拉（US / CA 硬编码） | |
| 324-398 | **移动 header**（`d-lg-none d-md-flex d-sm-flex`） | |
| 328-343 | 汉堡按钮 `nav-toggle` | |
| 349-360 | Logo（移动） | |
| 361-396 | gift / wishlist / cart + 角标 | |
| 401-459 | `.drops` 桌面下拉容器 | |
| 412-438 | 普通二级/三级下拉（`link.links`） | |
| 440-456 | mega menu 外壳（`.mega-menu .overlay .inner-mega-menu`）+ L449 `render 'mega-menu'` | mega 外层宽度/背景/遮罩 |
| 447-451 | ⚠ 对**每个**一级菜单都遍历**所有** blocks 调 `render 'mega-menu'` | 性能点：blocks 多会变慢 |
| 462-761 | **移动抽屉** `.nav-mobile` | |
| 465-467 | 关闭按钮 | |
| 471-490 | 抽屉内搜索框（普通 GET 表单，无联想） | |
| 497-664 | 手风琴菜单 | |
| 514-519 | 侧边划出的 mega 触发器（display_1~6 走 `data-mega`） | |
| 574-650 | 手风琴内的二级按钮（display2/3） | |
| 651-661 | 普通二级链接 | |
| 666-690 | 移动 mega 面板 `case block.type` → `render 'header-mega-mobile-display-N'` | 新增 display 类型要改这里 |
| 693-723 | 抽屉底部登录区（写死文案 "Log In to Join VENUSTAS"） | |
| 734-754 | 抽屉底部货币切换 | |
| 764 | `.header-placeholder`（补 fixed header 占位） | |
| 766-778 | Swym wishlist 绑定 | |
| 781-1670 | `{% schema %}` | |
| 784-835 | section settings：公告开关、logo、主菜单、autoplay、3 个颜色 | |
| 837-906 | block `dislay_1` | |
| 907-1120 | block `dislay_2` | |
| 1121-1257 | block `dislay_3` | |
| 1258-1399 | block `dislay_4` | |
| 1400-1491 | block `dislay_5` | |
| 1492-1625 | block `dislay_6`（Bundle Sale） | |
| 1626-1649 | block `announcement_bar` | |
| 1650-1670 | block `announcement_countdown` | |

---

## 5. 「我要改 XX」速查表

| 需求 | 先改 | 再改（样式 / 交互） | 备注 |
|---|---|---|---|
| 公告文案 / 加一条公告 | `header-group.json` 的 `announcement_bar_*`（或直接主题编辑器） | — | 支持 `[u]…[/u]` 下划线 |
| 公告轮播速度 / 开关 | 同上 `autoplay` / `autoplay_enabled` | `header.liquid:53-54` | 2–10 秒 |
| 公告倒计时 | `announcement_countdown` 的 `date_time` | `main.js:295-341` | 过期自动隐藏 |
| 公告栏高度（37px） | `header.liquid:20-33` | `style.css:934-940`、`main.js:611-637` | **改完必须同步依赖方**，见 §6.6 |
| 公告颜色 | `background_color` / `text_color` / `underline_text_color` | `header.liquid:39,45,64` | |
| 公告关闭按钮 | `header.liquid:154-156` | `main.js:597-608` | |
| 公告跑马灯（文字超宽滚动） | — | `main.js:1-294`、`style.css:1049-1133` | 逻辑较重，慎改 |
| Logo | `header-group.json` → `logo` | `header.liquid:163-174, 349-360`、`style.css:1168`(166×35) | |
| 一级导航文字/链接/排序 | **Shopify 后台 main-menu** | `header.liquid:180-223` | 不在代码里 |
| 导航 "New" 小角标 | 后台菜单标题写成 `名称#New` | `header.liquid:188-190, 529-533`、`style.css:1200` | |
| 导航 hover 下划线 | — | `style.css:1208-1219`、`main.js:345-348` | |
| 桌面 mega 外壳宽度/背景/遮罩 | `header.liquid:440-456` | `style.css:1486-1505` | |
| mega 里加新布局类型 | `header.liquid` schema + `mega-menu.liquid` 判断 | 新建 `snippets/mega-menu-xxx.liquid` | 见 §6.5 命名坑 |
| display 1 布局 | `mega-menu.liquid:5-74` | `mega-menu.css:1-110` | 3 列菜单 + 2×2 商品 |
| display 2 分 tab 商品格 | `mega-menu.liquid:76-215` | `main.js:500-517`、`mega-menu.css:111-156` | 左侧 tab + 右侧商品 |
| display 3 图文列 | `mega-menu.liquid:217-379` | `mega-menu.css:157-234` | 3 列（有 label_4 时 4 列） |
| display 4 五列图文 | `mega-menu.liquid:464-578` | `mega-menu.css:235-244` | |
| display 5 菜单 + 双图 | `mega-menu.liquid:381-460` | `mega-menu.css:245-311` | |
| display 6 bundle 货架 | `mega-menu.liquid:461-462` → `header-mega-desktop-display-6.liquid` | `mega-menu.css:312-476`、`main.js:519-532` | 分类面板在 `header-mega-bundle-panel.liquid` |
| mega 里的商品卡 | `product-item-mega-menu.liquid` / `-display-2.liquid` | `mega-menu.css:63-110` | 图可用 `custom.menu_product_image` |
| 商品角标 Hot/Best Seller/New | 给商品打 tag `Menu-Hot` / `Menu-Best Seller` / `Menu-New` | `product-menu-badge.liquid` | 优先级：Hot > Best Seller > New |
| 移动端汉堡按钮 / 顶栏 | `header.liquid:324-398` | `style.css:2828-2863`、`res-base.css:64-108` | |
| 移动抽屉整体 | `header.liquid:462-761` | `style.css:1688-2061` | 开关逻辑 `main.js:446-463` |
| 移动抽屉内搜索框 | `header.liquid:471-490` | `style.css:2005-2033` | 普通表单，无联想 |
| 移动端 mega 面板 | `header.liquid:666-690` | `header-mega-mobile-display-N.liquid`、`style.css:1848-2000` | |
| 移动端 bundle | `header-mega-mobile-display-6.liquid` | `header-mega-mobile-bundle-category.liquid`、`mega-menu.css:477-600`、`main.js:534-551` | |
| 搜索浮层 | `sections/search.liquid` | `main.js:428-444`、`search.css`、`style.css:2377-2591` | |
| 搜索联想 | — | `predictive-search.js` | `/search/suggest` |
| 搜索推荐内容 | `header-group.json` 的 `search` blocks | `search-recommendations.liquid` | |
| 购物车数量角标 | `header.liquid:278-289`（桌面）/ `384-393`（移动） | `style.css:1308-1326` | |
| 点购物车打开抽屉 | — | `popup-cart.js:29-34` → `popup-cart.liquid` | |
| Wishlist 点击 | `header.liquid:259-263, 372-376, 766-778` | Swym app | |
| 账户 / 登录区 | `header.liquid:265-270`（桌面）、`693-723`（抽屉） | — | 文案是写死的 |
| 国家/货币切换 | `header.liquid:228-246`（桌面）、`734-754`（抽屉） | `global.js:1092-1158` | `venustas.ca` ↔ `venustas.com` |
| 语言下拉 US/CA | `header.liquid:292-317` | `style.css:1641-1687`、`main.js:555-567` | |
| header 固定 / 阴影 / 层级 | `style.css:1136-1145` | — | `fixed` + `z-index:100000` |
| 桌面 vs 移动断点 | — | `res-base.css:2/43/112`、`bootstrap-custom.css:793/1582` | 见 §6.7 |
| 新增一个图标 | `header.liquid:228-319`（桌面）+ `361-396`（移动） | `style.css:1220-1326` | 两处都要加 |

---

## 6. 改之前必须知道的 7 个机制

### 6.1 导航 ↔ mega 块：靠 `menu_tag` 字符串相等绑定

```liquid
{% for block in section.blocks %}
  {% if clean_title == block.settings.menu_tag %}
    {% assign has_mega_menu = true %}
```

- 出现位置：`header.liquid:197-204`（桌面）、`514-519`（移动触发）、`577-578`（移动面板）、`mega-menu.liquid:1-4`（桌面 mega 内部再校验一次）
- **两边必须完全一致**（`clean_title` 已 `strip`，但大小写/空格敏感）。
- 菜单项标题带 `#标签` 时，绑定用的是 `#` 前面的部分。

### 6.2 菜单标题里的 `#` = 角标

`名称#New` → 显示「名称」+ 小标签「New」。解析在 `header.liquid:188-190`，链接内的角标渲染在 `mega-menu-link.liquid`。

### 6.3 URL 里的 `#mm` 是历史兼容

`header.liquid:182-186`：链接含 `#mm` 会去掉它，并优先用 block 的 `main_link`（L204）。改菜单链接时别把 `#mm` 当锚点。

### 6.4 `data-drop` / `data-mega` 是 JS 的钩子

- 桌面：`.nav-item[data-drop="handle"]` ↔ `.drop[data-drop="handle"]`，匹配失败 = 下拉打不开（`main.js:345-375`）。
- 移动：`button/a[data-mega="handleized-title"]` ↔ `.mega-mobile[data-mega=...]`，panel 上的 key 是 `clean_title | handleize`，**不是** `menu_tag`。
- 改 key 的生成方式，必须同时改 `header.liquid` 和 6 个移动 snippet。

### 6.5 block 类型名拼写就是 `dislay_*`（少一个 p）

`schema` / `header.liquid` 的 `case` / `mega-menu.liquid` 的 `if` 三处都用这个拼写。新增类型时**三处同步**，否则块不渲染也不报错。另外注意：`dislay_3` 和 `dislay_4` 的移动实现共用 `-3-4` 文件。

### 6.6 header 高度是「CSS 变量 + JS 事件」双轨

```
Liquid  L20-33   →  --header-nav-height / --announcement-current-height / --headerHeight
        ↓
JS      main.js  关闭公告(L597) / 倒计时结束(L328-336) / 编辑器 load(L631-638) → 改 --announcement-current-height
        ↓
        window.dispatchEvent(new CustomEvent('header:heightchange'))
        ↓
        main.js:611-637  更新 .sticky-top / .nav-mobile 高度 / .header-nav-section 顶部
```

改 header 高度（比如公告 37px → 40px）要改 4 处：`header.liquid:22-25`、`main.js:635`、`main.js:328-336`（倒计时过期后置 0）、`style.css:934-940` + 所有依赖 `--headerHeight` 的规则。

### 6.7 桌面 / 移动是两套 DOM，同时存在

| 布局 | 容器 | 显隐 class | 实际生效宽度 |
|---|---|---|---|
| 桌面 | `.header-wrapper`（L160） | `d-lg-flex d-md-none d-sm-none` | **≥1280px** |
| 移动 | `.header-wrapper-mobile`（L324） | `d-lg-none d-md-flex d-sm-flex` | **<1280px**（含平板/手机） |

- `bootstrap-custom.css`：`d-md-*` 断点 900，`d-lg-*` 断点 1280。
- `res-base.css`：手机 `767`、平板 `768-1279`、桌面 `1280+`。
- ⚠ 两个断点体系不一致：**900–1279 区间是「移动 header + 平板样式」**，调样式时容易对不上号。改宽度相关需求先确认目标区间。

---

## 7. display 1–6 对照表

| 类型 | 名称 | 桌面实现 | 移动实现 | CSS | 后台设置前缀 | 结构 |
|---|---|---|---|---|---|---|
| `dislay_1` | Display - 1 | `mega-menu.liquid:5-74` | `header-mega-mobile-display-1` | `mega-menu.css:1-110` | `menu_list_1~3`, `product_list` | 3 列菜单 + 2×2 商品 |
| `dislay_2` | Display - 2 | `mega-menu.liquid:76-215` | `header-mega-mobile-display-2` | `mega-menu.css:111-156` | `nav_1~6`, `tab_N_link`, `collection_nav_N`, `product_nav_N` | 左侧 tab + 右侧商品网格 |
| `dislay_3` | Display - 3 | `mega-menu.liquid:217-379` | `header-mega-mobile-display-3` → `-3-4` | `mega-menu.css:157-234` | `label_1~4`, `image_1~4`, `menu_list_1~4` | 3 或 4 列：图 + 标题 + 链接 |
| `dislay_4` | Display - 4 | `mega-menu.liquid:464-578` | `header-mega-mobile-display-4` → `-3-4` | `mega-menu.css:235-244` | `label_1~5`, `image_1~5`, `link_1~5` | 5 列图文 |
| `dislay_5` | Display - 5 | `mega-menu.liquid:381-460` | `header-mega-mobile-display-5` | `mega-menu.css:245-311` | `menu_list_1~2`, `image_1~2`, `title_url_*` | 左菜单列 + 右双图 |
| `dislay_6` | Display - 6 (Bundle Sale) | `mega-menu.liquid:461` → `header-mega-desktop-display-6` | `header-mega-mobile-display-6` + `-bundle-category` | `mega-menu.css:312-600` | `category_label_1~4`, `category_collection_1~4`, `view_all_label` | 左分类 + 右货架 |

---

## 8. 「同名但不是 header」——别改错文件

| 文件 | 真实用途 |
|---|---|
| `sections/page-nav-header.liquid` | 页面（page 模板）的**锚点导航**，页面顶部横条，不是全站 header |
| `sections/product-nav.liquid` / `product-nav-new.liquid` | 商品详情页**吸顶购买栏**（含规格、加购） |
| `snippets/nav-product-variant.liquid` | 商品页/快速加购的规格选择器（被 `product-nav-new` 和 `product-new-card-quick-add-dialog` 调用） |
| `snippets/pagefly-app-header.liquid` | PageFly 应用注入的 `<head>` 内容（`theme.liquid:351`） |
| `assets/global.js` `HeaderDrawer` | Dawn 遗留的 web component，本主题抽屉实际由 `main.js:446-463` 控制，**不要改这里** |
| `sections/main-search.liquid` | `/search` 搜索结果页，不是浮层 |

---

## 9. 改完自查清单

- [ ] 桌面（≥1280）和移动（<1280）**两边都看**：header 有两套 DOM
- [ ] 公告栏开着 / 关掉 两种状态都看：`--announcement-current-height` 会变
- [ ] 移动抽屉打开后，页面滚动是否被锁（`body.menu-open`）
- [ ] 改了 display 结构：桌面板 + 对应移动面板都改，`menu_tag` 绑定仍成立
- [ ] 改了 block 类型名：schema / `header.liquid` case / `mega-menu.liquid` if **三处**同步
- [ ] 改了 header 高度：`header.liquid:20-33`、`main.js:611-637`、依赖 `--headerHeight` 的样式
- [ ] 改了 `header-group.json`：记住主题编辑器会重写该文件（文件头有警告）

---

## 10. 已知技术债（改到附近时顺手注意）

| 位置 | 问题 |
|---|---|
| `header.liquid:447-451`、`672-689` | 每个一级菜单都遍历全部 blocks 渲染 mega，block 多时 TTFB/HTML 体积线性增长 |
| `header.liquid:166, 352` | 用 `img_url: 'master'`（旧 API），新代码建议 `image_url` |
| `header.liquid:250, 294, 336, 466, 476` | 图标/图片写死 Shopify CDN 绝对地址，换主题/店铺需逐个替换 |
| `header.liquid:292-317`、`734-754` | US/CA 切换与 `venustas.ca` 域名写死，多市场扩展要重构 |
| `header.liquid:703-709` | 登录文案写死英文，无翻译键 |
| `sections/search.liquid:87-96` | 文件尾部残留自动改写工具生成的注释块 |
| `mega-menu.css:157` | display3 有 `.menu-list-tab` 样式，但当前 display3 实现已不用 tab，属死代码 |
