# Shopify Theme 重构知识库

2026-11-28：[编辑弹窗移动端底部抽屉样式](logs/2026-11-28-popup-nav-new-mobile-style.md)：两个编辑弹窗移动端参考 product-nav-new，改为非全屏底部抽屉、98px 商品摘要、灰色变体区、固定 ATC；桌面 600px 不变，数量留在滚动区。

2026-11-28：[公告栏链接下划线与倒计时精简](logs/header/2026-11-28-announcement-link-underline-countdown.md)：整段 `link` 包裹不画下划线、富文本内嵌 `<a>` 才带下划线；倒计时去掉秒，数字改主题色加粗。

2026-11-28：[抽屉 logo 行右侧的国家切换](logs/header/2026-11-28-mobile-country-switcher.md)：移动端切换移入抽屉顶部 logo 行，删除抽屉专用覆盖后复用桌面浮层，并清理抽屉顶部 3 条历史按钮样式。

2026-11-28：[促销行图标与文案同排](logs/2026-11-28-promotion-row-icon-inline.md)：`product-nav-promotion` 把图标与文案合成一个 flex item，图标浮动在首行左侧，Free 长文案换行后回到与图标左对齐；折扣价仍可换行，商品页抽屉行为不变。

2026-11-28：[集合商品卡标题重写与行数限制](logs/collection/2026-11-28-product-collection-title-clamp.md)：product-collection 标题合并为单锚点 + 内层 span，≤899px 三行、≥900px 两行省略，样式改到 collection.css。

2026-11-28：[移动端 New 面板 Just Launched 默认展开](logs/header/2026-11-28-mobile-new-just-launched-open.md)：列级 `mobile_default_open` 设置替代“只展开 DOM 第一列”，仅 New 的 Just Launched 启用；Men／Women／Accessories／Gift 行为不变。

2026-11-27：[商品卡片促销价按卡片展示价计算](logs/collection/2026-11-27-product-card-promo-card-price.md)：`product-card-promotion` 把卡片的 `price_min`／选中变体价传给促销组件，Extra 折后价与卡片 `From` 价一致。

2026-11-27：[桌面顶级导航可点击与链接配置](logs/header/2026-11-27-desktop-nav-links.md)：8 个顶级入口保留 `<a>`，桌面悬停／聚焦开面板、点击跳转到 `nav_link_*` 设置；移动端仍点击开面板；字段留空时回退到各面板 Shop All。

2026-11-27：[促销行前缀分支与选中变体折扣价](logs/collection/2026-11-27-product-promotion-prefix-logic.md)：空值不显示；`Extra` 用 promotion-tag/#FF5F00 并按选中变体算折后价（商品页导航切换实时重算），`Free` 用 gift/#1E7A46，其它前缀黑色文字 + gift。

2026-11-27：[促销行空值礼卡兜底与配色](logs/collection/2026-11-27-product-card-promotion-fallback.md)：metafield 为空统一显示 `Free $20 Gift Card Orders $200+`（gift 图标、#1E7A46），非空 #FF5F00；商品页导航、gift-guide 与两类商品卡片均生效，文案只在组件内维护。（已被同日前缀分支逻辑取代）

2026-11-27：[商品卡片底部促销行](logs/collection/2026-11-27-product-card-promotion.md)：product-item 与主集合 product-collection 两类卡片底部复用 product-nav-promotion，取最低价变体折算；空值兜底由当日后续变更调整。

2026-11-26：[Men／Women 移动端 Shop by Category 折叠](logs/header/2026-11-26-mobile-shop-by-category-accordion.md)：图片菜单在 ≤1280 输出折叠行，默认展开六图，两个快捷按钮保持在上方；桌面不变。

2026-11-26：[Sale 面板商品卡折扣角标](logs/header/2026-11-26-sale-campaign-product-discount-badge.md)：商品卡图片左上角渲染 `sale-badge`，仅 `data-header-panel="sale"` 显示，Bundles 不显示。

2026-11-26：[Header 条宽 100px 与下拉左对齐](logs/header/2026-11-26-header-bar-align.md)：bar 改 `min(100% - 100px,1720px)`；下拉内容 1281–1520 与 Logo 对齐、1521 起与导航 New 对齐；移动端断点改为 1280，搜索条与 Help 面板同步。

2026-11-26：[Header 顶部图标 hover 变红](logs/header/2026-11-26-header-icon-hover.md)：header-icons 全部改用 currentColor，搜索／账户／收藏／购物车／Help 及移动端图标 hover 变 #B93205。

2026-11-26：[Help 链接与邮箱按钮](logs/header/2026-11-26-help-links-audit.md)：六项 Help 链接统一字符串化并补绝对地址回退，Help 面板内链接不再先关面板，邮箱按钮 hover #B93205；同步检查 header 各图标跳转。

2026-11-26：[桌面 predictive search 结构重写](logs/header/2026-11-26-predictive-search-layout.md)：去掉 Bootstrap 栅格与 logo／空列，搜索框与结果面板统一 800px，改用 `predictive-search__*` 新类名。

