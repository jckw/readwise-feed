import prisma from "@/lib/prisma"

type ReadwiseHighlightsResponse = {
  count: number
  results: {
    id: string
    source_url: string
    created_at: string
    highlights: {
      id: number
      text: string
      created_at: string
    }[]
  }[]
}

export async function GET() {
  const res = await fetch("https://readwise.io/api/v2/export", {
    headers: {
      Authorization: `Token ${process.env.READWISE_API_KEY}`,
    },
  })
  const data = (await res.json()) as ReadwiseHighlightsResponse

  const highlights = data.results.flatMap((doc) => {
    const { highlights, ...rest } = doc
    return highlights.map((highlight) => ({
      doc_data: rest,
      ...highlight,
    }))
  })

  const x = await Promise.all(
    highlights.map((highlight) =>
      prisma.activity.upsert({
        where: {
          type_event_id: {
            event_id: highlight.id.toString(),
            type: "HIGHLIGHTED",
          },
        },
        update: {},
        create: {
          event_id: highlight.id.toString(),
          type: "HIGHLIGHTED",
          event_data: highlight,
          created_at: new Date(highlight.created_at),
        },
      })
    )
  )

  return Response.json({ data: x })
}
