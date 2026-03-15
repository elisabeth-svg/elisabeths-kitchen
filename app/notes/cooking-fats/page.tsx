import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Cooking With Butter, Oils, and Animal Fats | Elisabeth's Kitchen",
  description:
    "A practical guide to butter, olive oil, avocado oil, duck fat, goose fat, coconut oil, and smoke points for everyday cooking.",
  alternates: {
    canonical: 'https://elisabeths-kitchen.nl/notes/cooking-fats',
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cooking With Butter, Oils, and Animal Fats',
  description:
    'A practical guide to butter, olive oil, avocado oil, duck fat, goose fat, coconut oil, and smoke points for everyday cooking.',
  author: {
    '@type': 'Person',
    name: 'Elisabeth',
  },
  publisher: {
    '@type': 'Organization',
    name: "Elisabeth's Kitchen",
  },
  mainEntityOfPage: 'https://elisabeths-kitchen.nl/notes/cooking-fats',
}

export default function CookingFatsArticlePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/notes"
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Notes
        </Link>

        <header>
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Kitchen basics
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Cooking With Butter, Oils, and Animal Fats
          </h1>

          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            How I think about smoke points and choosing the right fat for everyday cooking.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border bg-[#f4efe9] p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            In this article
          </h2>

          <nav className="mt-3">
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a href="#smoke-point-guide" className="text-blue-600 hover:underline">
                  Quick smoke point guide
                </a>
              </li>
              <li>
                <a href="#butter" className="text-blue-600 hover:underline">
                  Butter: great flavor, moderate heat
                </a>
              </li>
              <li>
                <a href="#olive-oil" className="text-blue-600 hover:underline">
                  Olive oil: my everyday cooking oil
                </a>
              </li>
              <li>
                <a href="#avocado-oil" className="text-blue-600 hover:underline">
                  Avocado oil: when the heat gets higher
                </a>
              </li>
              <li>
                <a href="#duck-goose-fat" className="text-blue-600 hover:underline">
                  Duck fat and goose fat: incredible for roasting
                </a>
              </li>
              <li>
                <a href="#coconut-oil" className="text-blue-600 hover:underline">
                  Coconut oil: stable but distinctive
                </a>
              </li>
              <li>
                <a href="#what-i-keep" className="text-blue-600 hover:underline">
                  The fats I actually keep in my kitchen
                </a>
              </li>
              <li>
                <a href="#pan-too-hot" className="text-blue-600 hover:underline">
                  A simple sign your pan is too hot
                </a>
              </li>
            </ul>
          </nav>
        </section>

        <div className="mt-8 space-y-6 text-[15px] leading-7 text-gray-700 sm:text-base">
          <p>
            Cooking fat is one of those kitchen topics where there’s a lot of conflicting
            advice. At different times I’ve heard that olive oil shouldn’t be heated,
            that butter always burns, or that certain oils are better for cooking than others.
          </p>

          <p>
            What helped me make sense of it was learning a bit about the science behind fats,
            especially something called the <strong>smoke point</strong>.
          </p>

          <p>
            Every cooking fat has a temperature where it begins to smoke. At that point
            the fat starts to break down and produce compounds that taste bitter and unpleasant.
            In practice, though, smoke point is simply a guide for choosing the right fat
            for the heat level you’re cooking at.
          </p>

          <section id="smoke-point-guide" className="scroll-mt-28 rounded-2xl border bg-gray-50 p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick smoke point guide
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 font-semibold text-gray-900">Fat</th>
                    <th className="px-3 py-2 font-semibold text-gray-900">Approx. smoke point</th>
                    <th className="px-3 py-2 font-semibold text-gray-900">How I use it</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-3 py-2">Butter</td>
                    <td className="px-3 py-2">150–175°C</td>
                    <td className="px-3 py-2">Eggs, vegetables, sauces, baking</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Extra virgin olive oil</td>
                    <td className="px-3 py-2">190–210°C</td>
                    <td className="px-3 py-2">Everyday cooking, roasting, sautéing</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Avocado oil</td>
                    <td className="px-3 py-2">250–270°C</td>
                    <td className="px-3 py-2">High heat, searing, roasting</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Duck fat</td>
                    <td className="px-3 py-2">190–200°C</td>
                    <td className="px-3 py-2">Roasted potatoes, root vegetables</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Goose fat</td>
                    <td className="px-3 py-2">190–200°C</td>
                    <td className="px-3 py-2">Roasting, especially potatoes</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Coconut oil</td>
                    <td className="px-3 py-2">175–200°C</td>
                    <td className="px-3 py-2">Curries, baking, dishes where the flavor fits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="butter" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              Butter: great flavor, moderate heat
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                Butter is one of the fats I cook with most often because of its flavor.
                It contains about 80% fat, 18% water, and a small amount of milk solids.
              </p>

              <p>
                Those milk solids are the reason butter browns quickly and eventually burns.
                When butter is heated, the milk proteins brown through the Maillard reaction,
                which creates the nutty flavor we associate with browned butter.
              </p>

              <p>
                Because of this, butter works best for medium heat cooking like eggs,
                sautéing vegetables, sauces, or baking.
              </p>
            </div>
          </section>

          <section id="olive-oil" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              Olive oil: my everyday cooking oil
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                Olive oil is often misunderstood. Extra virgin olive oil is actually
                quite stable during normal cooking.
              </p>

              <p>
                It contains a high percentage of monounsaturated fats, which are relatively
                resistant to oxidation compared with many vegetable oils. It also contains
                natural antioxidants like polyphenols that help protect the oil during heating.
              </p>

              <p>In my kitchen I use olive oil for most everyday cooking:</p>

              <ul className="list-disc space-y-1 pl-6">
                <li>sautéing vegetables</li>
                <li>cooking chicken or fish</li>
                <li>roasting vegetables</li>
                <li>salad dressings</li>
                <li>finishing dishes</li>
              </ul>
            </div>
          </section>

          <section id="avocado-oil" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              Avocado oil: when the heat gets higher
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                When I know the pan will get very hot, like when searing meat,
                I often use avocado oil.
              </p>

              <p>
                Avocado oil has a very high smoke point and is rich in monounsaturated fats,
                making it relatively stable when heated.
              </p>
            </div>
          </section>

          <section id="duck-goose-fat" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              Duck fat and goose fat: incredible for roasting
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                Duck fat and goose fat are traditional cooking fats with fantastic flavor.
                They contain a mix of saturated and monounsaturated fats, which makes them
                quite stable for roasting.
              </p>

              <p>
                They’re especially good for roasted potatoes and root vegetables,
                where they help create a crisp exterior and rich flavor.
              </p>
            </div>
          </section>

          <section id="coconut-oil" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              Coconut oil: stable but distinctive
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                Coconut oil contains a high percentage of saturated fat, which makes
                it relatively heat-stable. I mostly use it when the flavor fits the dish,
                such as curries or certain baked goods.
              </p>
            </div>
          </section>

          <section id="what-i-keep" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              The fats I actually keep in my kitchen
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                In practice I don’t keep a huge variety of oils. Most of my cooking
                is covered by just a few:
              </p>

              <ul className="list-disc space-y-1 pl-6">
                <li>olive oil for everyday cooking</li>
                <li>butter for flavor</li>
                <li>avocado oil for high heat</li>
                <li>duck or goose fat for roasting</li>
              </ul>

              <p>
                That combination covers almost everything I cook.
              </p>
            </div>
          </section>

          <section id="pan-too-hot" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold text-gray-900">
              A simple sign your pan is too hot
            </h2>

            <div className="mt-3 space-y-4">
              <p>
                If oil starts smoking immediately when it hits the pan,
                the heat is probably too high. Lower the heat slightly and keep cooking.
              </p>

              <p>
                In my experience, good cooking is less about extreme heat
                and more about controlling the temperature.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border bg-[#f4efe9] p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Related in Elisabeth’s Kitchen
            </h2>

            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/recipes" className="text-blue-600 hover:underline">
                Browse recipes
              </Link>

              <Link href="/menus" className="text-blue-600 hover:underline">
                Weekly menus
              </Link>

              <Link href="/notes" className="text-blue-600 hover:underline">
                More notes
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}