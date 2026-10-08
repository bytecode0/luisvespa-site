import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Senior Android Engineer · Security · SDKs · AI Agents`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0b",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e8eaed",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#7f8794" }}>LUIS VESPA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>I build secure Android systems</div>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1, color: "#3b82f6" }}>
            — and the agents that build them.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#a1a8b3" }}>
          SENIOR ANDROID ENGINEER · SECURITY · SDKs · AI AGENTS
        </div>
      </div>
    ),
    size,
  );
}
