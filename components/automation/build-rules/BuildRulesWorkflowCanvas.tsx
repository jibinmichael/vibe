"use client"

import { type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { PaperPlaneRight, WhatsappLogo } from "@phosphor-icons/react"
import { ChevronDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

/** Left canvas: ghost animation, then static Zapier-style steps. */
export const RULE_BUILD_ANIMATION_MS = 3800

export const BUILD_RULES_DEFAULT_COMPOSER = "Build a welcome message for all new whatsapp contacts"

export type RuleCanvasPhase = "ghost" | "building" | "ready"

function RulesGhostCard({ icon, delay }: { icon: ReactNode; delay: number }) {
  return (
    <motion.div
      className="flex w-full items-center gap-3 rounded-xl border border-dashed border-black/14 bg-white/65 px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[1px]"
      animate={{ opacity: [0.36, 0.58, 0.36] }}
      transition={{
        duration: 2.35,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff]/25 text-[#0a84ff]/55">
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-2.5 w-[72%] rounded bg-black/10" />
        <div className="h-2.5 w-[48%] rounded bg-black/8" />
      </div>
      <div className="h-7 w-[52px] shrink-0 rounded-full bg-black/8" />
    </motion.div>
  )
}

function RuleBuilderGhostCanvas() {
  return (
    <motion.div
      className="relative z-10 flex w-full max-w-[440px] flex-col gap-5 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/28">When</p>
        <RulesGhostCard
          icon={<WhatsappLogo size={18} weight="fill" aria-hidden className="text-[#25D366]" />}
          delay={0}
        />
      </div>
      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/28">Filter</p>
        <RulesGhostCard
          icon={<Filter className="size-[18px]" strokeWidth={2} aria-hidden />}
          delay={0.38}
        />
      </div>
      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/28">Then</p>
        <RulesGhostCard
          icon={<PaperPlaneRight size={18} weight="fill" aria-hidden className="text-[#e53935]" />}
          delay={0.76}
        />
      </div>
    </motion.div>
  )
}

function ZapierChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[#e8f1ff] px-1.5 py-0.5 text-[12px] font-medium text-[#0a84ff]">
      {children}
    </span>
  )
}

function DashedRuleConnector() {
  return (
    <div className="flex w-full justify-center py-0.5" aria-hidden>
      <div className="h-5 w-0 border-l border-dashed border-black/18" style={{ marginLeft: 22 }} />
    </div>
  )
}

function RuleStepEditLink() {
  return (
    <button
      type="button"
      className="mt-2 self-start text-[12px] font-semibold text-[#0a84ff] hover:underline"
    >
      Edit
    </button>
  )
}

function BuildRulesFilterAccordion({
  expanded,
  onToggle,
}: {
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl bg-white shadow-[0_2px_14px_rgba(0,0,0,0.06)] transition-[box-shadow,border-color]",
        expanded
          ? "ring-2 ring-emerald-500/35 ring-offset-2 ring-offset-[#f4f4f2]"
          : "border border-black/[0.08]",
      )}
    >
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start gap-3 rounded-lg py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]/30"
          aria-expanded={expanded}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-red-500">
            <Filter className="size-[18px]" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium tracking-wide text-black/40">Filter</p>
            <p className="mt-0.5 text-[13px] leading-snug font-semibold text-[rgba(0,0,0,0.88)]">
              Continue rule only if this <ZapierChip>condition</ZapierChip> is met…
            </p>
          </div>
          <ChevronDown
            className={cn(
              "mt-1 size-4 shrink-0 text-black/35 transition-transform",
              expanded ? "rotate-180" : "",
            )}
            strokeWidth={2}
            aria-hidden
          />
        </button>
        <div className="pb-2 pl-12">
          <RuleStepEditLink />
        </div>
      </div>
      {expanded ? (
        <div className="border-t border-black/[0.06] bg-[#fafafa] px-4 py-3">
          <p className="text-[10px] font-semibold tracking-wider text-black/40 uppercase">
            Filter details
          </p>
          <div className="mt-3 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-h-9 min-w-0 flex-1 items-center rounded-lg border border-black/12 bg-white px-2.5 text-[12px] text-black/70">
                <span className="truncate">Custom segment</span>
              </div>
              <div className="flex h-9 w-20 shrink-0 items-center justify-center rounded-lg border border-black/12 bg-white text-[11px] font-medium text-black/45">
                Select
              </div>
              <div className="flex h-9 min-w-[140px] items-center rounded-lg border border-black/12 bg-white px-2.5 text-[12px] text-black/75">
                Highly engaged (89)
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-black/12 bg-white px-2.5 py-1 text-[11px] font-medium text-black/55"
            >
              and +
            </button>
            <button
              type="button"
              className="rounded-md border border-black/12 bg-white px-2.5 py-1 text-[11px] font-medium text-black/55"
            >
              Or +
            </button>
          </div>
          <p className="my-3 text-center text-[11px] font-medium text-black/35">Or continue if</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-h-9 min-w-0 flex-1 items-center rounded-lg border border-black/12 bg-white px-2.5 text-[12px] text-black/70">
              <span className="truncate">Custom segment</span>
            </div>
            <div className="flex h-9 min-w-[120px] items-center rounded-lg border border-black/12 bg-white px-2.5 text-[12px] text-black/55">
              Select value…
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ZapierRuleStepsCanvas({
  filterExpanded,
  onFilterToggle,
}: {
  filterExpanded: boolean
  onFilterToggle: () => void
}) {
  return (
    <motion.div
      className="relative z-10 flex w-full max-w-[440px] flex-col px-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.28, 0.64, 1] }}
    >
      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/40">When</p>
        <div className="rounded-xl border border-black/[0.08] bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.06)]">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white">
              <WhatsappLogo size={18} weight="fill" aria-hidden className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug font-semibold text-[rgba(0,0,0,0.88)]">
                New WhatsApp message is received
              </p>
              <p className="mt-1 text-[12px] leading-snug text-black/45">
                Channel: 17735704742 (+17735704742)
              </p>
              <RuleStepEditLink />
            </div>
          </div>
        </div>
      </div>

      <DashedRuleConnector />

      <BuildRulesFilterAccordion expanded={filterExpanded} onToggle={onFilterToggle} />

      <DashedRuleConnector />

      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/40">Then</p>
        <div className="rounded-xl border border-black/[0.08] bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.06)]">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e53935] text-white">
              <PaperPlaneRight size={18} weight="fill" aria-hidden className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug font-semibold text-[rgba(0,0,0,0.88)]">
                Send a new WhatsApp message
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#0a84ff]/25 bg-[#f3f8ff] px-2 py-1 text-[12px] font-medium text-[#0a84ff]">
                  <PaperPlaneRight size={14} weight="regular" aria-hidden className="opacity-80" />
                  Choose message
                </span>
              </div>
              <RuleStepEditLink />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function RuleBuildAgentResponse() {
  const prose = "m-0 text-[13px] font-normal leading-[1.5] text-[rgba(0,0,0,0.88)]"
  const mono = "font-mono text-[13px] font-[450]"

  return (
    <div className="w-full" style={{ padding: "8px 18px 16px" }}>
      <div
        className="w-full rounded-2xl px-4 py-3"
        style={{
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex flex-col gap-3">
          <p className={prose}>
            I{"'"}ve created a rule named{" "}
            <span className={`${mono} text-[#0a84ff]`}>Welcome message</span>.
          </p>
          <p className={prose}>
            <span className="text-[12px] font-medium text-black/45">Trigger</span>
            <br />
            <span className={`${mono} text-emerald-700`}>New WhatsApp message is received</span>
          </p>
          <p className={prose}>
            <span className="text-[12px] font-medium text-black/45">Filters</span>
            <br />
            <span className={`${mono} text-violet-700`}>Custom segment</span>
            <span className="text-black/40">: </span>
            <span className={`${mono} text-indigo-700`}>Highly engaged (89)</span>
          </p>
          <p className={prose}>You can edit or modify and publish.</p>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-[#0a84ff] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0988f0] active:bg-[#0870d6]"
        >
          Edit and publish
        </button>
      </div>
    </div>
  )
}

export function BuildRulesWorkflowCanvas({
  userMessagesLength,
  ruleCanvasPhase,
  filterAccordionOpen,
  onFilterToggle,
}: {
  userMessagesLength: number
  ruleCanvasPhase: RuleCanvasPhase
  filterAccordionOpen: boolean
  onFilterToggle: () => void
}) {
  return (
    <AnimatePresence mode="wait">
      {userMessagesLength === 0 || ruleCanvasPhase !== "ready" ? (
        <RuleBuilderGhostCanvas key={`ghost-${userMessagesLength}-${ruleCanvasPhase}`} />
      ) : (
        <ZapierRuleStepsCanvas
          key="zapier-steps"
          filterExpanded={filterAccordionOpen}
          onFilterToggle={onFilterToggle}
        />
      )}
    </AnimatePresence>
  )
}
