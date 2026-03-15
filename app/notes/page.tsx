export default function NotesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          Elisabeth's Kitchen
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Notes
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Thoughts on cooking, planning meals, and building recipes for real
          weeknight life.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">May 2026</p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Why weekly menus make cooking easier
          </h2>

          <p className="mt-3 text-gray-600">
            Planning a week of dinners removes the daily decision fatigue.
            Instead of asking “what should we cook tonight?” you already
            have a plan and a grocery list ready.
          </p>
        </article>

        <article className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">May 2026</p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            How I design recipes for weeknights
          </h2>

          <p className="mt-3 text-gray-600">
            Most recipes online assume unlimited time. Weeknight cooking
            needs something different: fewer ingredients, fewer steps,
            and meals that still feel satisfying.
          </p>
        </article>
      </section>
    </main>
  )
}

<Link href="/notes/cooking-fats">
  <article className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
    <h2 className="text-xl font-semibold">
      Cooking With Butter, Oils, and Animal Fats
    </h2>

    <p className="mt-2 text-gray-600">
      A practical guide to smoke points, olive oil, butter, and choosing
      the right fat for cooking.
    </p>
  </article>
</Link>