import Link from 'next/link'

export default function PantrySuggestionsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Pantry Meals</h1>

        <p className="mt-3 text-gray-600">
          This page will suggest recipes you can cook with ingredients already
          in your pantry.
        </p>

        <p className="mt-4 text-gray-500">
          (Feature coming soon.)
        </p>

        <Link
          href="/recipes"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          Browse all recipes
        </Link>
      </section>
    </main>
  )
}