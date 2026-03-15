'use client'

import { useMemo, useState } from 'react'

type GroceryItem = {
  key: string
  category: string
  displayName: string
  totalQuantity: number | null
  unit: string | null
  countWithoutQuantity: number
  inPantry: boolean
}

type Props = {
  items: GroceryItem[]
}

function formatQuantity(value: number) {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(2).replace(/\.?0+$/, '')
}

function formatGroceryItem(item: GroceryItem) {
  const quantity = item.totalQuantity
  const unit = item.unit?.trim() ?? ''
  const name = item.displayName?.trim() ?? ''

  const isPlural = quantity !== null && quantity !== 1

  function formatUnit(unit: string) {
    if (!unit) return ''

    if (unit === 'piece') return ''
    if (unit === 'clove') return isPlural ? 'cloves' : 'clove'
    if (unit === 'stalk') return isPlural ? 'stalks' : 'stalk'
    if (unit === 'bunch') return isPlural ? 'bunches' : 'bunch'

    return unit
  }

  function pluralizeIngredient(name: string) {
    if (!isPlural) return name

    const lower = name.toLowerCase()

    const pluralMap: Record<string, string> = {
      carrot: 'carrots',
      onion: 'onions',
      cucumber: 'cucumbers',
      potato: 'potatoes',
      'sweet potato': 'sweet potatoes',
      egg: 'eggs',
      'salmon fillet': 'salmon fillets',
      'cod fillet': 'cod fillets',
      'chicken drumstick': 'chicken drumsticks',
    }

    return pluralMap[lower] ?? name
  }

  const formattedUnit = formatUnit(unit)
  const formattedName = unit === 'piece' ? pluralizeIngredient(name) : name

  if (quantity !== null) {
    const quantityText = formatQuantity(quantity)
    return [quantityText, formattedUnit, formattedName].filter(Boolean).join(' ')
  }

  if (item.countWithoutQuantity > 1) {
    return `${item.countWithoutQuantity}x ${formattedName}`
  }

  return formattedName
}

function getSectionIcon(category: string) {
  switch (category) {
    case 'Produce':
      return '🥕'
    case 'Meat & Poultry':
      return '🥩'
    case 'Fish & Seafood':
      return '🐟'
    case 'Dairy & Eggs':
      return '🥛'
    case 'Bakery':
      return '🥖'
    case 'Pantry':
      return '🧂'
    case 'Spices':
      return '🌿'
    case 'Frozen':
      return '❄️'
    default:
      return '🛒'
  }
}

export default function GroceryListChecklist({ items }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    const stored = localStorage.getItem('grocery-checklist')
    return stored ? JSON.parse(stored) : {}
  })

  const itemsByCategory = useMemo(
    () =>
      items.reduce<Record<string, GroceryItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
      }, {}),
    [items]
  )

  const orderedCategories = Object.keys(itemsByCategory)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    orderedCategories.forEach((category) => {
      initial[category] = true
    })
    return initial
  })

  function clearChecklist() {
    setChecked({})
    localStorage.removeItem('grocery-checklist')
  }

  function toggleItem(key: string) {
    setChecked((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      }

      localStorage.setItem('grocery-checklist', JSON.stringify(updated))
      return updated
    })
  }

  function toggleSection(category: string) {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const effectiveCheckedCount = items.filter(
    (item) => item.inPantry || checked[item.key]
  ).length

  const totalCount = items.length

  return (
    <div className="space-y-4 pb-20 sm:space-y-5 sm:pb-24">
      <div className="sticky top-0 z-10 mb-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:mb-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
              Shopping progress
            </p>
            <p className="text-sm font-medium sm:text-base">
              {effectiveCheckedCount} of {totalCount} checked
            </p>
          </div>

          <button
            onClick={clearChecklist}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>

      {orderedCategories.map((category) => {
        const categoryItems = itemsByCategory[category]
        const isOpen = openSections[category] ?? true
        const icon = getSectionIcon(category)

        return (
          <section
            key={category}
            className="rounded-2xl border bg-white p-3 shadow-sm sm:p-4"
          >
            <button
              type="button"
              onClick={() => toggleSection(category)}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg sm:text-xl">{icon}</span>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                    {category}
                  </h2>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {categoryItems.length} item{categoryItems.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <span className="text-base text-gray-500 sm:text-lg">
                {isOpen ? '▾' : '▸'}
              </span>
            </button>

            {isOpen && (
              <div className="mt-3 space-y-2.5 sm:space-y-3">
                {categoryItems.map((item) => {
                  const isChecked = item.inPantry || !!checked[item.key]

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        if (item.inPantry) return
                        toggleItem(item.key)
                      }}
                      className={`w-full rounded-xl border p-3 text-left transition sm:p-4 ${
                        isChecked
                          ? 'border-green-200 bg-green-50 opacity-70'
                          : 'border-gray-200 bg-gray-50 hover:bg-white active:bg-gray-50'
                      } ${item.inPantry ? 'cursor-default' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold sm:h-6 sm:w-6 sm:text-sm ${
                            isChecked
                              ? 'border-green-600 bg-green-600 text-white'
                              : 'border-gray-300 bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </div>

                        <div className={isChecked ? 'line-through' : ''}>
                          <div className="text-sm font-medium leading-5 sm:text-base sm:leading-6">
                            {formatGroceryItem(item)}
                          </div>

                          {item.inPantry && (
                            <div className="mt-1 text-xs font-medium text-green-700 sm:text-sm">
                              In pantry
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}