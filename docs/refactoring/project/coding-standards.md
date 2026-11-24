# 开发规范与代码事实

基线：2026-11-23。必须区分“指令要求”与“仓库已全面遵守”；本次未做全仓合规审计。

## 已确认的规范来源

- 根目录 `AGENTS.md`：项目主规则；本次增加知识库阅读与审批要求，保留原 section 约定和库存复盘。
- `.cursor/rules/shopify-theme.mdc`：声明 OS 2.0、先分析依赖、最小变更、复用及 Liquid 对象／metafield 注意事项。文件末尾停在一个 Liquid 示例代码块开头，内容不完整，不把缺失部分当成规则。
- 本次搜索仅发现一个 AGENTS.md，没有更深层同名文件。`.claude/settings.local.json`、`.cursor/settings.json` 属于本地工具设置，不能视作主题业务规范；未发现其他项目说明文档内容可供继承。
- `docs/SHOPIFY_ARCHITECTURE.md` 为空，不能当作架构事实来源。

## 已验证的现有实现模式

| 领域 | 代码事实与证据 | 注意 |
| --- | --- | --- |
| Liquid | header/main-product 等 render snippets；main-product 和 popup-cart include global-vars | render 与 include 并存，变量作用域不可机械替换 |
| 数据 | main-product 使用 product metafields、shop.metaobjects.size_chart；Header 使用菜单 links 与 block settings | 数据结构依赖后台，不能以本地空值推断生产配置 |
| CSS | layout 加载全局层；header 内有 :root 高度变量；main-collection 内有局部样式 | 现有并非全部 section 作用域，重构需分析共享覆盖 |
| JavaScript | jQuery ready／委托事件、原生 customElements、内联脚本并存 | 保留选择器、加载顺序、全局函数和事件契约 |
| JSON | 模板含 Shopify 自动生成注释，order、disabled、blocks、block_order | 不能把注释头误报为业务 JSON 错误；严格解析发现另列 known-issues |
| 资源 | layout 按 template.name 加载商品／集合资源 | 不按文件名猜测使用范围 |

## 当前必须遵守的项目要求

- 先读文档、历史日志／ADR、源码，提出完整方案；业务代码仅在明确批准后按范围实施。
- 保持小范围 diff、现有命名和断点；不顺带重写其他模块、升级库或改变后台配置。
- 新独立 section 默认内容最大宽度 1340px，移动左右 20px，默认移动断点 767px；修改已有模块保持其约定。
- 新商品详情模块文件／类使用 product-new 前缀，schema/preset 名称以 productN 开头且总长不超过 25 字符；这是新增规则，不要求批量改名旧文件。
- 新 section 样式限定 section.id，实例 DOM ID 唯一；可维护文案／图片／链接暴露必要设置，重复内容用 blocks 并保留 shopify_attributes。
- 图片处理空值、alt、宽高和适当加载策略；普通分端内容图优先 picture；Banner/Hero 专用规则以 heatingP-hero 为参考，分别输出两端 image_tag 并按 CSS 切换，移动图回退桌面图。专用规则优先，不能混为一个全局规则。
- SVG 优先复用；用户新增 SVG 集中到 heating-icons snippet，不自行下载或绘制替代，不新增独立 SVG 文件。
- CSS 仅保留必要选择器和覆盖，不引入无关 !important、全局 reset 或新库；CSS 足够时不增加 JS。
- 脚本考虑多实例和主题编辑器重载，避免重复监听并清理资源；交互可键盘操作、有可见焦点，动效支持 reduced-motion。
- 删除／重命名函数搜索全部调用；独立初始化只依赖自身节点。库存颜色、US/CA 单双国及未知状态遵守原 AGENTS 历史复盘。
- 验证前检查项目脚本；默认仅做变更相关静态语法、schema、引用及明显质量检查，不运行完整构建／全量测试／浏览器。只有用户特别要求浏览器时才按授权操作。
- 不自动提交、推送、发布，不自动进入下一模块。

## 建议规范（未作为实施决策批准）

- 逐步为 Header 高度、购物车、变体和片段刷新明确事件／DOM 契约与所有者，再考虑拆分资源。
- 文件依赖记录引用路径与函数／选择器，避免只记录容易漂移的行号。
- 已知问题以环境、源码证据、影响是否验证和状态记录；静态失败不直接等同线上故障。
- 新资源分包、全局状态迁移、组件统一等改变架构的选择，应先走方案审批与 ADR，不在普通整理中隐式实施。
