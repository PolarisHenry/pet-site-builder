"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { SequenceManifest } from "@/lib/sequence-loader";
import { createParticle, updateParticle, type Particle } from "@/lib/particle-emitter";

/* ================================================================
   ONE-TIME GSAP INIT
   ================================================================ */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ================================================================
   DATA
   ================================================================ */

const pet = {
  name: "李多多",
  breed: "英短蓝猫",
  age: "2 岁",
  location: "杭州",
  heroLine1: "笑起来很好看",
  heroLine2: "但是掉毛啊",
  bio: "白天窝在阳台晒太阳，晚上准时蹲在门口等人回家。最爱那只快被咬烂的小黄鸭，最讨厌洗澡。",
  stats: [
    { id: "01", label: "战斗力", value: 78, color: "#FF8C42", desc: "夜间跑酷能量瞬间拉满" },
    { id: "02", label: "撒娇指数", value: 92, color: "#FF5D73", desc: "蹭人发动机呼噜声 MAX" },
    { id: "03", label: "睡神等级", value: 85, color: "#A0C4FF", desc: "雷打不动，能睡18小时" },
    { id: "04", label: "聪明才智", value: 88, color: "#4D9078", desc: "精准识别拉开猫罐头的声音" },
  ],
  milestones: [
    { date: "2024.03", title: "第一天到家", text: "在沙发底下躲了一整天。半夜趁人睡着，偷偷爬上床，睡在枕头边。" },
    { date: "2024.06", title: "第一次打疫苗", text: "超勇敢，一声没叫。医生奖励了一根猫条，吃得吧唧嘴。" },
    { date: "2024.10", title: "一岁生日", text: "吃到特制三文鱼蛋糕。开心到满屋子跑酷半小时，然后睡了一整天。" },
    { date: "2025.01", title: "学会了握手", text: "训练三个月终于会了。不过只在有零食的时候才肯伸手，精明的生意人。" },
  ],
};

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function ProShowcase() {
  const lenisRef = useRef<any>(null);

  // Lenis init
  useEffect(() => {
    let rafId: number;
    let lenis: any;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;

      const tick = (time: number) => {
        lenis.raf(time * 1000);
        ScrollTrigger.update();
      };
      gsap.ticker.add(tick);

      // Store ticker ref for cleanup
      (lenis as any).__tick = tick;
      setTimeout(() => ScrollTrigger.refresh(), 200);
    });

    return () => {
      if (lenis && (lenis as any).__tick) {
        gsap.ticker.remove((lenis as any).__tick);
      }
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#FAF8F3] text-[#3A3226] font-body min-h-screen selection:bg-[#FF8C42]/20 selection:text-[#FF8C42]">
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.9) translateY(8px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overflow: clip; }
        .lenis.lenis-stopped { overflow: hidden; }
      `}</style>

      <BackButton />
      <HeroSection lenisRef={lenisRef} />
      <StatusSection />
      <TimelineSection />
      <InteractionWidget />
      <CTASection />
    </div>
  );
}

/* ================================================================
   BACK BUTTON
   ================================================================ */

function BackButton() {
  return (
    <div className="fixed top-6 left-6 z-50">
      <a
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-semibold text-[#8B7E6E] hover:text-[#FF8C42] transition-all shadow-sm border border-[#E8D5C0]/40"
      >
        <ArrowLeft className="w-4 h-4" /> 返回主站
      </a>
    </div>
  );
}

/* ================================================================
   HERO SECTION — Canvas sequence scrub
   ================================================================ */

function HeroSection({ lenisRef }: { lenisRef: any }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesCache = useRef<HTMLImageElement[]>([]);
  const manifestCache = useRef<SequenceManifest | null>(null);
  const [ready, setReady] = useState(false);

  // Load frames once, dedupe via ref
  useEffect(() => {
    if (manifestCache.current && framesCache.current.length > 0) return; // already loaded

    let stopped = false;
    (async () => {
      const res = await fetch("/sequences/hero-wakeup/manifest.json");
      const m: SequenceManifest = await res.json();
      if (stopped) return;
      manifestCache.current = m;

      const frames: HTMLImageElement[] = [];
      for (let i = 1; i <= m.total; i++) {
        if (stopped) break;
        const src = `/sequences/hero-wakeup/frame_${String(i).padStart(3, "0")}.webp`;
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => { frames.push(img); resolve(); };
          img.onerror = () => { frames.push(img); resolve(); };
          img.src = src;
        });
      }

      if (stopped) return;
      framesCache.current = frames;
      setReady(true);
    })();

    return () => { stopped = true; };
  }, []);

  // When DOM is laid out + frames ready, draw frame 0 + wire ScrollTrigger
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    // --- render ---
    const render = (progress: number) => {
      const c = canvasRef.current;
      if (!c) return;
      const m = manifestCache.current;
      const f = framesCache.current;
      if (!m || f.length === 0) return;

      const ctx = c.getContext("2d", { willReadFrequently: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = c.clientWidth;
      const ch = c.clientHeight;
      if (cw <= 0 || ch <= 0) return;

      const pw = Math.floor(cw * dpr);
      const ph = Math.floor(ch * dpr);
      if (c.width !== pw || c.height !== ph) {
        c.width = pw;
        c.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const idx = Math.min(Math.floor(progress * m.total), m.total - 1);
      const img = f[idx];
      if (!img || img.naturalWidth === 0) return;
      const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // Draw initial frame
    render(0);

    // ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate(self) { render(self.progress); },
    });

    gsap.to(".hero-bg-text", {
      x: -100, ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: "+=2000", scrub: 0.5 },
    });
    gsap.to(".hero-text-group", {
      opacity: 0, y: -60, ease: "power2.out",
      scrollTrigger: { trigger: section, start: "top top", end: "+=2000", scrub: 0.5 },
    });
    gsap.to(".hero-canvas-wrap", {
      scale: 0.82, ease: "power1.inOut",
      scrollTrigger: { trigger: section, start: "top top", end: "+=2000", scrub: 0.5 },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if ((t.vars as any)?.trigger === section) t.kill();
      });
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Layer 0: Background massive text */}
      <div
        className="hero-bg-text absolute text-[16vw] font-black text-[#EDE6DA] select-none pointer-events-none z-0 leading-none whitespace-nowrap"
        style={{ fontFamily: "Georgia, serif", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        DUODUO
      </div>

      {/* Layer 1: Canvas */}
      <div className="hero-canvas-wrap relative z-10 flex items-center justify-center w-[55vw] h-[55vw] max-w-[520px] max-h-[520px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,140,66,0.10)_0%,transparent_65%)]" />
        {!ready && (
          <div className="flex flex-col items-center gap-3 z-10 absolute">
            <div className="w-8 h-8 border-2 border-[#FF8C42]/30 border-t-[#FF8C42] rounded-full animate-spin" />
            <span className="text-xs text-[#B8A088]">加载素材中...</span>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full relative z-10" />
      </div>

      {/* Layer 2: Magazine text */}
      <div className="hero-text-group absolute z-20 text-center pointer-events-none" style={{ bottom: "clamp(48px, 12vh, 120px)" }}>
        <div className="text-[10px] tracking-[6px] uppercase text-[#B8A088] mb-5 font-semibold">
          — 英短蓝猫 · {pet.location} —
        </div>
        <h2 className="text-[clamp(32px,6vw,72px)] font-black leading-[1.05] mb-1 tracking-tight px-4" style={{ fontFamily: "Georgia, serif" }}>{pet.heroLine1}</h2>
        <h2 className="text-[clamp(32px,6vw,72px)] font-black leading-[1.05] text-[#FF8C42] tracking-tight px-4" style={{ fontFamily: "Georgia, serif" }}>{pet.heroLine2}</h2>
        <div className="w-14 h-[2px] bg-[#D4C4B0] mx-auto mt-7 mb-6" />
        <p className="text-sm text-[#8B7E6E] max-w-sm mx-auto leading-relaxed px-4">{pet.bio}</p>
      </div>
    </section>
  );
}

/* ================================================================
   STATUS SECTION — RPG stats
   ================================================================ */

function StatusSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const rows = section.querySelectorAll(".status-row");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });

      gsap.fromTo(
        ".status-portrait",
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20 relative overflow-hidden bg-white"
    >
      <div className="absolute right-[-10%] top-[-10%] w-96 h-96 bg-orange-50/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
          <div className="text-center lg:text-left space-y-2">
            <span className="text-[10px] font-bold text-[#FF8C42] uppercase tracking-[4px] bg-[#FFF5EC] px-3 py-1.5 rounded-full inline-block">
              Status · 超能力指标
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-[#3A3226]" style={{ fontFamily: "Georgia, serif" }}>
              {pet.name}的战斗力
            </h3>
          </div>

          <div className="space-y-7">
            {pet.stats.map((s) => (
              <div key={s.id} className="status-row border-b border-[#F0EBE0] pb-5">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-[#D4C4B0] font-mono">{s.id}</span>
                    <span className="text-sm font-bold text-[#3A3226]">{s.label}</span>
                    <span className="hidden lg:inline text-[11px] text-[#B8A088]">// {s.desc}</span>
                  </div>
                  <span className="text-sm font-black font-mono" style={{ color: s.color }}>{s.value}%</span>
                </div>
                <div className="h-[3px] w-full bg-[#F0EBE0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="status-portrait relative max-w-[240px] sm:max-w-[280px] aspect-[4/5] bg-[#FAF8F3] border border-[#E8DDD0] rounded-[32px] p-6 shadow-lg flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/30 via-transparent to-blue-50/20" />
            <img src="/pet/hero-full.png" alt={pet.name} className="w-full h-auto object-contain z-10 drop-shadow-xl" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#FF8C42] shadow-sm border border-[#FFE0C9] z-20">
              Lv.{pet.stats[0].value}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   TIMELINE SECTION — horizontal scrub
   ================================================================ */

function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const scrollAmount = track.scrollWidth - window.innerWidth;

    const st = ScrollTrigger.create({
      trigger: section,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => `+=${Math.max(scrollAmount, 200)}`,
    });

    const tween = gsap.to(track, {
      x: () => -Math.max(scrollAmount, 200),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(scrollAmount, 200)}`,
        scrub: 1,
      },
    });

    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-screen bg-[#FAF8F3] relative overflow-hidden flex flex-col justify-between py-12">
      <div className="pl-6 md:pl-24 z-20 shrink-0">
        <span className="text-[10px] font-bold text-[#FF8C42] uppercase tracking-[4px] bg-[#FFF5EC] px-3 py-1.5 rounded-full inline-block">
          Timeline · 成长日志
        </span>
        <h3 className="text-2xl md:text-4xl font-black text-[#3A3226] mt-3" style={{ fontFamily: "Georgia, serif" }}>
          {pet.name}的故事
        </h3>
        <p className="text-xs text-[#B8A088] mt-1">横向滚动翻阅 🐾</p>
      </div>

      <div ref={trackRef} className="flex gap-16 items-center pl-[25%] pr-[25%] h-[55%] relative whitespace-nowrap z-10">
        <div className="absolute left-0 right-0 h-[2px] border-t-2 border-dashed border-[#E0D0BB] z-0 top-[72%]" />

        {pet.milestones.map((m, i) => (
          <div key={m.date} className="relative inline-block w-[270px] sm:w-[340px] shrink-0 bg-white p-6 rounded-3xl border border-[#E8DDD0] shadow-sm z-20 whitespace-normal -translate-y-[15%]">
            <span className="text-[11px] font-bold font-mono text-[#FF8C42] tracking-wider">{m.date}</span>
            <h4 className="text-base font-bold text-[#3A3226] mt-1.5 mb-2">{m.title}</h4>
            <p className="text-xs text-[#8B7E6E] leading-relaxed">{m.text}</p>
            <div className="absolute left-[38px] bottom-[-45px] w-[2px] h-[45px] border-l-2 border-dashed border-[#E0D0BB]/60 z-0" />
            <div className="absolute left-[35px] bottom-[-49px] w-2 h-2 rounded-full bg-[#FF8C42] z-10" />
          </div>
        ))}
      </div>

      <div className="h-6 shrink-0" />
    </section>
  );
}

