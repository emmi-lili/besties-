import { Playfair_Display, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { APP_NAME } from "@/lib/constants"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: `${APP_NAME} — amigas de verdad`,
  description:
    "Hacer amigas de grande es rarísimo. Acá no. Match jugando, no mirando fotos.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${playfair.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
