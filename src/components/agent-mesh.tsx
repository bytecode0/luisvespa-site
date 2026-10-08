"use client";

import { useEffect, useRef } from "react";

/**
 * "Agent mesh": a slow network of devices, agents and human checkpoints.
 * Pulses of work travel along the edges and pause at human nodes before continuing.
 * Canvas 2D only. Pauses off-screen and in hidden tabs; static frame with reduced motion.
 */

type Kind = "device" | "agent" | "human";
type Node = { x: number; y: number; vx: number; vy: number; kind: Kind; glow: number };
type Pulse = { from: number; to: number; t: number; speed: number; hold: number; hops: number };

const COLORS = {
  device: [161, 168, 179],
  agent: [59, 130, 246],
  human: [242, 196, 109],
  secure: [125, 211, 168],
} as const;

/** Each page gets its own character: what the network is made of and what flows through it. */
export type MeshVariant = "hero" | "engineering" | "security" | "agents" | "quiet";
const VARIANTS: Record<MeshVariant, { area: number; human: number; agent: number; pulse: readonly number[]; pulses: number }> = {
  hero: { area: 11000, human: 0.07, agent: 0.35, pulse: COLORS.agent, pulses: 3 },
  engineering: { area: 12000, human: 0.03, agent: 0.15, pulse: COLORS.agent, pulses: 4 },
  security: { area: 12000, human: 0.1, agent: 0.1, pulse: COLORS.secure, pulses: 3 },
  agents: { area: 10000, human: 0.1, agent: 0.55, pulse: COLORS.agent, pulses: 2.5 },
  quiet: { area: 18000, human: 0.05, agent: 0.3, pulse: COLORS.agent, pulses: 6 },
};

const LINK_DIST = 175;
const MOUSE_DIST = 170;

const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export function AgentMesh({ className = "", variant = "hero" }: { className?: string; variant?: MeshVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const config = VARIANTS[variant];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let neighbours: number[][] = [];
    const mouse = { x: -9999, y: -9999 };
    let frame = 0;
    let running = false;
    let visible = true;
    let last = 0;

    const pickKind = (): Kind => {
      const r = Math.random();
      return r < config.human ? "human" : r < config.human + config.agent ? "agent" : "device";
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(26, Math.min(110, Math.round((width * height) / config.area)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        kind: pickKind(),
        glow: 0,
      }));
      // Guarantee a few human checkpoints so pulses visibly stop at them.
      for (let i = 0; i < Math.max(2, Math.round(count / 18)); i++) nodes[i].kind = "human";
      pulses = [];
    };

    const computeNeighbours = () => {
      neighbours = nodes.map(() => []);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) {
            neighbours[i].push(j);
            neighbours[j].push(i);
          }
        }
      }
    };

    const spawnPulse = () => {
      const from = Math.floor(Math.random() * nodes.length);
      const options = neighbours[from];
      if (!options?.length) return;
      const to = options[Math.floor(Math.random() * options.length)];
      pulses.push({ from, to, t: 0, speed: 0.0009 + Math.random() * 0.0007, hold: 0, hops: 3 + Math.floor(Math.random() * 4) });
    };

    const step = (dt: number) => {
      for (const n of nodes) {
        n.x += n.vx * dt * 0.06;
        n.y += n.vy * dt * 0.06;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.glow = Math.max(0, n.glow - dt * 0.0012);
      }
      computeNeighbours();

      for (const p of pulses) {
        if (p.hold > 0) {
          p.hold -= dt;
          continue;
        }
        p.t += p.speed * dt;
        if (p.t >= 1) {
          const arrived = nodes[p.to];
          arrived.glow = 1;
          p.hops -= 1;
          const next = neighbours[p.to].filter((k) => k !== p.from);
          if (p.hops <= 0 || next.length === 0) {
            p.hops = -1;
            continue;
          }
          p.from = p.to;
          p.to = next[Math.floor(Math.random() * next.length)];
          p.t = 0;
          // Work waits at a human checkpoint before it moves on.
          if (arrived.kind === "human") p.hold = 900;
        }
      }
      pulses = pulses.filter((p) => p.hops >= 0);
      const target = Math.round(nodes.length / config.pulses);
      if (pulses.length < target && Math.random() < 0.12) spawnPulse();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Edges
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (const j of neighbours[i]) {
          if (j < i) continue;
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < MOUSE_DIST;
          ctx.strokeStyle = rgba(COLORS.device, (1 - d / LINK_DIST) * (near ? 0.4 : 0.17));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Cursor links
      for (const n of nodes) {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < MOUSE_DIST) {
          ctx.strokeStyle = rgba(COLORS.agent, (1 - d / MOUSE_DIST) * 0.35);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Pulses
      for (const p of pulses) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const color = p.hold > 0 ? COLORS.human : config.pulse;
        if (p.hold <= 0) {
          // Light trail along the edge behind the pulse.
          const t0 = Math.max(0, p.t - 0.35);
          const tx = a.x + (b.x - a.x) * t0;
          const ty = a.y + (b.y - a.y) * t0;
          const trail = ctx.createLinearGradient(tx, ty, x, y);
          trail.addColorStop(0, rgba(color, 0));
          trail.addColorStop(1, rgba(color, 0.7));
          ctx.strokeStyle = trail;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
        const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
        g.addColorStop(0, rgba(color, 0.9));
        g.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      for (const n of nodes) {
        const c = COLORS[n.kind];
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < MOUSE_DIST;
        const base = n.kind === "device" ? 0.35 : 0.6;
        const alpha = Math.min(1, base + n.glow * 0.5 + (near ? 0.3 : 0));
        if (n.glow > 0 || n.kind === "human") {
          const r = 6 + n.glow * 10;
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
          g.addColorStop(0, rgba(c, 0.25 + n.glow * 0.35));
          g.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = rgba(c, alpha);
        if (n.kind === "human") {
          // Checkpoints are diamonds, so the kind never depends on colour alone.
          ctx.beginPath();
          ctx.moveTo(n.x, n.y - 4);
          ctx.lineTo(n.x + 4, n.y);
          ctx.lineTo(n.x, n.y + 4);
          ctx.lineTo(n.x - 4, n.y);
          ctx.closePath();
          ctx.fill();
        } else if (n.kind === "agent") {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(n.x - 1.6, n.y - 1.6, 3.2, 3.2);
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(48, now - (last || now));
      last = now;
      step(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    build();
    computeNeighbours();
    if (reduceMotion) {
      // One still frame: the network without motion.
      for (let i = 0; i < 6; i++) spawnPulse();
      pulses.forEach((p) => (p.t = Math.random()));
      draw();
    } else {
      start();
    }

    const onResize = () => {
      build();
      computeNeighbours();
      if (reduceMotion) draw();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [variant]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
