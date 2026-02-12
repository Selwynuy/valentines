# 💕 Valentine's Day Proposal App

An interactive Valentine's Day proposal web app with a heart-catching game, envelope date planner, and response tracking.

## ✨ Features

- **Heart-Catching Game**: Catch 15 hearts to unlock the proposal
- **Interactive Proposal**: "Will You Be My Valentine?" with a playful "No" button that runs away
- **Date Planner**: 3 beautiful envelopes containing date plans
- **Suggestion System**: She can add her own ideas to the date
- **Confirmation Card**: Beautiful, screenshot-ready date confirmation
- **Background Music**: Auto-playing romantic music (You and I - One Direction)
- **Response Tracking**: Secretly tracks her choices via Supabase

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS with Tailwind CSS 4
- **Database**: Supabase (for tracking responses)
- **Fonts**: Google Fonts (Great Vibes, Poppins)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### 1. Add Your Music
Place your song in `/public/` folder and update the path in `ValentineGame.tsx`:
```tsx
<source src="/Your-Song.mp3" type="audio/mpeg" />
```

### 2. Supabase Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Schema
Run this SQL in your Supabase SQL editor:
```sql
create table responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  accepted boolean default false,
  chosen_plan_id integer,
  chosen_plan_title text,
  suggestions text,
  user_agent text,
  ip_address text
);
```

## 🎮 How It Works

1. **Game**: User catches hearts by moving the basket with mouse/touch
2. **Proposal**: After catching 15 hearts, proposal appears
3. **Celebration**: 4-second countdown after saying YES
4. **Planner**: 3 envelopes with different date options
5. **Suggestions**: Optional input for her ideas
6. **Confirmation**: Beautiful summary card with all details
7. **Tracking**: Response automatically saved to Supabase

## 🔐 Admin Dashboard

Access the admin dashboard to see her response:
```
https://your-domain.com/admin
```

## 📝 Customization

### Change Date Plans
Edit the `datePlans` array in `app/components/ValentineGame.tsx`:
```tsx
const datePlans: DatePlan[] = [
  {
    id: 1,
    title: "Your Date Title",
    activity: "Activity Name",
    date: "2026-02-14",
    time: "7:00 PM",
    location: "Location",
    note: "Your romantic note"
  },
  // ... more plans
];
```

### Change Colors
Edit CSS variables in `app/valentine.css`:
```css
:root {
  --primary-color: #ff4d6d;
  --secondary-color: #ff8fa3;
  --accent-color: #c9184a;
}
```

## 📱 Responsive Design

- Desktop: Full experience with mouse controls
- Mobile: Touch controls, optimized layouts
- Tablet: Adaptive grid system

## 🎨 Screenshots

- Heart-catching game with love meter
- Proposal screen with animated heartbeat
- Envelope planner with hover effects
- Confirmation card (screenshot-ready)

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the .next folder
```

### Environment Variables
Don't forget to add your Supabase credentials in the deployment platform's environment variables section.

## 📄 License

Personal use only - Created with love for a special someone 💕

## 🙏 Credits

- Music: "You and I" by One Direction
- Fonts: Great Vibes, Poppins (Google Fonts)
- Icons: Emoji

---

Made with ❤️ for my Valentine
