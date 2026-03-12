'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { clearPantry, togglePantryItem } from './actions'

type Ingredient = {
  id: string
  display_name: string
  category: string
  store_section: string | null
}

type Props = {
  ingredients: Ingredient[]
  pantryIds: string[]
}

function getSectionName(ingredient: Ingredient) {
  return ingredient.store_section || ingredient.category || 'Other'
}

function getSectionOrder(section: string) {
  const order: Record<string, number> = {
    Produce: 1,
    'Meat & Poultry': 2,
    'Fish & Seafood': 3,
    'Dairy & Eggs': 4,
    Bakery: 5,
    'Bakery & Grains': 6,
    Pantry: 7,
    Spices: 8,
    Herbs: 9,
    Freezer: 10,
    Other: 99,
  }

  return order[section] ?? 99
}

function getSectionIcon(section: string) {
  switch (section) {
    case 'Produce':
      return '🥕'
    case 'Meat & Poultry':
      return '🥩'
    case 'Fish & Seafood':
      return '🐟'
    case 'Dairy & Eggs':
      return '🥛'
    case 'Bakery':
    case 'Bakery & Grains':
      return '🥖'
    case 'Pantry':
      return '🧂'
    case 'Spices':
      return '🌶️'
    case 'Herbs':
      return '🌿'
    case 'Freezer':
      return '❄️'
    default:
      return '🛒'
  }
}

export default function PantryList({ ingredients, pantryIds }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(pantryIds)
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const filteredIngredients = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return ingredients

    return ingredients.filter((ingredient) =>
      ingredient.display_name.toLowerCase().includes(q)
    )
  }, [ingredients, query])

  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {}

    for (const ingredient of filteredIngredients) {
      const section = getSectionName(ingredient)

      if (!groups[section]) {
        groups[section] = []
      }

      groups[section].push(ingredient)
    }

    return Object.entries(groups)
      .sort((a, b) => {
        const sectionOrderDiff =
          getSectionOrder(a[0]) - getSectionOrder(b[0])

        if (sectionOrderDiff !== 0) return sectionOrderDiff

        return a[0].localeCompare(b[0])
      })
      .map(([section, items]) => ({
        section,
        items: items.sort((a, b) =>
          a.display_name.localeCompare(b.display_name)
        ),
      }))
  }, [filteredIngredients])

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev }

      for (const { section } of groupedIngredients) {
        if (!(section in next)) {
          next[section] = true
        }
      }

      return next
    })
  }, [groupedIngredients])

  function handleToggle(ingredientId: string) {
    const currentlySelected = selectedSet.has(ingredientId)

    setSelectedIds((prev) =>
      currentlySelected
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    )

    startTransition(async () => {
      await togglePantryItem(ingredientId, !currentlySelected)
    })
  }

  function handleClearPantry() {
    setSelectedIds([])

    startTransition(async () => {
      await clearPantry()
    })
  }

  function toggleSection(section: string) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Pantry ingredients
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {selectedIds.length} ingredient{selectedIds.length === 1 ? '' : 's'} in pantry
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ingredients..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none sm:w-72 focus:border-gray-500"
          />

          <button
            type="button"
            onClick={handleClearPantry}
            disabled={selectedIds.length === 0 || isPending}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              selectedIds.length === 0 || isPending
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-gray-900 text-white hover:bg-black'
            }`}
          >
            Clear pantry
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {groupedIngredients.length === 0 ? (
          <p className="text-sm text-gray-600">No ingredients found.</p>
        ) : (
          groupedIngredients.map(({ section, items }) => {
            const isOpen = openSections[section] ?? true

            return (
              <div key={section}>
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className="mb-3 flex w-full items-center justify-between gap-3 border-b pb-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSectionIcon(section)}</span>
                    <h3 className="text-base font-semibold text-gray-900">
                      {section}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({items.length})
                    </span>
                  </div>

                  <span className="text-sm text-gray-500">
                    {isOpen ? '▾' : '▸'}
                  </span>
                </button>

                {isOpen && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((ingredient) => {
                      const isSelected = selectedSet.has(ingredient.id)

                      return (
                        <button
                          key={ingredient.id}
                          type="button"
                          onClick={() => handleToggle(ingredient.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                                isSelected
                                  ? 'border-green-600 bg-green-600 text-white'
                                  : 'border-gray-300 bg-white text-transparent'
                              }`}
                            >
                              ✓
                            </div>

                            <div>
                              <div className="font-medium text-gray-900">
                                {ingredient.display_name}
                              </div>
                              <div className="mt-1 text-sm text-gray-600">
                                {ingredient.store_section || ingredient.category}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {isPending && (
        <p className="mt-4 text-sm text-gray-500">Saving pantry changes...</p>
      )}
    </section>
  )
}