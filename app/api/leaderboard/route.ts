import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const entries = await prisma.leaderboardCache.findMany({
    orderBy: { explorationPct: 'desc' },
    take: 100,
    include: {
      user: {
        select: {
          username: true,
          name: true,
          avatar: true,
          showOnLeaderboard: true,
        },
      },
    },
  })

  const leaderboard = entries
    .filter((e) => e.user.showOnLeaderboard)
    .map((entry, index) => ({
      rank: index + 1,
      username: entry.user.username,
      name: entry.user.name,
      avatar: entry.user.avatar,
      explorationPct: entry.explorationPct,
      countriesCount: entry.countriesCount,
    }))

  return NextResponse.json(leaderboard)
}
