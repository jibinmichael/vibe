"use client"

/**
 * AiPulse — the home-page presence indicator.
 *
 * A 60×60 halo (conic gradient, blurred, slowly rotating) with two small
 * square eyes centered inside. No text, no label — pure presence.
 *
 * Emotional behavior: face gently scales down to 95% while drifting ±1.5px
 * side to side on a 4s cycle (breathing + subtle glance). Eyes blink
 * independently every 5s.
 *
 * Meant to sit above the chatbox on the home page as a quiet, alive
 * signal that the AI is there with you.
 */

export function AiPulse() {
  return (
    <div
      className="ai-pulse relative flex items-center justify-center"
      style={{ width: 60, height: 60 }}
      aria-hidden="true"
    >
      <div
        className="ai-pulse-halo absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(10,132,255,0.35), rgba(90,170,255,0.2), rgba(191,216,245,0.3), rgba(10,132,255,0.35))",
          filter: "blur(10px)",
          opacity: 0.8,
          animation: "aiPulseHaloRotate 6s linear infinite",
        }}
      />

      <div
        className="ai-pulse-face relative z-[1] flex items-center justify-center"
        style={{
          gap: 7,
          animation: "aiPulseFaceBreathe 4s ease-in-out infinite",
        }}
      >
        <span
          className="ai-pulse-eye"
          style={{
            width: 5,
            height: 5,
            background: "rgba(0,0,0,0.7)",
            borderRadius: 1,
            display: "inline-block",
            animation: "aiPulseEyeBlink 5s infinite",
          }}
        />
        <span
          className="ai-pulse-eye"
          style={{
            width: 5,
            height: 5,
            background: "rgba(0,0,0,0.7)",
            borderRadius: 1,
            display: "inline-block",
            animation: "aiPulseEyeBlink 5s infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes aiPulseHaloRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes aiPulseFaceBreathe {
          0%,
          100% {
            transform: scale(1) translateX(0);
          }
          30% {
            transform: scale(0.95) translateX(-1.5px);
          }
          50% {
            transform: scale(1) translateX(0);
          }
          70% {
            transform: scale(0.95) translateX(1.5px);
          }
        }
        @keyframes aiPulseEyeBlink {
          0%,
          88%,
          100% {
            height: 5px;
            margin-top: 0px;
          }
          92% {
            height: 1px;
            margin-top: 2px;
          }
          96% {
            height: 5px;
            margin-top: 0px;
          }
        }
      `}</style>
    </div>
  )
}
