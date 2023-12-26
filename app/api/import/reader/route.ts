import prisma from "@/lib/prisma"

type ReadwiseReaderResponse = {
  count: number
  results: {
    id: string
    title: string
    source_url: string
    created_at: string
  }[]
}

export async function GET() {
  const res = await fetch("https://readwise.io/api/v3/list/", {
    headers: {
      Authorization: `Token ${process.env.READWISE_API_KEY}`,
    },
  })
  const data = (await res.json()) as ReadwiseReaderResponse

  const x = await Promise.all(
    data.results.map((doc) =>
      prisma.activity.upsert({
        where: {
          type_event_id: {
            event_id: doc.id,
            type: "SAVED",
          },
        },
        update: {},
        create: {
          event_id: doc.id,
          type: "SAVED",
          event_data: doc,
          created_at: new Date(doc.created_at),
        },
      })
    )
  )

  return Response.json({ data: x })
}

export const dynamic = "force-dynamic"
