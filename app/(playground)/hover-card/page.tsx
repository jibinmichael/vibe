"use client"

import { CampaignHoverCard } from "@/components/hover-card/CampaignHoverCard"

export default function HoverCardPlaygroundPage() {
  return (
    <div className="relative min-h-screen bg-[#FAFAF8] px-10 pt-[5.5rem] pb-24">
      <div className="group relative inline-flex">
        <button
          type="button"
          className="text-foreground rounded-lg border border-black/10 bg-white px-4 py-2 text-[length:var(--text-body-sm)] font-medium shadow-sm"
        >
          Hover for hover card
        </button>
        <div className="pointer-events-none invisible absolute top-full left-0 z-[2147483647] mt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
          <CampaignHoverCard
            title="WhatsApp Campaign - Spring Promo"
            scheduledAt="11:10 AM May 15th 2026"
            scheduleStatus="Scheduled"
            contentLabel="Spring summer collection reveal"
            contentType="Carousel"
            audienceSummary="4500 Contacts "
            audienceTags={[
              { label: "winback", variant: "outline" },
              { label: "Highly engaged", variant: "outline" },
              { label: "+210", variant: "ghost" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
