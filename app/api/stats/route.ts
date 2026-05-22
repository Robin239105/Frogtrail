import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const visits = await prisma.visit.findMany({
    where: { userId: session.user.id },
    select: {
      cityName: true,
      country: true,
      continent: true,
    },
  })

  const countries = new Set(visits.map((v) => v.country))
  const cities = new Set(visits.map((v) => `${v.cityName}-${v.country}`))
  const continents = new Set(visits.map((v) => v.continent))

  return NextResponse.json({
    explorationPct: 0, // calculated client-side
    countriesCount: countries.size,
    citiesCount: cities.size,
    continentsCount: continents.size,
    totalVisits: visits.length,
  })
}
