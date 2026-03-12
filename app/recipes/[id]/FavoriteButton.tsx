'use client'

import { useState, useTransition } from 'react'
import { toggleFavorite } from './favorite-actions'

type Props = {
  recipeId: string
  initialIsFavorite: boolean
}

export default function FavoriteButton({
  recipeId,
  initialIsFavorite,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const nextValue = !isFavorite
    setIsFavorite(nextValue)

    startTransition(async () => {
      await toggleFavorite(recipeId, nextValue)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isFavorite
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
      } ${isPending ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {isFavorite ? '★ Favorite' : '☆ Add to favorites'}
    </button>
  )
}