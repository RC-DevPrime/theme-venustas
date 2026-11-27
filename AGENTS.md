# Shopify Project Instructions

## 重构知识库与业务修改审批（优先于下文默认执行流程）

知识库入口：`docs/refactoring/README.md`。重构顺序为 Header → Collection → Product Detail；不自动启动下一个模块。

### 修改前必须执行

1. 自动读取知识库入口及与任务有关的 `project/architecture.md`、`project/coding-standards.md`、`project/module-map.md`。
2. 按任务范围读取 `modules/header/`、`modules/collection/` 或 `modules/product-detail/` 的 README、architecture、files、known-issues；跨模块任务读取所有受影响模块，其他模块按最小范围补充档案。
3. 检索并阅读相关 `logs/{模块}/`、跨模块日志及 `decisions/` ADR；不每次加载全部历史，不把 proposed 当作 accepted。
4. 必须检查当前实际源代码、引用方和配置，核对文档与代码；不能只按文件名或旧文档推断。
5. 修改业务代码前提交完整方案：目标与验收、源码证据、文件／功能范围、跨模块依赖影响、实施步骤、验证、风险、回退、待确认信息。等待用户明确批准；没有明确批准不得修改 Liquid、CSS、JavaScript、JSON 模板／配置等业务代码。
6. 只能在批准范围内实施。范围变化先补充方案并取得批准；一次批准不延伸到其他模块、线上发布或未来任务。已明确批准的范围不重复请求批准。

明确授权的纯文档整理／知识库初始化可直接执行，不将其视作业务代码批准。读取分析可以先完成；不能用“最小修复”“顺手清理”绕过业务审批。

### 完成后必须执行

- 按实际改动新增独立任务日志，使用 `docs/refactoring/templates/refactoring-log.md`，记录批准依据、文件、验证、风险和遗留项；跨模块记录可放 `logs/` 根下并由模块档案索引。
- 功能逻辑或依赖关系变化，更新对应模块技术档案；架构变化同时更新模块 architecture 和项目 module-map，必要时更新项目 architecture。
- 重要技术取舍使用 ADR 模板记录背景、候选方案、决策和后果；未批准标记 proposed，明确批准后才标 accepted。
- 文档错误先核对源码再修正，在日志／ADR 保留必要旧结论和修正依据；只增量维护受影响内容，不重复生成完整项目文档。
- 区分已确认事实、项目规定、建议、历史复盘和待验证；记录适用环境，静态核对不宣称浏览器或线上验证。
- 保持下文既有命名、图片、SVG、响应式、库存复盘及轻量静态检查规则。普通任务不启动浏览器或全量检查；用户明确要求时按其授权范围执行。
- 不自动 Git commit、不自动 push、不自动发布；完成当前批准任务后汇报并停止，等待用户审核，不自行开始下一模块。

## Goal
This repository contains a Shopify theme/project. Optimize for:
- bug fixing
- page improvements without design references
- design-to-section implementation when designs are provided
- performance improvements
- minimal, safe diffs

## Instruction precedence
- Read this file first before editing anything in this repository.
- Project rules override global `~/.codex/AGENTS.md` rules.
- If a deeper `AGENTS.md` exists in a subdirectory, follow the nearest applicable file for that path.

## Working style
- Start by identifying the smallest relevant scope.
- Read only the files directly related to the task.
- Reuse existing Shopify patterns whenever possible:
  - CSS variables
  - snippets
  - section schema patterns
  - responsive breakpoints
  - existing blocks/settings patterns
- Prefer minimal changes over refactors.
- Avoid touching unrelated page areas.

## Task handling
### Bugs
- Reproduce or infer the issue first.
- Find the root cause.
- Fix the smallest code path possible.
- Verify the fix after editing.

### Page optimization without design
- Improve within the current theme structure.
- Keep the existing layout direction unless explicitly asked to change it.
- Focus on clarity, spacing, hierarchy, and UX polish with minimal diffs.

### New requirements with design
- Break the design into:
  - content
  - layout
  - settings
  - blocks
  - responsive states
  - asset needs
- Map the design to Shopify sections, blocks, snippets, and schema.
- Implement merchant-editable text, images, and links when appropriate.
- Keep the first diff focused on the requested area only.

