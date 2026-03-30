import { ImageResponse } from "next/og";
import { siteDescription, siteName, siteTagline, siteTitle } from "@/lib/site";

export const alt = siteTitle;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #fef9f4 0%, #fbd1a2 42%, #7dcfb6 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: -2,
              color: "#231f1c",
              lineHeight: 1.1,
            }}
          >
            {siteName}
          </span>
          <span
            style={{
              marginTop: 24,
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: -1,
              color: "#1d4e89",
              maxWidth: 900,
              lineHeight: 1.25,
            }}
          >
            {siteTagline}
          </span>
          <span
            style={{
              marginTop: 32,
              fontSize: 22,
              fontWeight: 500,
              color: "#231f1c",
              opacity: 0.88,
              lineHeight: 1.4,
            }}
          >
            {siteDescription}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
