# 🔧 Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in:
   - **Name**: Valentine Tracker (or any name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to you
6. Click "Create new project" and wait ~2 minutes

## Step 2: Create Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste this SQL and click "Run":

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

-- Add index for faster queries
create index responses_created_at_idx on responses(created_at desc);
```

## Step 3: Get API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Configure Environment Variables

1. Create `.env.local` file in project root:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Never commit `.env.local` to git (already in .gitignore)
- Service role key is only used server-side

## Step 5: Test Locally

```bash
npm run dev
```

Visit:
- App: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Step 6: Deploy

### Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (all 4 from `.env.local`)
5. Deploy!

### Environment Variables in Vercel
- Go to Project Settings → Environment Variables
- Add all 3 variables
- Redeploy if already deployed

## Access Admin Dashboard

Once deployed, access your dashboard:
```
https://your-domain.vercel.app/admin
```

**Bookmark this URL** - you'll use it to check her response!

## What Gets Tracked

When she confirms a date plan, you'll see:
- ✅ Whether she accepted
- 📅 Which date plan she chose
- 💡 Her suggestions (if any)
- 🕐 Timestamp
- 📱 Device info (for debugging)

## Security Notes

- ✅ Supabase URLs are safe to expose (public)
- ✅ Service role key only used server-side
- ⚠️ Admin dashboard is public - anyone with the URL can see responses
- ❌ Never commit `.env.local` file

## Troubleshooting

**"Failed to save response"**
- Check Supabase dashboard is accessible
- Verify API keys in `.env.local`
- Check browser console for errors

**Admin page not loading**
- Check if deployment succeeded
- Verify Supabase credentials are correct

**No responses showing**
- She hasn't completed the flow yet
- Check Supabase Table Editor to see raw data
- Click Refresh button on admin page

---

Need help? Check [Supabase Docs](https://supabase.com/docs)