### Performance work
- Prioritize:
  - image size and format
  - lazy loading
  - JavaScript/CSS bloat
  - render-blocking scripts
  - too many sections
  - third-party app code
  - repeated renders or expensive loops
  - unnecessary animations
- Make the smallest safe fix with the highest impact.

## Section 开发约定

以下规则适用于新开发的 section；修改现有 section 时优先保持该模块的既有结构，仅调整需求涉及的部分。用户本次说明或明确的设计要求优先于默认规则。

### 设计输入与还原
- 开发 section 时，用户通常会提供桌面端、移动端 Figma 链接及补充说明。先查看两端对应节点，再确认内容、布局、图片比例、交互与响应式差异。
- 不仅按桌面稿缩小：分别还原两端的排列、间距、字号、对齐和图片展示方式，中间宽度自然过渡。
- 缺少一端设计时，结合已有 section 和这些默认规则完成合理适配；只有影响核心布局、内容或交互的歧义才需要询问。
- 优先使用真实文本和可编辑内容，不将整块设计做成图片，也不将 Figma 临时资源地址硬编码为正式图片来源。

### 默认布局与响应式
- 桌面端内容区最大宽度为 `1340px`，水平居中；图文并排等布局默认垂直居中。整块内容在有明确高度的展示区域内也默认垂直居中，具体排版以设计为准。
- 背景可铺满屏幕，内部内容仍遵守最大宽度。优先沿用近期 section 的 `width: min(100% - 40px, 1340px); margin: 0 auto;` 写法，避免容器与子元素重复叠加左右留白。
- 移动端内容左右各留 `20px`，宽度和高度随内容自适应；满幅图片等明确设计例外按设计处理。
- 使用 Flex/Grid 组织布局，避免用绝对定位摆放普通文案，避免固定高度截断内容或固定宽度造成横向溢出。
- 新的独立 section 默认沿用近期 `heating-*` 的 `max-width: 767px` 移动端断点；修改已有模块时保持其现有断点，需要额外断点时再添加。
- 文案变长、图片缺省和中间屏宽时仍应可用，不通过隐藏溢出来掩盖布局问题。

### 图片与素材
- Banner、Hero 及大背景图片统一参考 `sections/heatingP-hero.liquid` 的多端适配方式，以下专用约定优先于本节普通内容图规则：
  - 提供 `desktop_image`、`mobile_image` 两个 `image_picker`，使用 `assign mobile_image = section.settings.mobile_image | default: desktop_image` 实现移动端回退。
  - 两端分别使用 `image_url` / `image_tag` 输出图片，通过带模块前缀的 `__image--desktop`、`__image--mobile` 类切换显示：默认显示桌面图，`max-width: 767px` 时隐藏桌面图、显示移动图；此类图片沿用该方式，不改用 `<picture>`。
  - 图片使用 `display: block; width: 100%; height: auto;`，按各端原始比例撑开区域，不以固定高度或强制裁切适配；图片位置默认居中，移动端可按设计使用 `center top`。
  - 桌面图参考最大输出宽度 `2400`、`widths: '960, 1340, 1600, 1920, 2400'`，移动图参考最大输出宽度 `900`、`widths: '390, 600, 750, 900'`，满幅图均设置 `sizes: '100vw'`；实际输出按素材和展示尺寸调整。
  - 图文叠放、移动端文案是否移至图片下方按各端设计实现，不将参考模块的文案布局强制套用到所有 Banner。保留空图判断、alt 和按首屏位置选择的加载策略，不一律照搬 `loading: 'eager'`。
- 根据两端图片展示区域的宽高比及主体裁切判断是否共用图片，不只比较导出像素尺寸。
- 两端比例接近、同一图片能够合理展示主体时，只提供一个 `image_picker`，桌面端和移动端共用图片。
- 两端比例相差明显，或构图、裁切导致同图无法满足设计时，提供桌面端和移动端两个 `image_picker`；移动端图片未上传时回退到桌面端图片。
- 分端图片优先使用 `<picture>` 和 `<source media>` 切换资源，避免仅靠 CSS 隐藏两张图片造成重复下载；同图使用合适的 `srcset` / `sizes`。
- 新图片优先使用 Shopify 的 `image_url` / `image_tag`，按展示尺寸输出，声明合理的宽高或宽高比，减少布局跳动。
- 保留图片 alt；装饰图片使用空 alt。普通内容图默认自然比例，只有明确的裁切区域才使用 `object-fit: cover`。
- 非首屏图片按需懒加载；首屏关键图片不强制懒加载。没有图片时不输出失效 URL 或破图。

