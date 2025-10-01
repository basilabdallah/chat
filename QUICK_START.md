# 🚀 Quick Start Guide

Get your Creative Chat app running in **5 minutes**!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- A Supabase account ([Sign up free](https://supabase.com))

---

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

---

## Step 2: Set Up Supabase (2 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to finish setting up (~2 minutes)

### Run Database Schema
1. Click **SQL Editor** in the sidebar
2. Click **"New query"**
3. Copy **all** of `supabase-schema.sql` and paste it
4. Click **"Run"** ✅

### Enable Realtime
1. Go to **Database** > **Replication**
2. Enable these tables:
   - ✅ messages
   - ✅ reactions  
   - ✅ typing_indicators
   - ✅ profiles

### Get Credentials
1. Click **Settings** (gear icon) > **API**
2. Copy your **Project URL** and **anon public key**

> 📖 **Detailed guide**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

---

## Step 3: Configure Environment (30 seconds)

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 4: Run the App (10 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Step 5: Create Account & Start Chatting

1. Click **"Sign Up"**
2. Enter username, email, and password
3. You'll be auto-logged in and joined to the **"General"** room
4. Start chatting! 💬

---

## 🎯 What You Get

### ✨ Features
- Real-time messaging
- Emoji reactions
- Typing indicators
- Message editing & deletion
- User presence (online/offline)
- Multiple chat rooms
- Beautiful, professional UI

### 🎨 Design
- Formal & professional look
- Rounded corners everywhere
- No harsh shadows
- Relaxing color palette
- Smooth animations

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Full documentation |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Detailed Supabase setup |
| [FEATURES.md](FEATURES.md) | Complete feature list |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & solutions |

---

## ⚠️ Common Issues

### "Invalid API credentials"
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

### "Permission denied"  
- Make sure you're using the **anon** key, not service_role

### "Messages not appearing"
- Enable Realtime for `messages` table in Supabase
- Check browser console (F12) for errors

### SQL Error about "user_id null"
- You're using the old schema
- Use the latest `supabase-schema.sql` (it's fixed!)

> 🔧 **More help**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎓 Project Structure

```
creative-chat-app/
├── app/              # Next.js pages
│   ├── auth/        # Login/signup
│   └── chat/        # Main chat interface
├── components/       # React components
│   ├── Sidebar.tsx
│   ├── MessageList.tsx
│   ├── MessageInput.tsx
│   └── ChatHeader.tsx
├── hooks/           # Custom hooks
│   ├── useAuth.ts
│   └── useChat.ts
├── store/           # State management
├── lib/             # Utilities
├── types/           # TypeScript types
└── supabase-schema.sql  # Database schema
```

---

## 🧪 Testing the App

### Test Real-time Messaging
1. Open two browser windows
2. Sign in with different accounts
3. Send a message in one window
4. See it appear instantly in the other! ⚡

### Test Reactions
1. Hover over any message
2. Click the emoji button
3. Select an emoji
4. See it appear on the message

### Test Typing Indicators
1. Start typing in one window
2. See "User is typing..." in the other window

---

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Other Platforms

Works with:
- Netlify
- Railway
- Render
- Any Node.js hosting

Just set the environment variables!

---

## 🎉 You're Done!

You now have a fully functional, professional chat application!

### Next Steps

- Create more rooms
- Invite team members
- Customize the colors (edit `tailwind.config.ts`)
- Add new features
- Deploy to production

---

## 📞 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
3. Open an issue on GitHub
4. Read Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Built with ❤️ using Next.js 14, TypeScript, and Supabase**

Happy chatting! 💬✨
