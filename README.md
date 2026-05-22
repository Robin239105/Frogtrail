# 🗺️ Fogtrail — Your World. Unfogged.

**Fogtrail** is a beautiful, gamified, fog-of-war travel tracker web application. The entire world map loads completely blacked out, like the fog of war in a video game minimap. As you log cities and countries you've explored, the fog permanently lifts around those coordinates with a smooth, radial animated reveal.

Get your exploration statistics, view leaderboards, and share your personal exploration map with a premium-designed public profile.

---

## 🚀 Key Features

*   **Fog of War Minimap**: Full-viewport interactive world map covered in a dark fog layer using custom Canvas API compositing over Mapbox GL JS.
*   **Animated Radial Reveal**: Visited locations are revealed dynamically with customizable radius sizes and smooth ease-out growth animations.
*   **Comprehensive Stats**: Tracks your global journey with real-time stats including your exact percentage of explored world landmass, country counts, cities, and continents.
*   **Shareable Profiles**: Public-facing custom user profiles displaying your personal exploration stats and read-only map state.
*   **Global Leaderboard**: Opt-in gamified competition showing who has explored the most of our planet.
*   **Premium Dark UI**: Built with a sleek HSL-tailored color palette, rich glassmorphism, responsive panels, and smooth micro-interactions.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript (Strict Mode)
*   **Database & ORM**: Prisma ORM with native support for PostgreSQL (Vercel Neon / Supabase) and local SQLite support.
*   **Map System**: Mapbox GL JS & `react-map-gl/mapbox`
*   **Fog Rendering**: HTML5 Canvas API with custom pixel-counting calculation
*   **Authentication**: NextAuth.js 4 with secure Google OAuth

---

## 📦 Getting Started

### 1. Clone the repository and install dependencies
```bash
git clone <your-repository-url>
cd fogtrail
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-32-character-secret-key"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Mapbox (Create a free account at mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1Ijo..." # Public client token for map rendering
MAPBOX_SECRET_TOKEN="sk.eyJ1Ijo..."      # Secret server token for geocoding API
```

---

## 💾 Database Configuration

Fogtrail supports standard PostgreSQL for production and SQLite for local development.

### Option A: Local Zero-Config Testing (SQLite)
To run and test the application locally with a lightweight SQLite database:
1. In `prisma/schema.prisma`, set the provider to `"sqlite"`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. In `prisma/schema.prisma`, remove the `@db.Text` decorator from any fields inside `model Account` (lines 69, 70, 74).
3. Create a `.env` file in the root of the project with:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Build client and push schema:
   ```bash
   npx prisma db push
   ```

### Option B: Vercel Neon / Supabase (PostgreSQL)
To run in production or connect a cloud database:
1. In `prisma/schema.prisma`, ensure the provider is set to `"postgresql"`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Make sure the `@db.Text` decorator is present on the `refresh_token`, `access_token`, and `id_token` fields in the `Account` model to avoid OAuth token truncations.
3. Configure `DATABASE_URL` in your environment variables to point to your cloud PostgreSQL database.
4. Run migrations/schema push:
   ```bash
   npx prisma db push
   ```

---

## 💻 Local Development

Once your environment and database are configured, start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deployment on Vercel

The easiest way to deploy Fogtrail is using **Vercel** combined with the **Vercel Neon Integration**:

1. Push your repository to **GitHub**.
2. Go to Vercel, click **Add New Project**, and import your repository.
3. Add the **Neon Serverless Postgres** integration to your Vercel project under the "Storage" tab. It will automatically inject the `DATABASE_URL` environment variable.
4. Add the remaining environment variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `MAPBOX_SECRET_TOKEN`) to your Vercel Project Settings.
5. Set your custom Build Command to run Prisma migrations:
   ```bash
   npx prisma db push && next build
   ```
6. Click **Deploy**!
