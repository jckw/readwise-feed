import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import Table from "@/components/table"
import TablePlaceholder from "@/components/table-placeholder"
import ExpandingArrow from "@/components/expanding-arrow"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center py-8">
      <Link
        href="https://www.github.com/jckw/readwise-feed"
        className="group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all items-center"
      >
        <Image
          src="/github.svg"
          alt="GitHub Logo"
          width={16}
          height={16}
          style={{ flexShrink: 0, aspectRatio: "1", height: 16 }}
          priority
        />
        <p>View on GitHub</p>
        <ExpandingArrow />
      </Link>
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Readwise Feed
      </h1>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
        Built by{" "}
        <Link
          href="https://weekend.systems"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          weekend.systems
        </Link>
        .
      </p>
    </main>
  )
}
