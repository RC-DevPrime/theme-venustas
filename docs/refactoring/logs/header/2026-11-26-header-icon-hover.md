# 2026-11-26 Header 顶部图标 hover 变红

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-26 消息“header 上这几个图标 hover 上去要变红色”（截图：搜索、账户、收藏、购物车、Help）
- 批准范围：Header 顶部工具图标（搜索、账户、收藏、购物车、Help、移动端搜索／礼盒）的 hover 颜色；不改尺寸、间距与点击行为

## 目标与源码证据

- `snippets/header-icons.liquid` 里的 search／wishlist／cart／help-circle／help 图标把颜色写死为 `#1A1A1A`／`#1E1E1E`／`#515151`，父级 `color` 变了图标也不会变；account、gift 已经是 `currentColor`。
- 之前为把 Help 字标模拟成 700 字重，给字母 path 加了 `stroke:#515151`，会覆盖 hover 时的 currentColor。

## 实际变更

- snippets/header-icons.liquid：把 `stroke="#1A1A1A"`、`fill="#1A1A1A"`、`stroke="#1E1E1E"`、`fill="#515151"` 全部改为 `currentColor`（共 23 处 currentColor），图标颜色统一跟随父级 `color`；`drawer-close` 的白色保持不变。
- assets/header-new.css：
  - `.header-new__help svg > path:last-of-type` 的描边由 `#515151` 改为 `currentColor`，Help 字标 hover 时整体变红。
  - 给 `.header-new__search`、`.header-new__mobile-search`、`.header-new__mobile-gift`、`.header-new__help`、`.header-new__cart`、`.header-new__utility-icon` 加 `transition:color .2s ease`。
  - 在 `@media (hover:hover)` 中统一 hover `color:#b93205`（主题红），覆盖搜索胶囊原本的 #515151 文字色。
- 未改图标尺寸/间距、未改 JS。

## 验证

- 静态核对：header-icons.liquid 中 `#1A1A1A`／`#1E1E1E`／`#515151` 均为 0，`currentColor` 23 处；Liquid 标签 31/31 配对；header-new.css 花括号 349/349。
- 手工推演：桌面搜索／账户／收藏／购物车／Help hover 时父级 color 变 #b93205，SVG 的 stroke/fill 用 currentColor 跟随；移动端搜索、礼盒、购物车同理；`drawer-close` 白图标不受影响。
- 未启动浏览器，实际 hover 过渡与红色色值需刷新预览确认。

## 文档与决策

- 新增本日志；`docs/refactoring/modules/header/files.md` 与知识库入口 README 登记。
- 无 ADR。

## 风险、回退与遗留

- 风险：图标改为 currentColor 后会跟随父级文字色，若其它位置给这些容器设置了非预期颜色，图标会一起变化（当前 header 内父级均为深色）。Help 字标默认色由原来的灰字+深图标统一为父级色。
- 回退：把 header-icons 的 currentColor 改回原色值，并删除 CSS hover 规则即可。
- 遗留：移动抽屉里的工具行（Help／账户等整行）不在本次 hover 范围，仍是行背景 hover。
