import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="footer-bar" />

      <div className="footer-pattern">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e7e0d8] bg-[#f4efe9] p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="Elisabeth's Kitchen"
                width={38}
                height={38}
                className="rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                Elisabeth’s Kitchen
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Plan your week, cook with less stress.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e0d8] bg-[#f4efe9] p-6 shadow-sm">
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

          <div className="rounded-2xl border border-[#e7e0d8] bg-[#f4efe9] p-6 shadow-sm">
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

        <div className="flex justify-center px-6 pb-8">
          <div className="flex items-center gap-2 rounded-full border border-[#e7e0d8] bg-[#f4efe9] px-5 py-2 text-xs text-gray-600 shadow-sm">
            <Image
              src="/icon.png"
              alt="Elisabeth's Kitchen"
              width={18}
              height={18}
              className="rounded-full"
            />
            <span>© 2026 Elisabeth’s Kitchen</span>
          </div>
        </div>
      </div>

      <div className="footer-bar" />
    </footer>
  )
}