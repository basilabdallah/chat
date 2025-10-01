# Supabase Setup Guide

## Step-by-Step Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub, Google, or email
4. Create a new organization if needed
5. Click "New Project" and fill in:
   - **Name**: `creative-chat` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is perfect for development
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 2. Run the Database Schema

#### Option A: Using SQL Editor (Recommended)

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click the **"New query"** button
3. Copy the **entire contents** of the `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** button (or press Cmd/Ctrl + Enter)
6. You should see: ✅ **"Success. No rows returned"**

> **Note**: If you see the error about null user_id, the updated schema fixes this. Just use the latest `supabase-schema.sql` file.

#### Option B: Using Supabase CLI (Alternative)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run the schema
supabase db push
```

### 3. ✅ Realtime Works Automatically!

**IMPORTANT UPDATE**: Realtime now works **WITHOUT** the Replication dashboard!

❌ **OLD WAY** (Skip this - no longer needed!):
~~Enable Database > Replication~~ **NOT REQUIRED**

✅ **NEW WAY** (Automatic!):
- Uses Supabase Broadcast Channels
- **NO configuration needed**
- Works in ALL Supabase regions
- Works even if Replication says "coming soon"!

**What this means**: Your app has real-time messaging immediately after running the schema. No extra steps needed!

### 4. Create Storage Bucket

The app needs a storage bucket for voice messages and file uploads.

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Enter bucket name: `chat-files`
4. Select **Public bucket** (checkbox)
5. Click **"Create bucket"**

> **Note**: The SQL schema tries to create this automatically, but if it fails, create it manually using the steps above.

### 5. Get Your API Credentials

1. Click the **Settings** gear icon in the left sidebar
2. Click **API** in the settings menu
3. You'll see two important values:

   **Project URL** (looks like):
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public key** (under "Project API keys", looks like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Copy both of these - you'll need them next!

### 6. Configure Your Environment

1. In your project root, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace the values with what you copied in step 4

### 7. Verify the Setup

You can verify everything is set up correctly in Supabase:

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - profiles
   - rooms (should have 1 row: "General")
   - room_members
   - messages
   - reactions
   - typing_indicators
   - read_receipts

3. Click on the **rooms** table - you should see one row:
   - **name**: General
   - **description**: Welcome to the general chat room!
   - **type**: channel

### 8. Optional: Configure Auth Settings

For development, you might want to disable email confirmation:

1. Go to **Authentication** > **Settings** in the left sidebar
2. Scroll to **Email Settings**
3. Find "Enable email confirmations"
4. Toggle it **OFF** for easier testing
5. Click **Save**

> **Note**: For production, keep email confirmations enabled!

## Troubleshooting

### Error: "null value in column user_id violates not-null constraint"

**Solution**: Use the updated `supabase-schema.sql` file which includes the fix for this issue. The trigger now checks if `created_by` is NULL before inserting.

### Error: "permission denied for table"

**Solution**: Make sure you're using the `anon` key, not the `service_role` key. The `anon` key should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Tables not showing up

**Solution**: 
1. Check the SQL editor for any errors
2. Make sure you ran the entire schema file
3. Refresh the Table Editor page

### Realtime not working

**Solution**:
1. Verify Realtime is enabled for the required tables
2. Check that RLS policies are set up correctly
3. Try disabling and re-enabling replication

### Can't connect to Supabase

**Solution**:
1. Verify your `.env.local` file has the correct values
2. Make sure there are no extra spaces or quotes
3. Restart your Next.js dev server after changing environment variables
4. Check that your Supabase project is not paused (free tier pauses after inactivity)

## What the Schema Creates

### Tables
- **profiles**: User accounts and status
- **rooms**: Chat rooms/channels  
- **room_members**: Who's in which room
- **messages**: All chat messages
- **reactions**: Emoji reactions to messages
- **typing_indicators**: Who's typing (temporary data)
- **read_receipts**: Message read status

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only see data they have access to
- Automatic permission checking

### Automation
- New users automatically join the "General" room
- Room creators automatically become owners
- Timestamps auto-update on changes
- Old typing indicators auto-cleanup

### Default Data
- One "General" room for everyone to start chatting

## Next Steps

After completing this setup:

1. Run your Next.js app:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Create an account (username, email, password)

4. You'll be automatically added to the "General" room

5. Start chatting! 🎉

## Need Help?

- Check the main `README.md` for application documentation
- Check `FEATURES.md` for feature details
- Open an issue if you encounter problems

---

**Important**: Keep your `anon` key safe but remember it's meant to be public. Never commit your `service_role` key to version control!
