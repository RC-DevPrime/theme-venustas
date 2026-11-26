# 2026-11-25 桌面端 Help 字标加粗

- 模块：header
- 状态：完成（仅静态检查）
- 环境／源码基线：本地工作区 D:\zyl\theme-venustas，未连接线上主题或浏览器
- 批准依据：用户 2026-11-25 消息“桌面端 help 文字自重改为 700”
- 批准范围：桌面 Header 中 Help 字标的视觉粗细；不改图标形状、尺寸、颜色、点击行为

## 目标与源码证据

- 桌面 Help 入口在 `sections/header-new.liquid:125`：`<button class="header-new__help" …>{% render 'header-icons', icon: 'help' %}</button>`，按钮尺寸 54×20（assets/header-new.css:988）。
- `snippets/header-icons.liquid:90` 的 `help` 图标不是真实文字，而是 54×20 的 SVG：第一条 path 是圆形问号图标（stroke #1E1E1E），第二条 path 是 “Help” 四个字母的轮廓（fill #515151）。因此没有可用的 `font-weight` 可设，只能改变轮廓粗细。

## 实际变更

- assets/header-new.css：新增 `.header-new .header-new__help svg > path:last-of-type { stroke:#515151; stroke-width:.45; stroke-linejoin:round; }`，给字母轮廓加 0.45 用户单位的同色描边，视觉上从常规字重接近 700；圆点图标 path 不受影响，颜色、位置与按钮尺寸保持不变。
- 未改 `snippets/header-icons.liquid`、section 标记或交互。

## 验证

- 静态核对：选择器只命中 `help` 图标的第二个 path（字母轮廓）；stroke 与 fill 同色，`stroke-linejoin: round` 避免尖角；描边外扩约 0.22 单位，仍在 54×20 viewBox 内，不会被裁切；CSS 花括号 342/342。
- 未启动浏览器、未做截图比对；实际粗细是否接近设计稿 700 需在预览主题确认。

## 文档与决策

- 新增本日志并在知识库入口 README 登记索引；未改模块架构。
- 无 ADR。

## 风险、回退与遗留

- 风险：描边是模拟加粗，字形本身仍是原 500 轮廓；与真正的 700 字体相比，笔画末端和转角会略有差异。若浏览器不支持 SVG path 的 CSS stroke（极旧环境），会保持原粗细，不影响布局。
- 回退：删除该条 CSS 规则即可。
- 遗留：如果设计要求真正 700 的文字，需要把 Help 字标换成“图标 + 真实文字”（`font-weight:700`），这会改变当前 54×20 的组合字标，需另行确认。
