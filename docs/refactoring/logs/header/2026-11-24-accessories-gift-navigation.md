# 2026-11-24 Accessories／Gift 导航及入口关联

- 模块：header
- 状态：实现及定向静态检查；浏览器／测试主题同步未验证
- 环境／源码基线：D:/zyl/theme-venustas 当前用户已保存的 group 配置
- 批准依据：用户要求排查 Accessories 已配置却不生效，继续配置 Gift；Accessories 两列、移动默认关闭、两面板使用现有双推广图片
- 批准范围：现有新 Header 的入口匹配与两个分组配置；不删除旧 Header，不提交／推送／发布

## 目标与源码证据

当前 group 的 header_nav_group_HHkAQK 已配置 menu_key=accessories，但 sections/header-new.liquid 的 navigation_panel_keys 仅含 new/men/women/bundles/sale，因此 Accessories 输出普通链接。实际列为 Batteries & Power（三条已配置内容）、Heated Accessories（默认 Feature 占位）、第三列完全空白。不是仅按截图推断。

用户截图提供两列 Accessories 和三列 Gift 文案；两张推广素材复用已有面板配置，不下载或绘制新素材。未提供的跳转地址不编造。

## 实际变更

sections/header-new.liquid 按顶级面板 settings.menu_key 自动关联导航，避免以后手动添加面板再次遗漏。sections/header-group-new.json 保留用户已配置内容，Accessories 去掉完全空第三列并补齐五个 Heated Accessories 条目，两个普通列移动默认关闭；Gift 使用三个普通分组，按截图配置收礼对象、价格与礼品卡，各列移动默认关闭。两面板均添加移动可见双推广卡，复用现有组件。

## 验证

JSON/schema/设置/类型/block_order 引用及既有面板保留核对通过；隔离目录 Shopify CLI theme check（LiquidHTMLSyntaxError、ValidSchema、JSONSyntaxError、ValidSettingsKey）返回 []，git diff --check 通过。静态复审未发现明确阻塞；当前总计76块，按用户前述授权保留。未启动浏览器，不运行全量构建，未上传主题。

## 文档与决策

更新 Header 档案及知识库索引，入口匹配变化记录于架构；不改变跨模块高度／事件契约。

## 风险、回退与遗留

空链接仍不可点击，需商家配置实际目标。测试主题文件是否同步以及平台超限保存／显示未验证。回退仅恢复当前两份业务文件对应增量，不覆盖用户其他面板；旧 Header 文件未修改。Sale 上一批日志中的61为助手沿用旧计数的误记，源码核对当时用户基线58、增加6后为64（New 已增至20），并非61；保留本条作为修正依据。
