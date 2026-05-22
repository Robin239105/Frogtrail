import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const visits = await prisma.visit.findMany({
    where: { userId: session.user.id },
    orderBy: { visitedAt: 'desc' },
  })

  return NextResponse.json(visits)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { lat, lng, cityName, country, countryCode, continent, visitedAt, note } =
    body

  if (!lat || !lng || !cityName || !country || !visitedAt) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const visit = await prisma.visit.create({
    data: {
      userId: session.user.id,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      cityName,
      country,
      countryCode: countryCode ?? '',
      continent: continent ?? 'Unknown',
      visitedAt: new Date(visitedAt),
      note: note ?? null,
    },
  })

  return NextResponse.json(visit, { status: 201 })
}
