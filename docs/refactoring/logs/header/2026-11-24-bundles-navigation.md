# 2026-11-24 Bundles 导航与超限实验

- 模块：header
- 状态：实现与定向静态检查；平台超限保存／显示待用户测试
- 环境／源码基线：D:/zyl/theme-venustas，延续 New/Men/Women 实现
- 批准依据：用户提供 Bundles 桌面 Figma 与移动截图，要求使用旧 Bundle Sale 集合；随后明确不控制50以内，保留真实区块由用户测试
- 批准范围：Bundles 及必要共享样式／脚本；不改旧 Header，不迁移多 section，不提交／推送／发布

## 目标与源码证据

Figma file lKrjxX1me3oajXobNizmhj 节点6226:5642，经 design context 与返回截图读取桌面260px分类侧栏、100px间隔、四商品区与底部描边按钮；移动按用户截图使用两列分类按钮与两列商品，底部当前集合实心按钮。商品图、商品标题和链接按用户要求读取集合，不把 Figma 示例商品图下载为真实商品。

旧 sections/header-group.json 的 dislay_6_yaYK6A 提供分类与集合：Clothing + Battery → clothing-extra-battery；Clothing + Gloves → complete-your-warmth；Couple & Family → couple-family；Clothing + Socks → clothing-extra-socks。总入口 bundle-deal，标题和说明一并复制。

## 实际变更

新增 blocks/_header-nav-campaign.liquid、blocks/_header-nav-category.liquid、snippets/header-new-product-card.liquid；修改 sections/header-new.liquid、sections/header-group-new.json、assets/header-new.js/css。

Bundles 采用独立可排序分类块，默认读取各集合前四商品，支持236:189完整显示与228:285裁切。桌面悬停／聚焦预览、分类名链接跳集合；移动按钮切换当前分类内容与按钮。首个非空分类默认选中，空集合不输出，全部为空禁用该面板入口。固定总入口与分类入口独立。按此前明确范围不实现 New/Hot 商品角标。

原49块新增活动面板1、分类4、底部按钮1，共55块；按用户明确要求保留，不用静态区块或固定字段规避计数。New/Men/Women、search/popup-cart 和旧 Header 配置保留。

## 验证

项目无 package.json 或既有测试脚本。11份 schema JSON、设置ID、父子类型、block_order、四个旧集合和标题映射核对通过；总数确认为55，本任务刻意不把小于等于50作为通过条件。与 HEAD 对比确认 New/Men/Women 三面板、search/popup-cart 配置未变。node --check assets/header-new.js、git diff --check 通过；Git提示工作区LF未来会转换为CRLF，不是语法错误。

Shopify Dev MCP validate_theme 30秒超时，使用临时隔离目录 Shopify CLI theme check，仅启用 LiquidHTMLSyntaxError、ValidSchema、JSONSyntaxError、ValidSettingsKey，返回 []、退出码0。该语法／schema检查不证明平台接受超限配置。静态复审修正全部为空仍可能悬停展开、分类悬停切换隐藏键盘焦点、移动分类控件顺序等问题；移动采用选中按钮单一Tab停靠点及方向键/Home/End导航，焦点约束排除tabIndex为负的控件。

未启动浏览器、上传主题、提交或发布。读取 Figma 截图不代表浏览器验收。

## 文档与决策

新增 ADR-0004，增量更新 Header 技术档案、知识库入口与项目模块关系。历史49/50与迁移建议保留，明确本次用户覆盖的实验边界。

## 风险、回退与遗留

本地静态检查不能证明 Shopify 接受55块配置，是否保存／上传／显示成功待用户实际测试；如果平台拒绝，不自动改变用户本次实验目标。此前用户报告看不到新 Header 配置，暂无对应主题环境证据，本次未宣称解决该问题。

集合数据仍依赖主题对应商店；不存在或无商品会隐藏分类。本批仅实现 Bundles，不自动实现其他导航。回退删除 bundles_panel 及其 block_order 项、撤销必要组件接入即可恢复49块；旧 Header 始终保留。
