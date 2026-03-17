'use client'

import { useMemo, useState } from 'react'

type GroceryListItem = {
  id: string
  ingredient_name: string
  quantity?: number | null
  unit?: string | null
  store_section?: string | null
  notes?: string | null
}

type GroceryListActionsProps = {
  title?: string
  items: GroceryListItem[]
}

function formatLine(item: GroceryListItem) {
  const quantity =
    item.quantity !== null && item.quantity !== undefined
      ? `${Number.isInteger(item.quantity) ? item.quantity : item.quantity}`
      : ''

  const unit = item.unit?.trim() ? ` ${item.unit}` : ''
  const notes = item.notes?.trim() ? ` (${item.notes.trim()})` : ''

  return `- ${quantity}${unit}${quantity || unit ? ' ' : ''}${item.ingredient_name}${notes}`.replace(
    /\s+/g,
    ' '
  )
}

function groupItems(items: GroceryListItem[]) {
  const grouped = new Map<string, GroceryListItem[]>()

  for (const item of items) {
    const section = item.store_section?.trim() || 'Other'
    if (!grouped.has(section)) grouped.set(section, [])
    grouped.get(section)!.push(item)
  }

  return Array.from(grouped.entries())
}

export default function GroceryListActions({
  title = 'Grocery List',
  items,
}: GroceryListActionsProps) {
  const [copied, setCopied] = useState(false)

  const groupedItems = useMemo(() => groupItems(items), [items])

  const listText = useMemo(() => {
    const lines: string[] = [title, '']

    groupedItems.forEach(([section, sectionItems]) => {
      lines.push(section)
      sectionItems.forEach((item) => {
        lines.push(formatLine(item))
      })
      lines.push('')
    })

    return lines.join('\n').trim()
  }, [groupedItems, title])

  const encodedSubject = encodeURIComponent(title)
  const encodedBody = encodeURIComponent(listText)
  const mailtoHref = `mailto:?subject=${encodedSubject}&body=${encodedBody}`
  const whatsappHref = `https://wa.me/?text=${encodedBody}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(listText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy grocery list:', error)
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: listText,
        })
        return
      }

      await navigator.clipboard.writeText(listText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to share grocery list:', error)
    }
  }

  function handlePrint() {
    window.print()
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-stone-900">
          Your grocery list is ready
        </h2>
        <p className="mt-1 text-sm text-stone-600">Use it your way:</p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 pb-1">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-10 items-center rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Print
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-10 items-center rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-10 items-center rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Share
          </button>

          <a
            href={mailtoHref}
            className="inline-flex h-10 items-center rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Email
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}