# Header 已知事项

2026-11-23 Men／Women：实现与静态验证完成，尚无后台菜单句柄及分类图片，暂展示可编辑初始文案和统一占位图；部分目标链接为空，Best Sellers 临时指向各自总集合。当前 Header section 已用49/50个动态区块，后续面板新增需先规划容量。两张默认推广图已本地化。见 [任务日志](../../logs/header/2026-11-23-men-women-navigation.md)。

2026-11-23 增量：本地入口已切换 header-group-new。新 New 面板完成静态校验，见 [实施日志](../../logs/header/2026-11-23-new-navigation.md)。New Color 与 Just In 样例条目暂指向已有 New Arrivals 集合，需商家配置实际目标；其他七个入口地址为临时值。H-002 的旧 header schema 未修复，H-001 的搜索缺口仍保留；新 Header 未提供搜索入口。以下历史事项继续保留，均不代表新入口线上已复现。

环境：2026-11-23 本地工作区，未做浏览器或线上复现。状态均为待审核，未修复。

| ID | 分类 | 证据 | 影响边界／下一步 |
| --- | --- | --- | --- |
| H-001 | 已确认本地依赖缺口 | assets/predictive-search.js:28 请求 section_id=predictive-search，:42 查找响应包装；sections 下不存在 predictive-search.liquid | 本地响应实现缺失；线上是否存在额外文件及搜索实际表现未确认，需核对完整主题和预期响应 |
| H-002 | 已确认严格解析失败 | sections/header.liquid:1147 的 schema Image Link label 后为尾逗号；提取 schema 用 Python json.loads 失败 | 不是注释头造成；Shopify 导入／编辑器实际行为未验证，不推断已导致线上故障 |
| H-003 | 已确认跨模块耦合，非故障结论 | header 内 :root；main.js:updateHeaderDependentUI；collection.js:1–13；product.js 对 nav.header 操作 | 高度与显隐修改会影响筛选和商品导航；具体改动前搜索所有消费者 |
| H-004 | 待评估维护风险 | header 同时输出桌面／移动分支，main/global/popup-cart 共享绑定 | 生命周期、键盘与重复监听需按具体方案核验；没有运行证据，不认定现有交互有 bug |

没有性能数据；不依据文件长度、使用 jQuery 或全局资源存在就宣称性能故障。
