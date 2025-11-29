# Fan Footprint - Stadium Tracker

A modern web app to track stadiums you've visited across Baseball, Football, Basketball, Soccer, and Hockey.

## Features

- ✅ User authentication (login/register)
- ✅ Personal stadium tracker with map view
- ✅ Add custom stadiums
- ✅ User profile with stats
- ✅ Dark modern UI with Tailwind CSS
- ✅ Leaflet map integration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Leaflet
- **Styling**: Tailwind CSS v4

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier: https://supabase.com)

### 2. Supabase Setup

1. Create a new Supabase project at https://app.supabase.com
2. In your Supabase project:
   - Go to **Settings** → **API**
   - Copy your **Project URL** and **Anon Key**
   - Save these values

3. Create the required tables:
   - Go to **SQL Editor** and run:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Stadiums table
CREATE TABLE stadiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  sport TEXT NOT NULL,
  lat DECIMAL,
  lng DECIMAL,
  visited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes
CREATE INDEX stadiums_user_id ON stadiums(user_id);
```

### 3. Environment Variables

1. Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Register**: Create a new account on the login page
2. **Explore**: View stadiums by sport
3. **Map View**: See stadiums on an interactive map
4. **Add Stadium**: Add custom stadiums to your collection
5. **Profile**: View your stats and all stadiums you've added
6. **Logout**: Click logout to sign out

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main tracker page
│   ├── login/page.tsx        # Login/Register page
│   ├── profile/page.tsx      # User profile page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # Reusable UI components
├── context/
│   └── AuthContext.tsx       # Auth state management
└── lib/
    └── supabase.ts           # Supabase client config
```

## Future Enhancements

- [ ] Persist user data to Supabase
- [ ] Add photo uploads for stadiums
- [ ] Visited/unvisited toggle
- [ ] Filter by sport or visited status
- [ ] Share stadium lists
- [ ] Social features (follow other users, compare collections)
- [ ] Mobile app version

## License

MIT
