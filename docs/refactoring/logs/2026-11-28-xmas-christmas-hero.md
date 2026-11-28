# 2026-11-28 xmas Christmas Hero 首屏

- 模块：跨模块（Christmas 页面 / xmas）
- 状态：完成（仅静态验证；未做浏览器、视觉或交互验证）
- 环境／源码基线：本地 `D:\zyl\theme-venustas`；未提交、未推送、未发布；页面模板 `templates/page.xmas.json`
- 批准依据：本次会话用户明确批准“xmas Christmas Hero”方案，选择小花图标用图片上传，并提供 calendar/card 两个 SVG
- 批准范围：新增 `sections/xmas-christmas-hero.liquid`；修改 `templates/page.xmas.json`；在 `snippets/heating-icons.liquid` 增加 calendar/card；新增本日志

## 目标与源码证据

- 桌面设计节点 `10320:550`：1920×760 banner，左侧文案、底部四项权益卡，权益卡上移覆盖 banner 下沿，页面底色 `#f9f2e8`。
- 移动设计节点 `10354:5444`：390×654，文案上下分布，CTA 与说明在底部，无权益卡。
- 现有 `sections/xmas-ways-to-save.liquid` 使用写死文案、图片上传和 `xmas-` 前缀；`sections/heatingP-hero.liquid` 使用 desktop/mobile 两个 `image_picker` 与类名切换。
- `snippets/heating-icons.liquid` 已有 `truck`、`returns`，缺少 calendar/card；用户本次提供两者 SVG 代码。
- `templates/page.xmas.json` 原有首节为 `xmas_ways_to_save`，本次新增首屏节。

## 实际变更

- `sections/xmas-christmas-hero.liquid`：新增 xmas Christmas Hero；桌面满幅 banner + 1340px 内容区，桌面四项权益卡上移 59px，768–1199px 为 2×2，移动端隐藏权益卡；移动端最小高度 654px，文案上下分布。
- 文案全部写死；设置仅 `desktop_banner`、`mobile_banner`、`holiday_icon`、`button_link`。移动 banner 空值回退桌面 banner；按钮链接空值回退 `/collections/all-sales`。
- `templates/page.xmas.json`：首位加入 `xmas_christmas_hero`，名称 `xmas Christmas Hero`（19 字符）。
- `snippets/heating-icons.liquid`：新增 `calendar`、`card` 分支；保留 34×34 viewBox，移除写死宽高，描边改为 `currentColor`，由父级颜色控制。

## 验证

- 提取 section `{% schema %}` 并 JSON.parse：名称/preset 均为 19 字符，设置 id 无重复，`button_link` 无 url 默认值。
- 去除模板注释后 JSON.parse：`order[0]` 为 `xmas_christmas_hero`，所有 order 键存在，全部 page section 名称 ≤25 字符。
- 静态检查 Liquid 块：section 7/7、snippet 3/3；section CSS 大括号 189/189；新增图标均为 `currentColor`，无遗留 `#B93205`。
- 用仅含该 section/snippet 的临时主题运行 `shopify theme check`，两者无 offense；未运行完整主题检查。
- 未启动浏览器，未做视觉、交互、响应式实测；未运行构建。

## 文档与决策

- 更新 `docs/refactoring/README.md` 索引；未改模块技术档案，未新增 ADR。
- 权益卡使用现有 `truck`/`returns` 图标；calendar/card 按用户提供代码加入，未自行绘制或下载。

## 风险、回退与遗留

- `templates/page.xmas.json` 带自动生成提示，后台主题编辑器保存后可能重写；如首屏消失需重新确认该 section 引用。
- banner 与花环图片在后台未上传前为空；桌面用 `#7a1f1f`、移动用 `#0b2a1d` 兜底，上传后按图片比例覆盖。
- 移动端未单独上传 banner 时会回退桌面图，主体可能被裁切；需上传移动端专用图。
- 现有 `truck`/`returns` 与 Figma 图标细节略有差异；如需完全一致，后续用同结构 SVG 替换。
- 回退：删除 `page.xmas.json` 中 `xmas_christmas_hero` 及 order 项，删除 `sections/xmas-christmas-hero.liquid`，移除 heating-icons 的 calendar/card 分支。
- 未自动进入下一个模块，等待审核。
