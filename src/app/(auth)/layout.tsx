import { APP_NAME } from "@/lib/constants"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="px-5 pt-6">
        <Link
          href="/"
          className="font-display text-headline-sm tracking-tight text-on-surface"
        >
          {APP_NAME}
        </Link>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
