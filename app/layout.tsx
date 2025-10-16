import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"
import { OfflineIndicator } from "@/components/offline-indicator"
import { AppProvider } from "@/context/app-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HealthWise for Sierra Leone - Maternal Health Education",
  description:
    "Improving health literacy and maternal health education for all in Sierra Leone through multiple languages and channels",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} antialiased`}>
      <body>
        <AppProvider>
          <OfflineIndicator />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
