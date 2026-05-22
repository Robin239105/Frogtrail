export interface Visit {
  id: string
  userId: string
  lat: number
  lng: number
  cityName: string
  country: string
  countryCode: string
  continent: string
  visitedAt: string
  note?: string
  createdAt: string
}

export interface UserStats {
  explorationPct: number
  countriesCount: number
  citiesCount: number
  continentsCount: number
  totalVisits: number
}

export interface PublicProfile {
  username: string
  name: string
  avatar?: string
  isPublic: boolean
  visits: Visit[]
  stats: UserStats
}

export interface LeaderboardEntry {
  rank: number
  username: string
  name: string
  avatar?: string
  explorationPct: number
  countriesCount: number
}

export interface GeocodeResult {
  lat: number
  lng: number
  cityName: string
  country: string
  countryCode: string
  continent: string
  displayName: string
}

export interface FogCircle {
  lat: number
  lng: number
  radiusKm: number
}
