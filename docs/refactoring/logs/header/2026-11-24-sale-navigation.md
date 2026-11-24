# 2026-11-24 Sale 五分类导航

- 模块：header
- 状态：实现及定向静态检查，浏览器和平台超限行为待验证
- 环境／源码基线：D:/zyl/theme-venustas，沿用 Bundles 已有活动组件
- 批准依据：用户明确要求继续 Sale，除图片比例外同 Bundles、用旧 Header 数据、包括 New Customer -$30 Off、桌面不需要按钮
- 批准范围：Sale 配置及必要标题回退；继续用户明确允许的超50区块实验，不改旧代码、不提交／推送／发布

## 目标与源码证据

读取 Header 文档、Bundles 日志与 ADR-0004，核对旧 header-group.json 的 menu_tag=Sale。有效分类集合按顺序为 campaign、deal-of-the-week、mega-clearance-sale、new-customer、outlet，第三槽无集合跳过。旧 nav_1 是字面量 {{ block.settings.collection_nav_1.title }}，不能直接复制到可见文字；用截图中的 Fall Mega Sale 作为初始化分类名，其他分类名取旧配置。

用户截图仅作布局参考，商品图片／名称／链接仍取真实集合；$30 OFF逐商品角标依照此前排除范围不实现，新增的 New Customer -$30 Off 是分类入口，不是角标映射。

## 实际变更

修改 sections/header-new.liquid 增加 sale 面板键；修改 sections/header-group-new.json 新增活动面板和五分类，全部 portrait（228:285裁切）、默认四商品；不添加 Sale 底部按钮区块。移动顶部 Shop All 使用旧 campaign 总入口，分类按钮各指向所选集合。

blocks/_header-nav-category.liquid 增加空内容标题回退集合标题；Bundles 配置的显式标题保持优先。复用现有样式、脚本与商品卡片，不新增业务文件或库。原55块增加6块，总计61块，按用户授权保留供测试。

## 验证

定向检查结果交付前补充。检查不将小于等于50作为本次通过条件。未启动浏览器、上传主题、提交或发布。

## 文档与决策

增量更新 Header README/architecture/files/known-issues、项目模块关系与知识库入口；ADR-0004 增加本次 Sale 追加授权历史，不新建架构方案。

## 风险、回退与遗留

真实集合数据、商品及61块配置在 Shopify 的保存／上传／显示未验证，静态通过不表示平台兼容。旧代码未修改。回退移除 sale_panel 配置和导航入口键并撤销标题回退，可恢复 Bundles 基线；不自动扩展 Accessories/Gift。
