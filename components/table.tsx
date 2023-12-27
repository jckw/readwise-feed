import prisma from "@/lib/prisma"
import { timeAgo } from "@/lib/utils"
import RefreshButton from "./refresh-button"
import { activity } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"
import Markdown from "react-markdown"

const Wrapper = ({
  children,
  sourceUrl,
}: {
  children: React.ReactNode
  sourceUrl?: string
}) =>
  sourceUrl ? (
    <Link href={sourceUrl} target="_blank">
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

function TableItemSavedInner({
  activity,
}: {
  user: { name: string }
  activity: activity & {
    event_data: {
      source_url?: string
      author?: string
      title?: string
      summary?: string
      category: string
    }
  }
}) {
  return (
    <Wrapper sourceUrl={activity.event_data.source_url}>
      <div className="px-3 py-3 bg-gray-300/10 mt-2 rounded">
        <p className="text-sm font-semibold text-gray-800">
          {activity.event_data.title}
        </p>
        <p className="text-sm text-gray-500 mt-1 mb-2 leading-relaxed line-clamp-2">
          {activity.event_data.summary}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {activity.event_data.author}
          {activity.event_data.author && activity.event_data.source_url
            ? " • "
            : null}
          {activity.event_data.source_url?.startsWith("http")
            ? new URL(activity.event_data.source_url || "").hostname
            : activity.event_data.category}
        </p>
      </div>
    </Wrapper>
  )
}

function TableItemHighlightedInner({
  activity,
}: {
  user: { name: string }
  activity: activity & {
    event_data: {
      text: string
      doc_data: { readable_title: string; author?: string; source_url: string }
    }
  }
}) {
  return (
    <>
      <p
        className="text-md  font-italic text-gray-800 leading-relaxed my-2 mx-2"
        style={{ textIndent: "-0.3em" }}
      >
        <Markdown className="markdown">
          {`“${activity.event_data.text}”`}
        </Markdown>
      </p>
      <Wrapper sourceUrl={activity.event_data.doc_data.source_url}>
        <div className="px-3 py-3 bg-gray-300/10 mt-2 rounded">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-600">
              {activity.event_data.doc_data.readable_title}
            </span>
            {activity.event_data.doc_data.author ? (
              <> • {activity.event_data.doc_data.author}</>
            ) : null}
          </p>
        </div>
      </Wrapper>
    </>
  )
}

function TableItem({
  user,
  activity,
}: {
  user: { id: string; name: string }
  activity: activity
}) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image
            alt={user.name}
            src={`https://avatar.vercel.sh/${user.id}`}
            width={16}
            height={16}
            className="rounded-full"
          />
          <p className="text-sm text-gray-500">
            <span className="font-medium">{user.name}</span>{" "}
            {activity.type === "HIGHLIGHTED" ? "highlighted" : null}
            {activity.type === "SAVED" ? "saved" : null}
          </p>
        </div>
        <p className="text-sm text-gray-500">{timeAgo(activity.created_at)}</p>
      </div>

      {activity.type === "HIGHLIGHTED" ? (
        <TableItemHighlightedInner user={user} activity={activity as any} />
      ) : null}
      {activity.type === "SAVED" ? (
        <TableItemSavedInner user={user} activity={activity as any} />
      ) : null}
    </div>
  )
}

export default async function Table() {
  const startTime = Date.now()
  const items = await prisma.activity.findMany({
    take: 200,
    orderBy: { created_at: "desc" },
    include: { User: true },
  })
  const duration = Date.now() - startTime

  return (
    <div className="bg-white/70 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-sm text-gray-500">
            Fetched {items.length} items in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className="divide-y divide-gray-900/5">
        {items.map((doc) => (
          <TableItem key={doc.id} user={doc.User} activity={doc} />
        ))}
      </div>
    </div>
  )
}
