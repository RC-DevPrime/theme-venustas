# 模块与共享依赖

基线：2026-11-23；箭头代表源码引用或选择器／事件契约，不代表已验证运行。

| 模块 | 页面入口 | 核心输出 | 资源／共享消费者 | 详细清单 |
| --- | --- | --- | --- | --- |
| Header | theme → header-group-new（旧 header-group 保留） | header-new + search + popup-cart；New/Men/Women/Bundles/Sale 面板（61块超限实验） | header-new.css/js；既有高度变量、nav.header 与高度事件；旧全局资源仍加载 | [Header](../modules/header/files.md) |
| Collection | collection JSON → main-collection 及辅助 sections | filters、分页商品列表、推广与推荐 | collection.css/js；main.js；product-collection → badge/colors/reviews；Header 高度 | [Collection](../modules/collection/files.md) |
| Product Detail | product JSON → main-product + 产品专属 sections | media、选项、价格、加购、库存、评价、导航与内容 | product.css/js、global.js、popup-cart.js；商品／尺寸／runtime snippets；应用 | [Product Detail](../modules/product-detail/files.md) |

## 必须保留或显式迁移的跨模块契约

| 所有者／来源 | 消费者 | 已核对的契约 |
| --- | --- | --- |
| header.liquid | style/res-base/main.js | `.header`、桌面／移动导航、公告；根高度变量 |
| main.js | 商品／支持页导航等 | `header:heightchange`、resize 更新 `.sticky-top`、`.nav-mobile`、`.header-nav-section`、`.main-support-nav`、`.main-product-support-nav` |
| Header DOM | collection.js | `.shopify-section-group-header-group .header` 的 outerHeight；筛选 sticky top = Header 高度 + 50 |
| Header DOM | product.js | `nav.header` 的 header-hide 显隐；商品导航滚动逻辑 |
| header `.icon-cart` | popup-cart.js | 打开购物车，更新 `.icon-cart .dot` |
| search section | main.js + predictive-search.js | 展开搜索、输入、建议结果容器；请求 section_id=predictive-search（本地目标缺失，见问题档案） |
| product-collection | Collection 列表 | product-badge、product-variant-colors、okendo 评分；隐藏商品表单 |
| product-item | 集合推荐等 | 与主列表的 product-collection 是不同组件，不能直接视为可互换 |
| main.js | Collection AJAX 替换后 | `window.applySwatchFallbacks`；collection.js 触发 `filters:refreshed` |
| main-product／product.popup | main.js 商品编辑弹窗 | `#productEditPopupHTML`、product-edit-option → edit-product-variant |
| product-variant | global.js | variant-radios、应用 JSON 变体数据、`#main-product-id`、价格／导航同步 |
| product.js | main-product／商品导航／加购 | `window.venustasRegionalInventoryGate`，主区和导航库存、选中变体可购状态 |
| popup-cart.js | Header／集合／商品等 | cart API、section HTML 刷新、`cart:updated` |
| config + Shopify 后台 | 所有相关模块 | 全局 settings、菜单、metafields、metaobjects、app blocks；本地文件不包含全部运行数据 |

## 边界说明

普通 theme 布局覆盖三模块；PageFly 和 layout none 的专用输出另行处理。JSON 模板和 group 数据可能由主题编辑器改写。复用组件的其他调用方必须在具体改动前搜索，当前关系图不是全站逐功能穷举。资源抽取／组件合并／事件替换属于跨模块方案，不能因为当前重构顺序从 Header 开始就忽略消费者。
