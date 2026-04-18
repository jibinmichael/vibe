import { ChatInputWrapper } from "@/components/chat/ChatInputWrapper"
import { Body, H2 } from "@/components/shared/Typography"

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-[640px] flex-col gap-5">
        <H2 as="h1" className="text-center">
          What are we working on?
        </H2>

        <ChatInputWrapper />

        <div className="grid grid-cols-3 gap-2.5">
          <GistPlaceholder />
          <GistPlaceholder />
          <GistPlaceholder />
        </div>
      </div>
    </div>
  )
}

function GistPlaceholder() {
  return (
    <div className="bg-background flex h-[76px] items-end rounded-md border p-3">
      <Body muted size="sm" className="text-xs">
        Gist placeholder
      </Body>
    </div>
  )
}
