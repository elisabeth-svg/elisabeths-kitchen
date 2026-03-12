'use client'

import { useEffect, useMemo, useState } from 'react'
import FavoriteButton from './FavoriteButton'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  serves: number | null
  prep_minutes: number | null
  cook_minutes: number | null
  protein_type?: string | null
  diet_type?: string | null
  difficulty?: string | null
  total_time_minutes?: number | null
}

type RecipeIngredient = {
  id: string
  ingredient_group: string
  quantity: number | null
  unit: string | null
  ingredient_name: string
  notes: string | null
}

type RecipeInstruction = {
  id: string
  step_number: number
  instruction: string
}

type Props = {
  recipe: Recipe
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  initialIsFavorite: boolean
}

function formatTotalTime(minutes: number | null | undefined) {
  if (!minutes) return null

  if (minutes < 60) return `${minutes} min`

  const hours = minutes / 60

  if (Number.isInteger(hours)) {
    return `${hours} hr`
  }

  return `${hours.toFixed(1).replace('.0', '')} hr`
}

function getTagColor(tag: string) {
  const value = tag.toLowerCase()

  if (value.includes('chicken') || value.includes('beef') || value.includes('pork')) {
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (value.includes('fish') || value.includes('salmon') || value.includes('cod')) {
    return 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }

  if (value.includes('vegetarian') || value.includes('vegan')) {
    return 'bg-green-100 text-green-800 border-green-200'
  }

  if (value.includes('oven')) {
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }

  if (value.includes('slow cooker')) {
    return 'bg-purple-100 text-purple-800 border-purple-200'
  }

  if (value.includes('one pot') || value.includes('pasta')) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  if (value.includes('easy')) {
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  if (value.includes('normal') || value.includes('medium')) {
    return 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }

  if (value.includes('hard')) {
    return 'bg-rose-100 text-rose-800 border-rose-200'
  }

  if (value.includes('min') || value.includes('hr')) {
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return 'bg-gray-100 text-gray-700 border-gray-200'
}

function formatGroupTitle(groupName: string) {
  return groupName
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatIngredient(
  ingredient: RecipeIngredient,
  multiplier: number
) {
  const quantityValue =
    ingredient.quantity !== null && ingredient.quantity !== undefined
      ? Number(ingredient.quantity) * multiplier
      : null

  const quantity = quantityValue
  const unit = ingredient.unit?.trim() ?? ''
  const ingredientName = ingredient.ingredient_name?.trim() ?? ''
  const notes = ingredient.notes?.trim() ?? ''

  let cleanedNotes = notes

  if (
    cleanedNotes &&
    ingredientName &&
    cleanedNotes.toLowerCase().startsWith(ingredientName.toLowerCase())
  ) {
    cleanedNotes = cleanedNotes.slice(ingredientName.length).trim()
  }

  const isPlural = quantity !== null && quantity !== 1

  function formatUnit(unit: string) {
    if (!unit) return ''

    if (unit === 'piece') return ''
    if (unit === 'clove') return isPlural ? 'cloves' : 'clove'
    if (unit === 'stalk') return isPlural ? 'stalks' : 'stalk'
    if (unit === 'bunch') return isPlural ? 'bunches' : 'bunch'

    return unit
  }

  function pluralizeIngredientName(name: string) {
    if (!name || !isPlural) return name

    const lower = name.toLowerCase()

    const pluralMap: Record<string, string> = {
      carrot: 'carrots',
      onion: 'onions',
      parsnip: 'parsnips',
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
  const formattedIngredientName =
    unit === 'piece' ? pluralizeIngredientName(ingredientName) : ingredientName

  const quantityText =
    quantity !== null
      ? Number.isInteger(quantity)
        ? String(quantity)
        : String(quantity)
      : ''

  const parts = [quantityText, formattedUnit, formattedIngredientName].filter(Boolean)
  let result = parts.join(' ')

  if (cleanedNotes) {
    result += ` (${cleanedNotes})`
  }

  return result.trim()
}

function getRecipeStorageKey(recipeId: string) {
  return `recipe-progress-${recipeId}`
}

export default function RecipeDetailContent({
  recipe,
  ingredients,
  instructions,
  initialIsFavorite,
}: Props) {
  const baseServings = recipe.serves ?? 1
  const [servings, setServings] = useState(baseServings)

  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>(
    () => {
      if (typeof window === 'undefined') return {}
      const stored = localStorage.getItem(getRecipeStorageKey(recipe.id))
      if (!stored) return {}

      try {
        const parsed = JSON.parse(stored)
        return parsed.checkedIngredients ?? {}
      } catch {
        return {}
      }
    }
  )

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    const stored = localStorage.getItem(getRecipeStorageKey(recipe.id))
    if (!stored) return {}

    try {
      const parsed = JSON.parse(stored)
      return parsed.checkedSteps ?? {}
    } catch {
      return {}
    }
  })

  function saveProgress(
    nextIngredients: Record<string, boolean>,
    nextSteps: Record<string, boolean>
  ) {
    localStorage.setItem(
      getRecipeStorageKey(recipe.id),
      JSON.stringify({
        checkedIngredients: nextIngredients,
        checkedSteps: nextSteps,
      })
    )
  }

  function toggleIngredient(id: string) {
    setCheckedIngredients((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveProgress(next, checkedSteps)
      return next
    })
  }

  function toggleStep(id: string) {
    setCheckedSteps((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveProgress(checkedIngredients, next)
      return next
    })
  }

  function clearProgress() {
    setCheckedIngredients({})
    setCheckedSteps({})
    localStorage.removeItem(getRecipeStorageKey(recipe.id))
  }

  const ingredientsByGroup = useMemo(() => {
    return ingredients.reduce<Record<string, RecipeIngredient[]>>((acc, ingredient) => {
      if (!acc[ingredient.ingredient_group]) {
        acc[ingredient.ingredient_group] = []
      }
      acc[ingredient.ingredient_group].push(ingredient)
      return acc
    }, {})
  }, [ingredients])

  const ingredientDoneCount = Object.values(checkedIngredients).filter(Boolean).length
  const stepDoneCount = Object.values(checkedSteps).filter(Boolean).length
  const totalSteps = instructions.length
  const stepProgress = totalSteps > 0 ? (stepDoneCount / totalSteps) * 100 : 0

  const tags = Array.from(
    new Set(
      [
        recipe.recipe_type,
        recipe.protein_type,
        recipe.diet_type,
        recipe.difficulty,
        formatTotalTime(recipe.total_time_minutes),
      ].filter(Boolean)
    )
  ) as string[]

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          Recipe
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          {recipe.title}
        </h1>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getTagColor(tag)}`}
              >
                {tag.replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
          <FavoriteButton
            recipeId={recipe.id}
            initialIsFavorite={initialIsFavorite}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Type</div>
            <div className="mt-1 font-medium text-gray-900">{recipe.recipe_type}</div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Serves</div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setServings((current) => Math.max(1, current - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-lg text-gray-900 hover:bg-gray-100"
              >
                −
              </button>

              <span className="w-6 text-center font-medium text-gray-900">
                {servings}
              </span>

              <button
                type="button"
                onClick={() => setServings((current) => current + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-lg text-gray-900 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Prep</div>
            <div className="mt-1 font-medium text-gray-900">
              {recipe.prep_minutes ?? '—'} min
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Cook</div>
            <div className="mt-1 font-medium text-gray-900">
              {recipe.cook_minutes ?? '—'} min
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{ingredientDoneCount} ingredients checked</span>
            <span>{stepDoneCount} steps completed</span>
          </div>

          <button
            type="button"
            onClick={clearProgress}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Reset progress
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Ingredients</h2>

          <div className="mt-5 space-y-6">
            {Object.entries(ingredientsByGroup).map(([groupName, groupIngredients]) => (
              <div key={groupName}>
                <div className="mb-3 border-b pb-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {formatGroupTitle(groupName)}
                  </h3>
                </div>

                <div className="space-y-2">
                  {groupIngredients.map((ingredient) => {
                    const isChecked = !!checkedIngredients[ingredient.id]

                    return (
                      <button
                        key={ingredient.id}
                        type="button"
                        onClick={() => toggleIngredient(ingredient.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                          isChecked
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50 hover:bg-white'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                            isChecked
                              ? 'border-green-600 bg-green-600 text-white'
                              : 'border-gray-300 bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </div>

                        <div className="text-sm leading-6 text-gray-800">
                          {formatIngredient(ingredient, servings / baseServings)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Instructions</h2>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Step progress</span>
              <span>{stepDoneCount} / {totalSteps}</span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          <ol className="mt-5 space-y-4">
            {instructions.map((step) => {
              const isChecked = !!checkedSteps[step.id]

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition ${
                      isChecked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isChecked
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {isChecked ? '✓' : step.step_number}
                    </div>

                    <p className="pt-0.5 text-sm leading-7 text-gray-800">
                      {step.instruction}
                    </p>
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}