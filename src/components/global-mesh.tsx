"use client";

import { usePathname } from "next/navigation";
import { AgentMesh, type MeshVariant } from "@/components/agent-mesh";

const VARIANT_BY_PATH: Record<string, MeshVariant> = {
  "/": "hero",
  "/engineering": "engineering",
  "/security": "security",
  "/agents": "agents",
};

/**
 * The animated agent mesh as a site-wide background: fixed behind all content, so it shows through
 * every gap while scrolling. Each page keeps its own character; it softens in the middle of the
 * viewport, where text usually sits.
 */
export function GlobalMesh() {
  const pathname = usePathname();
  const variant = VARIANT_BY_PATH[pathname] ?? "quiet";
  return (
    <AgentMesh
      key={variant}
      variant={variant}
      className="!fixed -z-[1] opacity-80 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_15%,black_70%)]"
    />
  );
}