### SVG 图标管理
- 涉及 SVG 图标时，不新增独立 `.svg` 素材文件；SVG 代码由用户单独提供，优先复用已有图标，缺少时等待用户提供，不自行下载、绘制或替代。
- 将用户提供的 SVG 代码统一放入 `snippets/heating-icons.liquid`，沿用现有 `case icon_name` 分支管理，以明确的图标名称区分；section 通过 `{% render 'heating-icons', icon: '图标名称' %}` 引用，不在 section 内重复嵌入 SVG 代码。
- 图标大小和颜色由调用处的父级容器控制：父级设置宽高及 `color`，局部 CSS 使子级 `svg` 使用 `display: block; width: 100%; height: 100%;`；SVG 保留原始 `viewBox`，不写死展示宽高或内联尺寸样式。
- SVG 按原有实心或描边结构使用 `fill="currentColor"` / `stroke="currentColor"` 继承父级颜色，保留必要的 `fill="none"`、`stroke="none"`，不以全局覆盖破坏图形；确需保留的多色按用户提供的素材处理。
- 装饰图标保持 `aria-hidden="true"`、`focusable="false"`；仅含图标的交互元素由父级按钮或链接提供可访问名称。

### Liquid、命名与后台设置
- 新增产品详情模块的文件名和 CSS 类名前缀统一使用 `product-new`，如 `product-new-features.liquid`、`product-new-features__title`。
- 上述模块的后台名称（schema `name` 及 preset `name`）统一以 `productN` 开头，总长度不得超过 25 个字符（包含前缀、空格和标点），如 `productN Features`；交付前检查名称长度。
- 新 section 沿用小写连字符文件名及与模块一致的类名前缀，子元素使用现有的 BEM 风格，如 `heating-bike-power__title`。
- 独立模块优先沿用 `{% style %}`、HTML/Liquid、必要的脚本、`{% schema %}` 的组织方式；已有模块保持原有文件组织。
- 样式优先限定在 `#shopify-section-{{ section.id }}` 内，DOM ID 包含 `section.id`，确保同一页面多个实例互不干扰。
- 标题、正文、按钮文字、链接和内容图片按需要提供后台设置；重复卡片、问答、数据项等使用 blocks，并保留 `block.shopify_attributes`。
- 不把所有设计数值都做成设置。默认只暴露实际需要维护的内容与必要控制项，避免堆砌字号、边距等无明确用途的开关。
- 新增可独立添加的 section 配置合适的 preset、默认内容和 block 限制；设置名称清晰，保持相邻模块的语言及命名习惯。
- 文本、链接、图片为空时分别处理，不渲染空标题、无内容按钮或无意义占位空间；纯文本属性正确转义，富文本按其内容类型输出。

### 精简 CSS 与交互
- CSS 只写实际使用的选择器和必要声明，不保留空规则、空媒体查询、废弃类或试验性覆盖。
- 合并重复样式；移动端只覆盖发生变化的属性，避免同一属性多次覆盖或重复写继承值。
- 优先复用主题字体、变量、按钮、snippet 和已有组件；先确认其行为符合设计，避免引入无关的全局样式依赖。
- 不为简单布局增加包装层、全局 reset、无用途的 CSS 变量或 `!important`。不照搬旧模块的冗余写法。
- 能用 CSS 完成的展示不增加 JavaScript；确需交互时沿用现有组件和依赖，不为单个 section 引入新库。
- 脚本限定在当前 section 内，支持多个实例和主题编辑器重新加载，避免重复绑定事件；移除实例时清理监听器、定时器和观察器。
- 交互元素使用合适的 button / a，支持键盘和可见焦点；动画支持 `prefers-reduced-motion`，不默认增加设计未要求的动效。

### 交付检查
- 仅对本次改动做轻量静态检查：Liquid / HTML / CSS / JavaScript 语法、schema JSON、设置引用及明显的代码质量问题。
- 通过阅读代码检查响应式规则、图片回退、空值处理和 section 作用域，不启动浏览器、不截图、不做视觉或交互测试。
- 未经用户明确要求，不运行完整构建、全量测试、性能审计或反复验证，不新增测试工具链。
- 交付时简要说明修改文件和检查结果；未经用户要求，不发布到线上主题。

