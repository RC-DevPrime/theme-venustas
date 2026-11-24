# 2026-11-23 Men／Women 四列导航

- 模块：header
- 状态：实现及定向静态检查完成，后台资源及浏览器待验证
- 环境／源码基线：D:/zyl/theme-venustas；延续上次 New 未提交实现，保留既有用户改动
- 批准依据：用户明确要求基于前述分析实施 Men、Women，共用四列结构、分别配置，Category 移动不折叠，其他列折叠，移动底部显示双推广卡
- 批准范围：两个新面板及必要共用组件；不删除旧代码，不自动提交／推送／发布，不实现其他面板

## 目标与源码证据

读取 Header 文档、New 日志、ADR-0002 与实际 section、group、blocks、CSS/JS；Figma file lKrjxX1me3oajXobNizmhj 节点6226:3979 提供桌面结构与两张推广原图，用户截图提供移动状态及 Women 数据。Women 采用相同样式，仅配置不同类别／Style／Collections。移动截图不含推广卡，但用户本次明确要求底部双卡，按文字需求实施。原旧配置提供 Men 总链接 collections/men、Women 总链接 collections/womens、推广页面和 Technology 页面地址。

## 实际变更

- sections/header-new.liquid：新增 men/women 面板入口键，仍保留固定八项变量。
- sections/header-group-new.json：保留 New/search/popup-cart，分别配置 Men/Women 四列、双推广卡、Shop All 与 Technology。每个面板16块，现共49/50块。
- 新增 blocks/_header-nav-image-menu.liquid：菜单优先、URL 匹配图片、统一占位图、移动三列；_header-nav-column 开放第四类型。
- _header-nav-menu 增加菜单缺失时最多四项初始文案；_header-nav-button 支持单区块双链接；_header-nav-promo 增加可选择默认素材回退；assets/header-new.css 增加对应样式。
- assets/header-new-volcano.jpg、header-new-apex.jpg 为 Figma 原始1080×1350 JPEG，实地读取 metadata 并查看本地图像确认与设计位置对应；虽然下载 URL 以 png 结尾，内容实际是 JPEG，已按真实格式命名。通过 asset_img_url 提供尺寸候选，保留懒加载。

本批不变更 assets/header-new.js、layout/theme.liquid、旧 header-group/header/snippets 或其他模块代码。

## 验证

项目无 package.json 或既有测试脚本。Python 核对 schema JSON、设置引用、允许的子类型、block_order、总计49块、两面板各四列和双移动卡通过；node --check assets/header-new.js 与 git diff --check 通过。Shopify Dev MCP validate_theme 30秒超时，改用临时隔离目录的 Shopify CLI theme check，仅启用 LiquidHTMLSyntaxError、ValidSchema、JSONSyntaxError、ValidSettingsKey，返回 []、退出码0。

静态复审修正移动专用按钮规则被通用 display 覆盖，以及 Technology 与推广卡的 DOM／视觉顺序不一致。未启动浏览器、截图、全量测试或构建；Figma 截图属于设计读取，不是页面验收。

## 文档与决策

新增 ADR-0003，增量更新 Header README/architecture/files/known-issues、项目入口与模块关系。原 New 日志和旧提案保留。

## 风险、回退与遗留

六个原生菜单句柄、分类图片及部分目标地址未提供；已异步询问，在未收到数据时以初始文案和占位图展示，空地址保持非交互文本；Best Sellers 暂指向各自总集合。商家可直接选择原生菜单及按对应链接上传图片，菜单优先替换初始数据。未假设本地能创建 Shopify 原生菜单。

现有 section 已用49/50个动态块，扩展后续导航需先规划容量。后台资源存在性、CDN 实际返回与浏览器布局未验证。回退本次 Men/Women 面板、对应共用组件扩展和两张默认图即可恢复 New 基线；旧 Header 始终保留，可通过原 group 引用恢复。未提交、推送或发布。
