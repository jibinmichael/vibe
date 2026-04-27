import { notFound } from "next/navigation"

import { VibeAnalyticsDashboardContent } from "@/components/vibe/VibeAnalyticsDashboardContent"
import { VIBE_ANALYTICS_NAV_ITEMS, getVibeAnalyticsPage } from "@/components/vibe/vibeAnalyticsNav"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function VibeAnalyticsSlugPage(props: PageProps) {
  const params = await props.params
  const entry = getVibeAnalyticsPage(params.slug)
  if (!entry) notFound()
  return <VibeAnalyticsDashboardContent title={entry.label} />
}

export function generateStaticParams() {
  return VIBE_ANALYTICS_NAV_ITEMS.map((item) => ({ slug: item.slug }))
}
