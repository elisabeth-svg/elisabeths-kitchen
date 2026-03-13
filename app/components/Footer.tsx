import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#d8d0c7] bg-[#f7f3ef]">
      <div className="mx-auto max-w-5xl px-6 py-12 grid gap-10 md:grid-cols-3">

        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Elisabeth’s Kitchen
          </h3>
          <p className="mt-3 text-sm text-gray-600 leading-6">
            Plan your week, cook with less stress.
          </p>
        </div>

        {/* Recipes */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Recipes
          </h4>

          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/menus" className="text-blue-600 hover:underline">
                Weekly menus
              </Link>
            </li>

            <li>
              <Link
                href="/recipes?collection=dinner"
                className="text-blue-600 hover:underline"
              >
                Dinner recipes
              </Link>
            </li>

            <li>
              <Link href="/kids-snacks" className="text-blue-600 hover:underline">
                Kid-friendly snacks
              </Link>
            </li>

            <li>
              <Link
                href="/pantry-suggestions"
                className="text-blue-600 hover:underline"
              >
                Pantry meals
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Notes */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Get in touch
          </h4>

          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/suggest-recipe"
                className="text-blue-600 hover:underline"
              >
                Suggest a recipe
              </Link>
            </li>

            <li>
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact
              </Link>
            </li>
          </ul>

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium">Notes</p>
            <p className="mt-1 leading-6">
              Recipes designed for real weeknight cooking.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-[#d8d0c7] py-4 text-center text-xs text-gray-500">
        © 2026 Elisabeth’s Kitchen
      </div>
    </footer>
  )
}