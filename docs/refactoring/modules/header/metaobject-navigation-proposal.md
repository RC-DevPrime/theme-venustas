# Header 导航 Metaobject 模型（提案）

状态：**proposed**（2026-11-23），未批准，未修改任何 Liquid／CSS／JS／JSON 业务文件。
范围：Header 桌面端与移动端导航内容结构。不含 Collection、Product Detail 模块。
依据：3 张桌面设计图（New / Men / Bundles）、`sections/header.liquid`、`snippets/mega-menu*.liquid`、`snippets/header-mega-*`、`assets/main.js`、`sections/header-group.json`，以及 Shopify 官方文档（文末列出）。

## 0. 结论

1. 导航内容全部放 Metaobject；Header 主题编辑器只保留外观、入口与行为设置。
2. 共 6 个定义，一条根导航条目：`header_navigation` → `header_nav_item` →（`header_menu_column` → `header_menu_link`｜`header_promo`｜`header_bundle_tab`）。
3. 顶层菜单项也由 Metaobject 管理，`header_navigation.items` 的顺序即顶部顺序；删除现有“菜单标题 = block 的 menu_tag”匹配方式。`main_menu` 仅作为元对象缺失时的回退，不参与新设计。
4. 三个设计是同一个 `header_nav_item` 的两种 `layout`：
   - `columns`：左侧 2–4 列链接 + 右侧 0–2 张促销卡 + 底部主/次链接（New、Men）。
   - `tabs`：左侧分类页签 + 右侧标题 + 产品网格 + 主按钮（Bundles）。
5. 主题代码只能读取元对象，**不能在 Liquid 中创建定义或条目**；定义与样例条目必须在后台 `Settings > Custom data` / `Content > Metaobjects` 或 Admin API 建好，主题才能渲染。

## 1. 设计稿内容拆解

| 设计元素 | 出现位置 | 归属字段 |
| --- | --- | --- |
| 顶部项 `New`（橙色）、`Men`…`Sale` | 三张图 | `header_nav_item.label` + `emphasis` |
| 列标题 `New Arrival` / `Shop by Category` / `Warmth & Runtime` | New、Men | `header_menu_column.label` |
| 链接行（可带说明 `Men's · 12V`、`Built for -40°F`） | New、Men | `header_menu_link.label` + `description` |
| 行内 `New` 小标签 | New、Men | `header_menu_link.badge` |
| 加粗行（`All Men's`、`New Arrivals`、`Best Sellers`） | Men | `header_menu_link.emphasize` |
| 促销卡（图片、`JUST LAUNCHED`、标题、副标题） | New、Men | `header_promo`（New 与 Men 的两张卡相同，可直接复用同一条目） |
| 底部左链接 `Shop all … →`；右链接 `Our Technology… →` | New、Men | `header_nav_item.cta_label/cta_href`、`secondary_label/secondary_href` |
| 侧栏标题 `Bundle`（与顶部 `Bundles` 不同） | Bundles | `header_nav_item.panel_title` |
| 左侧分类页签 `Clothing + Battery` 等 | Bundles | `header_bundle_tab.label` |
| 右侧标题 `More Power, Longer Warmth` | Bundles | `header_bundle_tab.heading`（可选副标题） |
| 右侧 4 个商品卡（图片、New/Hot、商品名） | Bundles | `header_bundle_tab.collection` + 现有 `header-mega-bundle-product-card` |
| `Shop All Bundles →` 按钮 | Bundles | `header_nav_item.cta_label/cta_href` |

## 2. 定义清单

关系：

```
header_navigation (1 条)
└─ items[] ──────────────► header_nav_item (每个顶部菜单 1 条)
   ├─ columns[] ─────────► header_menu_column
   │  └─ links[] ────────► header_menu_link
   ├─ promos[] ──────────► header_promo
   ├─ tabs[] ────────────► header_bundle_tab
   └─ cta / secondary 字段（文本 + 链接）
```

创建顺序必须从叶子类型开始：`header_menu_link` → `header_menu_column` → `header_promo` → `header_bundle_tab` → `header_nav_item` → `header_navigation`。引用字段所在定义需要目标定义已存在。

通用约定：

- 类型名、字段名全小写下划线；每个定义的首个文本字段设为 **Display name**。
- 行内链接 `href` 使用**单行文本**，存站内相对路径（`/collections/men`）或完整 `https://` 外链。不用 `url` 类型：官方 URL 类型限定 `https/http/mailto/sms/tel`，站内相对路径与多域名（venustas.com / venustas.ca）场景存在校验风险（社区证据见文末）。
- 所有 `list.*` 顺序即渲染顺序；后台列表排序方式见 §6 待验证项。
- 图片字段限定 `Image` 类型。

