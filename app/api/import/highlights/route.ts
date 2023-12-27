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
  const users = await prisma.user.findMany()

  for (const user of users) {
    const res = await fetch("https://readwise.io/api/v2/export", {
      headers: {
        Authorization: `Token ${user.readwise_access_token}`,
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
            user_id: user.id,
            event_id: highlight.id.toString(),
            type: "HIGHLIGHTED",
            event_data: highlight,
            created_at: new Date(highlight.created_at),
          },
        })
      )
    )
  }

  return Response.json({ success: true, user_count: users.length })
}

export const dynamic = "force-dynamic"
