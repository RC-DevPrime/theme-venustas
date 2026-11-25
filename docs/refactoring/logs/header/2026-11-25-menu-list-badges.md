# 2026-11-25 Menu list 菜单链接徽标

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“下拉菜单的菜单类型为 menu list，上传了 menu 则显示菜单列表，没上传则显示配置的菜单；menu 链接带 #hot、#new 等 badge 时显示标签，样式与配置 badge 相同”，随后补充“链接后面 # 带了什么就显示什么，不需要设置这些内容，另外还是没有显示标签样式”
- 批准范围：Menu list 区块（blocks/_header-nav-menu.liquid）及其文档；不改导航面板、其它区块、CSS 样式

## 目标与源码证据

- “菜单类型为 Menu list”对应区块 `blocks/_header-nav-menu.liquid`（schema name `Menu list`），由 `_header-nav-column` 引入、`_header-nav-group` 的 `content_for 'blocks'` 渲染；不是 sections/header-new.liquid 内联渲染。
- 菜单优先／初始链接回退已存在：`block.settings.menu.links != blank` 时用菜单标题与地址，否则读取 `title_1..4`／`url_1..4`／`description_1..4`，旧日志 2026-11-23-men-women-navigation.md 已记录该回退。
- 缺失能力：菜单项只有标题和地址，没有徽标。首轮实现只解析地址 fragment 且使用固定词表，实测菜单项名称写成 `Ultra Warm 12V#hot` 时 `#hot` 直接作为普通文字输出，既没有徽标样式也未被剥离；配置的 badge（`_header-nav-feature`、`_header-nav-image-menu`）用的是 `.header-new__badge`。

## 实际变更

- blocks/_header-nav-menu.liquid：
  - 每个条目取到标题与地址后，按以下顺序解析：标题含 `#` 时取最后一个 `#` 之后的内容作为徽标文字、前面部分作为标题；标题无 `#` 但地址含 `#` 时取地址 fragment 作为徽标文字，并从 href 去掉该 fragment。
  - 不设词表：`#` 后写什么就显示什么（去首尾空格）；全小写时首字母转大写（`hot` → `Hot`），已是混合大小写则原样保留。
  - 标题输出增加 `<span class="header-new__badge">`，复用配置 badge 的样式（assets/header-new.css:221）。
  - 菜单分支与初始链接分支共用同一解析，两条路径行为一致；`menu` 设置说明改为“在链接名称或地址末尾加 #Text 显示徽标”。
- 未改 sections/header-new.liquid、CSS、JS、JSON。

## 验证

- 静态阅读：`{%- liquid -%}` 与 for/if/endfor/endif 闭合正确；空标题／空地址经 `append: ''` 转为空字符串后再判断；标题优先于地址，避免同一项两处都带 `#` 时取错；带查询串的地址（`/collections/men?x=1#hot`）只去掉 fragment。
- 未启动浏览器、未在主题编辑器或线上预览验证；徽标换行、窄列排版及真实菜单数据未实测。

## 文档与决策

- 更新本日志；`docs/refactoring/modules/header/files.md` 更新对应条目；知识库入口 README 索引保持。
- 无架构或跨模块契约变化，不新增 ADR，不更新 module-map。

## 风险、回退与遗留

- 风险：标题本身含 `#`（如 “#1 Best Seller”）会被当作徽标分隔符，前半段变标题、后半段变徽标；菜单项名称需要该字符时需改用地址 fragment。地址 fragment 仅在标题没有 `#` 时解析。
- 回退：删除徽标解析段与标题输出中的 badge span，还原 `menu` info 即可。
- 遗留：Category image menu、Feature link 等其它区块仍使用各自 badge 设置字段，不自动解析 `#`；若需要统一，需另行确认。
