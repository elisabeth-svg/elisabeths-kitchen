'use client'

import Link from 'next/link'
import { useState } from 'react'

type Props = {
  clearAllHref: string
  activeFilterCount: number
  recipeTypes: string[]
  proteinTypes: string[]
  dietTypes: string[]
  selectedRecipeTypes: string[]
  selectedProteinTypes: string[]
  selectedDietTypes: string[]
  selectedMaxTime: string
  recipeTypeCounts: Record<string, number>
  proteinTypeCounts: Record<string, number>
  dietTypeCounts: Record<string, number>
  currentQueryString: string
  countByMaxTimeValues: {
    '30': number
    '45': number
    '60': number
  }
}

function buildQueryString(
  currentQueryString: string,
  key: string,
  value: string
) {
  const params = new URLSearchParams(currentQueryString)
  const existing = params.getAll(key)

  params.delete(key)

  if (existing.includes(value)) {
    existing
      .filter((item) => item !== value)
      .forEach((item) => params.append(key, item))
  } else {
    ;[...existing, value].forEach((item) => params.append(key, item))
  }

  const query = params.toString()
  return query ? `/recipes?${query}` : '/recipes'
}

function buildSingleValueQuery(
  currentQueryString: string,
  key: string,
  value: string
) {
  const params = new URLSearchParams(currentQueryString)

  if (!value) {
    params.delete(key)
  } else {
    params.set(key, value)
  }

  const query = params.toString()
  return query ? `/recipes?${query}` : '/recipes'
}

function FilterOption({
  href,
  checked,
  label,
  count,
  capitalize = false,
}: {
  href: string
  checked: boolean
  label: string
  count?: number
  capitalize?: boolean
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded border text-xs ${
            checked
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-transparent'
          }`}
        >
          ✓
        </span>
        <span className={`text-sm text-gray-700 ${capitalize ? 'capitalize' : ''}`}>
          {label}
        </span>
      </div>

      {count !== undefined && (
        <span className="text-xs text-gray-400">{count}</span>
      )}
    </Link>
  )
}

export default function RecipeFilters({
  clearAllHref,
  activeFilterCount,
  recipeTypes,
  proteinTypes,
  dietTypes,
  selectedRecipeTypes,
  selectedProteinTypes,
  selectedDietTypes,
  selectedMaxTime,
  recipeTypeCounts,
  proteinTypeCounts,
  dietTypeCounts,
  currentQueryString,
  countByMaxTimeValues,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Filters</h1>
          <p className="mt-2 text-sm text-gray-600">
            {activeFilterCount === 0
              ? 'No filters selected'
              : `${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} selected`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={clearAllHref}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-full border border-[#e7e0d8] bg-[#f4efe9] px-4 py-2 text-sm font-medium text-gray-700 md:hidden"
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className={`${isOpen ? 'mt-6 block' : 'mt-6 hidden'} md:block`}>
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Cooking style
            </h2>
            <div className="space-y-2">
              {recipeTypes.map((value) => (
                <FilterOption
                  key={value}
                  href={buildQueryString(currentQueryString, 'recipe_type', value)}
                  checked={selectedRecipeTypes.includes(value)}
                  label={value}
                  count={recipeTypeCounts[value] ?? 0}
                  capitalize
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Protein
            </h2>
            <div className="space-y-2">
              {proteinTypes.map((value) => (
                <FilterOption
                  key={value}
                  href={buildQueryString(currentQueryString, 'protein_type', value)}
                  checked={selectedProteinTypes.includes(value)}
                  label={value}
                  count={proteinTypeCounts[value] ?? 0}
                  capitalize
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Diet
            </h2>
            <div className="space-y-2">
              {dietTypes.map((value) => (
                <FilterOption
                  key={value}
                  href={buildQueryString(currentQueryString, 'diet_type', value)}
                  checked={selectedDietTypes.includes(value)}
                  label={value}
                  count={dietTypeCounts[value] ?? 0}
                  capitalize
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Cooking time
            </h2>
            <div className="space-y-2">
              <FilterOption
                href={buildSingleValueQuery(currentQueryString, 'max_time', '')}
                checked={selectedMaxTime === ''}
                label="Any"
              />
              <FilterOption
                href={buildSingleValueQuery(currentQueryString, 'max_time', '30')}
                checked={selectedMaxTime === '30'}
                label="Under 30 min"
                count={countByMaxTimeValues['30']}
              />
              <FilterOption
                href={buildSingleValueQuery(currentQueryString, 'max_time', '45')}
                checked={selectedMaxTime === '45'}
                label="Under 45 min"
                count={countByMaxTimeValues['45']}
              />
              <FilterOption
                href={buildSingleValueQuery(currentQueryString, 'max_time', '60')}
                checked={selectedMaxTime === '60'}
                label="Under 60 min"
                count={countByMaxTimeValues['60']}
              />
            </div>
          </section>
        </div>
      </div>
    </aside>
  )
}