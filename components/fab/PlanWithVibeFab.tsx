"use client"

/**
 * PlanWithVibeFab — a floating action button pill that pairs the
 * AiPulse eye face with a "Plan with Vibe" label.
 *
 * Solid halo-blue fill (#0a84ff), white eyes + label, 1px soft border,
 * and a pulsing outer glow (medium intensity, 2.6s cycle). The button
 * is positioned fixed to the bottom-center of the viewport at a very
 * high z-index so it stays reachable above any page content.
 *
 * Props:
 *   - onClick:   called when the pill is clicked
 *   - label:     override the default "Plan with Vibe" label
 *   - disabled:  optional disabled state (no pulse, muted glow)
 *   - zIndex:    optional z-index override (default 1000)
 *   - status:    idle (blue glow + halo) or done (white pill, smile mouth)
 */

type PlanWithVibeFabProps = {
  onClick?: () => void
  label?: string
  disabled?: boolean
  zIndex?: number
  status?: "idle" | "done"
}

export function PlanWithVibeFab({
  onClick,
  label = "Plan with Vibe",
  disabled = false,
  zIndex = 1000,
  status = "idle",
}: PlanWithVibeFabProps) {
  return (
    <>
      <style>{`
        .plan-vibe-fab {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 5px 20px 5px 10px;
          background: #0a84ff;
          border-radius: 9999px;
          border: 1px solid rgba(191,216,245,0.9);
          cursor: pointer;
          box-shadow:
            0 0 0 0 rgba(10,132,255,0.55),
            0 0 14px 2px rgba(10,132,255,0.2),
            0 4px 12px rgba(10,132,255,0.25);
          animation: planVibeFabGlow 2.6s ease-in-out infinite;
          font-family: inherit;
        }
        .plan-vibe-fab[data-status="done"] {
          animation: none;
          background: #fff;
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
        }
        .plan-vibe-fab:hover {
          filter: brightness(1.05);
        }
        .plan-vibe-fab:active {
          transform: translate(-50%, 1px);
        }
        .plan-vibe-fab[data-disabled="true"] {
          background: rgba(10,132,255,0.55);
          cursor: not-allowed;
          animation: none;
          box-shadow: 0 2px 6px rgba(10,132,255,0.15);
        }

        @keyframes planVibeFabGlow {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(10,132,255,0.55),
              0 0 14px 2px rgba(10,132,255,0.2),
              0 4px 12px rgba(10,132,255,0.25);
          }
          50% {
            box-shadow:
              0 0 0 3px rgba(10,132,255,0.08),
              0 0 22px 4px rgba(10,132,255,0.35),
              0 4px 12px rgba(10,132,255,0.3);
          }
        }

        .plan-vibe-fab-face-wrap {
          position: relative;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .plan-vibe-fab[data-status="done"] .plan-vibe-fab-face-wrap {
          background: rgba(0,0,0,0.03);
        }
        .plan-vibe-fab-halo {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(255,255,255,0.55),
            rgba(255,255,255,0.2),
            rgba(255,255,255,0.45),
            rgba(255,255,255,0.55)
          );
          filter: blur(6px);
          opacity: 0.85;
          animation: planVibeFabHaloRotate 6s linear infinite;
          pointer-events: none;
        }
        @keyframes planVibeFabHaloRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .plan-vibe-fab-face {
          position: relative;
          z-index: 1;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          animation: planVibeFabBreathe 4s ease-in-out infinite;
        }
        @keyframes planVibeFabBreathe {
          0%, 100% { transform: scale(1) translateX(0); }
          30% { transform: scale(0.94) translateX(-1px); }
          50% { transform: scale(1) translateX(0); }
          70% { transform: scale(0.94) translateX(1px); }
        }
        .plan-vibe-fab-eyes {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .plan-vibe-fab-eye {
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 1px;
          display: inline-block;
          animation: planVibeFabBlink 3.5s infinite;
        }
        .plan-vibe-fab[data-status="done"] .plan-vibe-fab-eye {
          background: rgba(0,0,0,0.78);
        }
        @keyframes planVibeFabBlink {
          0%, 88%, 100% { height: 4px; margin-top: 0; }
          92% { height: 1px; margin-top: 1.5px; }
          96% { height: 4px; margin-top: 0; }
        }

        .plan-vibe-fab-mouth {
          width: 10px;
          height: 5px;
          position: relative;
        }
        .plan-vibe-fab-mouth::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 5px;
          border-bottom: 1.5px solid rgba(0,0,0,0.78);
          border-radius: 0 0 10px 10px;
          transform: scaleY(0.1);
          transform-origin: center top;
          animation: planVibeFabSmileReveal 3s ease-in-out infinite;
        }
        @keyframes planVibeFabSmileReveal {
          0%, 100% { transform: scaleY(0.1); }
          20% { transform: scaleY(0.1); }
          40%, 80% { transform: scaleY(1); }
        }

        .plan-vibe-fab-label {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.005em;
          white-space: nowrap;
        }
        .plan-vibe-fab[data-status="done"] .plan-vibe-fab-label {
          color: rgba(0,0,0,0.82);
        }
      `}</style>
      <button
        type="button"
        className="plan-vibe-fab"
        onClick={disabled ? undefined : onClick}
        data-disabled={disabled ? "true" : "false"}
        data-status={status}
        aria-label={label}
        aria-disabled={disabled}
        style={{ zIndex }}
      >
        <span className="plan-vibe-fab-face-wrap" aria-hidden="true">
          {status === "idle" && <span className="plan-vibe-fab-halo" />}
          <span className="plan-vibe-fab-face">
            <span className="plan-vibe-fab-eyes">
              <span className="plan-vibe-fab-eye" />
              <span className="plan-vibe-fab-eye" />
            </span>
            {status === "done" && <span className="plan-vibe-fab-mouth" />}
          </span>
        </span>
        <span className="plan-vibe-fab-label">{label}</span>
      </button>
    </>
  )
}