### 2.1 `header_navigation`（根，仅 1 条）

| 字段 key | 后台名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | Title | 单行文本（≤60） | 是 | Display name，如 `Main navigation` |
| `items` | Menu Items | `list.metaobject_reference` → `header_nav_item` | 是 | 顺序 = 顶部导航顺序，`list.max` 12 |

### 2.2 `header_nav_item`（每个顶部菜单 1 条）

| 字段 key | 后台名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | Label | 单行文本（≤40） | 是 | Display name，顶部文案 |
| `href` | URL | 单行文本（≤255） | 是 | 顶部链接，无面板时直接跳转 |
| `emphasis` | Emphasis | 单行文本，choices：`default` / `accent` / `sale` | 否 | `accent` 对应 New 橙色，`sale` 供 Sale 使用；颜色在主题编辑器配置 |
| `layout` | Layout | 单行文本，choices：`columns` / `tabs` | 是 | 决定使用 `columns` 还是 `tabs` |
| `panel_title` | Panel Title | 单行文本（≤40） | 否 | 移动端返回标题、Bundles 侧栏标题；空则用 `label` |
| `columns` | Columns | `list.metaobject_reference` → `header_menu_column` | `columns` 布局必填 | `list.max` 4 |
| `promos` | Promo Cards | `list.metaobject_reference` → `header_promo` | 否 | `list.max` 2，超出取前 2 |
| `tabs` | Bundle Tabs | `list.metaobject_reference` → `header_bundle_tab` | `tabs` 布局必填 | `list.max` 6 |
| `cta_label` | CTA Label | 单行文本（≤40） | 否 | `Shop all new arrivals` / `Shop All Bundles` |
| `cta_href` | CTA URL | 单行文本（≤255） | 否 | 与 `cta_label` 同时存在才渲染 |
| `secondary_label` | Secondary Label | 单行文本（≤60） | 否 | Men 右下角 `Our Technology: Heatwave™ & PowerCore™` |
| `secondary_href` | Secondary URL | 单行文本（≤255） | 否 | 仅 `columns` 布局底部右对齐显示 |

### 2.3 `header_menu_column`

| 字段 key | 后台名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | Column Title | 单行文本（≤40） | 是 | Display name；空列不渲染 |
| `links` | Links | `list.metaobject_reference` → `header_menu_link` | 是 | `list.max` 12 |

### 2.4 `header_menu_link`

| 字段 key | 后台名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | Label | 单行文本（≤80） | 是 | Display name |
| `href` | URL | 单行文本（≤255） | 是 | 相对路径或完整外链 |
| `description` | Description | 单行文本（≤80） | 否 | 第二行小字；空则不占位 |
| `badge` | Badge | 单行文本（≤16） | 否 | 如 `New`；空则不渲染 |
| `emphasize` | Emphasize | 布尔 | 否 | 默认 `false`；true 时加粗 |

### 2.5 `header_promo`

| 字段 key | 后台名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | Title | 单行文本（≤80） | 是 | Display name |
| `eyebrow` | Eyebrow | 单行文本（≤40） | 否 | 如 `JUST LAUNCHED` |
| `subtitle` | Subtitle | 单行文本（≤120） | 否 | 如 `Built for -40°F` |
| `image` | Image | `file_reference`（仅 Image） | 是 | 桌面图 |
| `mobile_image` | Mobile Image | `file_reference`（仅 Image） | 否 | 移动端设计确认后使用；空则用 `image` |
| `href` | URL | 单行文本（≤255） | 否 | 空则整卡不输出链接 |
| `hide_on_mobile` | Hide on Mobile | 布尔 | 否 | 默认 `false`；移动端设计确认后决定是否保留 |

### 2.6 `header_bundle_tab`

| 字段 key | 后台名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | Tab Label | 单行文本（≤40） | 是 | Display name，左侧页签文案 |
| `heading` | Heading | 单行文本（≤80） | 否 | 右侧标题 |
| `subheading` | Subheading | 单行文本（≤120） | 否 | 预留副标题，设计未出现可留空 |
| `collection` | Collection | `collection_reference` | 是 | 取前 4 个商品，沿用现有商品卡与 New/Hot 标签逻辑 |
| `view_all_label` | View All Label | 单行文本（≤40） | 否 | 空则隐藏 View All |
| `view_all_href` | View All URL | 单行文本（≤255） | 否 | 空则用 `collection.url` |

## 3. 三个设计如何建

### New（columns，3 列 + 2 促销卡）

