# 2026-11-25 header-new.css 前移到 head，修复 header 无样式

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“按你说的修复，一定要确保第一时间能加载”
- 批准范围：`header-new.css` 的加载位置与去重；不改样式内容、不改 `header-new.js` 的加载方式

## 目标与源码证据

- 原实现：`sections/header-new.liquid:1` 与 `sections/announcement-bar.liquid:1` 各自输出 `{{ 'header-new.css' | asset_url | stylesheet_tag }}`；`layout/theme.liquid` 的 head 中没有该样式表，`{% sections 'header-group-new' %}` 在 `<body>`（layout:358）。
- 后果：样式表在 body 中、页面开始解析后才被发现；慢网络或预览刷新时首帧无样式；主题编辑器替换 section DOM 时 `<link>` 被一并移除再插回，期间及请求失败后 header 完全没有样式（用户截图为 Logo 原始 462px、导航竖排、工具区铺开）。
- 另有两个 section 重复输出同一文件，存在两个“样式未就绪”的检查点。

## 实际变更

- layout/theme.liquid：在 `<head>` 的 `res-base.css`、`res-font.css` 之后新增 `{{ 'header-new.css' | asset_url | stylesheet_tag }}`。位置在重置样式之后、模板级 CSS 之前，保证 head 阻塞渲染、第一帧即有样式，同时仍晚于 style.css／res-base.css 以保留原有级联关系。
- sections/header-new.liquid：删除第一行的 `header-new.css` 输出，保留 `header-new.js`（仍为 defer）。
- sections/announcement-bar.liquid：删除第一行的 `header-new.css` 输出。
- 未改 CSS 内容、未改 JS、未改其它模板或 layout。

## 验证

- 全仓检索 `header-new.css` 只剩 layout/theme.liquid:266 一处引用；该行位于 `<head>`（`</head>` 在 layout:349，`<body>` 在 351）之内。
- 未启动浏览器、未在主题编辑器或线上预览验证；head 样式表加载时机由浏览器规范保证，实际首帧需在预览主题确认。

## 文档与决策

- 新增本日志；更新 `docs/refactoring/modules/header/architecture.md`（新增条目并修正“只由 section 加载”的旧结论）、`docs/refactoring/project/architecture.md`（资源加载关系）、`docs/refactoring/modules/header/files.md` 与知识库入口 README。
- 无 ADR。

## 后续补充（2026-11-26）

- 用户反馈进入 `/collections/gift` 时 header 再次无样式。head 中的 link 仍在，怀疑是集合页走了不同的渲染路径（应用注入 header／旧 HTML 缓存）或该次请求的 CSS 资源失败。
- 处理：在 `sections/header-new.liquid` 顶部**再次输出** `header-new.css` 作为兜底（head 仍为主加载）。正常页面第二次是同 URL 的缓存请求，不会改变首帧；若 header 被应用/局部渲染到没有 head 的上下文，section 自带样式链接。
- 经验：head 中的 link 仍无法覆盖“页面 HTML 来自旧缓存/其它主题”的情况；排查时先看该页 view-source 是否有 `header-new.css`、Network 是否 200、当前预览主题 id（线上主题 t/134 没有该资源，误连线上就会无样式）。

## 内联关键样式（2026-11-26，根治层）

- 仅把样式表放 head 仍无法覆盖“当前渲染主题里没有这个资源”的情况：`asset_url` 是按**渲染 HTML 的那个主题副本**生成的（`/cdn/shop/t/<theme_id>/assets/…`）；开发主题上传失败、预览回落到已发布主题（已验证 t/134 下 `header-new.css` 返回 404）、或 CLI 代理 502 时，link 必然 404。
- 因此在 `layout/theme.liquid` 的 `<head>` 里、`header-new.css` 之前加入一段 `{% style %}` 内联关键样式：固定 header 容器、bar 宽度/高度、Logo 154px、drawer 桌面 `display:contents`、导航横排、工具区、移动端 bar 网格与抽屉不可见等骨架规则。
  - 完整 `header-new.css` 在同位置后加载，同选择器后者覆盖，正常时视觉不变；
  - 样式表失败时页面只失去细节样式，不会再出现“巨型 Logo + 竖排菜单 + 面板铺开”的不可用状态。
- 这是兜底层，不替代资源同步：仍需确认渲染主题里 `header-new.css` 为 200。

## 风险、回退与遗留

- 风险：`theme.pagefly.liquid` 不渲染 header group，也未加入该样式表；若后续在该 layout 加入 header，需要同步加载。另有页面若通过 section rendering 单独取 header HTML（不含 head）也不会带样式，但正常整页访问不受影响。
- 回退：把 `{{ 'header-new.css' | asset_url | stylesheet_tag }}` 移回两个 section，并删除 layout 中的新增行。
- 遗留：`header-new.js` 仍由 section 以 defer 加载，其初始化时机晚于 CSS；如需进一步消除交互前闪烁，可将 JS 前移（会改变编辑器内 section 重载的重复初始化行为，需另评估）。
