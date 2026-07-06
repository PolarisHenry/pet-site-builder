import { cn } from "@/lib/utils";

export type SequenceManifest = {
  action: string;
  description: string;
  total: number;
  fps: number;
  duration: number;
  width: number;
  height: number;
};

export async function loadManifest(sequencePath: string): Promise<SequenceManifest> {
  const res = await fetch(`${sequencePath}/manifest.json`);
  return res.json();
}

export function preloadFrames(
  sequencePath: string,
  total: number
): Promise<HTMLImageElement[]> {
  const promises: Promise<HTMLImageElement>[] = [];

  for (let i = 1; i <= total; i++) {
    const idx = String(i).padStart(3, "0");
    const src = `${sequencePath}/frame_${idx}.webp`;
    promises.push(
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      })
    );
  }

  return Promise.all(promises);
}

export function getFrameIndex(progress: number, total: number): number {
  return Math.min(Math.floor(progress * total), total - 1);
}
