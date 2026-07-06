"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Trophy, Zap, Moon, Sun, ArrowLeft, Coins } from "lucide-react";

export default function GoldieDemo() {
  // State for interaction widget
  const [petCount, setPetCount] = useState(99);
  const [feedCount, setFeedCount] = useState(88);
  const [happiness, setHappiness] = useState(100);
  const [activeSpeech, setActiveSpeech] = useState("呼噜噜... 别吵我睡觉 (Zzz)");
  const [emojis, setEmojis] = useState<{ id: number; char: string; x: number; y: number }[]>([]);
  const [widgetExpanded, setWidgetExpanded] = useState(false);

  // Scroll tracking for cat bouncing animation
  const [scrollPercent, setScrollPercent] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const timelineHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate how far along the timeline section we are
      const start = rect.top - windowHeight / 2;
      const end = rect.bottom - windowHeight / 2;
      const totalDist = timelineHeight;
      const currentDist = -start;
      
      let progress = currentDist / totalDist;
      progress = Math.max(0, Math.min(1, progress));
      setScrollPercent(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle petting interaction
  const handlePet = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPetCount((prev) => prev + 1);
    setHappiness((prev) => Math.min(120, prev + 5));
    
    // Random cute speech
    const lines = [
      "喵呜~ 手法不错！再来！❤️",
      "呼噜噜，本大人龙颜大悦！",
      "摸摸头，今年暴富！💰",
      "手别停，晚上分你小金鱼！",
    ];
    setActiveSpeech(lines[Math.floor(Math.random() * lines.length)]);

    // Spawn floating emoji
    spawnEmoji("❤️", e.clientX, e.clientY);
  };

  // Handle feeding interaction
  const handleFeed = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFeedCount((prev) => prev + 1);
    setHappiness((prev) => Math.min(120, prev + 8));
    
    const lines = [
      "嚼嚼嚼... 黄金鱼干太美味啦！🐟",
      "这芝士罐头真香，干杯！",
      "吃了你的鱼，保你发大财！💰",
      "饱了饱了，待会去抓发光老鼠！",
    ];
    setActiveSpeech(lines[Math.floor(Math.random() * lines.length)]);

    spawnEmoji("🐟", e.clientX, e.clientY);
  };

  const spawnEmoji = (char: string, clientX: number, clientY: number) => {
    // Generate an offset and spawn coords
    const newEmoji = {
      id: Date.now() + Math.random(),
      char,
      x: clientX ? clientX - 20 : Math.random() * 200 - 100,
      y: clientY ? clientY - 40 : -100,
    };
    setEmojis((prev) => [...prev, newEmoji]);
    
    // Clear emoji after 1.5s
    setTimeout(() => {
      setEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
    }, 1500);
  };

  // Derived style parameters for the scroll sprite cat
  // The cat bounces along a sine wave as the user scrolls
  const stepCount = 3; // Timeline has 3 milestones
  const verticalOffset = scrollPercent * 420; // Maximum vertical scroll track distance
  const bounceY = Math.abs(Math.sin(scrollPercent * Math.PI * 8)) * -24; // Sine bounce effect
  const rotationAngle = Math.sin(scrollPercent * Math.PI * 8) * 8; // Rotate cat slightly while bouncing
  const flipDirection = scrollPercent > 0.6 ? "-scale-x-100" : ""; // Turn cat sprite around half way

  return (
    <div className="bg-[#FFFDF9] text-[#2D3142] min-h-screen relative overflow-x-hidden selection:bg-pet-primary/20 selection:text-pet-primary">
      
      {/* ===== Floating Emojis Portal ===== */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {emojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute font-bold text-2xl animate-float-fade"
            style={{
              left: `${emoji.x}px`,
              top: `${emoji.y}px`,
            }}
          >
            {emoji.char}
          </div>
        ))}
      </div>

      {/* ===== Fixed Back Arrow ===== */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 font-heading font-semibold text-xs hover:text-pet-primary transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> 返回建站官网
        </a>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Sky gradient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] aspect-square bg-[#A0C4FF]/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-100/60 border border-orange-200/40 text-pet-primary font-heading font-bold text-xs">
            💰 金币的专属互联网之家 💰
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-tight">
            金币 · Goldie
          </h1>
          
          <p className="text-sm font-semibold tracking-[0.15em] text-pet-primary font-heading uppercase">
            长毛橘白特工 · 暴富守护神 · 资深觉主
          </p>

          <div className="w-full max-w-[380px] mx-auto aspect-[3/2] bg-white rounded-[32px] shadow-xl p-4 border border-gray-100 flex items-center justify-center card-hover mt-4">
            <img 
              src="/goldie-sleeping.svg" 
              alt="Goldie Curled Up Sleeping" 
              className="w-full h-full object-contain animate-float"
            />
          </div>

          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed pt-2">
            “我每天花 18 个小时睡觉。妈妈告诉我多睡觉会变有钱，我信了。你看我项圈上的金牌，那就是睡出来的，嘿嘿。”
          </p>
        </div>
      </section>

      {/* ===== RPG STATUS SECTION ===== */}
      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-[32px] border border-gray-100 shadow-lg p-6 md:p-8 space-y-6 relative overflow-hidden">
          {/* Subtle decor paw background */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[#FF8C42]/5 rounded-full blur-xl -z-10" />

          <h2 className="font-heading font-black text-lg border-b border-gray-50 pb-4 text-center">
            📊 RPG 角色属性卡 (猫咪视点)
          </h2>

          <div className="space-y-4">
            {/* Status 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-heading text-xs font-bold text-gray-700">
                <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500" /> 白天睡眠深度</span>
                <span>99% / 100%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000 shadow-inner" style={{ width: "99%" }}></div>
              </div>
            </div>

            {/* Status 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-heading text-xs font-bold text-gray-700">
                <span className="flex items-center gap-2"><Moon className="w-4 h-4 text-indigo-500" /> 夜间战力值</span>
                <span>Lv.99</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-inner" style={{ width: "90%" }}></div>
              </div>
            </div>

            {/* Status 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-heading text-xs font-bold text-gray-700">
                <span className="flex items-center gap-2"><Coins className="w-4 h-4 text-yellow-500" /> 吸金/招财指数</span>
                <span>MAX</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-1000 shadow-inner" style={{ width: "100%" }}></div>
              </div>
            </div>

            {/* Status 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-heading text-xs font-bold text-gray-700">
                <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> 情绪饱满度</span>
                <span>{happiness}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
                <div className="h-full bg-rose-400 rounded-full transition-all duration-300 shadow-inner" style={{ width: `${Math.min(100, happiness)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE STORY SECTION WITH SCROLL CHARACTER ===== */}
      <section ref={timelineRef} className="py-20 px-6 max-w-2xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-heading font-black">📅 金币的 24 小时工作日志</h2>
          <p className="text-gray-400 text-xs mt-1">滚动页面，看小猫在时间线中跑酷</p>
        </div>

        {/* Scroll Character Animation Track */}
        <div className="absolute left-6 top-[200px] bottom-[150px] w-0.5 bg-dashed bg-orange-200 pointer-events-none">
          {/* Sprite Wrapper */}
          <div 
            className="absolute left-[-24px] w-12 h-12 pointer-events-none transition-transform duration-100 ease-out z-20"
            style={{
              transform: `translateY(${verticalOffset}px) translateY(${bounceY}px) rotate(${rotationAngle}deg)`,
            }}
          >
            <div className={`w-full h-full transition-transform duration-300 ${flipDirection}`}>
              <img src="/goldie-standing.svg" alt="Standing sprite" className="w-full h-full object-contain" />
            </div>
            {/* Tiny pawprint trail */}
            <div className="absolute bottom-[-10px] left-4 font-bold text-orange-400 text-[10px] opacity-75">🐾</div>
          </div>
        </div>

        <div className="space-y-36 pl-16 relative">
          
          {/* Milestone 1 */}
          <div className="relative space-y-3">
            <div className="absolute left-[-56px] top-1.5 w-6 h-6 rounded-full bg-amber-400 border-4 border-white shadow-sm flex items-center justify-center text-white z-10">
              <Sun className="w-3 h-3" />
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <h3 className="font-heading font-black text-sm text-[#2D3142]">9:00 - 18:00 白天全面睡大觉</h3>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                这是“金币”最忙碌的时间。他在沙发底、猫窝或空调机顶进入深度睡眠模式。因为“睡得越香，有钱指数越高”。在此期间，他将呼吸频率调至最低，耳后绒毛会微微颤动，表示数据正在加载。
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="relative space-y-3">
            <div className="absolute left-[-56px] top-1.5 w-6 h-6 rounded-full bg-orange-400 border-4 border-white shadow-sm flex items-center justify-center text-white z-10">
              <Zap className="w-3 h-3" />
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <h3 className="font-heading font-black text-sm text-[#2D3142]">18:00 - 21:00 项圈封印解除</h3>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                夕阳西下，金币缓缓睁开眼，伸一个大懒腰。随着他脖子上的“纯金项圈”发出清脆的响声，他在这一阶段将重新获得满额战斗力。他会跳到桌子上，傲慢地用爪子推翻水杯，以此测试地心引力是否正常工作。
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="relative space-y-3">
            <div className="absolute left-[-56px] top-1.5 w-6 h-6 rounded-full bg-indigo-500 border-4 border-white shadow-sm flex items-center justify-center text-white z-10">
              <Moon className="w-3 h-3" />
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <h3 className="font-heading font-black text-sm text-[#2D3142]">21:00 - 05:00 夜间跑酷特工</h3>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                这是属于他的特工时刻。他在客厅进行百米冲刺，追逐看不见的“量子光点”。伴随“腾空翻身”和“踩墙反弹”，他将整个屋子当作自己的夜总会。在此期间，他会去铲屎官被窝踩奶，确保铲屎官明天的工资能顺利结算。
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="py-20 px-6 bg-gradient-to-t from-orange-50/40 via-white to-transparent text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-heading font-black">
          觉得金币的主页很有意思？
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          你也可以通过几张日常照片，为你的猫咪/狗狗/鹦鹉甚至仓鼠定制这样一套炫酷的官方简历哦！
        </p>
        <div className="pt-2">
          <a href="/" className="pet-btn-primary inline-flex">
            定制我宠物的官网
          </a>
        </div>
      </section>

      {/* ===== INTERACTIVE FLOATING PET WIDGET ===== */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Speech Balloon popup */}
        <div className="absolute bottom-20 right-0 w-64 bg-white p-3 rounded-2xl shadow-xl border border-orange-50 font-heading font-semibold text-xs text-gray-700 pointer-events-none transform transition-all duration-300 origin-bottom-right opacity-95 flex items-center justify-center text-center">
          <div className="relative">
            {activeSpeech}
            {/* Triangle indicator */}
            <div className="absolute bottom-[-16px] right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-orange-50" />
          </div>
        </div>

        {/* Floating action sheet */}
        {widgetExpanded && (
          <div className="absolute bottom-20 right-0 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 flex flex-col gap-3.5 w-44 animate-pop-in">
            <div className="text-center border-b border-gray-50 pb-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">互动中心</span>
              <p className="text-[11px] font-heading font-bold text-pet-primary">快乐值 💖 {happiness}%</p>
            </div>
            
            <button 
              onClick={handlePet}
              className="flex items-center justify-between w-full text-xs font-semibold py-2 px-3 hover:bg-orange-50 rounded-xl transition-colors text-left"
            >
              <span>💖 撸它一下</span>
              <span className="bg-orange-100 text-pet-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">x{petCount}</span>
            </button>

            <button 
              onClick={handleFeed}
              className="flex items-center justify-between w-full text-xs font-semibold py-2 px-3 hover:bg-orange-50 rounded-xl transition-colors text-left"
            >
              <span>🐟 喂鱼干</span>
              <span className="bg-orange-100 text-pet-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">x{feedCount}</span>
            </button>
          </div>
        )}

        {/* The clickable avatar controller */}
        <button 
          onClick={() => setWidgetExpanded(!widgetExpanded)}
          className={`w-16 h-16 rounded-full bg-white shadow-xl shadow-orange-500/10 border-2 border-pet-primary/30 overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-90 hover:scale-105 ${
            widgetExpanded ? "rotate-12" : ""
          }`}
        >
          <img src="/goldie-avatar.svg" alt="Pet Controller" className="w-[125%] h-[125%] object-cover object-center" />
        </button>

        {/* Small notification badge */}
        <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white animate-pulse">
          !
        </span>

      </div>

      <style jsx global>{`
        @keyframes float-fade {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(1.2);
            opacity: 0;
          }
        }
        .animate-float-fade {
          animation: float-fade 1.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
      `}</style>

    </div>
  );
}
