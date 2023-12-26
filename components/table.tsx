import prisma from "@/lib/prisma"
import { timeAgo } from "@/lib/utils"
import RefreshButton from "./refresh-button"
import { activity } from "@prisma/client"
import Link from "next/link"
import Markdown from "react-markdown"

function TableItemSavedInner({
  user,
  activity,
}: {
  user: { name: string }
  activity: activity
}) {
  return (
    <Link href={(activity.event_data as any).source_url} target="_blank">
      <p className="text-sm font-semibold text-gray-800">
        {(activity.event_data as any).title}
      </p>
      <p className="text-sm text-gray-600 my-2 leading-relaxed line-clamp-3">
        {(activity.event_data as any).summary}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {(activity.event_data as any).author}
        {(activity.event_data as any).author &&
        (activity.event_data as any).source_url
          ? " • "
          : null}
        {new URL((activity.event_data as any).source_url).hostname}
      </p>
    </Link>
  )
}

function TableItemHighlightedInner({
  user,
  activity,
}: {
  user: { name: string }
  activity: activity
}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    (activity.event_data as any).doc_data.source_url ? (
      <Link
        href={(activity.event_data as any).doc_data.source_url}
        target="_blank"
      >
        {children}
      </Link>
    ) : (
      <>{children}</>
    )

  return (
    <>
      <p className="text-md  font-italic text-gray-800 leading-relaxed">
        <Markdown className="markdown">
          {`“${(activity.event_data as any).text}”`}
        </Markdown>
      </p>
      <Wrapper>
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-medium">
            {(activity.event_data as any).doc_data.readable_title}
          </span>
          {(activity.event_data as any).doc_data.author ? (
            <>, {(activity.event_data as any).doc_data.author}</>
          ) : null}
        </p>
      </Wrapper>
    </>
  )
}

function TableItem({
  user,
  activity,
}: {
  user: { name: string }
  activity: activity
}) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between ">
        <p className="text-sm text-gray-500">
          <span className="font-medium">{user.name}</span>{" "}
          {activity.type === "HIGHLIGHTED" ? "highlighted" : null}
          {activity.type === "SAVED" ? "saved" : null}
        </p>
        <p className="text-sm text-gray-500">{timeAgo(activity.created_at)}</p>
      </div>
      <div className="px-3 py-3 bg-gray-400/10 mt-2 rounded">
        {activity.type === "HIGHLIGHTED" ? (
          <TableItemHighlightedInner user={user} activity={activity} />
        ) : null}
        {activity.type === "SAVED" ? (
          <TableItemSavedInner user={user} activity={activity} />
        ) : null}
      </div>
    </div>
  )
}

export default async function Table() {
  const startTime = Date.now()
  const items = await prisma.activity.findMany({
    take: 50,
    orderBy: { created_at: "desc" },
  })
  const duration = Date.now() - startTime

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
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
          <TableItem key={doc.id} user={{ name: "Jack" }} activity={doc} />
        ))}
      </div>
    </div>
  )
}
