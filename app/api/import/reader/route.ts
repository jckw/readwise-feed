import prisma from "@/lib/prisma"

type ReadwiseReaderResponse = {
  count: number
  results: {
    id: string
    title: string
    source_url: string
    created_at: string
    category: string
  }[]
}

export async function GET() {
  const users = await prisma.user.findMany()

  for (const user of users) {
    const res = await fetch("https://readwise.io/api/v3/list/", {
      headers: {
        Authorization: `Token ${user.readwise_access_token}`,
      },
    })
    const data = (await res.json()) as ReadwiseReaderResponse

    await Promise.all(
      data.results
        .filter((doc) => doc.category !== "highlight")
        .map((doc) =>
          prisma.activity.upsert({
            where: {
              type_event_id: {
                event_id: doc.id,
                type: "SAVED",
              },
            },
            update: {},
            create: {
              user_id: user.id,
              event_id: doc.id,
              type: "SAVED",
              event_data: doc,
              created_at: new Date(doc.created_at),
            },
          })
        )
    )
  }

  return Response.json({ success: true, user_count: users.length })
}

export const dynamic = "force-dynamic"
