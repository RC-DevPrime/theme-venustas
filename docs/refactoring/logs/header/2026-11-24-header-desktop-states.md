# 2026-11-24 桌面导航选中态与子菜单悬浮

- 模块：header
- 状态：完成（仅静态检查）
- 批准依据：用户 2026-11-24 要求国家浮窗当前项打勾、当前导航加下划线、下拉中有链接的子菜单 hover 变主题色
- 批准范围：snippets/header-new-localization.liquid、snippets/header-icons.liquid、snippets/heating-icons.liquid、sections/header-new.liquid、assets/header-new.css、assets/header-new.js

## 变更

- 国家浮窗：当前项右侧输出 check 图标（用户提供的 18×18 SVG，经 heating-icons `check-18` → header-icons `check` 引用），移除原来当前项的灰色底。
- 当前导航：按 `request.path === 导航 href` 输出 `aria-current="page"` 与 `header-new__nav-link--active`，桌面端在文字下方显示 2px #b93205 横线；同一横线在 hover、focus-visible、面板展开（aria-expanded=true）时也会出现，宽度随文字自适应；JS 升级为 button 时同步复制 `aria-current`。
- 下拉子菜单：菜单链接、Featured link、image-menu 链接、Feature link 标题、推广卡标题、活动面板分类 tab、活动商品标题在 hover 时变为 #b93205（仅 hover 设备）；桌面端底部按钮 hover 加下划线。
- 未改面板结构与其他链接。

## 验证

静态核对 Liquid 分支、CSS 选择器权重与 JS 复制逻辑；未浏览器验证。国家切换菜单为跨站链接，`aria-current` 仍由 `request.host` 判断。

## 风险与遗留

- 导航选中仅精确匹配 `request.path`，商品页、带查询/筛选的集合页以外的页面不会高亮，跨站主页（venustas.ca）不参与。
- 下划线位置为视觉估计（bottom 6px），需浏览器确认。
