"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Calendar, Heart, Sparkles, Smile, Moon, Zap, Shield, Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function MyPetDemo() {
  // Interaction states
  const [likes, setLikes] = useState(2045);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showFollowBubble, setShowFollowBubble] = useState(false);
  const [emojis, setEmojis] = useState<{ id: number; char: string; x: number; y: number }[]>([]);

  // Canvas States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackImageRef = useRef<HTMLImageElement | null>(null);

  // Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // Render Canvas Frame (Smooth Physics Mode - No cheap pendulum wiggles)
  const renderCanvasFrame = (progress: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (fallbackImageRef.current) {
      const img = fallbackImageRef.current;
      
      ctx.save();
      // Center translation
      ctx.translate(canvas.width / 2, canvas.height / 2 + 10); 
      
      // Premium 3D-like hover float: Only translation and scale, NO cheap-looking rotation swings
      const scale = 1 + Math.sin(progress * Math.PI) * 0.035;
      const translateY = Math.sin(progress * Math.PI) * -15; // smooth upward levitation
      
      ctx.scale(scale, scale);
      ctx.translate(0, translateY);

      const w = canvas.width * 0.72;
      const h = (img.height / img.width) * w;
      
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  };

  // Load Fallback Image
  useEffect(() => {
    let active = true;
    const fallback = new Image();
    fallback.src = "/pet-transparent.png";
    fallback.onload = () => {
      if (active) {
        fallbackImageRef.current = fallback;
        renderCanvasFrame(0); 
      }
    };
    return () => {
      active = false;
    };
  }, []);

  // Initialize GSAP & Lenis Smooth Scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // 1. Lenis Smooth Scroll Setup
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on("scroll", ScrollTrigger.update);

      const updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateTicker);

      // 2. Hero Section Apple-style Scroll Pinning & Timeline Scrubbing
      if (heroRef.current) {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "+=1200", 
            pin: true, 
            scrub: 0.5, 
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              renderCanvasFrame(self.progress);
            },
          },
        });

        // Parallel animations inside the pinned scroll height
        heroTimeline.to(".hero-bg-text", { x: -140, ease: "none" }, 0);
        heroTimeline.to(".hero-sparkle-1", { y: -100, ease: "none" }, 0);
        heroTimeline.to(".hero-sparkle-2", { y: -50, ease: "none" }, 0);
        heroTimeline.to(".hero-text-block", { opacity: 0, y: -50, ease: "power1.out" }, 0);
        heroTimeline.to(".hero-bed-container", { scale: 0.92, ease: "power1.inOut" }, 0);
      }

      // 3. Section 2: Attributes Rows ScrollReveal
      const rows = gsap.utils.toArray(".attribute-row");
      rows.forEach((row: any) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Side portrait cutout wiggles on screen enter
      gsap.fromTo(
        ".attributes-cat-image",
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".attributes-section",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 4. Section 3: Horizontal Timeline Pinning (Fixed overlapping rails and collision)
      if (horizontalSectionRef.current && horizontalTrackRef.current) {
        const trackWidth = horizontalTrackRef.current.scrollWidth;
        const scrollAmount = trackWidth - window.innerWidth;

        gsap.to(horizontalTrackRef.current, {
          x: -scrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollAmount}`,
            invalidateOnRefresh: true,
          },
        });

        // Scrub sprite cat runner wiggles along track line
        gsap.fromTo(
          ".horizontal-cat-sprite",
          { x: 0 },
          {
            x: scrollAmount + window.innerWidth * 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: horizontalSectionRef.current,
              start: "top top",
              end: () => `+=${scrollAmount}`,
              scrub: 1,
            },
          }
        );
      }

      // Cleanup ticker and triggers
      return () => {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  // Points & emoji clicks
  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLikes((prev) => prev + 1);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);

    const rect = e.currentTarget.getBoundingClientRect();
    spawnEmoji("❤️", rect.left + rect.width / 2, rect.top);
  };

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    if (!isFollowed) {
      setShowFollowBubble(true);
      setTimeout(() => setShowFollowBubble(false), 3000);
    }
  };

  const spawnEmoji = (char: string, clientX: number, clientY: number) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      char,
      x: clientX ? clientX - 10 : Math.random() * 200 - 100,
      y: clientY ? clientY - 30 : -100,
    };
    setEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
    }, 1200);
  };

  const pet = {
    name: "李多多",
    breed: "英短蓝猫",
    age: "2 岁",
    location: "杭州",
    joined: "2024 年 3 月",
    bio: "白天窝在阳台晒太阳，晚上准时蹲在门口等人回家。最爱那只快被咬烂的小黄鸭，最讨厌洗澡。",
    stats: [
      { id: "01", label: "战斗力", value: 78, c: "#FF8C42", desc: "夜间跑酷能量瞬间拉满" },
      { id: "02", label: "撒娇指数", value: 92, c: "#FF5D73", desc: "蹭人发动机呼噜声" },
      { id: "03", label: "睡神等级", value: 85, c: "#A0C4FF", desc: "雷打不动，能睡18小时" },
      { id: "04", label: "聪明才智", value: 88, c: "#4D9078", desc: "准确辨识拉开猫罐头的声音" },
    ],
    milestones: [
      { date: "2024.03", title: "第一天到家", text: "在沙发底下躲了一整天。半夜趁人睡着，偷偷爬上床，睡在枕头边。" },
      { date: "2024.06", title: "第一次打疫苗", text: "超勇敢，一声没叫。医生奖励了一根猫条，吃得吧唧嘴，从此爱上了去医院。" },
      { date: "2024.10", title: "一岁生日", text: "吃到特制三文鱼蛋糕。开心到满屋子跑酷半小时，然后睡了一整天。" },
      { date: "2025.01", title: "学会了握手", text: "训练三个月终于会了。不过只在有零食的时候才肯伸手，是个精明的生意人。" },
    ],
  };

  const ZzzGraphic = () => (
    <svg width="130" height="70" viewBox="0 0 130 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="select-none">
      <defs>
        <pattern id="zebra-stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="12" fill="#2C303E" />
          <rect x="6" width="6" height="12" fill="#FAF6EE" />
        </pattern>
      </defs>
      <g transform="translate(10, 48) rotate(-8)">
        <text x="0" y="0" className="font-heading font-black" fontSize="56" fill="url(#zebra-stripes)" stroke="#2C303E" strokeWidth="3" strokeLinejoin="round">Z</text>
      </g>
      <g transform="translate(56, 38) rotate(6)">
        <text x="0" y="0" className="font-heading font-black" fontSize="36" fill="#FF8C42" stroke="#2C303E" strokeWidth="2.5" strokeLinejoin="round">Z</text>
      </g>
      <g transform="translate(90, 28) rotate(-4)">
        <text x="0" y="0" className="font-heading font-black" fontSize="24" fill="#F9C784">z</text>
      </g>
      <g transform="translate(112, 22) rotate(8)">
        <text x="0" y="0" className="font-heading font-black" fontSize="16" fill="#FFE5A3">z</text>
      </g>
    </svg>
  );

  const PixelCrocodile = () => (
    <svg width="56" height="56" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-full shadow-inner select-none">
      <circle cx="30" cy="30" r="30" fill="#3D8EBA" />
      <g transform="translate(10, 10)">
        <rect x="2" y="10" width="34" height="14" fill="#4CAF50" />
        <rect x="6" y="6" width="26" height="4" fill="#4CAF50" />
        <rect x="12" y="2" width="14" height="4" fill="#4CAF50" />
        <rect x="2" y="20" width="34" height="4" fill="#388E3C" />
        <rect x="32" y="10" width="4" height="10" fill="#388E3C" />
        <rect x="10" y="2" width="4" height="4" fill="#FFFFFF" />
        <rect x="12" y="4" width="2" height="2" fill="#000000" />
        <rect x="16" y="2" width="4" height="4" fill="#FFFFFF" />
        <rect x="18" y="4" width="2" height="2" fill="#000000" />
        <rect x="30" y="8" width="2" height="2" fill="#1B5E20" />
        <rect x="14" y="22" width="2" height="2" fill="#FFFFFF" />
        <rect x="20" y="22" width="2" height="2" fill="#FFFFFF" />
        <rect x="26" y="22" width="2" height="2" fill="#FFFFFF" />
        <rect x="32" y="22" width="2" height="2" fill="#FFFFFF" />
        <rect x="6" y="12" width="4" height="2" fill="#FF8A80" />
      </g>
    </svg>
  );

  return (
    <div ref={containerRef} className="bg-[#FAF6EE] text-[#2D3142] font-body selection:bg-pet-primary/20 relative min-h-screen">
      
      {/* Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {emojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute font-bold text-3xl animate-float-fade"
            style={{ left: `${emoji.x}px`, top: `${emoji.y}px` }}
          >
            {emoji.char}
          </div>
        ))}
      </div>

      {/* Glass Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-heading font-semibold text-gray-500 hover:text-pet-primary transition-all shadow-sm border border-gray-150/40"
        >
          <ArrowLeft className="w-4 h-4" /> 返回主站
        </a>
      </div>

      {/* ================================================================ */}
      {/* SECTION 1: HERO SPOTLIGHT (Editorial magazine card layout)        */}
      {/* ================================================================ */}
      <section ref={heroRef} className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 md:px-12 py-16">
        
        {/* Massive background text layered BEHIND the cat */}
        <div className="hero-bg-text absolute text-[16vw] font-heading font-black text-[#F2ECE0] select-none pointer-events-none z-0 tracking-widest leading-none left-[5%] top-1/2 -translate-y-1/2 whitespace-nowrap">
          DUODUO
        </div>

        {/* Sparkles Parallax */}
        <div className="hero-sparkle-1 absolute left-[8%] top-[18%] text-amber-400 opacity-60 w-5 h-5">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" /></svg>
        </div>
        <div className="hero-sparkle-2 absolute left-[45%] bottom-[12%] text-amber-400 opacity-50 w-4 h-4">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" /></svg>
        </div>
        <div className="hero-sparkle-1 absolute right-[25%] top-[10%] text-amber-400 opacity-60 w-6 h-6">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" /></svg>
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Block: Editorial Typography */}
          <div className="hero-text-block lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-1 pt-4 lg:pt-0">
            <div className="space-y-1">
              <span className="text-xs font-heading font-bold text-gray-400 tracking-widest block uppercase">
                — NAP · 补觉
              </span>
              <div className="pt-1 flex justify-center lg:justify-start">
                <ZzzGraphic />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#2D3142] tracking-tight leading-none">
                对对对，喜欢
              </h1>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-[#FF8C42] tracking-tight leading-none">
                白天睡觉晚上行动
              </h2>
            </div>

            <div className="border-l-0 lg:border-l-[3px] border-orange-200 pl-0 lg:pl-4 py-1">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed tracking-wide font-medium whitespace-pre-line">
                {`因为麻麻骗他小猫
                  多睡觉会变有钱，
                  所以多多项圈牌都
                  变成黄金的啦哈哈`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 bg-amber-500/5 px-3.5 py-1.5 rounded-full border border-amber-500/10">
                <Sparkles className="w-3.5 h-3.5" /> 招财体质 MAX
              </div>
            </div>
          </div>

          {/* Right Block: 3D Oval Fluffy Bed + HTML5 Canvas Centered Container */}
          <div className="hero-bed-container lg:col-span-7 flex justify-center items-center order-1 lg:order-2">
            
            {/* The relative base box sized for an ellipse bed */}
            <div className="relative w-[290px] h-[190px] sm:w-[380px] sm:h-[240px] md:w-[460px] md:h-[280px] flex items-center justify-center">
              
              {/* 3D Oval Fluffy Bed Rim */}
              <div className="absolute w-full h-full rounded-[50%] bg-[#D5E6F5] border-[8px] sm:border-[10px] border-[#E8F3FD] shadow-[0_20px_45px_rgba(162,210,255,0.4),_inset_0_-15px_25px_rgba(100,149,237,0.2),_inset_0_15px_20px_rgba(255,255,255,0.8)] transform rotate-[2deg] animate-float" />
              
              {/* Inner Cushion ellipse */}
              <div className="absolute w-[82%] h-[78%] rounded-[50%] bg-white/40 backdrop-blur-[1px] shadow-[inset_0_6px_12px_rgba(100,149,237,0.08)] flex items-center justify-center overflow-hidden" />

              {/* Realistic Shadow beneath the cat inside the bed */}
              <div className="absolute bottom-[24%] w-[48%] h-[12%] bg-black/12 rounded-[50%] blur-sm z-10" />

              {/* 100% Responsive Centered Canvas Wrapper Container */}
              <div className="absolute w-[56%] h-[78%] bottom-[16%] left-[22%] flex items-center justify-center z-20 pointer-events-none">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain select-none pointer-events-none"
                />
              </div>

              {/* Top-Right Heart bubble badge */}
              <div className="absolute top-[2%] right-[2%] sm:right-[6%] z-30 animate-bounce-slow">
                <div className="relative bg-white border border-[#E9D5C3] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-2xl shadow-[0_6px_14px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform group">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-[-6px] left-3 sm:left-4 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-[#E9D5C3]" />
                </div>
              </div>

              {/* Crocodile Follow badge */}
              <div className="absolute top-[34%] -right-[2%] sm:-right-[6%] z-30 flex flex-col items-center">
                {showFollowBubble && (
                  <div className="absolute bottom-16 right-0 bg-white px-3 py-1 rounded-xl border border-gray-150 shadow-md text-[10px] font-bold text-[#2D3142] whitespace-nowrap animate-pop-in">
                    谢谢关注！🐾
                  </div>
                )}
                
                <div className="relative cursor-pointer hover:scale-105 transition-transform">
                  <div className="border-[2px] sm:border-[3px] border-white rounded-full bg-white shadow-md">
                    <PixelCrocodile />
                  </div>
                  
                  <button
                    onClick={handleFollow}
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-[1.5px] sm:border-2 border-white shadow-sm text-white text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isFollowed 
                        ? "bg-gray-400 hover:bg-gray-500" 
                        : "bg-[#FF5D73] hover:bg-[#FF435D] hover:scale-110"
                    }`}
                  >
                    {isFollowed ? <Check className="w-3.5 h-3.5" /> : "+"}
                  </button>
                </div>
              </div>

              {/* Heart Likes button */}
              <div className="absolute -bottom-[8%] right-[4%] sm:right-[8%] z-30">
                <button
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:scale-105 transition-transform ${
                    isWiggling ? "animate-wiggle" : ""
                  }`}>
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5D73] fill-[#FF5D73] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 font-mono tracking-wider">
                    {likes}
                  </span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: ATTRIBUTES (High-end Editorial Layout)                */}
      {/* ================================================================ */}
      <section className="attributes-section min-h-screen flex items-center justify-center px-6 md:px-12 py-20 relative bg-white overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Interactive attribute lists */}
          <div className="lg:col-span-7 space-y-12 order-2 lg:order-1">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-heading font-black text-pet-primary uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full inline-block">
                Status
              </span>
              <h3 className="text-3xl md:text-4xl font-heading font-black text-[#2D3142]">
                多多的超能力指标
              </h3>
            </div>

            <div className="space-y-8">
              {pet.stats.map((s) => (
                <div key={s.label} className="attribute-row space-y-2 border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black font-mono text-gray-300">{s.id}</span>
                      <span className="text-sm font-bold text-gray-700 font-heading">{s.label}</span>
                      <span className="text-[11px] text-gray-400 font-medium opacity-0 lg:opacity-100 transition-opacity duration-300">
                        // {s.desc}
                      </span>
                    </div>
                    <span className="text-sm font-black font-mono" style={{ color: s.c }}>
                      {s.value}%
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                      style={{ width: `${s.value}%`, backgroundColor: s.c }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: Large Cutout Cat looking at the text */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="attributes-cat-image relative max-w-[240px] sm:max-w-[280px] md:max-w-[340px] aspect-[4/5] bg-[#FAF8F5] border border-gray-150/70 rounded-[32px] p-6 shadow-md flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/20 via-transparent to-blue-50/20" />
              <img
                src="/pet-transparent.png"
                alt="Li Duoduo"
                className="w-full h-auto object-contain z-10 drop-shadow-xl transform -scale-x-100"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: TIMELINE (GSAP Horizontal Scroll Pinning)             */}
      {/* ================================================================ */}
      <section ref={horizontalSectionRef} className="h-screen bg-[#FAF6EE] relative overflow-hidden flex flex-col justify-between py-12 md:py-16">
        
        {/* Section title (static at the top) */}
        <div className="pl-6 md:pl-24 z-20">
          <span className="text-xs font-heading font-black text-pet-primary uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Timeline
          </span>
          <h3 className="text-xl md:text-3xl font-heading font-black text-[#2D3142] mt-2">
            多多的成长日志
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            滚动滚轮，横向滑动查看故事轴 🐾
          </p>
        </div>

        {/* Horizontal Track container */}
        <div ref={horizontalTrackRef} className="flex gap-20 items-center pl-[25%] pr-[25%] h-[60%] relative whitespace-nowrap z-10">
          
          {/* Horizontal dotted line at bottom of container (75% top height) */}
          <div className="absolute left-0 right-0 h-[2px] border-t-2 border-dashed border-orange-200 z-0 top-[75%]" />

          {/* Clean cat runner sprite on the dotted line (no cheap rotation) */}
          <div className="horizontal-cat-sprite absolute w-16 h-16 z-10 top-[62%] pointer-events-none">
            <img
              src="/pet-transparent.png"
              alt=""
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Milestone Cards floating elegantly in the upper half of horizontal track */}
          {pet.milestones.map((m) => (
            <div key={m.date} className="timeline-card relative inline-block w-[280px] sm:w-[350px] shrink-0 bg-white p-6 rounded-3xl border border-gray-150/70 shadow-sm z-20 whitespace-normal transform translate-y-[-20%]">
              <span className="text-xs font-bold font-mono text-orange-400 tracking-wider">
                {m.date}
              </span>
              <h4 className="text-base font-heading font-black text-[#2D3142] mt-1.5 mb-2">
                {m.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {m.text}
              </p>
              
              {/* Connecting vertical line down to the rail */}
              <div className="absolute left-[38px] bottom-[-45px] w-[2px] h-[45px] border-l-2 border-dashed border-orange-200/60 z-0" />
              {/* Small node dot sitting directly on the rail */}
              <div className="absolute left-[35px] bottom-[-49px] w-2 h-2 rounded-full bg-orange-400 z-10" />
            </div>
          ))}

        </div>

        {/* Spacer for bottom layout balancing */}
        <div className="h-6" />
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: CALL TO ACTION                                        */}
      {/* ================================================================ */}
      <section className="py-24 px-6 text-center max-w-xl mx-auto">
        <div className="bg-[#FF8C42]/5 border border-[#FF8C42]/10 rounded-[36px] p-8 md:p-12 space-y-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#FF8C42]/10 rounded-full blur-xl -z-10" />
          
          <h3 className="text-xl md:text-2xl font-heading font-black tracking-tight leading-snug">
            为你的毛孩子也做一个
            <br />
            专属高定主页 💖
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
            只需几张照片与故事碎片，我们将为你定制极其精美、极具商业观感的宠物品牌级网页！
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-heading font-bold text-white bg-pet-primary shadow-lg shadow-pet-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              了解定制方案
            </a>
          </div>
        </div>
      </section>

      {/* Animations global styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.8deg); }
        }
        .animate-float {
          animation: float 4.5s ease-in-out infinite;
        }

        @keyframes float-fade {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-90px) scale(1.3) rotate(12deg);
            opacity: 0;
          }
        }
        .animate-float-fade {
          animation: float-fade 1.1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes wiggle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-8deg); }
          75% { transform: scale(1.1) rotate(8deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out;
        }

        @keyframes pop-in {
          0% { transform: scale(0.9) translateY(5px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Lenis smooth scrolling compatibility */
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overflow: clip;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
      `}</style>

    </div>
  );
}
