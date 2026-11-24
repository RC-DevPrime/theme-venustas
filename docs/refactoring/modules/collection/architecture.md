# Collection 架构

基线：2026-11-23，本地静态分析。

## 编排与服务端数据

61 个 collection JSON 均定义 main-collection 和六类辅助 sections（FAQ 在其中 43 个定义），逐模板启用情况见 files.md。

默认 collection.json 的启用顺序为 collection-featured-banner → main-collection → collection-list-v2 → collection-products-recommendation；collection-list、collection-vertical-slider、collection-faqs 被 disabled。不能将所有定义 section 当成页面现有展示。

main-collection 读取 collection.filters、sort options 与 collection.products，以每页 9 项 paginate；穿插 promotion_image/video/sale blocks，读取集合自定义促销标题 metafields。商品由 product-collection 渲染，继续依赖 product-badge、product-variant-colors、okendo 评分；其隐藏加购／弹窗表单连接共享 JS。

推荐 section 使用 product-item，和主网格不是同一个 snippet。collection-list/v2、banner、vertical-slider 和 FAQ 各自输出配置内容；具体布局／交互以文件为准。

## 客户端流程与 DOM 契约

layout 对集合加载 collection.css/js；jQuery、main.js、global.js、popup-cart.js 仍为全局依赖。

collection.js 处理价格滑块、桌面／移动过滤与排序同步、清除条件、分页、加载更多。filterCollection 用 GET 请求目标 URL，解析整页 HTML，更新 `.item-found`、`.sticky-filter .filter-form`、`.main-collection-product-list`，恢复 accordion 与筛选显示；调用 window.applySwatchFallbacks，触发 filters:refreshed。不是一个可无缝替换成任意 JSON API 的实现。

脚本以 Header outerHeight + 50 设置 sticky-filter top。重构 Header 类名／高度和筛选 DOM、ID、商品列表容器时需联合考虑。商品卡片与购物车操作受 main.js／popup-cart.js 委托事件影响，不能仅验证 collection.js。

## 专用输出

`templates/collection.quiz-targets-json.liquid` 使用 layout none，分页 250 项输出 JSON，读取 settings.quiz_matching_metafields 与商品字段，属于独立数据输出，不走普通 collection JSON 编排。

在线集合／筛选配置、动态应用输出和运行时行为未验证。
