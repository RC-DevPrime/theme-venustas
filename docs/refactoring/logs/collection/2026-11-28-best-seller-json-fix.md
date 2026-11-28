# 2026-11-28 修复 collection.best-seller.json 非法 JSON

- 模块：Collection（`templates/collection.best-seller.json`）
- 状态：完成（仅静态检查；未上传主题、未做线上验证）
- 环境／源码基线：本地工作区 `D:\zyl\master\theme-venustas`，分支 `master`，基线 commit `992020e`；未提交、未推送
- 批准依据：用户 2026-11-28 报告“templates/collection.best-seller.json / Invalid JSON”，并在确认中选择“确认修复（推荐）”
- 批准范围：仅该文件的这一处非法字符；不改模板结构、section 顺序、其他模板

## 目标与源码证据

- 现象：Shopify 报该模板 JSON 非法；`JSON.parse` 报 `Expected double-quoted property name in JSON at position 2632 (line 74 column 74)`（去掉文件头注释后的坐标）。
- 原因：`main-collection` 的 `promotion_image_z3jmTk` 设置里，`"background_image": ".../new-arriveal.jpg",` 之后写入了两个字符的字面量 `\r\n`（反斜杠 + `r`、反斜杠 + `n`），而不是真实换行，导致逗号后出现非法 token。
- 对照：`templates/page.pf-4841c317.json` 也有同样的字面量 `\r\n`，但位于字符串值内部，是合法 JSON 转义，解析正常，未改动。

## 实际变更

- `templates/collection.best-seller.json`：把该处字面量 `\r\n` 改为真实换行；`background_image`、`background_image_mobile` 的值与其余内容不变。

## 验证

- `node` 读取文件、去掉头部注释后 `JSON.parse` 通过；`sections` 7 个、`order` 7 项；两个 background_image 值与原值一致。
- `git diff --check` 无空白错误；diff 仅 1 行拆成 2 行。
- 未上传主题、未在主题编辑器保存或预览，线上是否还有其他同名报错未验证。

## 文档与决策

- 新增本日志并在知识库入口登记；不改模块架构，不新增 ADR。

## 风险、回退与遗留

- 风险：该文件由 Shopify 主题编辑器自动生成（文件头已注明），后台再次保存可能重新写回异常行；复发时按本日志同样的方式处理。
- 遗留：`templates/product.MMJ01.json` 与 `templates/product.MMP03.json` 仍为已知非法 JSON（product-detail known-issues 的 P-001，尾逗号问题），本次未处理。
- 回退：还原该文件本次差异即可。
