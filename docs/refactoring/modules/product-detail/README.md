# Product Detail 技术档案

状态：2026-11-23 初始化；第三阶段，未开始业务重构。

职责：商品媒体、价格／促销、选项、加购、尺码、区域库存、商品导航、评价与不同商品的内容模块。127 个 product JSON 共用 main-product，存在大量后续 section 编排差异及专用 Liquid 输出。

阅读：[架构](architecture.md) → [清单](files.md) → [问题／历史经验](known-issues.md)，再检索 `../../logs/product-detail/`、跨模块日志和 ADR。

待确认：模板实际分配、metafield/metaobject 定义与数据、库存应用响应、US/CA 市场预期、旧／新导航启用组合、应用状态。不因前两个模块完成自动开始本模块。
