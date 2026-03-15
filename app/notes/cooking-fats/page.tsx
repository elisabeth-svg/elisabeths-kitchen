import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Cooking With Butter, Oils, and Animal Fats | Elisabeth's Kitchen",
  description:
    "A practical guide to cooking fats: butter, olive oil, avocado oil, duck fat and more. Learn about smoke points, heat stability, and how to choose the right fat for cooking.",
}

export default function CookingFatsArticle() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <article className="rounded-2xl border bg-white p-8 shadow-sm">

        <Link
          href="/notes"
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Notes
        </Link>

        <header>
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Cooking Basics
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Cooking With Butter, Oils, and Animal Fats
          </h1>

          <p className="mt-3 text-gray-600">
            How I think about smoke points and choosing the right fat
            for everyday cooking.
          </p>
        </header>

        <div className="prose prose-neutral mt-8 max-w-none">
          
          <p>
            Cooking fat is one of those kitchen topics where there’s a lot of
            conflicting advice. At different times I’ve heard that olive oil
            shouldn’t be heated, that butter always burns, or that certain oils
            are better for cooking than others.
          </p>

          <p>
            What helped me make sense of it was learning a bit about the science
            behind fats, especially something called the <strong>smoke point</strong>.
          </p>

          <p>
            Every cooking fat has a temperature where it begins to smoke. At
            that point the fat starts to break down and produce compounds that
            taste bitter and unpleasant. In practice, though, smoke point is
            simply a guide for choosing the right fat for the heat level you’re
            cooking at.
          </p>

          <h2>Butter: great flavor, moderate heat</h2>

          <p>
            Butter is one of the fats I cook with most often because of its
            flavor. It contains about 80% fat, 18% water, and a small amount of
            milk solids.
          </p>

          <p>
            Those milk solids are the reason butter browns quickly and
            eventually burns. When butter is heated, the milk proteins brown
            through the Maillard reaction, which creates the nutty flavor we
            associate with browned butter.
          </p>

          <p>
            Because of this, butter works best for medium heat cooking like
            eggs, sautéing vegetables, sauces, or baking.
          </p>

          <h2>Olive oil: my everyday cooking oil</h2>

          <p>
            Olive oil is often misunderstood. Extra virgin olive oil is actually
            quite stable during normal cooking.
          </p>

          <p>
            It contains a high percentage of monounsaturated fats, which are
            relatively resistant to oxidation compared with many vegetable
            oils. It also contains natural antioxidants like polyphenols that
            help protect the oil during heating.
          </p>

          <p>
            In my kitchen I use olive oil for most everyday cooking:
          </p>

          <ul>
            <li>sautéing vegetables</li>
            <li>cooking chicken or fish</li>
            <li>roasting vegetables</li>
            <li>salad dressings</li>
            <li>finishing dishes</li>
          </ul>

          <h2>Avocado oil: when the heat gets higher</h2>

          <p>
            When I know the pan will get very hot, like when searing meat, I
            often use avocado oil.
          </p>

          <p>
            Avocado oil has a very high smoke point and is rich in
            monounsaturated fats, making it relatively stable when heated.
          </p>

          <h2>Duck fat and goose fat: incredible for roasting</h2>

          <p>
            Duck fat and goose fat are traditional cooking fats with fantastic
            flavor. They contain a mix of saturated and monounsaturated fats,
            which makes them quite stable for roasting.
          </p>

          <p>
            They’re especially good for roasted potatoes and root vegetables,
            where they help create a crisp exterior and rich flavor.
          </p>

          <h2>Coconut oil: stable but distinctive</h2>

          <p>
            Coconut oil contains a high percentage of saturated fat, which
            makes it relatively heat-stable. I mostly use it when the flavor
            fits the dish, such as curries or certain baked goods.
          </p>

          <h2>The fats I actually keep in my kitchen</h2>

          <p>
            In practice I don’t keep a huge variety of oils. Most of my cooking
            is covered by just a few:
          </p>

          <ul>
            <li>olive oil for everyday cooking</li>
            <li>butter for flavor</li>
            <li>avocado oil for high heat</li>
            <li>duck or goose fat for roasting</li>
          </ul>

          <p>
            That combination covers almost everything I cook.
          </p>

          <h2>A simple sign your pan is too hot</h2>

          <p>
            If oil starts smoking immediately when it hits the pan, the heat is
            probably too high. Lower the heat slightly and keep cooking.
          </p>

          <p>
            In my experience, good cooking is less about extreme heat and more
            about controlling the temperature.
          </p>

        </div>
      </article>
    </main>
  )
}