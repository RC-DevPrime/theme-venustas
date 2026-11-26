# 2026-11-26 活动面板商品卡角标定位与配色

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“header-new-product-card 里 product-menu-badge 的样式修复，放在产品图右上角，上边距和右边距都是 8px，颜色 #FF5D5F”（用户文字写“左上角”，但边距为上下与右边、截图中角标位于图片右上角，按右上角实现）
- 批准范围：活动面板商品卡角标的位置与配色；不改角标判定标签逻辑、不改卡片其它结构

## 目标与源码证据

- `snippets/header-new-product-card.liquid` 原本在卡片 `<a>` 内、图片容器之前渲染 `product-menu-badge`；角标 `.badge.menu-badge` 在 assets/style.css:1021 为 `position:absolute;top:7px;right:8px`，但卡片与图片容器都没有 `position`，最近的定位祖先退到 `.header-new__panel`，位置不可控。
- 角标内容来自商品标签 `Menu-Hot`／`Menu-Best Seller`／`Menu-New`（snippets/product-menu-badge.liquid），样式类为 `.badge.menu-badge`，底色 #B93205。

## 实际变更

- snippets/header-new-product-card.liquid：把 `{% render 'product-menu-badge', product: product %}` 移入 `.header-new__campaign-product-media` 内部，使绝对定位以图片容器为基准（无图占位时同样生效）。
- assets/header-new.css：
  - `.header-new__campaign-product-media` 增加 `position: relative`。
  - 新增 `.header-new__campaign-product-media .menu-badge`：`top:8px; right:8px; left:auto; border-radius:4px; background:#ff5d5f; color:#fff; font-weight:600`，其余（padding、字号、min-width、z-index）沿用 style.css 的 `.badge.menu-badge`。
- 未改 `snippets/product-menu-badge.liquid`、未改标签判定、未改商品图与标题。

## 验证

- 静态核对：header-new.css 花括号 345/345；snippet Liquid `{% %}` 8/8、`{{ }}` 4/4；`header-new.css` 在 head 中位于 style.css 之后，同名优先级下新规则覆盖旧的 top/right/背景色。
- 手工推演：`.header-new__campaign-product-media` 为定位容器，角标距图片上、右各 8px；`overflow:hidden` 的容器内缩 8px 不会被裁切；横版 236:189 与竖版 228:285 两种比例位置一致。
- 未启动浏览器、未在主题编辑器或线上预览验证。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记；未改架构文档（加载关系与组件契约未变）。
- 无 ADR。

## 风险、回退与遗留

- 风险：用户文字中的“左上角”与“右边距/截图右上角”冲突，本次按右上角实现；若实际要左上角，把 `right:8px` 换成 `left:8px` 即可。
- 回退：把 render 移回 `<a>` 下第一条并删除新增 CSS 规则即可。
- 遗留：角标沿用 `aria-hidden="true"`，读屏不朗读标签文字；若需要可访问性支持需另议。
