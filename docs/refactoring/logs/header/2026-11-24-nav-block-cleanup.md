# 2026-11-24 导航区块调整与还原

- 模块：header
- 状态：完成（仅静态检查，未浏览器验证）
- 环境／源码基线：本地工作区 `D:\zyl\theme-venustas`，未提交
- 批准依据：用户 2026-11-24 要求 Gift 移动端 Shop All 复用桌面 Gift Guide 链接、删除 Featured link、image-menu 只保留菜单与图片；随后两次要求还原 image-menu 与 Featured link 改动
- 批准范围：sections/header-group-new.json、Gift 链接；Featured link／image-menu 的代码与数据已恢复原状

## 目标与源码证据

- Gift 面板 `mobile_shop_all_link` 原为空，移动端不渲染 Shop All；桌面 guide 区块地址为 `shopify://pages/gift-guide`。
- 用户随后要求撤销对 `_header-nav-featured` 与 `_header-nav-image-menu` 的改动，只保留 Gift 链接调整。

## 实际变更（最终状态）

- header-group-new.json：Gift `mobile_shop_all_link` 改为 `shopify://pages/gift-guide`；其余导航区块类型与设置恢复原值（Featured link 6 处恢复 `_header-nav-featured`，image-menu 恢复 `title_i`／`url_i` 数据）。
- blocks/_header-nav-featured.liquid：已删除后按原内容恢复。
- blocks/_header-nav-image-menu.liquid：已改后按原内容恢复（menu + title_i／url_i／image_i、按 URL 匹配、菜单为空用初始文案）。
- blocks/_header-nav-column.liquid：允许类型恢复 `_header-nav-featured`。
- assets/header-new.css：`.header-new__featured` 全部规则已恢复；image-menu 相关样式未变。
- 未改 header-new.js。

## 验证

- `header-group-new.json` 去除注释头后可被 ConvertFrom-Json 解析；确认 6 处 Featured link 类型、Men／Women image-menu 设置与改动前一致、Gift 链接为 gift-guide。
- 静态比对还原后的 Liquid 与 CSS；未做浏览器、主题编辑器或线上验证。

## 文档与决策

更新本日志与模块 architecture／files／README／known-issues；ADR-0005 标记 rejected（方案未采用）。

## 风险、回退与遗留

- image-menu 图片仍按 `url_i` 匹配，Men／Women 的 `url_1..8` 为空，移动端显示占位图；需补充与菜单一致的地址后才会显示已上传图片。
- Gift Guide 页面句柄沿用旧配置，线上是否存在未验证。
- 回退：仅保留 Gift 链接改动，其余文件与改动前一致。
