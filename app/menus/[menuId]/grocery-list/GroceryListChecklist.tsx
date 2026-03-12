'use client'

import { useMemo, useState } from 'react'

type GroceryItem = {
  key: string
  category: string
  displayName: string
  totalQuantity: number | null
  unit: string | null
  countWithoutQuantity: number
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

  const checkedCount = Object.values(checked).filter(Boolean).length
  const totalCount = items.length

  return (
    <div className="space-y-6 pb-24">
      <div className="sticky top-0 z-10 -mx-6 mb-4 border-b bg-white/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Shopping progress</p>
            <p className="font-medium">
              {checkedCount} of {totalCount} checked
            </p>
          </div>

          <button
            onClick={clearChecklist}
            className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-300"
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
          <section key={category} className="rounded-2xl border bg-gray-50/50 p-3">
            <button
              type="button"
              onClick={() => toggleSection(category)}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/70"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                  <p className="text-sm text-gray-500">
                    {categoryItems.length} item{categoryItems.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <span className="text-lg text-gray-500">{isOpen ? '▾' : '▸'}</span>
            </button>

            {isOpen && (
              <div className="mt-3 space-y-3">
                {categoryItems.map((item) => {
                  const isChecked = !!checked[item.key]

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleItem(item.key)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        isChecked
                          ? 'border-green-200 bg-green-50 opacity-70'
                          : 'border-gray-200 bg-white active:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border text-sm font-bold ${
                            isChecked
                              ? 'border-green-600 bg-green-600 text-white'
                              : 'border-gray-300 bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </div>

                        <div className={isChecked ? 'line-through' : ''}>
                          <div className="text-base font-medium">
                            {formatGroceryItem(item)}
                          </div>
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