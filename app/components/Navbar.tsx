'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import posthog from 'posthog-js'
import { createClient } from '@/lib/supabase/client'

type AuthUser = {
  id?: string
  email?: string
  firstName?: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  function linkClass(path: string) {
    const isActive =
      pathname === path || (path !== '/' && pathname.startsWith(path))

    return `text-sm font-medium transition ${
      isActive
        ? 'text-black underline underline-offset-4'
        : 'text-gray-700 hover:text-black hover:underline underline-offset-4'
    }`
  }

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const firstNameFromMetadata =
        user?.user_metadata?.first_name as string | undefined
      const fullName =
        user?.user_metadata?.full_name as string | undefined

      const firstName =
        firstNameFromMetadata ??
        fullName?.split(' ')[0] ??
        user?.email?.split('@')[0] ??
        null

      if (user) {
        posthog.identify(user.id, {
          email: user.email,
          first_name: firstName ?? undefined,
        })
      } else {
        posthog.reset()
      }

      if (isMounted) {
        setUser(
          user
            ? {
                id: user.id,
                email: user.email,
                firstName: firstName ?? undefined,
              }
            : null
        )
        setLoading(false)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const firstNameFromMetadata =
        session?.user?.user_metadata?.first_name as string | undefined
      const fullName =
        session?.user?.user_metadata?.full_name as string | undefined

      const firstName =
        firstNameFromMetadata ??
        fullName?.split(' ')[0] ??
        session?.user?.email?.split('@')[0] ??
        null

      if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
          first_name: firstName ?? undefined,
        })
      } else {
        posthog.reset()
      }

      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
              firstName: firstName ?? undefined,
            }
          : null
      )

      setLoading(false)
      router.refresh()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <>
      <div className="h-2 w-full bg-[#2c585f]" />

      <header className="navbar-pattern sticky top-0 z-50 border-b border-[#e7e0d8]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col items-center gap-3 lg:w-full lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-5xl rounded-full border border-[#e7e0d8] bg-[#f4efe9] px-5 py-3 shadow-sm lg:max-w-none lg:w-auto">
              <Link
                href="/"
                className="flex items-center justify-center gap-3 text-gray-900 lg:justify-start"
              >
                <Image
                  src="/icon.png"
                  alt="Elisabeth's Kitchen"
                  width={34}
                  height={34}
                  priority
                  className="rounded-full"
                />

                <span className="font-logo text-[1.45rem] leading-none text-[#525C45] sm:text-[1.7rem] lg:text-[1.9rem]">
                  Elisabeth&apos;s Kitchen
                </span>
              </Link>
            </div>

            <div className="flex w-full max-w-5xl flex-col items-center gap-3 lg:max-w-none lg:w-auto lg:flex-row lg:items-center">
              <nav className="w-full rounded-full border border-[#e7e0d8] bg-[#f4efe9] px-5 py-3 shadow-sm lg:w-auto lg:px-6">
                <div className="flex items-center justify-center gap-8 sm:gap-10 lg:flex-wrap lg:justify-start lg:gap-6">
                  <Link href="/" className={linkClass('/')}>
                    Home
                  </Link>

                  <Link href="/menus" className={linkClass('/menus')}>
                    Weekly Menus
                  </Link>

                  <Link href="/recipes" className={linkClass('/recipes')}>
                    Recipes
                  </Link>
                </div>
              </nav>

              <div className="w-full rounded-full border border-[#e7e0d8] bg-[#f4efe9] px-5 py-2.5 shadow-sm lg:w-auto lg:px-5 lg:py-2">
                <div className="flex items-center justify-center gap-4 lg:justify-start">
                  {loading ? (
                    <span className="text-sm text-gray-500">Loading...</span>
                  ) : user ? (
                    <>
                      <Link
                        href="/profile"
                        className={linkClass('/profile')}
                      >
                        Hi{user.firstName ? `, ${user.firstName}` : ''}
                      </Link>

                      <Link
                        href="/pantry"
                        className={linkClass('/pantry')}
                      >
                        Pantry
                      </Link>

                      <Link
                        href="/notes"
                        className={linkClass('/notes')}
                      >
                        Notes
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/notes"
                        className={linkClass('/notes')}
                      >
                        Notes
                      </Link>

                      <Link
                        href="/login"
                        className="text-sm font-medium text-gray-700 hover:text-black hover:underline underline-offset-4"
                      >
                        Log in
                      </Link>

                      <Link
                        href="/signup"
                        className="rounded-full bg-[#2c585f] px-4 py-2 text-sm font-medium text-white hover:bg-[#24474d]"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="h-2 w-full bg-[#2c585f]" />
    </>
  )
}