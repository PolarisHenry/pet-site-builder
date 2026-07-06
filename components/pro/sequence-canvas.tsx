"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  loadManifest,
  preloadFrames,
  getFrameIndex,
  SequenceManifest,
} from "@/lib/sequence-loader";

type SequenceCanvasProps = {
  sequencePath: string;
  className?: string;
  onProgress?: (progress: number) => void;
  onReady?: (manifest: SequenceManifest) => void;
};

export default function SequenceCanvas({
  sequencePath,
  className,
  onProgress,
  onReady,
}: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const manifestRef = useRef<SequenceManifest | null>(null);
  const isReadyRef = useRef(false);

  const renderFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const manifest = manifestRef.current;
    if (!canvas || !manifest || framesRef.current.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const frameIndex = getFrameIndex(progress, manifest.total);
    const img = framesRef.current[frameIndex];
    if (!img) return;

    const scale = Math.min(rect.width / img.width, rect.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (rect.width - w) / 2;
    const y = (rect.height - h) / 2;

    ctx.drawImage(img, x, y, w, h);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const manifest = await loadManifest(sequencePath);
      if (cancelled) return;
      manifestRef.current = manifest;
      onReady?.(manifest);

      const frames = await preloadFrames(sequencePath, manifest.total);
      if (cancelled) return;
      framesRef.current = frames;
      isReadyRef.current = true;
      renderFrame(0);
    })();

    return () => {
      cancelled = true;
    };
  }, [sequencePath, onReady, renderFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
}

export { type SequenceManifest };
