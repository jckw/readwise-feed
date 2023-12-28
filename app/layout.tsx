import "./globals.css"
import { Inter, Merriweather } from "next/font/google"

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Readwise Feed",
  description: "A minimal feed of my Readwise highlights and saves.",
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable}`}>
        {children}
      </body>
    </html>
  )
}
