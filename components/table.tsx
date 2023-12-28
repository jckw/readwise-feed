import prisma from "@/lib/prisma"
import { indefArt, mapCategory, timeAgo } from "@/lib/utils"
import RefreshButton from "./refresh-button"
import { activity } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"
import Markdown from "react-markdown"
import { useEffect } from "react"
import { EventData_Highlighted } from "@/app/api/import/highlights/route"
import { EventData_Saved } from "@/app/api/import/reader/route"

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
    event_data: EventData_Saved
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

function Quote({ text }: { text: string }) {
  return (
    <div className="text-md font-serif font-italic text-gray-800 leading-relaxed my-3 mx-3">
      <Markdown
        className="markdown"
        disallowedElements={["a"]}
        components={{
          p: ({ node, ...props }) => (
            <p className="first:indent-[-0.3em]" {...props} />
          ),
          strong: ({ node, ...props }) => <span {...props} />,
          ol: ({ node, ...props }) => (
            <ol className="list-decimal" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc" {...props} />,
          li: ({ node, ...props }) => <li className="ml-5 pl-1" {...props} />,
        }}
      >{`“${text}”`}</Markdown>
    </div>
  )
}

function TableItemHighlightedInner({
  activity,
}: {
  user: { name: string }
  activity: activity & {
    event_data: EventData_Highlighted
  }
}) {
  return (
    <>
      <Quote text={activity.event_data.text} />
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

function TableItemHighlightedMultiInner({
  activityItems,
}: {
  user: { name: string }
  activityItems: (activity & {
    event_data: EventData_Highlighted
  })[]
}) {
  const rootActivity = activityItems[0]

  return (
    <>
      {activityItems.reverse().map((activity, i) => (
        <Quote key={activity.id} text={activity.event_data.text} />
      ))}
      <Wrapper sourceUrl={rootActivity.event_data.doc_data.source_url}>
        <div className="px-3 py-3 bg-gray-300/10 mt-3 rounded">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-600">
              {rootActivity.event_data.doc_data.readable_title}
            </span>
            {rootActivity.event_data.doc_data.author ? (
              <> • {rootActivity.event_data.doc_data.author}</>
            ) : null}
          </p>
        </div>
      </Wrapper>
    </>
  )
}

function TableItem({
  user,
  activityItems,
}: {
  user: { id: string; name: string }
  activityItems: activity[]
}) {
  const rootActivity = activityItems[0]
  const isMultiple = activityItems.length > 1

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
            {rootActivity.type === "HIGHLIGHTED"
              ? `highlighted ${activityItems.length} part${
                  activityItems.length !== 1 ? "s" : ""
                } of ${indefArt(
                  mapCategory(
                    (rootActivity.event_data as EventData_Highlighted).doc_data
                      .category
                  )
                )}`
              : null}
            {rootActivity.type === "SAVED"
              ? `saved ${indefArt(
                  mapCategory(
                    (rootActivity.event_data as EventData_Saved).category
                  )
                )}`
              : null}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {timeAgo(rootActivity.created_at)}
        </p>
      </div>
      {rootActivity.type === "HIGHLIGHTED" ? (
        isMultiple ? (
          <TableItemHighlightedMultiInner
            user={user}
            activityItems={activityItems as any}
          />
        ) : (
          <TableItemHighlightedInner
            user={user}
            activity={rootActivity as any}
          />
        )
      ) : null}
      {rootActivity.type === "SAVED" ? (
        <TableItemSavedInner user={user} activity={rootActivity as any} />
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

  const dynamicallyGroupedItems = items.reduce((acc, currentItem) => {
    const lastGroup = acc[acc.length - 1]
    const referenceItem = lastGroup ? lastGroup[0] : null

    // group items if they are both highlights of the same doc by the same user
    if (
      referenceItem &&
      lastGroup.length < 4 &&
      referenceItem.type === "HIGHLIGHTED" &&
      currentItem.type === "HIGHLIGHTED" &&
      (currentItem.event_data as any).doc_data.id ===
        (referenceItem.event_data as any).doc_data.id &&
      currentItem.user_id === referenceItem.user_id
    ) {
      lastGroup.push(currentItem)
    } else {
      acc.push([currentItem])
    }

    return acc
  }, [] as (typeof items)[])

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
        {dynamicallyGroupedItems.map((docGroup) => (
          <TableItem
            key={docGroup[0].id}
            user={docGroup[0].User}
            activityItems={docGroup}
          />
        ))}
      </div>
    </div>
  )
}
