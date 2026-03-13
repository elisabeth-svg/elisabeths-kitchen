import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: "Elisabeth's Weekly Menus",
  description: "Weekly menus, recipes, and grocery lists",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />

  <main className="mx-auto max-w-5xl px-6">
    {children}
  </main>

  <Footer />
</body>
    </html>
  )
}