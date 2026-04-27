export const VIBE_ANALYTICS_NAV_ITEMS = [
  { slug: "sales-analytics", label: "Sales Analytics" },
  { slug: "inbox-analytics", label: "Inbox Analytics" },
  { slug: "cx-score", label: "CX score" },
  { slug: "shopify-analytics", label: "Shopify Analytics" },
] as const

export type VibeAnalyticsSlug = (typeof VIBE_ANALYTICS_NAV_ITEMS)[number]["slug"]

export function getVibeAnalyticsPage(slug: string) {
  return VIBE_ANALYTICS_NAV_ITEMS.find((item) => item.slug === slug)
}
