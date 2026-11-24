# 2026-11-24 Announcement Bar 独立 section

- 模块：header
- 状态：完成（仅静态验证）
- 环境／源码基线：本地 D:\zyl\theme-venustas，未提交；主题编辑器与线上未验证
- 批准依据：用户 2026-11-24 消息明确要求公告栏 38px、header 1280 以下 40px／以上 68px、公告独立 section、逻辑放入 header-new.js／header-new.css，并直接改代码
- 批准范围：公告 section 迁移、header 高度、header-new 资源、header-group-new.json；不改旧 header.liquid 与旧 group

## 目标与源码证据

旧公告在 header.liquid:1-158，样式分散于 style.css:892-1132、2990-3062、res-base.css:23-27/64-67/133-136，逻辑在 main.js:2-293/295-342/597-608。新 header 固定 top:0 且高度由 header-new.js measure 覆盖，旧 `--announcement-current-height: 0px` 写死在 header-new.liquid:4-14。

## 实际变更

- 新增 sections/announcement-bar.liquid：header group 专用，迁移公告标记、颜色/autoplay 设置、announcement_bar 与 announcement_countdown 区块；输出 38px 公告高度变量；class 统一为 header-announcement 命名空间。
- 新增 sections/header-group-new.json announcement_bar 实例（header_new 前），迁移现网 3 条公告与黑底白字、autoplay 4。
- assets/header-new.css：header 高度改为 nav + 公告；导航条下移；移动抽屉让出公告；条内按钮高度由 44 调为 40；新增公告全部样式（marquee、倒计时、移动 767、reduced motion）。
- assets/header-new.js：新增公告控制器（Swiper、marquee、倒计时、关闭、section 重载），measure 只写总高；不再覆盖 --header-nav-height。
- sections/header-new.liquid：nav 40px，1280 以上 68px；headerHeight 改为 nav + 公告。
- assets/main.js：旧 header 的 section:load 仅在自身含 .announcement-bar 时写高度，避免主题编辑器编辑 header 时压掉独立公告。

## 验证

- `node --check assets/header-new.js`、`assets/main.js` 通过。
- header-group-new.json（去注释）与 section schema 经 JSON.parse 通过。
- 新 section Liquid 标签配平、CSS 花括号配平。
- 未进行浏览器、主题编辑器或线上验证。

## 文档与决策

更新 header README、architecture、files；无新 ADR。

## 风险、回退与遗留

- 公告固定在最上层，移动抽屉从公告下沿开始；1200–1279 仍用桌面布局、40px 高度，仅静态推断可容纳。
- 关闭不持久化；38px 固定高度长文案可能裁切；主题编辑器保存仍可能覆盖 header-group-new.json。
- 回退：删除新 section 与 group 条目，还原 header-new.css/js/liquid 与 main.js 本次改动。
