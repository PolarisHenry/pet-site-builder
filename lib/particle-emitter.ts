export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  char: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  friction: number;
}

export function createParticle(
  x: number,
  y: number,
  char: string
): Particle {
  const angle = (Math.random() - 0.5) * Math.PI * 0.8 - Math.PI / 2;
  const speed = 2 + Math.random() * 6;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed * 1.5,
    life: 1,
    maxLife: 0.6 + Math.random() * 0.8,
    char,
    size: 18 + Math.random() * 18,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.15,
    gravity: 0.08 + Math.random() * 0.06,
    friction: 0.985 + Math.random() * 0.01,
  };
}

export function updateParticle(p: Particle, delta: number): Particle {
  const dt = delta / 16;
  return {
    ...p,
    x: p.x + p.vx * dt,
    y: p.y + p.vy * dt,
    vy: p.vy + p.gravity * dt,
    vx: p.vx * p.friction,
    life: p.life - dt / (p.maxLife * 60),
    rotation: p.rotation + p.rotationSpeed * dt,
  };
}

export const ParticleChars = ["❤️", "🐟", "🐾"] as const;
