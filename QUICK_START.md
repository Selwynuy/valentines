# 🚀 Quick Start Guide

## Immediate Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase (Required for tracking)
Follow [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - takes 5 minutes

### 3. Add Your Music
- Put your song in `/public/You-and-I.mp3`
- Or update the filename in `app/components/ValentineGame.tsx` line 411

### 4. Run Locally
```bash
npm run dev
```
Visit: http://localhost:3000

### 5. Test Admin Dashboard
Visit: http://localhost:3000/admin

## Customizing Date Plans

Edit `app/components/ValentineGame.tsx` around line 147:

```tsx
const datePlans: DatePlan[] = [
  {
    id: 1,
    title: "Dinner Date",
    activity: "Romantic Dinner",
    date: "2026-02-14",      // ← Change this
    time: "7:00 PM",          // ← Change this
    location: "Restaurant",   // ← Change this
    note: "Your note here"    // ← Change this
  },
  // Add more plans...
];
```

## Deploy to Vercel

### Option 1: Quick Deploy
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Don't forget to add your 3 environment variables in Vercel!**

## Your Admin URL

After deployment, bookmark this:
```
https://your-app.vercel.app/admin
```

This is where you'll check her response! 👀

## What Happens

1. She catches hearts → 2. Says YES → 3. Chooses a date → 4. Adds suggestions (optional) → 5. Confirms

**Then you see everything in the admin dashboard!** 🎉

## Need Help?

- App not working? Check browser console (F12)
- Data not saving? Verify Supabase setup
- Admin not showing data? Check Supabase credentials

---

Made with ❤️ Good luck! 🍀