- `header_nav_item`：`label=New`、`emphasis=accent`、`layout=columns`、`cta_label=Shop all new arrivals`、`cta_href=/collections/new-arrivals`。
- 3 个 `header_menu_column`：`New Arrival`（2 条）、`Just Launched`（2 条，带 `description`）、`Just in`（6 条，带 `description` + `badge=New`）。
- `promos`：2 条（Volcano™ Flagship Heated Vest、Apex™ Riding System）。

### Men（columns，4 列 + 2 促销卡）

- `header_nav_item`：`label=Men`、`layout=columns`、`cta_label=Shop all Men's`、`cta_href=/collections/men`、`secondary_label=Our Technology: Heatwave™ & PowerCore™`、`secondary_href=/pages/technology`。
- 4 个 `header_menu_column`：`Shop by Category`（9 条，前 3 条 `emphasize=true`，`Pants` 带 `badge=New`）、`Shop by Style`（3 条）、`Warmth & Runtime`（3 条带 `description`）、`Collections`（4 条）。
- `promos`：与 New **复用同两条** `header_promo`，改一次两处同步。

### Bundles（tabs，4 页签）

- `header_nav_item`：`label=Bundles`、`layout=tabs`、`panel_title=Bundle`、`cta_label=Shop All Bundles`、`cta_href=/collections/bundles`。
- 4 个 `header_bundle_tab`：`Clothing + Battery`（`heading=More Power, Longer Warmth`）、`Clothing + Gloves`、`Couple & Family`、`Clothing + Socks`；各自绑定分类 collection。
- `columns`、`promos` 留空。

## 4. 主题读取方式（实现阶段使用）

```liquid
{%- assign nav = section.settings.navigation -%}
{%- if nav != blank -%}
  {%- for item in nav.items.value -%}
    {%- assign href = item.href.value | default: '#' -%}
    <a class="nav-item{% if item.emphasis.value == 'accent' %} nav-item--accent{% endif %}"
       href="{{ href | escape }}"
       data-drop="{{ item.system.handle }}">
      {{ item.label.value | escape }}
    </a>
  {%- endfor -%}
{%- else -%}
  {%- comment -%} 回退：现有 main_menu.links，纯链接无面板 {%- endcomment -%}
{%- endif -%}
```

面板在 `.drop[data-drop]` 容器内按 `layout` 渲染；`columns` 遍历 `item.columns.value` → `column.links.value`，`tabs` 遍历 `item.tabs.value`。输出时 `label`、`href` 分别 `escape`；`description` 按纯文本输出；`collection` 为空时不输出商品网格。顶部激活态用 `href` 与 `request.path`／`request.fullpath` 比较（外链不参与），替代原 `link.active`。

## 5. 主题编辑器保留的外观设置

内容不进 schema，只保留外观与行为：

| 设置 | 用途 |
| --- | --- |
| `navigation`（`metaobject` 类型，`header_navigation`） | 指定根导航条目 |
| `main_menu`（`link_list`，保留） | 元对象为空时的回退 |
| 顶部 `accent` / `sale` 文字颜色 | 对应 New / Sale |
| 面板背景、最大宽度（默认沿用 1340）、内边距、列间距、分隔线 | 普通外观 |
| 促销卡图片比例（如 3:4 / 4:5）、卡片宽度 | 设计图比例 |
| Bundles 侧栏宽度、背景、选中项背景、按钮样式 | tabs 布局外观 |
| 每个页签商品数量（默认 4） | 控制 collection 取几个商品 |
| 链接/说明/徽标字号与徽标颜色 | 统一视觉 |
| 搜索是否显示 `Search` 文案、Help 文案与链接、购物车/账户/币种入口开关 | 顶部右侧 |

## 6. 约束、风险与待验证

