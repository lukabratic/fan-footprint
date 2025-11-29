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
- **Fonts**: Google Inter# fan-footprint

## Project Structure

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

## Authentication Flow

1. **Registration** — User creates account → Supabase stores credentials → Confirmation email sent
2. **Email Verification** — User clicks link in email → Account becomes active
3. **Login** — User enters credentials → Supabase validates → Session created
4. **Auto-login** — On page load, app checks for existing session → User automatically logged in if valid
5. **Logout** — User clicks logout → Session cleared → Redirected to login page

## Future Enhancements

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