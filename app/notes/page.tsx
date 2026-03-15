export default function NotesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          Elisabeth's Kitchen
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Notes
        </h1>

        <p className="mt-4 text-gray-600">
          Thoughts, cooking tips, and behind-the-scenes notes about
          building Elisabeth's Kitchen.
        </p>
      </section>

      <section className="mt-6 space-y-6">
        <article className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Why weekly menus make cooking easier
          </h2>

          <p className="mt-3 text-gray-600">
            Planning a week of dinners removes the daily decision fatigue.
            Instead of asking "what should we cook tonight?" you already
            have a plan and a grocery list ready.
          </p>
        </article>
      </section>
    </main>
  )
}