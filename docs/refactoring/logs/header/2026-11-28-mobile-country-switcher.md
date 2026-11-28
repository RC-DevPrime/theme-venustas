# 2026-11-28 抽屉 logo 右侧的国家切换与桌面浮窗复用

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master\theme-venustas（HEAD ef2f08a + 用户对 layout/theme.liquid 的 seel 定位改动），未连接线上主题或浏览器
- 批准依据：用户 2026-11-28 消息“移动端的国家切换样式，改为在 logo 右边，切换出现浮窗，和桌面端的样式很像，看能不能复用”；首轮改到移动端 header 横条右侧被用户回退并更正为“移动端点击汉堡线浮窗（抽屉）的 logo 右边”
- 批准范围：抽屉顶部 logo 行的国家切换位置、`snippets/header-new-localization.liquid` 的模式类、`assets/header-new.css` 中对应的移动端规则；不改桌面端位置与样式、不改 US／CA 地址设置与跳转逻辑、不改抽屉其它行

## 目标与源码证据

- 切换组件唯一输出点 `snippets/header-new-localization.liquid`，用 `mode` 区分两处渲染：`sections/header-new.liquid` 桌面在 `.header-new__desktop-utilities` 内（现 L174），移动在抽屉底部 `.header-new__mobile-utilities` 列表内（改前 L86）。
- 改前移动端把浮层改成行内展开：`@media (max-width:1280px)` 内 `ul{position:static;box-shadow:none;min-width:0}`、`country-label{display:inline}`、`label small`、`li a{padding:16px}`、`li:has(a[aria-current]){display:none}`、`.header-new__mobile-utilities .header-new__localization button{width:100%;padding:16px;min-height:64px}`；桌面端则是 `ul{position:absolute;right:0;top:100%;min-width:220px;background:#fff;box-shadow:0 4px 12px #0002}` 的浮窗。
- 抽屉顶部 `.header-new__drawer-top`（`sections/header-new.liquid` L29–31）只有 logo 一个子元素，移动端 CSS 已是 `display:flex;align-items:center;justify-content:space-between`（`header-new.css` ≤1280 块），因此追加子元素会自然落在 logo 右侧、行末。
- 抽屉顶部原有两个按钮样式（`.header-new__drawer-top button{min-height:44px;padding:8px 0 8px 16px}` 与 `{width:44px;height:44px;padding:12px;background:#b93205;color:white}`、`button img{width:20px;height:20px}`），但抽屉顶部当前没有任何按钮，属于历史残留；若保留会命中新加入的国家切换按钮（橙底 44×44、旗帜被压成 20×20）。

## 实际变更

- `snippets/header-new-localization.liquid`：根节点增加模式类 `header-new__localization--{{ mode }}`。
- `sections/header-new.liquid`：移动端实例从 `.header-new__mobile-utilities`（原 L86）移到 `.header-new__drawer-top` 的 logo 之后（现 L31）；桌面实例仍留在 `.header-new__desktop-utilities`。
- `assets/header-new.css`：
  - 删除 6 条抽屉专用覆盖（`.header-new__mobile-utilities .header-new__localization button`、`country-label{display:inline}`、`label small`、`ul{position:static…}`、`li a{padding:16px}`、`li:has(a[aria-current]){display:none}`），移动端因此复用桌面浮层：绝对定位、右对齐、220px 最小宽、白底阴影、行内边距 12/16px、当前国家显示勾选。
  - 新增 `.header-new .header-new__localization--mobile ul{top:calc(100% + 16px);z-index:2;border-radius:8px;overflow:hidden}`：浮层落到 logo 行下方（行高 68＋上下 padding 16），圆角与截图一致，`z-index` 高于后续菜单列表。
  - 删除抽屉顶部的 3 条历史按钮样式（见上），避免橙底 44×44 命中国家切换、避免旗帜被强制成 20×20；`.header-new__flag img{width:100%;height:100%;object-fit:cover}` 继续按 22×16 输出。
- 未改 JS：抽屉关闭走 `close()` → `closeCountries()`，浮层随之收起；`.header-new__country-label` 基础规则本就是 `display:none`，移动端只显示旗帜＋箭头，与桌面一致。

## 验证

- 静态核对：`assets/header-new.css` 花括号 355/355；`sections/header-new.liquid` `{% %}` 89/89、`{{ }}` 29/29，localization 渲染 2 处（mobile 在 drawer-top、desktop 在 desktop-utilities）；`snippets/header-new-localization.liquid` 根节点含模式类。
- 手工推演（≤1280）：打开汉堡抽屉 → 顶部行为 logo（左）＋旗帜箭头（右）；点击旗帜在行下方弹出白底圆角浮层，浮层右边缘与旗帜对齐、向左展开 220px，US／CA 两行含旗帜、货币与当前项勾选；点击页面空白、按 Esc、关闭抽屉都会收起；打开 New／Men 等子面板时 drawer-top 隐藏，浮层随之消失。
- 抽屉宽 `min(89vw,100vw-40px)`：390px 下约 347，内容宽 315，220px 浮层放得下；320px 下约 280，仍可容纳并自动右对齐。
- 桌面端：`.header-new__drawer-top` 基础规则 `display:none`，移动实例不显示；桌面切换仍在右侧 `.header-new__desktop-utilities`，未改。
- 未启动浏览器，未在移动端实机或主题编辑器验证。

## 文档与决策

- 新增本日志；更新 header 模块 README、architecture、files 与知识库入口 README。
- 无数据契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：浮层 `top:calc(100% + 16px)` 依赖抽屉顶部 16px 的上下 padding（`header-new.css` ≤1280 块），若改 padding 需同步调整，否则浮层会压住 logo 行下边框或留缝。
- 风险：抽屉里不再有国家切换这一行，移动端入口只剩 logo 行右侧这一处。
- 风险：浮层在抽屉滚动容器 `.header-new__drawer-scroll`（`overflow-y:auto`）内，位于抽屉顶部、高度不足以触发裁剪；若以后把浮层做得更高需复查裁剪与滚动。
- 回退：还原 `sections/header-new.liquid`、`snippets/header-new-localization.liquid`、`assets/header-new.css` 三个文件的本次差异（含恢复抽屉内实例与 6 条抽屉规则、3 条 drawer-top 按钮样式）即可。
- 遗留：浮层箭头未做展开旋转；US／CA 链接仍取 `country_us_url`／`country_ca_url` 设置与宿主域名判断。
