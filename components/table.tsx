import prisma from "@/lib/prisma"
import { timeAgo } from "@/lib/utils"
import RefreshButton from "./refresh-button"

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
          <div key={doc.id} className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              {/* <Image
                src={user.image}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full ring-1 ring-gray-900/5"
              /> */}
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  {doc.type === "HIGHLIGHTED" ? "Jack highlighted" : null}
                  {doc.type === "SAVED" ? "Jack saved" : null}
                </p>
                <p className="font-medium leading-none">
                  {doc.type === "HIGHLIGHTED"
                    ? (doc.event_data as any).doc_data.readable_title
                    : null}
                  {doc.type === "SAVED" ? (doc.event_data as any).title : null}
                </p>
                {doc.type === "HIGHLIGHTED" ? (
                  <p>{(doc.event_data as any).text}</p>
                ) : null}
              </div>
            </div>
            <p className="text-sm text-gray-500">{timeAgo(doc.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
