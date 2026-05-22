'use client'

import useSWR from 'swr'
import type { Visit } from '@/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useVisits() {
  const { data, error, isLoading, mutate } = useSWR<Visit[]>(
    '/api/visits',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  )

  const addVisit = async (visitData: {
    lat: number
    lng: number
    cityName: string
    country: string
    countryCode: string
    continent: string
    visitedAt: string
    note?: string
  }): Promise<Visit | null> => {
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData),
      })
      if (!res.ok) throw new Error('Failed to add visit')
      const newVisit = await res.json()
      await mutate()
      return newVisit
    } catch (err) {
      console.error('Error adding visit:', err)
      return null
    }
  }

  const deleteVisit = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/visits/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete visit')
      await mutate()
      return true
    } catch (err) {
      console.error('Error deleting visit:', err)
      return false
    }
  }

  return {
    visits: data ?? [],
    isLoading,
    error,
    addVisit,
    deleteVisit,
    mutate,
  }
}