/* ================================================================
   INTERACTION WIDGET — bottom-right floating
   ================================================================ */

function InteractionWidget() {
  const [expanded, setExpanded] = useState(false);
  const [petCount, setPetCount] = useState(99);
  const [feedCount, setFeedCount] = useState(76);
  const [happiness, setHappiness] = useState(100);
  const [speech, setSpeech] = useState("呼噜噜... 别吵我睡觉 Zzz");
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef<number>(0);

  const petLines = ["喵呜~ 手法不错！再来！❤️", "呼噜噜，本喵龙颜大悦！", "摸摸头，今晚分你小鱼干！🐟", "手别停，继续继续！"];
  const feedLines = ["嚼嚼嚼... 太好吃啦！🐟", "耶！是零食时间！", "吃了你的鱼，保你发财！💰", "还有吗还有吗！"];

  const spawn = useCallback((char: string, count: number) => {
    setParticles((prev) => [
      ...prev,
      ...Array.from({ length: count }, () => createParticle(0, -20, char)),
    ]);
  }, []);

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;

    let raf: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      setParticles((prev) => {
        if (prev.length === 0) return prev;
        const next = prev.map((p) => updateParticle(p, dt)).filter((p) => p.life > 0);
        return next;
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [particles.length > 0]);

  return (
    <>
      {/* Particle rendering layer — absolutely positioned within the widget area */}
      <div className="fixed bottom-0 right-0 w-80 h-96 pointer-events-none z-[9998] overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={`${i}-${p.life.toFixed(3)}`}
            className="absolute"
            style={{
              left: `calc(80% + ${p.x}px)`,
              bottom: `calc(20% - ${p.y}px)`,
              opacity: Math.max(0, p.life),
              fontSize: `${p.size}px`,
              transform: `rotate(${p.rotation}rad)`,
              transition: "none",
            }}
          >
            {p.char}
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 z-[9999]">
        {/* Speech bubble */}
        <div className="absolute bottom-20 right-0 w-60 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E8DDD0] pointer-events-none transition-all duration-300 origin-bottom-right text-center">
          <p className="text-xs font-semibold text-[#3A3226] leading-relaxed">{speech}</p>
          <div className="absolute bottom-[-8px] right-6 w-3.5 h-3.5 bg-white rotate-45 border-r border-b border-[#E8DDD0]" />
        </div>

        {expanded && (
          <div className="absolute bottom-20 right-0 bg-white p-4 rounded-3xl shadow-2xl border border-[#E8DDD0] flex flex-col gap-3 w-44 animate-pop-in mb-2">
            <div className="text-center border-b border-[#F0EBE0] pb-2">
              <span className="text-[9px] text-[#B8A088] font-bold uppercase tracking-[2px]">互动中心</span>
              <p className="text-[11px] font-bold text-[#FF8C42]">快乐值 💖 {happiness}%</p>
            </div>
            <button
              onClick={() => { setPetCount((p) => p + 1); setHappiness((h) => Math.min(120, h + 5)); setSpeech(petLines[Math.floor(Math.random() * petLines.length)]); spawn("❤️", 12); }}
              className="flex items-center justify-between w-full text-xs font-semibold py-2.5 px-3 hover:bg-orange-50 rounded-xl transition-colors text-[#3A3226]"
            >
              <span>💖 撸它一下</span>
              <span className="bg-orange-100 text-[#FF8C42] text-[10px] px-1.5 py-0.5 rounded-full font-bold">x{petCount}</span>
            </button>
            <button
              onClick={() => { setFeedCount((f) => f + 1); setHappiness((h) => Math.min(120, h + 8)); setSpeech(feedLines[Math.floor(Math.random() * feedLines.length)]); spawn("🐟", 12); }}
              className="flex items-center justify-between w-full text-xs font-semibold py-2.5 px-3 hover:bg-orange-50 rounded-xl transition-colors text-[#3A3226]"
            >
              <span>🐟 喂鱼干</span>
              <span className="bg-orange-100 text-[#FF8C42] text-[10px] px-1.5 py-0.5 rounded-full font-bold">x{feedCount}</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-16 h-16 rounded-full bg-white shadow-xl shadow-[#FF8C42]/10 border-2 border-[#FF8C42]/20 overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 hover:scale-105 ${expanded ? "rotate-12" : ""}`}
        >
          <img src="/pet/hero-full.png" alt="多多" className="w-[130%] h-[130%] object-contain" />
        </button>

        <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#FF5D73] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">!</span>
      </div>
    </>
  );
}

/* ================================================================
   CTA
   ================================================================ */

function CTASection() {
  return (
    <section className="py-24 px-6 text-center max-w-xl mx-auto">
      <div className="bg-[#FFF5EC] border border-[#FFE0C9] rounded-[36px] p-8 md:p-12 space-y-6 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#FF8C42]/8 rounded-full blur-xl -z-10" />
        <span className="text-[10px] font-bold text-[#FF8C42] uppercase tracking-[4px]">— 高定宠物官网 —</span>
        <h3 className="text-xl md:text-2xl font-black text-[#3A3226] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
          为你的毛孩子也做一个<br />专属杂志风主页 💖
        </h3>
        <p className="text-xs text-[#8B7E6E] leading-relaxed max-w-xs mx-auto">只需几张照片与故事碎片，我们为你定制极具杂志质感的宠物品牌级网页</p>
        <a href="/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-bold text-white bg-[#FF8C42] shadow-lg shadow-[#FF8C42]/15 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200">
          了解定制方案 <Sparkles className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
