import type { Visit, UserStats } from '@/types'

export function calculateStats(visits: Visit[]): UserStats {
  const countries = new Set(visits.map((v) => v.country))
  const cities = new Set(visits.map((v) => `${v.cityName}-${v.country}`))
  const continents = new Set(visits.map((v) => v.continent))

  return {
    explorationPct: 0, // calculated separately via calculateExplorationPct() — client only
    countriesCount: countries.size,
    citiesCount: cities.size,
    continentsCount: continents.size,
    totalVisits: visits.length,
  }
}
