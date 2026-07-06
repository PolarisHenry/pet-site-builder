# 李多多 Pro 高定样板间 — 设计规格

> YOLO: 只做 Pro，不降级。宠物杂志风。

---

## 视觉系统

- **配色**: 暖米白 `#FAF8F3` · 橙橘 `#FF8C42` · 深棕 `#3A3226` · 杏色 `#D4A574`
- **字体**: Georgia 衬线 (标题) · Inter (正文) · Quicksand (RPG 标签)
- **排版**: 大字压底 + 宠物图层穿插 + RPG 属性卡 + 趣味标注

## 页面结构

### Section 1: Hero (首屏唤醒)
- Lenis 平滑滚动
- 3 层 Z-index: 底层大字 "DUODUO" → 中层 Canvas 序列帧 → 顶层杂志标题
- ScrollTrigger pin 2000px + scrub 0.5
- Canvas 读取 `manifest.json` 播放 60 帧打哈欠

### Section 2: Status (RPG 属性)
- 4 个属性条逐个 GSAP fromTo 滑入
- 立绘视差浮动

### Section 3: Timeline (成长线)
- GSAP horizontal pin 横向滚动

### Section 4: Widget (撸猫挂件)
- 右下角悬浮，展开喂鱼/撸猫
- Canvas 粒子喷射 💖🐟

## 技术栈

`Next.js 15` · `GSAP + ScrollTrigger` · `Lenis` · `Tailwind` · `@gsap/react` · `output: 'export'`

## 素材

- `pet/hero-full.png` (主角立绘) · `sequences/hero-wakeup/` (60 帧打哈欠) · `ui/particles/`
