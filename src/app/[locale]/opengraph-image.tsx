import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Winston Pichardo, Software Engineer";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline =
    locale === "es"
      ? "Construyo sistemas que no se caen."
      : "I build systems you can trust.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 12,
            color: "#34d399",
            marginBottom: 28,
          }}
        >
          SOFTWARE ENGINEER
        </div>
        <div style={{ fontSize: 92, fontWeight: 700 }}>Winston Pichardo</div>
        <div style={{ fontSize: 36, color: "#d4d4d4", marginTop: 24 }}>
          {tagline}
        </div>
        <div
          style={{
            marginTop: 48,
            width: 120,
            height: 4,
            background: "#10b981",
          }}
        />
      </div>
    ),
    size,
  );
}
