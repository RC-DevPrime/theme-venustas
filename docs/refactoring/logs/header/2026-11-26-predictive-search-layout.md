# 2026-11-26 桌面 predictive search 结构重写（800px）

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“桌面端 search 重新改造，丢弃 col-2 d-lg-block d-md-none d-sm-none 这类样式，col-lg-2 … justify-content-end 也不要，重新命名写样式，搜索框和下拉搜索内容都为 800px，只改移动端（按上下文理解为只改桌面、移动端搜索抽屉不动）”
- 批准范围：`sections/search.liquid` 桌面搜索弹层的结构、类名与样式；不改 predictive-search.js、结果模板、移动端 `header-new-search-mobile`

## 目标与源码证据

- 原结构依赖 Bootstrap 栅格：`.col-2 d-lg-block d-md-none d-sm-none`（Logo）、`.col-lg-8 col-md-6 col-sm-12`（表单列）、`.col-lg-2 d-lg-flex d-md-flex d-sm-none justify-content-end`（空占位列），外层 `.container` flex 居中；表单里还有 `.input-group`。
- predictive-search.js 只依赖 `predictive-search` 自定义元素内的 `input[type="text"]`、`#predictive-search .inner-content` 和 `.recommendations`，不依赖 `.container`／`.input-group`／栅格类，因此可以安全替换结构。
- 调整前样式：`predictive-search` 元素 50%（上一版改 100%），面板 `min(1340px,100%-40px)`。

## 实际变更

- sections/search.liquid：
  - 删除三段 Bootstrap 栅格包裹（含 Logo 列与右侧空列），新结构为 `.predictive-search__bar` → `predictive-search.predictive-search__box` → `form.predictive-search__field`。
  - 移除 `.container`、`.search-box-container`、`.input-group`；保留 `id="predictive-search"` 并新增 `.predictive-search__results` 类，保证 predictive-search.js 的 `#predictive-search .inner-content` 选择器不变。
  - 搜索与关闭图标继续使用 `header-icons` 的 search／close，关闭入口保留 `.icon-close`。
- assets/style.css（PREDICTIVE SEARCH 段）：
  - 删除旧 `.predictive-search .container`、`predictive-search`、`.input-group`、`form` 系列规则。
  - 新增 `.predictive-search__bar`（flex 居中、上下左右 16/20）、`.predictive-search__box`（宽 `min(800px,100%)`）、`.predictive-search__field`（44 高胶囊、圆角 32、1px rgba(0,0,0,.2)、底色 #F5F5F5、gap 9、内边距 0 12）及输入／按钮样式。
  - 结果面板由 `#predictive-search` 改为 `.predictive-search__results`：宽 `min(800px, calc(100% - 40px))` 居中、白底、内边距 24/20/28、下圆角 8；原 `#predictive-search { … }` 容器规则删除。
  - 结果内部的 `#predictive-search .results …` 等选择器保留，未改结果排版。
- 移动端 `header-new-search-mobile` 抽屉与 header-new.css 未改。

## 验证

- 静态核对：style.css 花括号 401/401；search.liquid `{% %}` 12/12；全段检索确认没有遗留 `.predictive-search form`／`.container`／`.input-group`／`#predictive-search {` 规则；`#predictive-search` id 与 `.inner-content` 保留。
- 手工推演：打开桌面搜索 → 白色条内 800px 胶囊搜索框居中；结果面板同为 800px 居中；关闭与提交沿用原逻辑；视口 <840 时两者按 `100% - 40px` 收缩。
- 未启动浏览器、未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记；未改模块架构文档（DOM 结构变化仅限该 section，JS 契约未变）。
- 无 ADR。

## 后续修正（同日）

- 用户要求保留并还原 Logo，且搜索条高度与 header 一致（≥1280 为 68px），视觉上不跳变。
- sections/search.liquid：`.predictive-search__bar` 内恢复 `.predictive-search__logo`（链接到站点根，`settings.logo` 用 `image_url:462` + `image_tag` 输出，空时回退站点名）。
- assets/style.css：`.predictive-search__bar` 改为 `width:min(100% - 40px,1720px)`、`height:var(--header-nav-height,68px)`、居中；Logo 绝对定位在容器左侧（154px）；`.predictive-search__box` 仍 800px 并居中，结果面板 800px 与搜索框对齐。1200–1279 时高度跟随 header 的 40px，避免比 header 高。

## 风险、回退与遗留

- 风险：桌面搜索弹层不再显示站点 Logo；若设计仍需要 Logo，需要单独加回并重新定宽。`res-base.css:23` 里 `.predictive-search .logo img` 规则已无对应 DOM（保留未删）。
- 回退：还原 search.liquid 的栅格结构与 style.css 对应规则。
- 遗留：`assets/search.css` 中移动端媒体查询里的 `#predictive-search { overflow:scroll; max-height:70vh }` 仍存在，移动端不会走该弹层，未处理。
