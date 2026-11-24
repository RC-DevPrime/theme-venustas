# 2026-11-24 顶级导航下拉失效修复（运行时关联面板）

- 模块：header
- 状态：实现与定向静态检查；未浏览器实测
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas，feature/menu 未提交改动
- 批准依据：用户 2026-11-24 回复“方案1”，确认采用运行时关联方案
- 批准范围：sections/header-new.liquid、assets/header-new.js 及对应文档；不改面板／group JSON、CSS、旧 Header

## 目标与源码证据

用户反馈改后所有顶级下拉都不显示。定位到 sections/header-new.liquid 原实现遍历 section.blocks 读取 panel.settings.menu_key 计算 has_panel。本 section 的块是 blocks/_header-nav-group、_header-nav-campaign 主题块，由 content_for 'blocks' 渲染；主题块在父 section 中遍历时 block.settings 为空、block.type 恒为 @theme（Shopify 员工回复与社区记录，见 tasks 讨论 13259／416639），因此 panel_key 恒为空，has_panel 恒 false，所有入口退化为普通链接，没有 data-header-toggle，assets/header-new.js 的 this.toggles 为空，面板永远不会展开。改前硬编码 navigation_panel_keys 时正常，说明不是语法错误而是取不到数据。

## 实际变更

- sections/header-new.liquid：删除 has_panel 的 section.blocks 循环与 if／else 双分支，统一输出 li[data-nav-key] 加普通 a 链接（保留 gift 强调类），箭头 span 保留在链接内，供升级后的按钮复用；无 JS 时仍是可用链接。
- assets/header-new.js：构造函数在取得 panels 之后、收集 toggles 之前调用新增的 prepareNavToggles()。它按 data-nav-key 与 data-header-panel 匹配，把对应 a.header-new__nav-link 原位替换为 button[data-header-toggle]（复制 class、innerHTML、aria-expanded=false）；没有匹配面板的入口移除箭头。这样面板仍是唯一数据源，新增面板无需再维护第二份名单。

## 验证

node --check assets/header-new.js 通过；Liquid 只删分支并保留 for／endfor、assign 结构，逐行核对标签闭合与 data 属性一致（li[data-nav-key] ↔ panel[data-header-panel]，两侧都是 handleize 结果）。未启动浏览器、未运行 theme check、未上传主题；桌面悬停展开、移动抽屉进入面板的实际表现仍未实测。

## 文档与决策

更新 Header architecture 的 2026-11-24 自动关联段落，修正为“section.blocks 读不到主题块设置，改为运行时关联”；known-issues 增加该平台限制及遗留项；知识库索引登记本日志。无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

入口按钮现在依赖 JS 升级（面板展开本身也已依赖 JS），无 JS 时退化为直达链接且移动端所有入口带箭头；主题编辑器 section 重载会重新初始化，不会重复升级。回退：恢复本文件两处增量，或按方案2改回显式 key 名单。仍需商家在测试主题确认桌面悬停／键盘 ArrowDown、移动抽屉、Bundles／Sale 无面板入口的点击跳转。
