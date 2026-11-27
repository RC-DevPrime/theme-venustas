# Collection 已知事项

环境：2026-11-23 本地源码。未执行浏览器／网络／性能测试。

| ID | 分类 | 证据 | 影响／状态 |
| --- | --- | --- | --- |
| C-001 | 已确认跨模块耦合，非已复现故障 | collection.js:1–13 读取 Header DOM 并添加 50px 偏移 | Header 结构变化必须评估 sticky 筛选；未修改 |
| C-002 | 已确认 HTML 契约 | collection.js:filterCollection 替换筛选与产品容器；main-collection 提供这些节点 | 改结构需同步请求解析及刷新逻辑；尚无证据表明当前失效 |
| C-003 | 已确认共享组件差异 | main-collection render product-collection；collection-products-recommendation render product-item | 统一卡片前需核对字段、行为和其他调用方，不能直接合并；2026-11-27 起两者通过 product-card-promotion 共用底部促销行，结构仍不同 |

本次 61 个 collection JSON 模板移除注释头后严格解析通过；这不等于全部 schema、业务关系或线上行为通过验证。尚未形成有证据的 Collection 运行缺陷结论。
