# 2026-11-23 New 导航首批实现

- 模块：header
- 状态：实现完成，静态校验结果见下；浏览器与线上待用户测试
- 环境／源码基线：D:/zyl/theme-venustas 本地工作区；存在用户既有 .gitignore、.shopifyignore、AGENTS 与知识库改动，未覆盖
- 批准依据：用户要求从 Figma 实现 New，暂用变量写死八导航、复用旧推广数据；明确选择切换 theme.liquid 引用至 header-group-new
- 批准范围：New 面板、新 Header 文件及测试入口；不实现其他面板和功能入口，不删除旧 Header，不提交／推送／发布

## 目标与源码证据

Figma file lKrjxX1me3oajXobNizmhj：6226:3641（桌面）、6324:7606（移动）。通过 design context 与返回截图核对。旧 sections/header-group.json 中 menu_tag=New 的 dislay_5_63a99U 提供两张推广图片、标题和链接。原入口为 layout/theme.liquid 的 header-group 引用。

## 实际变更

新增 sections/header-new.liquid、sections/header-group-new.json、assets/header-new.css/js、blocks/_header-nav-{group,column,featured,menu,feature,promo,button}.liquid、snippets/header-icons.liquid。layout 仅切换 group 引用。

New 三列为快捷入口、Just Launched、Just In，支持两推广卡、桌面底部按钮和移动折叠／返回／关闭。第一列使用 Category 角色隐藏移动标题，不参与折叠。普通菜单区块支持读取 Shopify 菜单；其余尚未使用的类型不预建。推广素材沿用旧配置，未使用 Figma 临时地址。旧 search/popup-cart 数据复制保留。

八个顶级入口及临时地址集中于 section 变量。New Color 与缺少已确认商品地址的 Just In 条目临时指向已有 new-arrivals 集合，后台可修改；不编造未确认产品 URL。逐商品 New 角标按此前明确排除范围不实现。

## 验证

检查项目未提供 package.json 或本地构建／测试脚本。实际执行：node --check assets/header-new.js 通过；8 份 schema JSON 解析、设置 ID、父子类型、block_order、17 个嵌套区块数量及 search/popup-cart 配置原样保留核对通过；git diff --check 通过。Shopify Dev MCP validate_theme 指定本次文件，但接口 30 秒超时；随后将本次新增文件及复用图标依赖复制到临时隔离目录，使用 Shopify CLI theme check，仅启用 LiquidHTMLSyntaxError、ValidSchema、JSONSyntaxError、ValidSettingsKey，返回 []、退出码 0。该隔离校验不验证后台资源存在性或全主题运行效果。

静态复审发现桌面 pointerleave 可能隐藏键盘焦点所在面板，已为焦点保留增加保护。未启动浏览器、截图或运行全量构建；设计工具截图仅用于读取设计，不代表浏览器验收。

## 文档与决策

增量维护 Header README、architecture、files、project/module-map 与 project/architecture；新增 ADR-0002。旧 Metaobject 提案保留为历史，当前不采用。

## 风险、回退与遗留

Shopify 后台菜单、图片、页面及集合资源是否存在取决于测试主题；本地无法确认发布资源。仅实现 New，其余入口临时链接不保证与后台实际集合一致。未提供新搜索／购物车入口。保留 nav.header、高度选择器、变量与事件，但跨页面实际行为仍需用户测试。

回退：将 layout/theme.liquid 的 sections 引用恢复 header-group；旧 group、section、snippets 与资源均未改动。未提交、推送、发布，不自动启动其他导航或模块。
