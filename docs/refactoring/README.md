# Shopify Theme 重构知识库

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
