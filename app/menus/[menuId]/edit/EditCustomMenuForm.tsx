'use client'

import { useMemo, useState } from 'react'
import { updateCustomMenu } from './actions'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  protein_type: string | null
  total_time_minutes: number | null
}

type Menu = {
  id: string
  name: string
  description: string | null
}

type Props = {
  menu: Menu
  recipes: Recipe[]
  selectedRecipeIds: string[]
}

function formatTotalTime(minutes: number | null) {
  if (!minutes) return null

  if (minutes < 60) return `${minutes} min`

  const hours = minutes / 60

  if (Number.isInteger(hours)) {
    return `${hours} hr`
  }

  return `${hours.toFixed(1).replace('.0', '')} hr`
}

export default function EditCustomMenuForm({
  menu,
  recipes,
  selectedRecipeIds,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedRecipeIds)
  const [menuName, setMenuName] = useState(menu.name)
  const [menuNote, setMenuNote] = useState(menu.description ?? '')

  const canSubmit =
    menuName.trim().length > 0 &&
    selectedIds.length >= 1 &&
    selectedIds.length <= 7

  function toggleRecipe(recipeId: string) {
    setSelectedIds((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId)
      }

      if (prev.length >= 7) {
        return prev
      }

      return [...prev, recipeId]
    })
  }

  const selectedRecipes = useMemo(
    () => recipes.filter((recipe) => selectedIds.includes(recipe.id)),
    [recipes, selectedIds]
  )

  const boundAction = updateCustomMenu.bind(null, menu.id)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Edit recipes</h2>
        <p className="mt-2 text-sm text-gray-600">
          Update your custom menu by selecting between 1 and 7 recipes.
        </p>

        <div className="mt-5 space-y-3">
          {recipes.map((recipe) => {
            const isSelected = selectedIds.includes(recipe.id)
            const disabled = !isSelected && selectedIds.length >= 7

            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => toggleRecipe(recipe.id)}
                disabled={disabled}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-green-300 bg-green-50'
                    : disabled
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50'
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
                    <div className="font-medium text-gray-900">{recipe.title}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="capitalize">{recipe.recipe_type}</span>
                      {recipe.protein_type ? ` • ${recipe.protein_type}` : ''}
                      {recipe.total_time_minutes
                        ? ` • ${formatTotalTime(recipe.total_time_minutes)}`
                        : ''}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Edit custom menu</h2>
        <p className="mt-2 text-sm text-gray-600">
          Update the name, note, and selected recipes.
        </p>

        <form action={boundAction} className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="menuName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Menu name
            </label>
            <input
              id="menuName"
              name="menuName"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="menuNote"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Short note (optional)
            </label>
            <textarea
              id="menuNote"
              name="menuNote"
              value={menuNote}
              onChange={(e) => setMenuNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Selected recipes</h3>
              <span className="text-sm text-gray-500">
                {selectedIds.length} / 7
              </span>
            </div>

            {selectedRecipes.length === 0 ? (
              <p className="mt-3 text-sm text-gray-600">
                No recipes selected yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {selectedRecipes.map((recipe, index) => (
                  <li
                    key={recipe.id}
                    className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-800"
                  >
                    <span className="mr-2 font-medium text-gray-500">
                      {index + 1}.
                    </span>
                    {recipe.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedIds.map((id) => (
            <input key={id} type="hidden" name="recipeIds" value={id} />
          ))}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full rounded-xl px-5 py-3 text-sm font-medium text-white ${
              canSubmit
                ? 'bg-green-600 hover:bg-green-700'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Save changes
          </button>
        </form>
      </section>
    </div>
  )
}