2026-11-26：[桌面 predictive search 样式与图标](logs/header/2026-11-26-predictive-search-style.md)：搜索/关闭图标改用 header-icons，表单改 44 高胶囊，结果面板 1340 上限，标题与词条按新版字号间距。

2026-11-26：[活动面板商品卡角标](logs/header/2026-11-26-campaign-product-badge.md)：角标移入图片容器，绝对定位到图片右上角 8px、8px，底色 #FF5D5F。

2026-11-25：[header-new.css 前移到 head](logs/header/2026-11-25-header-css-head.md)：样式表改由 layout/theme.liquid 的 head 加载，两个 section 去重，解决 body 内样式表导致的首帧无样式与 section 刷新失效。

2026-11-25：[移动端搜索弹层样式](logs/header/2026-11-25-mobile-search-style.md)：按 Figma 6312:7106 调整字体、间距与商品卡，390 宽下内容宽 350（左右 20），抽屉改为满宽。

2026-11-25：[桌面端 Help 字标加粗](logs/header/2026-11-25-help-wordmark-weight.md)：Help 为 SVG 轮廓字，用同色 0.45 描边模拟 700 字重，图标与尺寸不变。

2026-11-25：[Category image menu 移动端标题](logs/header/2026-11-25-image-menu-mobile-title.md)：匹配到槽位后，移动端用 Initial category name 覆盖菜单链接名称（空值回退菜单名），桌面端仍显示菜单名。

2026-11-25：[移动端列角色修正](logs/header/2026-11-25-mobile-column-role.md)：category 角色只保留 Men／Women 的 Shop by Category（无标题直接展开）；Shop by Style 与 New 的 New Arrival 改回 group，第一列标题行恢复显示、默认展开且仍可点击折叠。

2026-11-25：[移动端导航折叠与 Technology 位置](logs/header/2026-11-25-mobile-nav-accordion.md)：所有列都可折叠，第一列无按钮直接展开、其余默认折叠（移除 mobile_open）；Our Technology 移动端排到推广卡之后。

2026-11-25：[Category image menu 按完整地址匹配图片](logs/header/2026-11-25-image-menu-url-match.md)：图片槽位改为路径 + 查询参数逐项精确比较、参数最多者优先，避免 `/collections/men?filter.p.product_type=...` 全部命中第一个槽位。

2026-11-25：[Menu list 菜单链接徽标](logs/header/2026-11-25-menu-list-badges.md)：菜单非空用菜单、为空回退初始链接；菜单项名称或链接末尾的 #文本 直接渲染 .header-new__badge 并从标题／href 去掉该段。

2026-11-25：[活动商品卡标题两行省略](logs/header/2026-11-25-campaign-product-title-clamp.md)：header-new.css 标题加 -webkit-line-clamp:2，超过两行显示省略号。

2026-11-25：[新 Header 去掉 header 类并清除旧样式/脚本](logs/header/2026-11-25-header-class-decoupling.md)：class 改为 header-new，213 条旧 header CSS 与 main/global/popup-cart/index 旧逻辑删除，header-hide 行为改指新类。

2026-11-25：[删除旧导航](logs/header/2026-11-25-remove-legacy-header.md)：删除旧 header／group、mega-menu 片段与 mega-menu.css，保留共享样式与 `.header` 锚点。

2026-11-24：[公告栏独立 section](logs/header/2026-11-24-announcement-bar-section.md)：公告 38px 固定，header 40/68（1280 断点），样式与交互迁入 header-new.css／js。

2026-11-24：[顶级导航下拉失效修复](logs/header/2026-11-24-nav-toggle-runtime.md)：section.blocks 读不到主题块 settings，改为运行时按面板 key 升级导航项。

2026-11-24：[恢复 Bundles／Sale 面板](logs/header/2026-11-24-restore-bundles-sale-panels.md)：后台保存回写曾覆盖 group 文件，已从 c202258 增量恢复两个 campaign 块。

2026-11-24：[Help 下拉／Help 页面](logs/header/2026-11-24-help-panel.md)：Help 入口改为面板开关，桌面卡片、移动抽屉页，5 个业务链接待配置。

2026-11-24：[桌面 Header 布局对齐 Figma](logs/header/2026-11-24-desktop-header-layout.md)：1920/100px 留白、左侧 800、右侧间距与搜索胶囊按 6175:2532，搜索仍开既有弹层。

2026-11-24：[移动 Help 箭头与 Gift Guide 按钮](logs/header/2026-11-24-mobile-help-chevron-gift-guide.md)：Help 行加右箭头；Gift 面板 guide 块补链接后恢复桌面底部按钮。

2026-11-24：[Header功能入口](logs/header/2026-11-24-header-utilities.md) 接入旧Logo/搜索/购物车/应用与用户Help图标，Help下拉未实现。

2026-11-24：[Accessories／Gift 导航及入口关联修正](logs/header/2026-11-24-accessories-gift-navigation.md)，保留用户已有配置，复用既有组件。

