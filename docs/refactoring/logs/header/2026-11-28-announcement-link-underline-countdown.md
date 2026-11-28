# 2026-11-28 公告栏链接下划线规则与倒计时精简

- 模块：header（公告栏 section）
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\master\theme-venustas（HEAD ef2f08a + 本地未提交改动），未连接线上主题或浏览器
- 批准依据：用户 2026-11-28 消息“广告栏优化：广告栏如果配置整个文案的 link 则不显示下划线，配置部分文案的 link 显示下划线；倒计时不需要显示秒，倒计时的数字的颜色为主题色加粗”
- 批准范围：`sections/announcement-bar.liquid` 的链接包裹与倒计时单位、`assets/header-new.css` 中公告栏链接与倒计时数字样式、`assets/header-new.js` 倒计时秒的更新；不改公告栏高度、颜色设置、轮播／跑马灯逻辑

## 目标与源码证据

- 公告文案由 `block.settings.announcement_content`（富文本）与 `block.settings.link`（整段链接）组成：改前 `{% if block.settings.link != blank %}` 时整段包 `<a class="header-announcement__link">`，否则包 `<span>`。
- 改前 CSS `.header-announcement__content a{text-decoration:underline}` 对所有 `<a>` 生效，因此整段链接也带下划线；`style.css:43` 的全局 `a{text-decoration:none}` 说明主题默认不画下划线，公告栏这条是显式加上的。
- `[u]`／`【u】` 标记会转成 `.header-announcement__underline`（颜色取 `--header-announcement-underline-color`、600 字重、下划线），这是独立的强调功能，本次不动。
- 若整段链接与富文本内 `<a>` 同时存在，外层 `<a>` 会包住内层 `<a>`，属于非法嵌套（浏览器会拆开），需要避免。
- 倒计时：`sections/announcement-bar.liquid` L104–117 输出 days／hours／minutes／seconds 四个单位，`assets/header-new.js` 的 `initCountdown()` 每秒同步四个值。
- 倒计时数字样式 `.header-announcement__unit-value` 为白底、黑色 12px、无字重设置。

## 实际变更

- `sections/announcement-bar.liquid`：
  - 新增判断：`announcement_content contains '<a'` → `announcement_has_inline_link = true`；只有 `link != blank` 且没有内嵌链接时才把整段包成 `<a>`（`announcement_whole_link`），否则保持 `<span>`。开合标签两处同步改用该变量，避免 `<a>` 嵌套。
  - 删除 seconds 单位（`<span class="header-announcement__unit">…Secs</span>`），倒计时只留 Days／Hrs／Mins。
- `assets/header-new.css`：
  - 下划线规则从 `.header-announcement__content a` 收窄为 `.header-announcement__content .header-announcement__marquee-item a`（内嵌链接）并补 `text-underline-offset:3px`；整段链接因此回落到全局无下划线。
  - `.header-announcement__unit-value`：`color:#000` → `color:var(--color-brand, #B93205)`，新增 `font-weight:700`；白底 28×20 数字块保留。
- `assets/header-new.js`：`tick()` 删除 seconds 一行，其余天／时／分计算与 1 秒定时器不变（定时器仍用于准点跨分钟与到期隐藏）。

## 验证

- 静态核对：`sections/announcement-bar.liquid` `{% %}` 34/34、`{{ }}` 12/12、`if/endif` 9/9（新增两处配对）；`assets/header-new.css` 花括号 355/355；`node --check assets/header-new.js` 通过；检索确认章节内已无 seconds／Secs 单位（仅剩 schema 文案 “Autoplay (in seconds)”）。
- 手工推演（当前 `sections/header-group-new.json`）：announcement_1、announcement_3 设了整段 `link` 且文案无 `<a>` → 渲染 `<a>` 包裹、无下划线；announcement_2 的 `link` 为空、文案内含 `<a href="/pages/return-and-exchange-policy">` → 渲染 `<span>` 包裹、内嵌链接带下划线且可点击。
- 倒计时（商家添加该 block 时）：只有 Days／Hrs／Mins 三个单位，数字白底、主题色 #B93205、700 字重；到期隐藏逻辑不变。
- 未启动浏览器，未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；更新 header 模块 README、files、architecture 与知识库入口 README。
- 无数据契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：整段 `link` 与富文本内 `<a>` 同时配置时，本次以内嵌链接为准，整段点击跳转不再生效（避免非法嵌套）；如需两者共存需另定规则。
- 风险：数字块固定 28×20，倒计时天数超过两位（≥100 天）时会偏挤，本次未改宽度。
- 风险：下划线仍沿用 `currentColor`（文字色），未使用 `underline_text_color` 设置；`[u]` 标记的强调样式不受影响。
- 回退：还原上述三个文件的本次差异即可。
- 遗留：倒计时不再显示秒后仍按 1 秒刷新，若需降低开销可改为分钟级定时器；文案里的 “Secs” 若被商家直接写进富文本需在后台改文案。
