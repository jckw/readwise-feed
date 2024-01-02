import prisma from "@/lib/prisma"
import { create } from "domain"

export type EventData_Highlighted = {
  id: number
  text: string
  created_at: string
  doc_data: {
    user_book_id: number
    source_url: string
    readable_title: string
    author?: string
    category: "books" | "articles" | "tweets" | "podcasts"
  }
}

type ReadwiseHighlightsResponse = {
  count: number
  results: (EventData_Highlighted["doc_data"] & {
    highlights: {
      id: number
      text: string
      created_at: string
    }[]
  })[]
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

    const highlights: (ReadwiseHighlightsResponse["results"][0]["highlights"][0] & {
      doc_data: EventData_Highlighted["doc_data"]
    })[] = []
    const user_documents: EventData_Highlighted["doc_data"][] = []

    data.results.forEach((doc) => {
      const { highlights: hs, ...rest } = doc

      user_documents.push(rest)

      hs.forEach((highlight) => {
        highlights.push({
          doc_data: rest,
          ...highlight,
        })
      })
    })

    const uds = await Promise.all(
      user_documents.map((ud) =>
        prisma.user_document.upsert({
          where: {
            user_book_id: ud.user_book_id,
          },
          update: {},
          create: {
            user_id: user.id,
            user_book_id: ud.user_book_id,
            category: ud.category,
            data: ud,
          },
        })
      )
    )
    const uds_by_id = uds.reduce((acc, ud) => {
      acc[ud.user_book_id] = ud
      return acc
    }, {} as Record<number, (typeof uds)[0]>)

    await Promise.all(
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
            user_document_id: uds_by_id[highlight.doc_data.user_book_id].id,
          },
        })
      )
    )
  }

  return Response.json({ success: true, user_count: users.length })
}

export const dynamic = "force-dynamic"