2026-11-24：[Sale 五分类](logs/header/2026-11-24-sale-navigation.md) 复用活动面板接入，图片228:285，桌面无底部按钮，当前61块超限实验。

2026-11-24：[Bundles 导航与55块超限实验](logs/header/2026-11-24-bundles-navigation.md) 按用户明确要求继续原嵌套结构，未实施多 section 拆分，旧代码保留。

2026-11-23 后续增量：[Men／Women 四列导航](logs/header/2026-11-23-men-women-navigation.md) 已按本次授权实现，旧代码保留，未扩展其他导航。

2026-11-23 增量：用户批准实施 New 导航首批，当前本地 Header 入口为 header-group-new，旧代码保留。见 [New 实施日志](logs/header/2026-11-23-new-navigation.md) 与 [ADR-0002](decisions/0002-header-new-theme-blocks.md)。以下“未开始”描述为初始化时的历史状态；Collection、Product Detail 尚未启动。

初始化：2026-11-23。范围：当前本地工作区源代码；未连接线上主题或浏览器。当前阶段：知识库已初始化，等待审核，尚未开始业务重构。

## 入口与顺序

1. [Header](modules/header/README.md)：第一阶段，等待方案与批准。
2. [Collection](modules/collection/README.md)：后续阶段，不自动启动。
3. [Product Detail](modules/product-detail/README.md)：后续阶段，不自动启动。

## 目录用途

| 路径 | 内容 |
| --- | --- |
| [project/architecture.md](project/architecture.md) | 整体架构、资源加载和分析边界 |
| [project/coding-standards.md](project/coding-standards.md) | 现行规则、代码事实、建议的区别 |
| [project/module-map.md](project/module-map.md) | 模块入口和跨模块契约 |
| modules/{模块}/README.md | 职责、阅读顺序、状态、待确认项 |
| modules/{模块}/architecture.md | 核心流程与数据／交互依赖 |
| modules/{模块}/files.md | 实际文件清单、静态调用链、模板启用状态 |
| modules/{模块}/known-issues.md | 有证据的发现、历史经验、待验证风险 |
| logs/{模块}/ | 一次任务一份日志，不覆盖旧记录 |
| [logs/2026-11-23-knowledge-base-init.md](logs/2026-11-23-knowledge-base-init.md) | 本次跨模块初始化记录 |
| decisions/ | 有编号的 ADR，记录重要决策及取舍 |
| [templates/refactoring-log.md](templates/refactoring-log.md) | 重构日志模板 |
| [templates/adr.md](templates/adr.md) | ADR 模板 |

模块日志目录中的 `.gitkeep` 仅用于让空目录可被 Git 保存，不代表已有重构任务。根目录 [AGENTS.md](../../AGENTS.md) 负责要求 Codex 按范围读取和维护文档；没有新增后台服务、数据库或自动运行脚本。

## 读取流程

修改前读取本入口、相关 project 文档、对应模块的四份文档；按模块／共享文件／关键词检索相关历史日志和 ADR，再阅读实际源码。跨模块修改必须读所有受影响模块。不能以文档代替源码核对。

提交完整方案：目标、证据、文件范围、依赖影响、实施步骤、保留行为、验证方法、风险、回退方式和待确认项。业务代码必须取得用户对该方案的明确批准后才可修改。批准不自动延伸到其他文件、模块或线上发布。

## 增量维护

- 普通代码修改：新增必要任务日志，包含批准范围、改动、证据及实际验证。
- 功能逻辑变化：同步更新对应模块技术档案。
- 架构／跨模块关系变化：更新模块 architecture、files 和 project/module-map，必要时更新 project/architecture。
- 重要技术取舍：新增 ADR；未批准的选择标记 proposed，不写成 accepted。
- 修正文档：先核对源码；记录旧结论、修正依据和日期，保留必要历史，不每次重新生成整套文档。
- 日志命名 `YYYY-MM-DD-简短主题.md`，同日重名加序号；ADR 使用递增四位编号。
- 条目须区分：已确认代码事实／项目规则／建议／待验证／历史复盘。问题记录应含路径、位置或函数、适用环境、影响边界与状态。
- 文件路径和行号是初始化快照；改动后更新受影响条目，以当前源码为准。静态字符串调用不代表分支运行，也不包含全部动态／应用依赖。
- 不自动提交、推送、发布或开始下一个模块。完成后汇报并停止。

## 当前未知

线上主题与本地代码是否一致、商品／集合实际分配的 template suffix、后台菜单和 metafield/metaobject 数据、应用注入 DOM 及网络响应、实际交互和性能，均未验证。

## 版本管理待处理

本地 `.gitignore:5` 忽略根 `AGENTS.md`，且该文件当前未被 Git 跟踪。因此本次 AGENTS 更新在本地生效，但不会被常规 Git 添加包含；需审核后单独决定调整忽略规则或显式纳入跟踪。本次授权仅限文档与 AGENTS，未修改 `.gitignore`，未暂存、提交或推送。知识库 Markdown 本身不被该规则忽略。
