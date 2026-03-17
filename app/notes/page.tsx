import Link from 'next/link'

export default function NotesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          Elisabeth&apos;s Kitchen
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Notes</h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Thoughts on cooking, planning meals, ingredients, and building recipes
          for real weeknight life.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Link href="/notes/cooking-fats" className="block">
          <article className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Kitchen basics</p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              Cooking With Butter, Oils, and Animal Fats
            </h2>

            <p className="mt-3 text-gray-600">
              A practical guide to smoke points, olive oil, butter, duck fat,
              goose fat, and how I choose the right fat for cooking.
            </p>
          </article>
        </Link>

        <Link href="/notes/browning-and-searing" className="block">
          <article className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm text-gray-500">Kitchen basics</p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              Why Browning and Searing Matter in Slow Cooker and Oven Dishes
            </h2>

            <p className="mt-3 text-gray-600">
              A practical note on why I brown ingredients before slow cooker and
              oven cooking, how it builds flavor, and when I sear vegetables
              instead of sautéing them.
            </p>
          </article>
        </Link>

        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Coming soon</p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            More notes are on the way
          </h2>

          <p className="mt-3 text-gray-600">
            I’ll be adding practical kitchen notes, cooking tips, and
            behind-the-scenes thoughts here over time.
          </p>
        </article>
      </section>
    </main>
  )
}