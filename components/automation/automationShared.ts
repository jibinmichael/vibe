import type { CSSProperties } from "react"

export const AUTOMATION_SIDEPANEL_EASE = "cubic-bezier(0.34, 1.28, 0.64, 1)"
export const AUTOMATION_SIDEPANEL_DURATION = "0.52s"

export const AUTOMATION_DOT_GRID_STYLE: CSSProperties = {
  backgroundColor: "#f4f4f2",
  backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px)`,
  backgroundSize: "14px 14px",
}

export function automationOpenPanelTransform(open: boolean) {
  return open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)"
}
