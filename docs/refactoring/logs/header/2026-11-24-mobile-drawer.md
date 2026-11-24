# 2026-11-24 移动抽屉与 My Account

- 模块：header
- 状态：实现，定向静态检查
- 环境：本地工作区，未浏览器实测或上传
- 批准依据：用户明确要求左侧抽屉、关闭按钮保持旧 Header 样式，My Account固定四个子项
- 范围：新Header移动抽屉、账户内容及图片尺寸提示；保留旧文件

## 目标与源码证据

旧style.css的.nav-mobile .main-nav-content为89%宽、max-width600px、left过渡；.btn-mav-close在right:-40px，40px橙色右半圆，图片close-nav-mobile.png。新版本此前为四周留白390px抽屉和内部关闭，现按用户纠正对齐旧实现。

## 实际变更

header-new.liquid增加独立滚动容器和外侧全局关闭按钮，My Account始终显示四个子项。header-new.css恢复左侧全高抽屉及关闭形状，保留窄屏40px关闭空间与reduced-motion。header-icons新增drawer-close复用旧图片。分类图/推广图/商品卡sizes随89%最大600px更新。JS不变，继续已有遮罩、inert、焦点约束和清理。

## 验证

定向ShopifyCLI LiquidHTMLSyntaxError/ValidSchema检查和diff检查；未运行浏览器或全量构建，未上传、提交、发布。

## 文档与决策

更新Header architecture，无跨模块协议变化，不新增ADR。

## 风险、回退与遗留

账户专用目标仍可在编辑器配置，未登录时由原生账户链接引导登录。回退对应新Header样式/markup/icon增量即可；旧Header未改。
