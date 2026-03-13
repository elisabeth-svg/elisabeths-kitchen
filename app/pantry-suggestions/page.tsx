import Link from 'next/link'

export default function PantrySuggestionsPage() {
  return (
    <main className="flex flex-col gap-6 lg:grid lg:grid-cols-[300px_1fr] lg:items-start">
      <aside className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Filters</h1>
          <Link
            href="/pantry-suggestions"
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all
          </Link>
        </div>

        <p className="mt-2 text-sm text-gray-600">No filters selected</p>

        <div className="mt-6 space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Pantry meals
            </h2>
            <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
              This page will later suggest recipes you can cook with ingredients
              already in your pantry.
            </div>
          </section>
        </div>
      </aside>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="mb-3 inline-block text-sm text-blue-600 hover:underline"
              >
                ← Back to home
              </Link>

              <h1 className="text-2xl font-semibold text-gray-900">
                Pantry Meals
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Discover recipes you can already cook, or almost cook, with the
                ingredients in your pantry.
              </p>
            </div>

            <p className="text-sm text-gray-500">Coming soon</p>
          </div>

          <form
            action="/pantry-suggestions"
            method="get"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="q"
              placeholder="Search pantry suggestions..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Search
            </button>
          </form>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Pantry suggestions will appear here
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Later, this page will show recipes you can make with ingredients you
            already have at home, plus recipes where you only miss a few items.
          </p>
        </div>
      </section>
    </main>
  )
}