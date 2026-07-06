# PetSite Builder Pro - 项目架构文档

> 基于 Next.js 15 + GSAP ScrollTrigger + Lenis.js + Cloudflare Pages 的苹果级宠物高定官网样板间

---

## 一、项目架构总览

```
pet-site-builder/
│
├── public/                              # 静态资源 (Cloudflare CDN 全球分发)
│   ├── pet/
│   │   ├── hero-full.png                # 主角全身高清立绘 (透明底)
│   │   ├── avatar.png                   # 大头贴 (右下角挂件入口)
│   │   └── foreground/                  # 前景遮挡物 (选配，制造 Z 轴景深)
│   │
│   ├── sequences/
│   │   ├── hero-wakeup/                 # ★ Hero Loop: 打哈欠/伸懒腰 (首屏唤醒)
│   │   │   ├── frame_001~060.webp       #    60帧 @ 24fps ≈ 2.5秒
│   │   │   └── manifest.json            #    { total, fps, action, width, height }
│   │   ├── transition-pounce/           # ★ Transition: 扑/跑酷 (场景过渡)
│   │   └── interaction-play/            # ★ Interaction: 翻肚皮/抓平板
│   │
│   ├── ui/
│   │   ├── badges/                      # SVG 印章: "表扬头子" "全自动闯祸机"
│   │   └── particles/                   # PNG 粒子: 💖 🐟 🐾 🪙 Zzz (128px)
│   │
│   └── pet-logo.svg                     # 品牌 Logo
│
├── app/
│   ├── layout.tsx                        # 根布局: 字体加载 (Quicksand + Inter)
│   ├── globals.css                       # Tailwind + 自定义玻璃卡片/按钮
│   ├── page.tsx                          # [保留] Agency 营销主页
│   │
│   └── demo/
│       └── pro/                          # ★★★ 唯一重点: Pro 高定样板间
│           └── page.tsx                  #     全站单页，所有核心逻辑在此
│
├── components/
│   └── pro/                              # Pro 版专属组件 (按需拆分)
│       ├── smooth-scroll.tsx             #   Lenis 初始化 + GSAP ticker 绑定
│       ├── sequence-canvas.tsx           #   Canvas 序列帧渲染器 (核心)
│       ├── hero-section.tsx              #   首屏: 杂志大标题 + Canvas 唤醒动画
│       ├── parallax-gallery.tsx          #   中段: Z-index 视差错位文字+宠物
│       ├── timeline-section.tsx          #   横滚: 成长时间线 (ScrollTrigger pin)
│       ├── interaction-widget.tsx        #   右下角挂件: 撸猫 + 粒子喷射
│       └── particle-system.tsx           #   Canvas 粒子引擎 (💖🐟重力喷射)
│
├── lib/
│   ├── utils.ts                          # cn() 工具函数
│   ├── sequence-loader.ts               # 序列帧预加载器 (Image 对象池)
│   └── particle-emitter.ts              # 粒子发射器纯函数
│
├── hooks/
│   └── use-sequence-scrub.ts            # GSAP ScrollTrigger → Canvas 帧映射 Hook
│
├── tailwind.config.ts                   # 主题: 暖橘主色 / 杂志风衬线字体
├── next.config.js                       # output: 'export' (Cloudflare Pages)
├── package.json                         # gsap + lenis + next 15
└── tsconfig.json
```

---

## 二、组件树 & 数据流

```
demo/pro/page.tsx  (入口)
│
├─ <SmoothScroll>           ← Lenis 实例 + GSAP ticker 桥接
│     │                       全局注入平滑滚动，驱动所有 ScrollTrigger
│     │
├─ <HeroSection>            ← Section 1: 首屏唤醒
│     │
│     ├─ 杂志大标题层        ← "对对对，喜欢白天睡觉晚上行动"
│     │   (Z-index 3, font-[16vw])
│     │
│     ├─ <SequenceCanvas>    ← 主角序列帧动画
│     │   sequence="hero-wakeup"
│     │   scrollTrigger { pin: true, scrub: 0.5 }
│     │   └─ Canvas ctx.drawImage()  ← 随滚动进度切换帧
│     │
│     ├─ 背景大字 "DUODUO"   ← (Z-index 0, 慢速视差 x:-140)
│     └─ 前景遮挡物          ← (Z-index 5, 可选)
│
├─ <ParallaxGallery>        ← Section 2: 杂志视差展
│     │
│     ├─ RPG 属性条          ← GSAP fromTo 逐个滑入
│     └─ 立绘切图            ← 慢速视差浮动
│
├─ <TimelineSection>        ← Section 3: 横滚成长线
│     │
│     ├─ GSAP horizontal pin
│     ├─ 里程碑卡片
│     └─ <SequenceCanvas>    ← transition-pounce 序列帧
│         sequence="transition-pounce"
│
├─ <InteractionWidget>      ← 右下角常驻挂件
│     │
│     ├─ 头像按钮 (展开/收起)
│     ├─ 🐟 喂食 / 💖 撸猫
│     └─ <ParticleSystem>   ← Canvas 粒子喷射
│         particles: 💖🐟🐾
│
└─ <Footer>                 ← CTA 定制引导
```

