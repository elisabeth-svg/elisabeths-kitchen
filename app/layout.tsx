import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: "Elisabeth's Kitchen",
  description: "Weekly menus, recipes, and grocery lists",

  manifest: "/site.webmanifest",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  themeColor: "#2c585f",

  appleWebApp: {
    capable: true,
    title: "Elisabeth's Kitchen",
    statusBarStyle: "default",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}