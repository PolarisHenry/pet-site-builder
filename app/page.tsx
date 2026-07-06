"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Heart, QrCode, Shield, CheckCircle, Gamepad2, Compass, Layers } from "lucide-react";

export default function AgencyHome() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const features = [
    {
      icon: <Gamepad2 className="w-6 h-6 text-pet-primary" />,
      title: "RPG 属性卡片",
      desc: "为宠物定制专属属性：战斗力、睡眠深度、撒娇指数，以游戏卡牌形式生动展现。",
    },
    {
      icon: <Layers className="w-6 h-6 text-pet-primary" />,
      title: "滚屏蹦跳动效",
      desc: "页面滚动时，宠物透明切图伴随物理弹性动画蹦跳移动，让页面变得生机勃勃。",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pet-primary" />,
      title: "云撸猫狗小挂件",
      desc: "右下角常驻互动小组件，访客可点击喂食、抚摸，伴有可爱的爱心与气泡吐槽。",
    },
    {
      icon: <QrCode className="w-6 h-6 text-pet-primary" />,
      title: "项圈 QR 码绑定",
      desc: "支持生成专属二维码，可印制在宠物项圈上，路人扫码即可开启宠物官网名片。",
    },
    {
      icon: <Compass className="w-6 h-6 text-pet-primary" />,
      title: "成长纪念线",
      desc: "用精美卷轴式时间线记录爱宠的第一次进家、生日、调皮瞬间，永久定格美好。",
    },
    {
      icon: <Shield className="w-6 h-6 text-pet-primary" />,
      title: "Cloudflare 免费托管",
      desc: "静态网页部署在 Cloudflare Pages，终身零服务器托管费，访问速度极快。",
    },
  ];

  const pricing = [
    {
      id: "basic",
      name: "轻量单页版",
      price: "199",
      desc: "适合快速为爱宠建立数字名片",
      features: [
        "1 页专属定制页面",
        "基础宠物档案与相册",
        "RPG 属性雷达图",
        "Cloudflare Pages 免费部署",
        "送专属二维码设计 (用于项圈)",
      ],
      popular: false,
    },
    {
      id: "standard",
      name: "豪华互动版",
      price: "399",
      desc: "最受宠主欢迎的趣味故事官网",
      features: [
        "多页面/分段式深度故事流",
        "滚屏蹦跳趣味宠物动效",
        "云撸宠交互小组件 (右下角)",
        "自定义域名绑定支持",
        "终身免费托管维护",
      ],
      popular: true,
    },
    {
      id: "ai",
      name: "AI 智能分身版",
      price: "699",
      desc: "让你的宠物在互联网中拥有生命",
      features: [
        "豪华互动版所有功能",
        "AI 宠物性格聊天分身 (内置大模型接口)",
        "访客可与你的宠物实时对话",
        "高动态 3D/2D 浮动跟随骨骼动效",
        "专属独立域名免费代理注册 (1年)",
      ],
      popular: false,
    },
  ];

  return (
    <div className="bg-[#FFFDF9] text-[#2D3142] min-h-screen selection:bg-pet-primary/20 selection:text-pet-primary">
      
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src="/pet-logo.svg" alt="Logo" className="w-9 h-9" />
            <span className="font-heading text-xl font-bold tracking-tight text-[#2D3142]">
              PetSite <span className="text-pet-primary">Builder</span>
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 font-heading text-sm font-semibold">
            <a href="#features" className="text-gray-600 hover:text-pet-primary transition-colors">建站特色</a>
            <a href="#demo" className="text-gray-600 hover:text-pet-primary transition-colors">演示案例</a>
            <a href="#pricing" className="text-gray-600 hover:text-pet-primary transition-colors">服务定价</a>
            <a href="#process" className="text-gray-600 hover:text-pet-primary transition-colors">如何开始</a>
          </nav>

          <a href="#pricing" className="pet-btn-primary text-xs py-2 px-5 rounded-xl">
            立即定制
          </a>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/60 text-pet-primary text-xs font-heading font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 开启你宠物的互联网第一步
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-tight">
              让每只宠物，都有自己的 <span className="text-pet-primary relative">互联网小家<span className="absolute left-0 bottom-1 w-full h-3 bg-pet-secondary/40 -z-10 rounded-full"></span></span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
              我们为宠物定制专属的高端静态官方网站。融合 RPG 游戏属性卡、滚屏蹦跳猫狗动画、云撸宠互动挂件，支持生成项圈二维码，永久免费托管在 Cloudflare 静态云上！
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/demo/goldie" target="_blank" className="pet-btn-primary">
                预览 Goldie 的主页 <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#pricing" className="pet-btn-secondary">
                了解定价方案
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-[400px] aspect-square rounded-[36px] bg-gradient-to-tr from-orange-100 to-blue-100 p-4 shadow-xl">
              <div className="w-full h-full rounded-[28px] overflow-hidden bg-white relative flex items-center justify-center p-6 border border-white">
                <img 
                  src="/goldie-sleeping.svg" 
                  alt="Sleeping Goldie Demo Cat" 
                  className="w-full h-auto object-contain animate-float"
                />
                
                {/* Embedded Mini Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-orange-50 flex items-center gap-3">
                  <img src="/goldie-avatar.svg" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-pet-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm text-[#2D3142]">金币 Goldie</span>
                      <span className="text-[10px] text-white px-2 py-0.5 rounded-full bg-pet-primary font-bold scale-90 origin-right">Lv.99</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-heading">白天睡大觉，晚上悄悄暴富 💰</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ambient Decorative dots */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-200/40 rounded-full blur-xl -z-10 animate-float" />
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-blue-200/40 rounded-full blur-xl -z-10 animate-float" style={{ animationDelay: "2s" }} />
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-heading font-black">
              为什么你的宠物需要一个官网？
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              拒绝社交平台上千篇一律的网格，给它一个真正具备独特个性、交互动感、可终身保存并分享的专属数字居所。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-[#FFFDF9] border border-gray-100 shadow-sm hover:shadow-lg card-hover space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-[#2D3142]">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE CASE DEMO SPOTLIGHT ===== */}
      <section id="demo" className="py-20 bg-gradient-to-b from-white via-orange-50/20 to-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#FF8C42]/5 rounded-[40px] p-8 md:p-12 lg:p-16 border border-[#FF8C42]/10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="font-heading font-bold text-pet-primary text-sm tracking-wider uppercase">经典案例 Demo 体验</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black leading-tight">
                长毛橘猫“金币”的官方个人主页
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                这是我们为一只叫“金币 (Goldie)”的橘猫搭建的 Demo。在这个网站中，你不仅能阅读它令人捧腹的“暴富秘诀”，还可以在页面滚动时看它欢快蹦跳。觉得云撸猫不过瘾？右下角还有专门的喂食功能哦！
              </p>
              
              <div className="space-y-3 font-heading font-semibold text-sm">
                <div className="flex items-center gap-2.5 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-pet-accent" />
                  <span>支持滚屏人物弹性骨骼位移动效</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-pet-accent" />
                  <span>右下角云互动喂食、抚摸音效与动效</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-pet-accent" />
                  <span>RPG 搞怪性格属性卡与大图相册</span>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href="/demo/goldie" 
                  target="_blank" 
                  className="pet-btn-primary inline-flex bg-[#2D3142] text-white hover:bg-opacity-90 shadow-[#2D3142]/20"
                >
                  去金币的官网玩耍 <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] bg-white rounded-[32px] shadow-2xl border border-gray-100 p-6 flex flex-col justify-between overflow-hidden">
                {/* Glowing backdrop inside frame */}
                <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl -z-10" />
                
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-2.5">
                    <img src="/goldie-avatar.svg" alt="Cat Face" className="w-10 h-10 rounded-full border border-orange-100" />
                    <div>
                      <h4 className="font-heading font-bold text-xs">金币 · Goldie</h4>
                      <p className="text-[10px] text-gray-400 font-medium">长毛橘白</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-pet-primary font-bold px-2 py-0.5 rounded-full bg-orange-50">名片二维码</span>
                </div>

                <div className="my-6 flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-36 h-36 border-4 border-dashed border-orange-100 rounded-full flex items-center justify-center p-3">
                    <img src="/goldie-standing.svg" alt="Standing Goldie" className="w-full h-auto object-contain animate-bounce-slow" />
                  </div>
                  <div className="text-center">
                    <h5 className="font-heading font-black text-sm">“白天睡觉，晚上搬砖”</h5>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">因为妈妈骗我，猫猫多睡觉会变有钱，所以项圈牌都变成黄金的啦</p>
                  </div>
                </div>

                <div className="bg-orange-50/60 p-3 rounded-2xl flex items-center justify-between text-xs font-semibold text-pet-primary font-heading">
                  <span>撸猫度 💖 99+</span>
                  <span>吃小鱼干 🐟 99+</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SERVICE PRICING ===== */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="font-heading font-bold text-pet-primary text-sm uppercase">清晰透明的定价</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black">
              选择适合你宠物的建站套餐
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              一次性制作费用，无额外托管隐形扣费，永久享受 Cloudflare 全球极速静态访问。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricing.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-8 rounded-[32px] border bg-[#FFFDF9] cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  plan.popular 
                    ? "border-pet-primary shadow-xl shadow-pet-primary/5 -translate-y-2" 
                    : "border-gray-200 hover:border-pet-primary/40 hover:-translate-y-1"
                } ${selectedPlan === plan.id ? "ring-2 ring-pet-primary" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-pet-primary text-white font-heading font-bold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider">
                    最受欢迎 RECOMMENDED
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-black text-xl text-[#2D3142]">{plan.name}</h3>
                    <p className="text-gray-400 text-xs mt-1.5 font-medium">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-bold text-lg text-pet-primary">￥</span>
                    <span className="font-heading font-black text-4xl text-[#2D3142]">{plan.price}</span>
                    <span className="text-gray-400 text-xs font-semibold"> / 起</span>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-pet-accent flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button className={`w-full py-3.5 rounded-2xl font-heading font-bold text-xs transition-all ${
                    plan.popular 
                      ? "bg-pet-primary text-white shadow-md shadow-pet-primary/20 hover:opacity-95" 
                      : "bg-[#2D3142] text-white hover:bg-opacity-90"
                  }`}>
                    立即咨询 &amp; 定制
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STEP PROCESS ===== */}
      <section id="process" className="py-20 bg-gradient-to-b from-[#FFFDF9] to-orange-50/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-heading font-black">
              简单 3 步，轻松拥有官网
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              无需任何开发背景，你提供素材与灵感，我们负责代码与上线部署。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center font-heading font-black text-lg text-pet-primary shadow-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-base">提交照片与喜好</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                把宠物最萌的照片、性格、习惯以及一些搞笑的故事段子发给我们（也可自主填写模板表单）。
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center font-heading font-black text-lg text-pet-primary shadow-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-base">定制开发与交互调试</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                我们会量身打造符合宠物调性的配色和 RPG 属性，融入精美的微交互、滚屏猫狗动效。
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-100 flex items-center justify-center font-heading font-black text-lg text-pet-primary shadow-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-base">永久免费云端上线</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                我们将网站做静态打包，免费绑定自定义域名发布到 Cloudflare Pages，终身不用付云服务器费。
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== CTA FOOTER ===== */}
      <footer className="bg-[#2D3142] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <img src="/pet-logo.svg" alt="Logo" className="w-10 h-10 brightness-0 invert" />
            <span className="font-heading text-2xl font-bold tracking-tight">
              PetSite <span className="text-pet-primary">Builder</span>
            </span>
          </div>

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            做你宠物的专属“互联网合伙人”，用充满温情和创意的个人网站，定格毛孩子陪我们走过的灿烂时光。
          </p>

          <div className="flex justify-center gap-6 font-heading text-xs font-semibold text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">产品特色</a>
            <a href="#demo" className="hover:text-white transition-colors">金币的主页Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">制作报价</a>
            <a href="mailto:contact@petsite.pages.dev" className="hover:text-white transition-colors">联系合作</a>
          </div>

          <div className="border-t border-gray-700/60 pt-8 text-[11px] text-gray-500 font-medium flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} PetSite Builder. All rights reserved.</span>
            <span>Made with 🧡 &amp; Next.js for all cute pets around the world.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