---

## 三、核心技术流: 滚动擦除链路

```
用户滚轮 / 手指滑动
       │
       ▼
  Lenis.js                          ← 物理惯性平滑 (duration: 1.2s)
       │ raf → GSAP ticker
       ▼
  GSAP ScrollTrigger                ← 时间线总管
       │
       ├── pin: true                 ← 钉住 section
       ├── scrub: 0.5               ← 滚动条控制播放头
       ├── start: "top top"
       └── end: "+=2000"            ← 2000px 滚动区间
              │
              │ onUpdate: (self) => {
              │   progress = 0.00 ~ 1.00
              │   frameIndex = floor(progress * totalFrames)
              │   ctx.drawImage(frames[frameIndex], ...)
              │ }
              ▼
         HTML5 Canvas               ← 高速刷新画布
```

---

## 四、关键依赖

| 库 | 版本 | 作用 |
|---|---|---|
| `gsap` | ^3.15.0 | ScrollTrigger 滚动擦除 + 时间线动画 |
| `lenis` | ^1.3.25 | 物理平滑滚动底座 (苹果级阻尼) |
| `next` | ^15.0.0 | 框架 + `output: 'export'` 静态导出 |
| `react` | ^19.0.0 | UI 组件 |
| `tailwindcss` | ^3.4.17 | 原子化样式系统 |
| `lucide-react` | ^1.21.0 | 图标库 |

---

## 五、页面分区设计 (4 Section + 1 Widget)

| Section | 功能 | 核心技术 | 素材依赖 |
|---|---|---|---|
| **Hero Section** | 首屏唤醒: 杂志标题 + 宠物打哈欠序列帧 | GSAP pin + scrub + Canvas 帧映射 | `sequences/hero-wakeup/` 60帧 |
| **Parallax Gallery** | RPG 属性条 + 立绘视差浮动 | GSAP fromTo + scrollTrigger | `pet/hero-full.png` |
| **Timeline Section** | 横向滚动成长时间线 | GSAP horizontal pin + scrub | `sequences/transition-pounce/` |
| **Interaction Widget** | 右下角撸猫挂件 + 粒子喷射 | Canvas 粒子引擎 + React State | `ui/particles/` + `pet/avatar.png` |
| **Footer CTA** | 定制引导入口 | 静态 | - |

---

## 六、素材目录重构计划

### 当前 → 目标

| 当前路径 | 目标路径 | 说明 |
|---|---|---|
| `public/pet-transparent.png` | `public/pet/hero-full.png` | 主角全身立绘 |
| `public/goldie-avatar.svg` | `public/pet/avatar.png` | 需替换为高清 PNG |
| `public/goldie-sleeping.svg` | 废弃 | 不再使用静态 SVG |
| `public/goldie-standing.svg` | 废弃 | 不再使用静态 SVG |
| `public/sequence/frame_001~060.webp` | `public/sequences/hero-wakeup/` | 归入 Hero Loop |
| `public/pet-logo.svg` | `public/pet-logo.svg` | 保留不变 |

### 待补充素材

1. **`sequences/hero-wakeup/manifest.json`** — 元数据描述
2. **`sequences/transition-pounce/`** — 过渡动作序列帧 (需 AI 流水线生成)
3. **`ui/badges/`** — SVG 趣味印章 (Figma 绘制)
4. **`ui/particles/`** — 粒子素材 PNG (💖🐟🐾🪙Zzz)
5. **`pet/avatar.png`** — 大头贴 (500x500+)

---

## 七、零成本部署

```bash
next build    # → out/ 静态文件
# 推送到 Cloudflare Pages → 全球 CDN 分发
# 零服务器费用，纯静态托管
```
