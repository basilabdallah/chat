# Quick Setup Guide

Follow these steps to get your Creative Chat application running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: creative-chat
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Wait for the project to be created (~2 minutes)

### Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" or press Cmd/Ctrl + Enter
5. You should see "Success. No rows returned" - this is correct!

### Get Your API Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. Copy the following:
   - **Project URL** (under Project URL)
   - **anon public** key (under Project API keys)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Enable Realtime in Supabase

1. Go to **Database** > **Replication** in your Supabase dashboard
2. Enable replication for these tables:
   - messages
   - reactions
   - typing_indicators
   - profiles

## Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 6: Create Your First Account

1. Click "Sign Up"
2. Enter a username, email, and password
3. You'll be logged in automatically
4. Start chatting in the "General" room!

## Troubleshooting

### "Invalid API credentials"
- Double-check your `.env.local` file
- Make sure you copied the correct URL and key
- Restart the dev server after changing environment variables

### "No messages appearing"
- Ensure you ran the database schema
- Check that you're a member of the room
- Open browser console (F12) to check for errors

### "Database error"
- Verify the SQL schema was executed successfully
- Check Supabase project dashboard for any issues
- Ensure RLS policies are enabled

## Optional: Customize the App

### Change Colors
Edit `tailwind.config.ts` to customize the color palette

### Modify Database Schema
Edit `supabase-schema.sql` and re-run in Supabase SQL Editor

### Add Features
Check the main `README.md` for the project structure and how to extend

---

Need help? Check the main README.md for more detailed documentation!
