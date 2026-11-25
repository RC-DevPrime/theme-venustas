# 2026-11-25 Category image menu 移动端改用 Initial category name

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“category image menu 的图片和 Initial category name 是展示在移动端的，如果 Initial category name 填了值需要覆盖上传的 menu 的菜单名称”
- 批准范围：Category image menu 区块（blocks/_header-nav-image-menu.liquid）移动端标题来源与对应样式；不改图片匹配、链接地址、桌面端文字

## 目标与源码证据

- 现有渲染中图片与标题同处一个 `.header-new__image-menu-link`：`.header-new__image-menu-media` 在基础样式里 `display:none`，仅在 ≤1199px 的移动断点设为 `display:block`，即图片本来只在移动端展示（assets/header-new.css:272、590）。
- 菜单分支过去只用 `item_link.title` 作为标题；匹配到的槽位只取 `image_N`、`badge_N`，没有读取 `title_N`，所以商家填写的 Initial category name 在菜单非空时不生效。
- 槽位与菜单项由完整地址匹配（含查询参数，见 2026-11-25-image-menu-url-match.md），因此可以确定当前项对应哪个槽位及其 `title_N`。

## 实际变更

- blocks/_header-nav-image-menu.liquid：
  - 菜单分支在命中槽位后额外读取 `title_<槽位>` 作为 `item_title_mobile`；未命中或该字段为空时回退到菜单项名称；无菜单时直接使用初始名称。
  - 每个循环开头重置 `item_title_mobile`，避免未命中槽位的项沿用上一项的移动端标题。
  - 标题输出拆成两个 span：`--desktop` 显示菜单项名称、`--mobile` 显示 Initial category name，两者都保留原 badge 输出；图片 alt 改用移动端标题。
  - `menu` 设置 info 更新为“Initial category name 在移动端替换匹配到的链接名称；菜单为空时才使用初始文本”。
- assets/header-new.css：新增基础规则 `.header-new__image-menu-title--mobile { display: none }`；≤1199px 断点内隐藏 `--desktop`、显示 `--mobile`。桌面端文字与布局不变。

## 验证

- 静态核对：Liquid `{% %}` 28/28、`{{ }}` 9/9；header-new.css 花括号 341/341；新增选择器仅出现在基础规则与 1199px 断点各一处，无重复覆盖。
- 手工推演：菜单项 `/collections/men?filter.p.product_type=Heated+Vest` 命中槽位 1，移动端标题取 `title_1`；`title_1` 为空时显示菜单名；未命中槽位时显示菜单名并使用占位图；桌面端始终显示菜单名。
- 未启动浏览器、未在主题编辑器或线上预览验证；双 span 在不同断点的实际显示需刷新预览确认。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 增加记录；知识库入口 README 登记索引。
- 无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- 风险：同一标题在 DOM 中出现两次（另一份由 CSS 隐藏），不影响可访问性但会增加少量标记；若某断点样式未加载，两行标题会同时出现。
- 回退：删除 `item_title_mobile` 相关赋值与 `--mobile` span，并移除三条 CSS 规则即可恢复只用菜单名称。
- 遗留：桌面端仍显示菜单项名称；若希望桌面也用 Initial category name，需要再确认。
