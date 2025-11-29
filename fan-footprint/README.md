# Fan Footprint - Stadium Tracker

A modern web app to track stadiums you've visited across Baseball, Football, Basketball, Soccer, and Hockey.

## About

Fan Footprint is a personal stadium tracking application that lets you keep track of all the stadiums you've visited or want to visit. Whether you're a die-hard sports fan or just exploring new venues, this app helps you organize and visualize your stadium experiences.

## Features

- **User Authentication** — Secure login/register with email verification
- **Personal Stadium Tracker** — Add and manage stadiums you've visited
- **Interactive Map View** — See your stadiums on an interactive Leaflet map
- **Sport Organization** — View stadiums organized by sport (Baseball, Football, Basketball, Soccer, Hockey)
- **User Profile** — Check your stats: total stadiums, visited count, and more
- **Dark Modern UI** — Beautiful, responsive design with Tailwind CSS
- **Real-time Sync** — All changes saved instantly to your database

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email verification
- **Maps**: Leaflet
- **Styling**: Tailwind CSS v4
- **Fonts**: Google Inter

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier: https://supabase.com)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd fan-footprint/fan-footprint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase** — See [SETUP.md](./SETUP.md) for detailed instructions

4. **Create `.env.local`**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Register** — Create a new account with email and password
2. **Verify Email** — Check your email and click the verification link
3. **Login** — Sign in with your credentials
4. **Add Stadiums** — Click "+ Add Stadium" to add venues you've visited
5. **View by Sport** — Browse stadiums organized by sport type
6. **Map View** — See all your stadiums on an interactive map
7. **Check Profile** — View your stadium stats and collection
8. **Logout** — Sign out when done

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main stadium tracker page
│   ├── login/page.tsx        # Login/Register page
│   ├── profile/page.tsx      # User profile with stats
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles & Tailwind imports
├── components/
│   └── ui/                   # Reusable UI components (Button, Input, Card)
├── context/
│   └── AuthContext.tsx       # Auth state management & Supabase integration
└── lib/
    └── supabase.ts           # Supabase client configuration
```

## 🔐 Authentication Flow

1. **Registration** — User creates account → Supabase stores credentials → Confirmation email sent
2. **Email Verification** — User clicks link in email → Account becomes active
3. **Login** — User enters credentials → Supabase validates → Session created
4. **Auto-login** — On page load, app checks for existing session → User automatically logged in if valid
5. **Logout** — User clicks logout → Session cleared → Redirected to login page

## 🎮 How to Use

### Adding a Stadium

1. Click the **"+ Add Stadium"** button
2. Fill in the modal:
   - **Stadium Name** — e.g., "Yankee Stadium"
   - **City** — e.g., "New York"
   - **Sport** — e.g., "Baseball"
3. Click **"Add Stadium"** to save
4. Stadium appears in your list organized by sport

### Viewing Your Collection

- **List View** — See all stadiums grouped by sport
- **Map View** — Interactive map showing stadium locations
- **Profile** — View your stats (total visited, to visit, etc.)

## 🗺️ Database Schema

### Users Table
```sql
id (UUID) | username | email | created_at
```

### Stadiums Table
```sql
id (UUID) | user_id | name | city | sport | lat | lng | visited | created_at
```

## 🔄 Data Sync

- All stadium additions/deletions sync to Supabase in real-time
- User session persists across page reloads
- Changes saved to PostgreSQL database automatically

## 🚧 Future Enhancements

- [ ] Visited/unvisited toggle for each stadium
- [ ] Filter stadiums by sport or visited status
- [ ] Add photo uploads for stadiums
- [ ] Share stadium collections with other users
- [ ] Compare collections with friends
- [ ] Social features (follow users, view others' lists)
- [ ] Stadium reviews and ratings
- [ ] Mobile app version
- [ ] Export stadium list (CSV/PDF)
- [ ] Stadium statistics and achievements

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet Maps](https://leafletjs.com)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)