- **定义不能由主题创建**：Liquid 只能读取；`metaobject` / `metaobject_list` 设置要求定义已存在且对 Storefront 可用，否则编辑器显示错误（[Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)）。条目默认 `Active`，`publishable` 能力开启时 Draft 不会出现在前台。
- **字段上限**：每个定义最多 40 字段；本方案最多 12 个，满足（[Metaobject limits](https://shopify.dev/docs/apps/build/metaobjects/metaobject-limits)）。
- **Liquid 渲染上限**：不使用 `paginate` 遍历 `values`／列表引用时最多 50 条；本方案单页导航条目远低于该值；每页最多加载同一类型 1,000 条、按 handle 查找最多 20 次（本方案只用引用，不按 handle 查找）。
- **列表排序**：顶部顺序依赖 `items` 列表顺序。需在目标店铺后台确认引用列表可拖拽排序；若不可用，给 `header_nav_item` 增加 `sort_order` 数字字段并在 Liquid 中排序（不影响其余字段）。
- **URL 类型**：采用单行文本保存链接目标，避免 URL 类型的 scheme 限制与多域名问题；如后续确认 `url` 类型可存站内相对路径，可改类型，Liquid 的 `.value` 读取方式不变。
- **迁移风险**：`sections/header-group.json` 现有 `dislay_1`–`dislay_6` 块保存着线上内容；新导航上线前需备份，并单独决定旧块是保留一个版本还是移除。移除块类型可能导致后台配置失效，不能顺带处理。
- **多店铺/多域名**：Header 代码同时服务 `venustas.com` 与 `venustas.ca`。若两者是独立店铺，元对象定义与条目需在两边分别创建（或通过 Admin API 同步），主题代码只共享渲染逻辑；若为同一店铺的两个域名，站内相对路径可正常复用。
- **跨模块契约**：`main.js` 依赖 `.header .nav-item` 的 `data-drop`、`.drop[data-drop]`、`.mega-menu-tab-list`、`.menu-list-tab li[data-tab]`、`.mega-menu-tab-list-content[data-tab]`；移动端依赖 `data-mega`。新渲染需沿用或同步修改，且不能破坏 header 高度变量与 `header:heightchange`（Collection 筛选、Product 导航依赖）。
- **性能**：tabs 布局会按 collection 预渲染商品卡片（每个页签 4 个），与现有 display-6 行为一致；菜单越多首屏 HTML 越大，后续可评估按需加载，但不在本方案内。
- **主题商店限制**：自定义定义不能用于 Theme Store 上架主题；本店铺为自定义主题，不受影响。
- **可访问性**：移动端手风琴、页签需保留 `aria-expanded` / `aria-controls`；图片 alt 由 `title` 回退；装饰性图标 `aria-hidden`。

## 7. 实施顺序（获批准后）

1. 在后台或通过 Admin API 创建 6 个定义与 3 组样例条目（New / Men / Bundles）。
2. Header schema 增加 `navigation` 与外观设置，保留 `main_menu` 回退；不改公告、购物车、搜索逻辑。定义建好后需在主题编辑器 Header 设置中手动选中根条目（`metaobject` 设置没有可用默认值），未选中时走回退。
3. 新增 `header-mega-panel` 渲染片段（columns / tabs 两分支），复用 `header-mega-bundle-product-card`、现有类名与 JS 契约。
4. 桌面端静态还原 + 移动端按后续设计适配。
5. 仅做静态语法、schema JSON、空值与响应式规则检查；不启动浏览器。
6. 旧 `dislay_*` 块与 `mega-menu.liquid` 的退役另提方案，不在本次批准范围。

## 8. 待确认

1. 顶层导航是否按本方案改为 Metaobject 驱动（推荐），还是保留 `main_menu` 仅面板用元对象？
2. Bundles 四个分类对应的 collection handle 是否已存在？
3. 移动端设计（待提供）：促销卡是否保留、是否用独立移动图、列是否手风琴、Bundles 是否堆叠为手风琴、页签/标题顺序。
4. 顶部右侧 Help、Search 文案、Wishlist/Account/币种入口是否保持现状（本方案归入主题编辑器设置，不建元对象）。
5. 现有 `dislay_1`–`dislay_6` 配置的迁移/退役节奏。
6. 目标店铺后台的列表字段是否支持拖拽排序（决定是否需要 `sort_order`）。
7. `venustas.com` 与 `venustas.ca` 是同一店铺的两个域名，还是两个独立店铺（决定元对象需要建一套还是两套）。

## 9. 验证边界

本文为静态设计与源码核对结论，未在浏览器、主题编辑器或线上环境验证；后台字段行为（Link/URL 输入、列表排序、Storefront 可用性）需在目标店铺实际创建时确认。业务代码未修改。

## 参考

- [Input settings（metaobject / metaobject_list）](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)
- [Metaobject limits](https://shopify.dev/docs/apps/build/metaobjects/metaobject-limits)
- [List of data types（link、list.metaobject_reference）](https://shopify.dev/docs/apps/build/metafields/list-of-data-types)
- [List of validation options（choices、list.max、file_type_options）](https://shopify.dev/docs/apps/build/metafields/list-of-validation-options)
- [Metaobject Liquid object](https://shopify.dev/docs/api/liquid/objects/metaobject)
- [社区：Link 类型在 Liquid 中读取 `.value.url` / `.value.text`](https://community.shopify.com/t/how-to-access-url-and-text-from-metafield-of-type-link/576558)
- [社区：URL 类型对非标准值的限制](https://community.shopify.com/t/using-id-in-an-url-metafield-throws-an-error/331334)
