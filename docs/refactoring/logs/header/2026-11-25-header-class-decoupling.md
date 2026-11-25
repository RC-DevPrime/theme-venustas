# 2026-11-25 新 Header 去掉 header 类并清除旧 header 样式与脚本

- 模块：header（涉及共享资源）
- 状态：实现与静态检查；未浏览器实测
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas，HEAD c986a93 + 未提交改动
- 批准依据：用户要求“新导航去掉 header 类，collection/article/blog 等改成 .header-new”“把旧 header 相关的样式和 js 删除干净，目前新 header 的样式和 js 都在 header-new.css/js”
- 批准范围：新导航 class 解耦、共享脚本/样式中的旧 header 代码、仍引用 `.header` 的页面脚本；不改新导航视觉数值、不改 group 配置（除删除失效的 banner 透明头设置）

## 目标与源码证据

改前 `<nav class="header header-new">`，新导航仍借用 style.css 的 `.header` 基样式（fixed/height/box-shadow/transition 等，header-new.css 已自带同名属性，仅缺 transition）。旧 header 删除后，以下代码仍在按 `.header` 工作：collection.js／article.js／blog.js（`.shopify-section-group-header-group .header` 量高度）、main.js（`.header .header-wrapper` 旧导航交互、`.header` 公告类名、`.header` 取高度）、global.js（`#shopify-section-header`、`.header .icon-local`）、popup-cart.js（`.header .icon-cart` 开购物车与角标）、index.js（`.header .header-wrapper` 透明头高度）、page.js／product.js／tech-core（`nav.header` + `header-hide`）、cooling-vest-nav／heatingV-anchor-nav／index-banner-slider（`.header` 偏移或滚动态）。另发现 style.css/res-base.css 内 213 条规则只服务旧 header 标记（`.header`、`.mega-*`、`.nav-mobile`、`.drops`、`.icon-local`、`.announcement-bar` 等），旧标记删除后已成死样式。

## 实际变更

- sections/header-new.liquid：`<nav class="header header-new">` → `<nav class="header-new">`。
- assets/header-new.css：`.header-new.header` → `.header-new`、`.header-new.header [hidden]` → `.header-new [hidden]`，并把 style.css `.header` 里唯一仍需保留的 `transition: box-shadow .2s ease` 补进基础规则。
- 脚本选择器改为 `.header-new`：collection.js、article.js、blog.js（header group 内量高度）、main.js（getHeaderHeight、section:load 判断、页面导航偏移）、page.js／product.js（`nav.header`→`nav.header-new`）、index.js（banner 高度测量）、heatingV-anchor-nav.liquid、index-banner-slider.liquid、cooling-vest-nav.liquid（选择器列表）、tech-core-technoogies.liquid（`pageHeader`）。
- 删除旧 header 脚本：main.js 的公告 Swiper／marquee／倒计时整段、旧导航 mega／移动菜单／语言选择交互、`.announcement-close` 处理器、`.nav-mobile` 高度写入、section:load 里的旧公告初始化与 `initAnnouncementSwipers` 调用；global.js 的 `HeaderDrawer` 自定义元素与 `initHeaderLocalizationSwitcher`；popup-cart.js 的 `.header .icon-cart` 点击与 `.dot` 角标同步；index.js 的 `enabled_transparent_banner_slider` 分支。
- 删除旧 header 样式：style.css 移除 213 条纯旧 header 规则（`.header` 143 条、`.nav-mobile`／`.mega-*` 70 条），res-base.css 移除 37 条并清掉 3 条 `.header .logo img,` 混合选择器中的旧部分；剩余 `.predictive-search` 规则保留。
- 保留并改为新类：page-nav-header／product-nav／tech-core 的 `nav.header.header-hide` → `nav.header-new.header-hide`，页面滚动隐藏 header 的行为继续作用于新导航。
- 移除已失效的 Banner Slider“透明头”特性：`enabled_transparent_header` 对应内联样式、`window.enabled_transparent_banner_slider`、滚动加 `.scrolled` 的 js、schema 设置，以及 templates/index.json 里的该设置值（原本为 false）。新的导航没有旧 `.header` 标记可透明化，保留会误导。

## 验证

`node --check` 通过：main.js、global.js、popup-cart.js、index.js、page.js、product.js、collection.js、article.js、blog.js、header-new.js；两个 JSON（header-group-new、index）解析通过；style.css 401/401、res-base.css 57/57、header-new.css 337/337 花括号平衡；以 HEAD 版本做选择器集合对比：style.css 移除 255 个选择器、res-base.css 移除 48 个，全部命中旧 header 标记，0 个误删（`.predictive-search` 的三条 logo 规则保留）；全仓检索 `.header`、`nav.header`、`header-wrapper`、`.nav-mobile`、`.mega-menu`、`icon-local`、`.announcement-bar` 均为 0（jquery-ui.min.js 内的是第三方字符串）；`header-new.js` 无 `.header` 选择器；新导航 class 为 `header-new`。

另：`[hidden]` 规则原为 `.header-new.header [hidden]`（0,3,0），去掉多余类后改为 `.header-new[data-header-new] [hidden]` 以维持 0,3,0，避免 Help 面板等带 `display:flex` 的规则压过它。未启动浏览器、未运行 theme check、未上传主题。

## 文档与决策

本日志；Header architecture／known-issues／files 与知识库索引增量。这是一次跨共享资源的解耦，未新增 ADR。

## 风险、回退与遗留

- 视觉：新导航不再继承 style.css `.header` 的其余属性。已核对并补上 transition，其余基础属性 header-new.css 原本就有；但没有浏览器实测，字体／阴影／层级等细节需在预览主题确认。
- 行为：Banner Slider 的“透明头”开关被移除（原值 false，当前线上表现不变）；若以后需要透明头，应按新导航标记重新实现。
- 外部依赖：第三方应用或 PageFly 片段若用 `.header`／`.nav-mobile`／`.mega-*` 类名做样式或偏移，会失去效果（本仓库内已无引用）。
- `global.js` 的 `MenuDrawer` 基类保留（通用组件，已无 `menu-drawer`/`header-drawer` 标记），未删除以免影响其他自定义元素。
- 回退：`git checkout -- <文件>` 可还原本次全部改动；如需只回退类名，恢复 `header` 类并还原对应选择器即可。
