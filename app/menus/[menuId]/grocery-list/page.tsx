import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import GroceryListChecklist from './GroceryListChecklist'
import GroceryListActions from '@/app/components/GroceryListActions'

type PageProps = {
  params: Promise<{ menuId: string }>
}

type MenuRecipeRow = {
  recipe_id: string
}

type IngredientRow = {
  ingredient_id: string | null
  canonical_ingredient: string | null
  ingredient_name: string
  quantity: number | null
  unit: string | null
}

type IngredientMasterRow = {
  id: string
  canonical_ingredient: string
  display_name: string
  category: string
  store_section: string | null
}

type PantryRow = {
  ingredient_id: string
}

type GroceryItem = {
  key: string
  category: string
  displayName: string
  totalQuantity: number | null
  unit: string | null
  countWithoutQuantity: number
  inPantry: boolean
}

function mapCategoryToStoreSection(category?: string) {
  switch (category) {
    case 'vegetables':
    case 'fruit':
    case 'herbs':
      return 'Produce'

    case 'meat':
      return 'Meat & Poultry'

    case 'fish':
      return 'Fish & Seafood'

    case 'dairy':
      return 'Dairy & Eggs'

    case 'bread':
      return 'Bakery'

    case 'grains':
      return 'Bakery & Grains'

    case 'pantry':
      return 'Pantry'

    case 'spices':
      return 'Spices'

    default:
      return 'Other'
  }
}

function getSectionOrder(category: string) {
  const order: Record<string, number> = {
    Produce: 1,
    'Meat & Poultry': 2,
    'Fish & Seafood': 3,
    'Dairy & Eggs': 4,
    Bakery: 5,
    'Bakery & Grains': 6,
    Pantry: 7,
    Spices: 8,
    Other: 9,
  }

  return order[category] ?? 999
}

function formatMenuTitle(name: string) {
  return `${name} Grocery List`
}

export default async function GroceryListPage({ params }: PageProps) {
  const { menuId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: menu, error: menuError } = await supabase
    .from('weekly_menus')
    .select('id, name')
    .eq('id', menuId)
    .single()

  const { data: menuRecipes, error: menuRecipesError } = await supabase
    .from('menu_recipes')
    .select('recipe_id')
    .eq('menu_id', menuId)
    .order('order_index')

  if (menuError || menuRecipesError || !menu) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto mt-6 max-w-6xl">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Grocery List</h1>
            <p className="mt-4 text-red-600">
              There was a problem loading this menu.
            </p>
          </section>
        </div>
      </main>
    )
  }

  const recipeIds = ((menuRecipes ?? []) as MenuRecipeRow[]).map(
    (row) => row.recipe_id
  )

  if (recipeIds.length === 0) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto mt-6 max-w-6xl">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <Link
              href="/menus"
              className="mb-4 inline-block text-sm text-blue-600 hover:underline"
            >
              ← Back to menus
            </Link>

            <h1 className="text-2xl font-semibold">{formatMenuTitle(menu.name)}</h1>
            <p className="mt-4 text-gray-600">No recipes found for this menu.</p>
          </section>
        </div>
      </main>
    )
  }

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .select(
      'ingredient_id, canonical_ingredient, ingredient_name, quantity, unit'
    )
    .in('recipe_id', recipeIds)

  if (ingredientsError) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto mt-6 max-w-6xl">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Grocery List</h1>
            <p className="mt-4 text-red-600">
              There was a problem loading ingredients.
            </p>
          </section>
        </div>
      </main>
    )
  }

  const ingredientIds = Array.from(
    new Set(
      ((ingredients ?? []) as IngredientRow[])
        .map((item) => item.ingredient_id)
        .filter((value): value is string => Boolean(value))
    )
  )

  let masterMap = new Map<string, IngredientMasterRow>()

  if (ingredientIds.length > 0) {
    const { data: masterRows } = await supabase
      .from('ingredients_master')
      .select('id, canonical_ingredient, display_name, category, store_section')
      .in('id', ingredientIds)

    masterMap = new Map(
      ((masterRows ?? []) as IngredientMasterRow[]).map((row) => [row.id, row])
    )
  }

  let pantryIngredientIds = new Set<string>()

  if (user) {
    const { data: pantryRows } = await supabase
      .from('user_pantry')
      .select('ingredient_id')
      .eq('user_id', user.id)

    pantryIngredientIds = new Set(
      ((pantryRows ?? []) as PantryRow[]).map((row) => row.ingredient_id)
    )
  }

  const grouped = new Map<string, GroceryItem>()

  for (const ingredient of (ingredients ?? []) as IngredientRow[]) {
    const master = ingredient.ingredient_id
      ? masterMap.get(ingredient.ingredient_id)
      : undefined

    const canonical =
      master?.canonical_ingredient ??
      ingredient.canonical_ingredient ??
      ingredient.ingredient_name

    const displayName = master?.display_name ?? ingredient.ingredient_name
    const category =
      master?.store_section || mapCategoryToStoreSection(master?.category)

    const unit = ingredient.unit ?? null
    const key = `${canonical}__${unit ?? 'none'}`
    const inPantry =
      ingredient.ingredient_id !== null &&
      pantryIngredientIds.has(ingredient.ingredient_id)

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        category,
        displayName,
        totalQuantity: null,
        unit,
        countWithoutQuantity: 0,
        inPantry,
      })
    }

    const current = grouped.get(key)!

    if (ingredient.quantity !== null && ingredient.quantity !== undefined) {
      current.totalQuantity =
        (current.totalQuantity ?? 0) + Number(ingredient.quantity)
    } else {
      current.countWithoutQuantity += 1
    }

    if (inPantry) {
      current.inPantry = true
    }
  }

  const items = Array.from(grouped.values()).sort((a, b) => {
    if (a.inPantry !== b.inPantry) {
      return a.inPantry ? -1 : 1
    }

    const categoryDiff = getSectionOrder(a.category) - getSectionOrder(b.category)

    if (categoryDiff !== 0) return categoryDiff

    return a.displayName.localeCompare(b.displayName)
  })

  const actionItems = items.map((item) => ({
    id: item.key,
    ingredient_name:
      item.totalQuantity === null && item.countWithoutQuantity > 1
        ? `${item.displayName} (${item.countWithoutQuantity})`
        : item.displayName,
    quantity: item.totalQuantity,
    unit: item.unit,
    store_section: item.category,
    notes: item.inPantry ? 'Already in pantry' : null,
  }))

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto mt-6 max-w-6xl space-y-6">
        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <Link
            href="/menus"
            className="mb-4 inline-block text-sm text-blue-600 hover:underline"
          >
            ← Back to menus
          </Link>

          <h1 className="mb-2 text-2xl font-semibold">{formatMenuTitle(menu.name)}</h1>
          <p className="text-sm leading-6 text-gray-600">
            Combined ingredients from all recipes in this weekly menu.
          </p>
        </section>

        <GroceryListActions
          title={formatMenuTitle(menu.name)}
          items={actionItems}
        />

        <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
          <GroceryListChecklist items={items} />
        </section>
      </div>
    </main>
  )
}