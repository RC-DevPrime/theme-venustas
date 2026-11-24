# Header 技术档案

状态：2026-11-24 已实现 New、Men、Women、Bundles、Sale 导航；本地入口为 header-group-new，旧代码保留。仅静态验证，未验证浏览器或线上环境。

职责：站点公告、Logo、桌面／移动菜单、国家／币种入口、账户入口，以及 header group 挂载的搜索与购物车弹层。不能把 header.liquid 当作全部 Header 系统。

阅读：[架构](architecture.md) → [文件与调用链](files.md) → [问题](known-issues.md)，再检索 `../../logs/header/`、`../../decisions/` 和跨模块日志，核对源码。

当前方案：[ADR-0002](../../decisions/0002-header-new-theme-blocks.md)，使用嵌套主题区块，不使用元对象。[New 实施日志](../../logs/header/2026-11-23-new-navigation.md)。此前 [Metaobject 导航模型](metaobject-navigation-proposal.md) 为历史提案，本次不采用。

Men／Women 四列扩展：[实施日志](../../logs/header/2026-11-23-men-women-navigation.md)、[ADR-0003](../../decisions/0003-header-menu-image-settings.md)。两个面板独立配置；分类、Style、Collections 的原生菜单及分类图片仍需商家选择，未配置时展示初始文案／占位图。

Bundles：[实施日志](../../logs/header/2026-11-24-bundles-navigation.md)、[ADR-0004](../../decisions/0004-header-over-limit-experiment.md)。用户明确要求保留真实嵌套分类并测试超50个区块，目前55个；不代表平台保存／上传／显示已验证。

Sale：[实施日志](../../logs/header/2026-11-24-sale-navigation.md)。复用活动面板，五个旧 Sale 集合含 New Customer -$30 Off，图片228:285裁切，不配置桌面底部按钮。新增后总计61块，继续用户授权的超限实验。

## 后续建议（未批准实施）

1. 确认需要保留的菜单 display 1–6、公告／倒计时、国家切换、搜索、账户和购物车行为，并确定代表性页面与后台配置。
2. 先明确 DOM、CSS 高度变量、header:heightchange、购物车和搜索契约，以及 Collection／Product 消费者。
3. 单独确认缺失 predictive-search 响应 section、既有 schema 尾逗号是否需要纳入第一批修复；禁止顺带修复。
4. 提交按文件／功能拆分的小步方案，说明验证和回退。获明确批准后只做第一批；资源拆分和组件统一若有重要取舍另记 ADR。

待确认：实际线上主题、菜单配置、各 display 的使用频率、国家切换预期、编辑器重载行为和浏览器验收范围。