### Shopify schema 与 section 文件规则（2026-11-27 复盘）
- `url` 类型设置的 `default` 只接受 `/collections`、`/collections/all`（Shopify 平台限制）。需要自定义默认地址时不要写 `default`，改为在 Liquid 中按空值回退，并在设置 `info` 标注留空后的地址；否则整个 section schema 会报 `default must be a string or datasource access path`。
- 修改 schema 后必须提取 `{% schema %}` 做 `JSON.parse`，并检查重复 `id`、合法 `type`、`url` 的 `default` 是否在白名单内；不能只凭编辑器/上传成功与否判断。
- 设置字段可能为空或未被商家保存，Liquid 必须为空值提供正确回退，不能假设 schema `default` 一定生效。
- 优先显式读取 `section.settings.<id>`；动态 `section.settings[变量]` 可能取不到值，必须用 `case` 白名单映射并保留回退，禁止在取不到值时静默使用过期或错误地址。
- section 文件 schema 校验失败时 Shopify 会拒绝该文件；模板或 section group 引用它会报 `Section type 'x' does not refer to an existing section file`。修复 schema 后必须重新上传该 section 文件（只上传 JSON 不算修复），并确认文件存在、`type` 与文件名一致。
- 涉及链接/价格的配置项，交付前核对“设置值 / 空值回退 / 实际输出”三条路径；修改默认地址时同步修改回退数组，避免回退仍是旧值。
- 给元素设置 `display: flex` 等作者样式且仍可能使用 `hidden` 时，必须保留或补回 `[hidden] { display: none; }`，不能因空值不再输出节点就删除其他消费方的防御规则。

## Shopify-specific rules
- Use Shopify AI Toolkit / Dev MCP when Shopify docs, schema, or platform behavior are needed.
- Keep Liquid, schema, and JSON valid.
- Preserve merchant controls and theme editor usability.
- Respect accessibility and responsive behavior.
- Do not assume production changes are safe without review.

## Validation

### 库存模块问题复盘与检查规则

- 本次首屏空框的根因是库存初始化被包进 `.product-image-location-section` 条件块，缺少热点模块的商品页跳过了整个初始化。独立功能初始化应只依赖自身所需节点，修改时核对外层条件、括号范围与实际入口。
- 旧库存函数删除后仍有调用，导致变体切换在请求前抛出 `ReferenceError`。删除或更名函数时搜索全部调用点，核对参数签名、成功回调和失败分支。JS 语法通过不能证明引用和入口正确。
- 库存应用在脚本执行后注入 DOM，原始商品 HTML 不包含库存节点。区分应用接口响应、原始 HTML 与注入后的 DOM，复用已有应用加载流程，不能仅靠解析商品 HTML 获取动态库存。
- 配送说明曾将 `(Ship to US ONLY)` 的文字删除后留下 `()`，再拼接成 ` · ()`。当前只提取并标准化配送说明，避免通过删除其他文本推导说明内容。
- 静态核对有货、低库存、无货三种状态的识别顺序和绿、黄、红色映射，未知状态使用中性色。默认空白不代表有货。
- 静态核对 US 单独返回、CA 单独返回、双国家和未返回数据四种路径，国家可见数量必须与布局一致，单国家一列铺满、双国家两列。
- 排查结论必须注明证据所在页面和主题环境。用户提供本地或预览地址时以该地址为准，代码静态检查、隔离验证与浏览器实测分别如实说明。

Before finishing:
- Limit verification to syntax, schema validity, code conventions, and obvious quality issues in the changed code.
- Do not use a browser for testing. Review responsive behavior statically.
- Do not run broad checks or spend excessive effort on verification unless explicitly requested by the user.
- Confirm no unrelated files were changed. If a targeted syntax check is needed, inspect the project scripts first.

## 执行效率与沟通
- 节省 token：只搜索和读取任务相关的文件与片段，避免全仓扫描、重复读取和大段工具输出。
- 优先最小必要修改，不做无关重构，不重复检查已经确认的内容。
- 沟通简短直接，不复述需求、不展开常规过程、不输出冗长计划或无关解释。
- 完成后仅说明改了什么、涉及文件和必要的检查结果；有实际阻塞或关键风险时再补充。

## Output expectations
When reporting work, keep it concise:
- what changed
- which files were touched
- any risk or limitation
- how it was validated
