import type { GeocodeResult } from '@/types'

let debounceTimer: NodeJS.Timeout | null = null

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  if (!query || query.length < 2) return []

  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
  if (!res.ok) return []

  return res.json()
}

export function debouncedSearch(
  query: string,
  callback: (results: GeocodeResult[]) => void,
  delay: number = 300
): void {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    const results = await searchPlaces(query)
    callback(results)
  }, delay)
}
