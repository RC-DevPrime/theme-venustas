# 2026-11-24 移动 Help 行箭头与桌面 Gift Guide 按钮

- 模块：header
- 状态：实现与定向静态检查；未浏览器实测
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas，feature/menu 未提交改动
- 批准依据：用户要求移动端导航 Help 右侧加箭头、桌面端 Gift Guide 底部显示按钮
- 批准范围：sections/header-new.liquid、assets/header-new.css、sections/header-group-new.json（仅 gift_panel.guide.url）及文档

## 目标与源码证据

移动截图：Help 行左侧问号图标 + “Help”，右侧箭头，表示可进入 Help 页。当前该行是 button.header-new__utility-row（data-header-toggle=help），只有图标与文字，没有箭头。

桌面截图：Gift 面板底部 “Shop the Gift Guide →”。gift_panel 里已有 guide 块（_header-nav-button，title=Shop the Gift Guide、style=text、align=left、show_arrow=true、visibility=desktop），但 url 为空；blocks/_header-nav-button.liquid 仅在 title 与 url 都不为空时输出（has_primary），所以桌面底部按钮整体不渲染。主题已有 templates/page.gift-guide.json，可作为默认目标。

## 实际变更

- sections/header-new.liquid：移动 Help 行内新增 span.header-new__nav-chevron（复用 chevron-right 图标），与导航项箭头同一套样式。
- assets/header-new.css：新增 `.header-new .header-new__utility-row .header-new__nav-chevron { margin-left:auto; }`，把箭头推到行尾；箭头显示规则沿用现有 ≤1199px 的 .header-new__nav-chevron（12×12、inline-flex）。
- sections/header-group-new.json：gift_panel.blocks.guide.settings.url 由空改为 shopify://pages/gift-guide，使该块满足 has_primary 并渲染；其余设置未改。

## 验证

Node 解析 group JSON 通过（guide：Shop the Gift Guide｜shopify://pages/gift-guide｜desktop）；Liquid schema 解析通过、div 15:15、button 8:8；CSS 花括号 263:263。未启动浏览器、未上传主题；移动箭头位置、桌面 Gift 面板底部按钮样式与跳转均未实测。

## 文档与决策

本日志、知识库索引、Header known-issues 增量。未改底部按钮组件的通用逻辑（其他面板的空 url 行为保持不变）。

## 风险、回退与遗留

- gift-guide 页面句柄按模板名推断为 pages/gift-guide，需在后台或预览确认；若实际句柄不同，在编辑器 Gift 面板底部按钮的 Link 里改成正确地址即可。
- 移动 Help 行箭头与导航项共用 class，若后续给其他 utility 行加箭头可直接复用该规则。
- 回退：删除新增箭头 span 与 margin 规则、并把 guide.url 恢复为空即可。
