# 2026-11-28 编辑弹窗移动端按 product-nav-new 底部抽屉样式改造

- 模块：跨模块（Product Detail、Collection、Header 购物车抽屉；`product-edit-option`、`product-update-popup`）
- 状态：完成（仅静态检查；未做浏览器或线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`；当前 HEAD `5115106 fix: 细节优化`；未提交、未推送、未发布
- 批准依据：用户 2026-11-28 在方案确认中选择“完整参考 nav-new（推荐）”
- 批准范围：`assets/style.css` 中两个弹窗的移动端样式及文档；不修改 Liquid、`assets/main.js`、schema、后台配置

## 目标与源码证据

- 参考 [product-nav-new.liquid:106-153](../../../sections/product-nav-new.liquid#L106) 的 `@media (max-width: 767px)`：
  - 面板固定在底部而非全屏：`max-height: 90vh/90dvh`、`border-radius: 12px 12px 0 0`、`overflow: hidden`、flex 纵向排列。
  - 遮罩 `rgba(0, 0, 0, .45)`；内容区滚动，左右 20px、底部 16px，5px 细滚动条。
  - 商品摘要：98px 图片（比例 616/800）+ 标题 18px/600 两行 + 价格 20px/700 红色、划线价 12px/500 `#999`。
  - 变体区：`#f5f5f5` 灰底、6px 圆角、16px 内边距；变体名 14px/700；尺寸选择约 42×32 / 12px，选中黑底白字。
  - 底部购买区：`padding: 12px 20px calc(16px + env(safe-area-inset-bottom))`、`border-top: 1px solid #ececec`、白底；按钮 48px 高、6px 圆角、14px/600。
- 改造前 `assets/style.css` 的移动端规则把两个弹窗设为 `position:fixed; inset:0; height:100dvh` 全屏；本次按用户要求改为非全屏底部抽屉。
- 两个弹窗共用 `edit-option-popup` / `cart-edit-popup` 类；`product-edit-option` 的 ATC 在 `.bottom-container`，`product-update-popup` 的 ATC 在 `.cart-atc-footer`，ADD MORE 留在购物车滚动区。

## 实际变更

1. 仅修改 `assets/style.css` 的 `@media (max-width:768px)` 段：
   - 两个 `.popup-content` 由全屏改为 `position:fixed; top:auto; bottom:0; left/right:0; height:auto; max-height:90dvh; border-radius:12px 12px 0 0`，保留上圆角、阴影；遮罩改为 `.45`。
   - 头部保留 “Edit Option”，关闭按钮去掉圆底；标题 18px/700，头部 padding `16px 20px 8px`。
   - 商品摘要用现有 DOM + 缩略图浮动 + `display:contents`：98×127 缩略图在左，标题/价格右移 110px；不新增 Liquid 结构。
   - 变体区改为灰底圆角容器，变体名/默认选择器/尺码选择器按 nav-new 调整字号和尺寸，选中态黑底白字；颜色块沿用现有样式。
   - 数量标签与数量控件按 nav-new 风格调整；数量仍在滚动区（符合本次选择的“不改 DOM”）。
   - `product-edit-option` 的 `.bottom-container` 做移动端全宽购买区（负边距铺满、20px 内边距），ATC 48px/6px 圆角/14px；`product-update-popup` 的 `.cart-atc-footer` 同步。
   - 内容滚动条改为 5px 细条；桌面 >768 的 600px 居中、最高 90vh、底部固定布局保持不变。
2. 文档：新增本日志；前两次弹窗日志补充“全屏已按 nav-new 调整”的后续说明；知识库入口增加索引。

## 验证

- `assets/style.css` 花括号静态计数：456／456，平衡。
- `git diff --check`：通过，无空白错误。
- 检索确认该移动端段已无 `height:100dvh` / `inset:0` 全屏规则；`position:fixed` 只用于底部抽屉和遮罩。
- 静态核对事件链：未改 `main.js`；ATC 仍在 `.main-cart`／`#popup-cart` 的 `.btn-main` 委托范围内，ADD MORE 仍在 `.popup-container` 内。
- 未启动浏览器，未验证 iOS／Android 安全区、真实滚动、`display:contents` 在目标浏览器中的视觉结果。

## 文档与决策

- 本次为视觉/布局改造，不改变数据流、DOM 结构或模块依赖；未新增 ADR，未更新模块 architecture／files。
- 按用户选择保留数量在滚动区；nav-new 的“数量 + ATC 同一行”未实施，如需完全一致需另批 DOM 改造。

## 风险、回退与遗留

- 风险：商品摘要依赖缩略图浮动 + `display:contents` 重排现有 DOM，旧浏览器或应用注入样式可能影响；变体/数量覆盖使用 `#popup-cart`、`.main-cart` 与 `:is()` 提高优先级，后续若调整购物车公共样式需同步核对。
- 购物车抽屉中的底部抽屉仍在 `.cart` 的层叠上下文内；若后续给祖先增加 `transform`／`filter`，`position:fixed` 会改为相对该祖先。
- 回退：将 `assets/style.css` 的移动端段恢复为 HEAD `5115106` 中的全屏规则即可；本次未改 Liquid/JS，无需回退结构。
- 遗留：未在真实主题中验证移动端底部抽屉、图片比例、变体换行和 ATC 固定表现；等待用户审核后再发布。
