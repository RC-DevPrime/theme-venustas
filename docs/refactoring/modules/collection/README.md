# Collection 技术档案

2026-11-28：[促销 Box 移动端背景图](../../logs/collection/2026-11-28-promotion-box-mobile-image.md)：promotion_image／promotion_sale 各增加 `background_image_mobile`，≤899px 切换、留空回退桌面图。

2026-11-28：[商品卡标题重写与行数限制](../../logs/collection/2026-11-28-product-collection-title-clamp.md)：product-collection 标题合为一个锚点 + 内层 span，移动端 ≤899px 三行、桌面 ≥900px 两行省略；其它卡片标题未改。

状态：2026-11-23 初始化；第二阶段，尚未获准开始业务重构。

职责：集合 Banner／导航、过滤排序、分页／加载更多、商品卡片、推广区、FAQ 和推荐区。61 个 JSON 变体保存不同配置；定义不等于启用。

阅读：[架构](architecture.md) → [实际清单](files.md) → [已知事项](known-issues.md)，并检索 `../../logs/collection/`、跨模块日志和 ADR。

待确认：真实集合 template suffix 分配、filter 配置、营销 block 内容、AJAX 错误及浏览器历史行为；不在 Header 完成后自动启动本模块。
