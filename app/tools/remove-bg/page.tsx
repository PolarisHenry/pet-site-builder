"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Download,
  ImageIcon,
  Loader2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  RefreshCcw,
  Zap,
  ShieldCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Stage = "idle" | "downloading-model" | "processing" | "done" | "error";

interface ProgressInfo {
  key: string;
  current: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function RemoveBgPage() {
  // State
  const [stage, setStage] = useState<Stage>("idle");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);

  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // Cleanup object URLs on unmount
  // -------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Validate file
  // -------------------------------------------------------------------------
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return "仅支持 JPG、PNG、WebP 和 AVIF 格式的图片";
      }
      if (file.size > MAX_FILE_SIZE) {
        return `图片过大（${formatBytes(file.size)}），请上传小于 15MB 的图片`;
      }
      return null;
    },
    [],
  );

  // -------------------------------------------------------------------------
  // Core: remove background
  // -------------------------------------------------------------------------
  const processImage = useCallback(async (file: File) => {
    // Clean up previous result
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      setResultBlob(null);
    }

    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      setStage("error");
      return;
    }

    // Show original preview
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setOriginalSize(file.size);
    setErrorMsg(null);

    try {
      // Dynamically import the library (it's heavy, only load when needed)
      setStage("downloading-model");
      setProgress({ key: "AI 模型 & 引擎", current: 0, total: 100 });

      const { removeBackground } = await import("@imgly/background-removal");

      const config = {
        debug: false,
        model: "isnet_quint8" as const, // Fastest model, good enough for pets
        output: {
          format: "image/png" as const,
          quality: 1.0,
          type: "foreground" as const,
        },
        progress: (key: string, current: number, total: number) => {
          setProgress({ key, current, total });
        },
        device: "gpu" as const, // Use GPU if available for faster processing
      };

      setStage("processing");
      const blob: Blob = await removeBackground(file, config);

      const resultUrl_ = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(resultUrl_);
      setStage("done");
    } catch (e: any) {
      console.error("Background removal failed:", e);
      setErrorMsg(e.message || "AI 处理失败，请重试");
      setStage("error");
    }
  }, [validateFile, originalUrl, resultUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      processImage(file);
    },
    [processImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleReset = () => {
    setStage("idle");
    setErrorMsg(null);
    setProgress(null);
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url_ = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url_;
    a.download = "pet-transparent.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url_);
  };

  // -------------------------------------------------------------------------
  // Derive progress percentage
  // -------------------------------------------------------------------------
  const progressPercent =
    progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="bg-[#FFFDF9] text-[#2D3142] min-h-screen selection:bg-pet-primary/20 selection:text-pet-primary">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-orange-50 font-heading font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回官网
          </a>
          <a
            href="/"
            className="flex items-center gap-2"
          >
            <img src="/pet-logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="font-heading text-lg font-bold">
              PetSite <span className="text-pet-primary">Builder</span>
            </span>
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/60 border border-orange-200/40 text-pet-primary font-heading font-bold text-xs mb-4">
          <Sparkles className="w-3.5 h-3.5" /> 免费在线工具
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-tight">
          AI 宠物照片一键抠图
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto mt-3 leading-relaxed">
          上传你家宠物的照片，AI 自动识别并去除背景，输出透明 PNG。
          <br />
          <span className="text-gray-400 text-xs">
            完全在浏览器本地处理，不上传任何数据到服务器
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pet-accent" />
            隐私安全 · 本地处理
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            AI 驱动 · 秒级出图
          </span>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative rounded-[36px] border-2 border-dashed transition-all duration-300 overflow-hidden",
            stage === "done"
              ? "border-pet-accent/40 bg-green-50/20"
              : stage === "error"
                ? "border-red-200 bg-red-50/20"
                : dragOver
                  ? "border-pet-primary bg-orange-50/40 scale-[1.01] shadow-xl"
                  : "border-gray-200 bg-white hover:border-pet-primary/30",
          )}
        >
          {/* ---- IDLE / UPLOAD ---- */}
          {(stage === "idle" || stage === "error") && (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center space-y-5">
              {stage === "error" ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-red-600">
                    处理失败
                  </h3>
                  <p className="text-sm text-red-500 max-w-sm">{errorMsg}</p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="pet-btn-secondary text-xs py-2 px-5"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" /> 重新上传
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="pet-btn-primary text-xs py-2 px-5"
                    >
                      <Upload className="w-3.5 h-3.5" /> 换一张试试
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center transition-all",
                      dragOver ? "bg-orange-100 scale-110" : "bg-orange-50",
                    )}
                  >
                    {dragOver ? (
                      <ImageIcon className="w-10 h-10 text-pet-primary animate-bounce-slow" />
                    ) : (
                      <Upload className="w-9 h-9 text-pet-primary/60" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-[#2D3142]">
                      {dragOver ? "松手即可上传 ✨" : "拖拽宠物照片到此处"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      或点击下方按钮选择图片
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="pet-btn-primary"
                  >
                    <Upload className="w-4 h-4" /> 选择宠物照片
                  </button>
                  <p className="text-[10px] text-gray-400 pt-1">
                    支持 JPG / PNG / WebP，最大 15MB
                  </p>
                </>
              )}
            </div>
          )}

          {/* ---- PROCESSING ---- */}
          {(stage === "downloading-model" || stage === "processing") && (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center space-y-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-pet-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-3 max-w-sm w-full">
                <h3 className="font-heading font-bold text-lg text-[#2D3142]">
                  {stage === "downloading-model"
                    ? "正在加载 AI 模型..."
                    : "AI 正在识别宠物..."}
                </h3>
                {stage === "downloading-model" && (
                  <p className="text-xs text-gray-400">
                    首次使用需下载 AI 引擎（约 40MB），下次即开即用
                  </p>
                )}
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pet-primary to-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {progress && (
                  <p className="text-[10px] text-gray-400 font-mono">
                    {progress.key} · {progressPercent}%
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ---- DONE: Before/After ---- */}
          {stage === "done" && originalUrl && resultUrl && (
            <div className="p-6 sm:p-10">
              {/* Success banner */}
              <div className="flex items-center gap-2 text-pet-accent font-heading font-bold text-sm mb-6">
                <CheckCircle2 className="w-4 h-4" />
                去背景完成！
              </div>

              {/* Image comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                      原图
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatBytes(originalSize)}
                    </span>
                  </div>
                  <div className="aspect-square rounded-2xl bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFklEQVQ4y2P8z8BQz0BKYBg1YNQAWgYF9QEALl0B/wAAAABJRU5ErkJggg==')] bg-repeat border border-gray-100 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={originalUrl}
                      alt="原始图片"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                    />
                  </div>
                </div>

                {/* Result */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-pet-accent uppercase tracking-wider">
                      透明背景 ✨
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {resultBlob ? formatBytes(resultBlob.size) : ""}
                    </span>
                  </div>
                  <div className="aspect-square rounded-2xl bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFklEQVQ4y2P8z8BQz0BKYBg1YNQAWgYF9QEALl0B/wAAAABJRU5ErkJggg==')] bg-repeat border border-pet-accent/20 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={resultUrl}
                      alt="去背景后"
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-8 justify-center">
                <button
                  onClick={handleDownload}
                  className="pet-btn-primary bg-pet-accent shadow-pet-accent/20"
                >
                  <Download className="w-4 h-4" /> 下载透明 PNG
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="pet-btn-secondary"
                >
                  <RefreshCcw className="w-4 h-4" /> 再处理一张
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== CTA: Link to build service ===== */}
        {stage === "done" && (
          <div className="mt-10 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-[32px] p-8 text-center border border-orange-100 space-y-4 animate-slide-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-pet-primary text-[11px] font-heading font-bold">
              🐾 下一步
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black">
              有了透明图片，给它做一个专属官网吧！
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              把抠好的宠物照片嵌入动态网页，配合 RPG 属性卡、滚屏蹦跳动效和云撸宠互动挂件。
            </p>
            <a href="/" className="pet-btn-primary inline-flex">
              了解更多 <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>
          </div>
        )}
      </section>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
}
