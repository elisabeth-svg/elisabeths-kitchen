import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-pattern mt-12 border-t border-[#e7e0d8]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="Elisabeth's Kitchen"
                width={36}
                height={36}
                className="rounded-full"
              />

              <span className="font-logo text-xl text-[#525C45]">
                Elisabeth's Kitchen
              </span>
            </div>

            <p className="mt-3 text-gray-600">
              Plan your week, cook with less stress.
            </p>

            <p className="mt-2 text-gray-600">
              Recipes designed for real weeknight cooking.
            </p>

            <div className="mt-4">
              <Link
                href="/notes"
                className="text-sm font-medium text-[#c34e28] hover:underline"
              >
                Notes →
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#525C45]">
              Recipes
            </h3>

            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/menus"
                  className="text-[#c34e28] hover:underline"
                >
                  Weekly menus
                </Link>
              </li>

              <li>
                <Link
                  href="/recipes?collection=dinner"
                  className="text-[#c34e28] hover:underline"
                >
                  Dinner recipes
                </Link>
              </li>

              <li>
                <Link
                  href="/recipes?collection=snacks"
                  className="text-[#c34e28] hover:underline"
                >
                  Kid-friendly snacks
                </Link>
              </li>

              <li>
                <Link
                  href="/recipes?collection=pantry"
                  className="text-[#c34e28] hover:underline"
                >
                  Pantry meals
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#525C45]">
              Get in touch
            </h3>

            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/suggest-recipe"
                  className="text-[#c34e28] hover:underline"
                >
                  Suggest a recipe
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-[#c34e28] hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="mt-8 flex items-center justify-center gap-2 rounded-full border bg-[#f4efe9] px-4 py-2 text-sm text-gray-600 shadow-sm">
          <Image
            src="/icon.png"
            alt="Elisabeth's Kitchen"
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>© 2026 Elisabeth's Kitchen</span>
        </div>
      </div>
    </footer>
  )
}