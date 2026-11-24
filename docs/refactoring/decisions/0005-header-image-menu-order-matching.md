# ADR-0005 导航图片菜单按顺序匹配与移除 Featured link（未采用）

- 状态：rejected（2026-11-24 用户要求还原 image-menu 与 Featured link 改动，均未采用）
- 日期：2026-11-24
- 依据：用户先要求 image menu 只配置菜单与图片、删除 Featured link，随后两次要求还原

## 背景

_category image menu_ 同时维护 menu、`title_i`、`url_i`、`image_i`：菜单与手填文案/地址双份数据，图片依赖手填 `url_i` 匹配。另一区块 `_header-nav-featured` 与 `_header-nav-feature` 能力重叠，New／Men／Women 数据分别使用两种类型。

## 候选方案

1. 保持 URL 匹配：图片槽继续保存 `url_i`。名称/链接可来自菜单，但每个图片仍需配置匹配地址，维护成本高。
2. 按菜单顺序匹配：只保留 menu 与 `image_i`，第 N 张图对应菜单第 N 个链接。配置最少，菜单重排会移动图片。
3. 使用动态区块为每个分类配置图片：数据分散、区块数量增加，当前 section 已接近平台区块上限。

## 决策

采用方案 2：image-menu 只保留 menu 与 8 个图片槽，名称、地址、顺序完全来自菜单；图片按顺序匹配，缺少图片使用 collection-1 占位，菜单为空不输出。删除 `_header-nav-featured`，统一使用 `_header-nav-feature`，既有数据转换为 feature 类型。

## 后果

- 商家只需选择菜单并上传图片；菜单变更后需检查图片顺序。
- 旧主题数据若保留 `_header-nav-featured` 将不再渲染；本仓库数据已转换。
- 减少一个区块类型与一组 CSS，降低维护面。
