"use client"

/**
 * UserRow — one chat row containing a user message.
 *
 * Row spans the full width of the chat column. Internal left/right padding
 * matches the chatbox interior so the bubble aligns with chatbox content.
 * User bubble: grey, right-aligned, capped at 60% of row width.
 *
 * Asymmetric corner (bottom-right squared to 4px) so the bubble points
 * toward the "speaker side" of the rail.
 */

type UserRowProps = {
  text: string
  /** Automation builders use a tighter 13px type scale. */
  variant?: "default" | "automation"
}

export function UserRow({ text, variant = "default" }: UserRowProps) {
  const fontSize = variant === "automation" ? 13 : 14

  return (
    <div
      className="chat-row chat-row-user flex w-full justify-end"
      style={{ padding: "16px 18px" }}
    >
      <div
        className="chat-user-bubble"
        style={{
          maxWidth: "60%",
          padding: "9px 14px",
          background: "rgba(0,0,0,0.06)",
          borderRadius: "14px 14px 4px 14px",
          fontSize,
          lineHeight: 1.45,
          color: "rgba(0,0,0,0.88)",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  )
}
