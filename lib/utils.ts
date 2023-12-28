import { EventData_Highlighted } from "@/app/api/import/highlights/route"
import { EventData_Saved } from "@/app/api/import/reader/route"
import ms from "ms"

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never"
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`
}

export const indefArt = (text: string): string => {
  const vowels = ["a", "e", "i", "o", "u"]
  return vowels.includes(text[0].toLowerCase()) ? `an ${text}` : `a ${text}`
}

export const mapCategory = (
  category:
    | EventData_Saved["category"]
    | EventData_Highlighted["doc_data"]["category"]
): string => {
  switch (category) {
    case "rss":
      return "RSS feed item"
    case "books":
      return "book"
    case "articles":
      return "article"
    case "tweets":
      return "tweet"
    case "podcasts":
      return "podcast"
    default:
      return category
  }
}
