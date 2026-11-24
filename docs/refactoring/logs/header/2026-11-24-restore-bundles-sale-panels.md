# 2026-11-24 恢复 Bundles／Sale campaign 面板

- 模块：header
- 状态：配置已恢复，结构与 JSON 静态校验通过；主题编辑器／浏览器未验证
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas，feature/menu 未提交改动
- 批准依据：用户回复确认“从 c202258 恢复两个 campaign 面板到 group JSON（推荐）”
- 批准范围：仅 sections/header-group-new.json 的 header_new.blocks 与 block_order 增量；不改 Liquid、JS、CSS，不改现有五个面板内容

## 目标与源码证据

用户反馈 Bundles／Sale 顶级入口没有下拉。assets/header-new.js 的 prepareNavToggles 按 data-nav-key（handleize 后的 bundles／sale）匹配 [data-header-panel]；当前 group 文件里 menu_key 只有 new／men／women／accessories／gift，按 type 统计 _header-nav-campaign 为 0，全文件无 bundle／sale 字样，因此两项没有可匹配面板，按设计退化为直达链接。

git 追溯：c202258 “feat: 添加sale导航” 的 sections/header-group-new.json 含 bundles_panel（menu_key=bundles）与 sale_panel（menu_key=sale）；其后的 ed170a6 “Update from Shopify for theme ... by Yaoyao zhang”（后台保存回写仓库）把该文件覆盖为不含 campaign 的版本，HEAD 与工作区自此都没有这两个面板。

## 实际变更

sections/header-group-new.json：从 c202258 取出 bundles_panel、sale_panel 两个完整块（含内部 blocks 与 block_order），按原文缩进插入 header_new.blocks 起始处，并把两个 id 加入 header_new.block_order。相对恢复前文件为纯增量：0 行删除、177 行新增。JS 无需改动，页面加载后自动匹配出下拉。

恢复内容沿用旧配置：Bundles 为四个 _header-nav-category（clothing-extra-battery、complete-your-warmth、couple-family、clothing-extra-socks）加 shop_all 按钮，入口集合 bundle-deal，图片比例 landscape；Sale 为 category_1／2／4／5／6（campaign、deal-of-the-week、mega-clearance-sale、new-customer、outlet，空槽仍跳过），图片比例 portrait。两个面板均无推广卡，show_category_button 为 true，mobile_shop_all_link 分别是 bundle-deal 与 campaign。

## 验证

Node JSON.parse（去注释头）通过：header_new 共 7 个块，block_order 一致，两个新块 type=_header-nav-campaign、menu_key=bundles／sale、各 5 个子块；与备份文件做 --no-index diff 确认仅新增 177 行、无删除；CRLF 与文件原格式一致；引用的 _header-nav-category、_header-nav-button 块文件均存在。未启动浏览器、未运行 theme check、未上传主题。

## 文档与决策

新增本日志；知识库索引登记；Header known-issues 补充“后台保存回写覆盖 group 文件、campaign 面板丢失”的事实与恢复范围。无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

恢复的是 c202258 时点的旧配置，分类标题、按钮文案与集合句柄需在主题编辑器核对；集合是否有商品、空集合隐藏与 JS 禁用逻辑未实测。editor 侧 block 顺序现在把两个 campaign 放在最前（导航顺序仍由 Liquid 八项固定变量决定），仅影响编辑器列表顺序。回退：删除这两个块与两条 block_order 即可回到恢复前状态（备份在会话临时目录，最终以 git diff 为准）。
