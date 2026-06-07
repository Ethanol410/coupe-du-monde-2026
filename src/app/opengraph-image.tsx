import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fr } from "@/lib/labels/fr";

export const alt = fr.app.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-noir.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          backgroundColor: "#faf7f0",
          color: "#1f1a17",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={240} height={240} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-2px",
            textTransform: "uppercase",
          }}
        >
          {fr.app.title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#6b6256" }}>
          {fr.app.tagline}
        </div>
        <div
          style={{ display: "flex", width: 140, height: 8, backgroundColor: "#c8102e" }}
        />
      </div>
    ),
    { ...size },
  );
}
