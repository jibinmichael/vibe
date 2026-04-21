"use client"

/**
 * FAB playground — isolated render of PlanWithVibeFab so engineers can
 * see the button floating on an otherwise empty canvas.
 */

import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

export default function FabPlaygroundPage() {
  return (
    <div
      className="fab-playground-page"
      style={{
        minHeight: "100vh",
        background: "#FAFAF8",
        padding: "48px 32px",
      }}
    >
      <div
        className="fab-playground-container"
        style={{
          maxWidth: 720,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "rgba(0,0,0,0.85)",
            letterSpacing: "-0.01em",
          }}
        >
          Plan with Vibe FAB
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "rgba(0,0,0,0.55)",
            lineHeight: 1.55,
          }}
        >
          Floating action button. Position fixed, bottom-center of the
          <br />
          viewport. High z-index so it stays above all page content.
          <br />
          Pulsing glow, breathing eye-blink face, white label.
        </p>
      </div>

      <PlanWithVibeFab onClick={() => alert("Plan with Vibe clicked")} />
    </div>
  )
}
