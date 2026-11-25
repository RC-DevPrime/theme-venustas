# 2026-11-25 删除旧导航代码

- 模块：header
- 状态：已删除旧导航文件与包含引用；静态校验通过，未浏览器实测
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas（HEAD ed170a6 + 未提交改动）
- 批准依据：用户明确要求“把旧导航相关的代码删除干净，而且不影响现在的流程”，并已在前一轮确认新导航不依赖旧文件
- 批准范围：旧 header section／group、mega-menu 系列 snippet、旧导航专用样式与两处 layout 引用；不改共享样式/脚本、不改新导航文件、不改 group 配置

## 目标与源码证据

删除前静态核对：`layout/theme.liquid:358` 只 `sections 'header-group-new'`；`sections/header-group-new.json` 的 order 为 announcement_bar → header_new → search → popup-cart，四个 section 文件都存在；全仓检索没有模板／布局引用 `header-group`（旧）或 `type: header`；旧 header 只 render `mega-menu`、`header-mega-mobile-display-1..6`、`icon_currency`，其中 `icon_currency` 同时被新导航的 `header-icons`（国旗）使用，必须保留。`assets/mega-menu.css` 全部选择器都在 `.header .mega-menu ...` 之下，无其它文件使用该前缀；`style.css`/`res-base.css` 是全局共享样式，其中 `.header` 基础规则仍作用于新导航（新 nav 保留 `header` 类）。

## 实际变更

删除 20 个旧导航专属文件：

- sections/header.liquid、sections/header-group.json
- assets/mega-menu.css
- snippets/mega-menu.liquid、mega-menu-link.liquid、mega-menu-d2-product-loop.liquid、mega-menu-d2-mobile-product-rows.liquid
- snippets/header-mega-bundle-panel.liquid、header-mega-bundle-product-card.liquid、header-mega-desktop-display-6.liquid、header-mega-mobile-bundle-category.liquid、header-mega-mobile-display-1／2／3／3-4／4／5／6.liquid（7 个）
- snippets/product-item-mega-menu.liquid、product-item-mega-menu-display-2.liquid（旧 mega menu 商品卡，删除后全仓无引用）
- snippets/product-menu-badge.liquid（旧 mega menu 的 Hot／Best Seller／New 角标，删除后全仓无引用）

移除两处包含：layout/theme.liquid、layout/theme.pagefly.liquid 中的 `{{ 'mega-menu.css' | asset_url | stylesheet_tag }}`。

保留未动：assets/style.css、res-base.css 中旧导航选择器（见遗留）；assets/global.js、main.js、collection.js、article.js、blog.js（依赖 `.header` 类与 `--headerHeight` 的共享逻辑）；snippets/icon_currency.liquid、heating-icons.liquid（新导航在用）；sections/announcement-bar.liquid、search.liquid、popup-cart.liquid；blocks/_header-nav-*、snippets/header-new-*、header-icons.liquid（新导航）。

## 验证

- 全仓检索 `mega-menu`、`header-mega`、`render 'header...'`、`sections 'header'`：无残留引用；`snippets/` 下已无 mega 系列文件。
- 未引用片段扫描：nav／menu／header 命名片段中已无未引用项。
- `sections/header-group-new.json` 解析通过，四个 section 类型对应文件均存在，order 不变。
- 两个 layout 已无 `mega-menu.css`，theme.liquid 仍渲染 header-group-new。
- JSON 解析：templates／sections／config 中除 templates/product.MMJ01.json、product.MMP03.json 外全部可解析；这两个文件本次未改动（git status 无变化），属既有问题，已记入 known-issues。
- 未启动浏览器、未运行 theme check、未上传主题；新导航页面表现未回归实测。

## 文档与决策

本日志；Header files.md 增加删除记录并把 2026-11-23 基线表格标为历史；architecture 与 known-issues 增量；知识库索引。无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 共享样式表中仍保留旧导航选择器（`.header .mega-menu ...`、`.nav-mobile ...` 等）。它们已无匹配 DOM，属于死样式；未删除的原因是这些文件为全局样式且与新导航共用 `.header` 基础规则，清除需逐条核对并做视觉验证。
- 旧导航专属的 shop_images（Help_Center／Order_Tracking 等）是文件库资源，不在主题文件范围内，未处理。
- 后续如清理 style.css/res-base.css 的旧选择器，需在预览主题逐页核对（首页、集合筛选 sticky、文章 sticky、商品页）。
- 回退：`git checkout -- <被删文件路径>` 可恢复 20 个文件，并还原两个 layout 的一行引用即可。
