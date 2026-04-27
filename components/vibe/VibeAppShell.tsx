"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import {
  AudioLines,
  BoomBox,
  ChessPawn,
  ChevronDown,
  ChevronRight,
  CupSoda,
  DatabaseSearch,
  ListChevronsDownUp,
  Mailbox,
  PanelLeft,
  PanelLeftClose,
  ShoppingBasket,
  Tv,
} from "lucide-react"

import {
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import { cn } from "@/lib/utils"

import { VIBE_ANALYTICS_NAV_ITEMS } from "@/components/vibe/vibeAnalyticsNav"

const VIBE_SIDEBAR_COLLAPSED_PX = 52
const VIBE_SIDEBAR_EXPANDED_PX = 184

const vibeSidebarNavLabelClass =
  'min-w-0 truncate text-[13px] font-normal leading-[1.5] tracking-normal text-neutral-600 antialiased [font-optical-sizing:auto] [font-kerning:normal] [font-feature-settings:"kern"_1]'

const navIconClass = "size-4 shrink-0 text-neutral-600"

export function VibeAppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [dashboardSubOpen, setDashboardSubOpen] = useState(false)

  const sidepanelTransition = `width ${AUTOMATION_SIDEPANEL_DURATION} ${AUTOMATION_SIDEPANEL_EASE}`

  const navButtonClass = (opts: { collapsed: boolean }) =>
    cn(
      "flex min-w-0 items-center rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-1 hover:bg-neutral-100",
      opts.collapsed ? "justify-center p-1" : "gap-2.5 py-1.5 pr-2 pl-1",
    )

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "flex shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white",
        )}
        style={{
          width: collapsed ? VIBE_SIDEBAR_COLLAPSED_PX : VIBE_SIDEBAR_EXPANDED_PX,
          transition: sidepanelTransition,
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div
            className={cn(
              "flex shrink-0 items-center",
              collapsed ? "justify-center px-1.5" : "px-2",
            )}
            style={{ minHeight: 48 }}
          >
            {!collapsed ? (
              <p className="truncate [font-family:system-ui,sans-serif]">Wati</p>
            ) : null}
          </div>

          <nav
            className={cn(
              "flex min-h-0 flex-1 flex-col py-1",
              collapsed ? "items-stretch px-1.5" : "px-2",
            )}
            aria-label="Main"
          >
            <Link href="/vibe" className={navButtonClass({ collapsed })} aria-label="Vibe">
              <CupSoda className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Vibe</span> : null}
            </Link>

            <button type="button" className={navButtonClass({ collapsed })} aria-label="Inbox">
              <Mailbox className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Inbox</span> : null}
            </button>

            <button type="button" className={navButtonClass({ collapsed })} aria-label="Contacts">
              <ChessPawn className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Contacts</span> : null}
            </button>

            <button type="button" className={navButtonClass({ collapsed })} aria-label="Campaigns">
              <BoomBox className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Campaigns</span> : null}
            </button>

            {!collapsed ? (
              <div className="flex flex-col">
                <button
                  type="button"
                  className={cn(navButtonClass({ collapsed: false }), "w-full min-w-0")}
                  aria-expanded={dashboardSubOpen}
                  onClick={() => {
                    setDashboardSubOpen((o) => !o)
                  }}
                >
                  <DatabaseSearch className={navIconClass} strokeWidth={1.5} aria-hidden />
                  <span className={cn(vibeSidebarNavLabelClass, "min-w-0 flex-1 text-left")}>
                    Analytics
                  </span>
                  {dashboardSubOpen ? (
                    <ChevronDown
                      className="size-4 shrink-0 text-neutral-500"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  ) : (
                    <ChevronRight
                      className="size-4 shrink-0 text-neutral-500"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  )}
                </button>

                {dashboardSubOpen ? (
                  <div
                    role="group"
                    aria-label="Analytics"
                    className="mt-0.5 flex gap-2.5 py-0.5 pr-2 pl-1"
                  >
                    <div className="relative flex w-4 shrink-0 justify-center">
                      <span
                        className="pointer-events-none absolute left-1/2 w-px -translate-x-1/2 bg-neutral-200"
                        style={{ top: "-14px", bottom: 0 }}
                        aria-hidden
                      />
                    </div>
                    <ul className="flex min-w-0 flex-1 flex-col gap-0.5">
                      {VIBE_ANALYTICS_NAV_ITEMS.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/vibe/analytics/${item.slug}`}
                            className={cn(
                              vibeSidebarNavLabelClass,
                              "block w-full rounded-lg px-0 py-1.5 text-left transition-colors hover:bg-neutral-100",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href={`/vibe/analytics/${VIBE_ANALYTICS_NAV_ITEMS[0]?.slug ?? "sales-analytics"}`}
                className={navButtonClass({ collapsed: true })}
                aria-label="Analytics"
              >
                <DatabaseSearch className={navIconClass} strokeWidth={1.5} aria-hidden />
              </Link>
            )}

            <button type="button" className={navButtonClass({ collapsed })} aria-label="Ads">
              <Tv className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Ads</span> : null}
            </button>

            <button type="button" className={navButtonClass({ collapsed })} aria-label="Commerce">
              <ShoppingBasket className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Commerce</span> : null}
            </button>

            <button type="button" className={navButtonClass({ collapsed })} aria-label="More">
              <ListChevronsDownUp className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>More</span> : null}
            </button>

            <Link
              href="/vibe/automation"
              className={navButtonClass({ collapsed })}
              aria-label="Automation"
            >
              <AudioLines className={navIconClass} strokeWidth={1.5} aria-hidden />
              {!collapsed ? <span className={vibeSidebarNavLabelClass}>Automation</span> : null}
            </Link>
          </nav>

          <div
            className={cn(
              "mt-auto flex shrink-0 p-1.5",
              collapsed ? "justify-center" : "justify-start",
            )}
          >
            <button
              type="button"
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => {
                const nextCollapsed = !collapsed
                setCollapsed(nextCollapsed)
                if (nextCollapsed) {
                  setDashboardSubOpen(false)
                }
              }}
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-1 focus-visible:outline-none",
              )}
            >
              {collapsed ? (
                <PanelLeft className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
              ) : (
                <PanelLeftClose className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </aside>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}
