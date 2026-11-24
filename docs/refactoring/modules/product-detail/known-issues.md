# Product Detail 已知事项

基线：2026-11-23 本地工作区；未复测线上行为。

## 本次源码发现

| ID | 分类 | 证据 | 影响边界／状态 |
| --- | --- | --- | --- |
| P-001 | 已确认严格 JSON 解析失败 | templates/product.MMJ01.json 与 product.MMP03.json:80 的 block 末项逗号后直接闭合对象 | 移除 Shopify 注释头后 json.loads 仍失败；未验证 Shopify 导入或线上故障，待批准处理 |
| P-002 | 已确认 schema 严格解析失败 | sections/main-product.liquid:1225，Tags block 的 limit 后尾逗号 | 提取 schema 后 json.loads 失败；未修改，不推断编辑器实际症状 |
| P-003 | 已确认复杂运行依赖，非当前故障结论 | product.js:watchInventoryMarkup、loadInventoryMarkupViaIframe、refreshInventoryInfoForVariant；main-product 的库存槽移动 | 库存来自应用注入；不能用原始 HTML 缺少数据判定无库存或删除应用流程 |
| P-004 | 已确认多处状态同步 | global.js 变体类；product.js 主区／导航逻辑；product-nav-new.js；popup-cart.js 加购 | 迁移时需梳理选择器、input、事件、区域库存和加购所有者，尚未验证重复执行或竞态 |

其余 125 个 product JSON 在移除注释头后严格解析通过。为建立两份失败模板的清单，曾仅在内存中去除尾逗号后解析；源文件没有修改，该清单不代表校验通过。本次没有全量验证所有附属 section schema。

## 继承的历史复盘（来源：原根 AGENTS.md）

以下是项目已有历史记录，本次未重新复现，不能当成当前故障或本次修复成果：

- 库存初始化曾被 product-image-location-section 条件包住，缺少热点模块时跳过；独立功能初始化需只依赖自身节点。
- 删除旧库存函数后遗留调用曾引发 ReferenceError；函数修改必须搜索所有调用、参数和失败路径。
- 库存应用晚于原始 HTML 注入 DOM，不能仅靠商品 HTML 抓取库存。
- 删除配送文本曾残留 `()` 和 ` · ()`，应提取并标准化配送说明。
- 静态覆盖有货／低库存／无货的绿黄红映射，未知状态中性色；覆盖 US、CA、双国、无数据四类布局。

原历史未提供可定位的页面 URL、主题版本或任务日期，尚不能映射到具体线上环境。未来任务应补齐环境和证据，不虚构历史。
