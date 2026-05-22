import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      username: true,
      name: true,
      avatar: true,
      isPublic: true,
      visits: {
        orderBy: { visitedAt: 'desc' },
      },
    },
  })

  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (!user.isPublic) {
    return NextResponse.json({
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      isPublic: false,
      visits: [],
      stats: {
        explorationPct: 0,
        countriesCount: 0,
        citiesCount: 0,
        continentsCount: 0,
        totalVisits: 0,
      },
    })
  }

  const countries = new Set(user.visits.map((v) => v.country))
  const cities = new Set(
    user.visits.map((v) => `${v.cityName}-${v.country}`)
  )
  const continents = new Set(user.visits.map((v) => v.continent))

  return NextResponse.json({
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    isPublic: true,
    visits: user.visits,
    stats: {
      explorationPct: 0,
      countriesCount: countries.size,
      citiesCount: cities.size,
      continentsCount: continents.size,
      totalVisits: user.visits.length,
    },
  })
}
