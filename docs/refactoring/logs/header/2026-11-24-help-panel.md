# 2026-11-24 Help 下拉／Help 页面

- 模块：header
- 状态：实现与定向静态检查；未浏览器实测
- 环境／源码基线：本地工作区 D:/zyl/theme-venustas，feature/menu 未提交改动
- 批准依据：用户要求实现 header Help 点击效果并给出桌面／移动 Figma 节点与 6 个图标；按已提交方案实施，用户随后提供图标即视为继续实施
- 批准范围：sections/header-new.liquid、assets/header-new.css、assets/header-new.js、snippets/header-icons.liquid 及文档；不改面板／group JSON

## 目标与源码证据

Figma：桌面 6210:1789（347×383 白卡，圆角12，阴影 0 18 15 rgba(0,0,0,.16)，内边距 18/20/16，gap12；6 行链接 20 图标+12 间距+Montserrat Medium 14/20 #141414，行 padding 10 0，1px #f0f0f0 分隔，末行无；307×44 黑按钮；12/18 #515151 字距1px 两行电话）；移动 6348:4712（350 宽，左右16，同内容无卡片样式）。

改前桌面 Help 是 a.header-new__help（54×20 SVG 链接，sections/header-new.liquid），移动是 a.header-new__utility-row 链接；两者都直接跳到 help_link。可复用机制已存在：data-header-panel / data-header-toggle / showPanel()、.header-new__panel-top + data-header-mobile-back、chevron-left、help-circle。

## 实际变更

- sections/header-new.liquid：两个入口改为 button[data-header-toggle="help"]（aria-expanded=false，桌面保留原 help SVG，移动沿用 help-circle）；在 content_for 'blocks' 之后新增 help 面板（id HeaderPanel-<section.id>-help，hidden，移动返回行 + 6 行链接 + 邮件按钮 + 电话说明）。用 help_labels/help_icons 两个固定数组与 help_urls（由 5 个新 URL 设置 + 既有 help_link 拼接后 split）驱动循环，URL 为空时输出 span 而非 a。新增设置 help_email / help_phone / help_hours（含设计默认值）与 help_order_tracking_url / help_returns_url / help_warranty_registration_url / help_warranty_claim_url / help_manuals_url；help_link 标签改为 Help Center link。
- assets/header-new.css：新增 --help 面板卡片样式（347 宽、右边缘对齐 bar、top calc(100%+8px)、圆角/阴影/行分隔/黑按钮/电话文案）与 ≤1199px 的静态页样式（左右16、无卡片样式、gap0 用 margin 控制间距）；新增 [data-help-open] 时保留抽屉顶部 Logo（按移动截图，覆盖默认隐藏规则）。
- assets/header-new.js：showPanel 增加一行，按面板是否 --help 切换根节点 data-help-open。
- snippets/header-icons.liquid：新增 help-order-tracking、help-returns、help-warranty-registration、help-warranty-claim、help-manuals 五个用户提供 SVG，保留 viewBox、去掉内联宽高、描边改 currentColor；Help Center 复用既有 help-circle。

后续增量（同日用户要求）：5 个链接改用主题里已有的地址作为默认回退（Liquid default，不写进设置默认值），Order Tracking → https://venustas.aftership.com/，Returns & Exchanges → https://venustas.returnscenter.com/?ref=powr-io，Warranty Registration → shopify://pages/warranty-registration，User Manuals → https://venustas.zendesk.com/hc/en-us/categories/38122906510477-User-Manual，Help Center → help_link（默认 zendesk hc/en-us）；Warranty Claim 无现成地址，保持空值渲染为不可点击文本，商家可在 help_warranty_claim_url 配置。Help 改为仅点击触发：两个入口加 data-header-no-hover，JS 跳过其 pointerenter 绑定，且 pointerleave 自动关闭对 --help 面板不生效；下拉每行 hover 加 #f5f5f5 背景。

## 验证

Node 解析 schema 通过，16 个设置、引用无缺失；if/endif 6:6、for/endfor 2:2、div 15:15；CSS 花括号 261:261；node --check assets/header-new.js 通过；6 个图标 case 名与循环数组一致；data-header-toggle=help 与 data-header-panel=help 配对、面板有 id 供 aria-controls；5 个默认地址与 2 个 data-header-no-hover 均已核对。未启动浏览器、未上传主题，点击展开、行 hover 灰底、移动抽屉 Help 页与返回、Esc／外点关闭均未实测。

## 文档与决策

本日志、Header architecture 与 known-issues 增量、知识库索引。无跨模块契约变化，不新增 ADR。

## 风险、回退与遗留

- Warranty Claim 无现成地址，当前为不可点击文本；其余 5 行为主题里已有的默认地址，Help Center 沿用 help_link。
- 桌面面板右边缘按 .header-new__bar（max 1720）对齐，极端窄桌面（1200–1259）下与图标簇位置需实测。
- Help 仅点击触发，行 hover 为 #f5f5f5；移动端沿用现有面板状态机：打开 Help 时隐藏主列表与工具区，通过 data-help-open 保留 Logo；返回按钮焦点回到 Help 行。
- 无 JS 时 Help 按钮不展开（与现有导航面板一致）。
- 回退：撤销上述四个文件增量即可，导航与面板逻辑不受影响。
