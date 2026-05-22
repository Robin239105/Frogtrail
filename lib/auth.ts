import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import type { Adapter } from 'next-auth/adapters'

function generateUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20)
}

async function ensureUniqueUsername(baseName: string): Promise<string> {
  let username = generateUsername(baseName)
  if (!username) username = 'explorer'

  let existing = await prisma.user.findUnique({ where: { username } })
  if (!existing) return username

  // Append random digits until unique
  let attempts = 0
  while (existing && attempts < 100) {
    const suffix = Math.floor(Math.random() * 9999)
    username = `${generateUsername(baseName)}${suffix}`
    existing = await prisma.user.findUnique({ where: { username } })
    attempts++
  }

  return username
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Fetch username from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true },
        })
        session.user.username = dbUser?.username ?? ''
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Auto-generate username on first sign-in
      const username = await ensureUniqueUsername(user.name ?? 'explorer')
      await prisma.user.update({
        where: { id: user.id },
        data: { username },
      })
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
}

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
