# ⚡ Quick Reference Guide

Fast answers to common questions!

---

## 🚀 Setup (3 Steps)

```bash
# 1. Install
npm install

# 2. Configure .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 3. Run
npm run dev
```

**Supabase**: Run `supabase-schema.sql` in SQL Editor

---

## 🎯 Key Features

| Feature | How to Use |
|---------|-----------|
| **Voice Message** | Click microphone icon → Record → Send |
| **File Upload** | Click attachment → Drag/drop or browse |
| **Emoji React** | Hover message → Click emoji → Select |
| **Edit Message** | Hover message → Click edit → Modify |
| **Create Room** | Sidebar → Click + button → Fill form |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `hooks/useChat.ts` | All chat logic |
| `hooks/useAuth.ts` | Authentication |
| `components/MessageInput.tsx` | Send messages |
| `components/MessageList.tsx` | Display messages |
| `supabase-schema.sql` | Database setup |

---

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Real-time not working | Uses broadcast - should work automatically |
| Can't upload files | Create `chat-files` bucket in Supabase Storage |
| Messages not sending | Check `.env.local` has correct credentials |
| Build errors | Run `npm install` again |
| Voice not working | Allow microphone permissions in browser |

---

## 📖 Documentation Quick Links

- **New User?** → [START_HERE.md](START_HERE.md)
- **Quick Setup?** → [QUICK_START.md](QUICK_START.md)
- **Supabase Help?** → [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- **Advanced Features?** → [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
- **Problems?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Deploy?** → [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ⚡ Real-time Fix

**✅ Works without Replication dashboard!**

The app uses **broadcast channels** instead of database replication, so it works in ALL Supabase regions immediately.

No configuration needed!

---

## 🎙️ Voice Messages

```
Click mic → Allow access → Speak → Send
```

Features:
- Real-time visualization
- Pause/resume
- Duration counter
- Cancel option

---

## 📎 File Uploads

```
Click attachment → Drag file or browse → Upload
```

Supported:
- Images (preview shown)
- Audio (inline player)
- Documents (download card)
- Any file type (50MB max)

---

## 🎨 Design System

**Colors:**
- Primary: Calm blue (#0ea5e9)
- Neutral: Soft grays
- Success: Green
- Error: Red

**Style:**
- Border radius: 12-24px
- No shadows
- Smooth transitions
- Relaxing palette

---

## 🔐 Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Get from: Supabase Dashboard → Settings → API

---

## 📊 Database Tables

- `profiles` - Users
- `rooms` - Chat rooms
- `room_members` - Membership
- `messages` - Messages
- `reactions` - Emoji reactions
- `typing_indicators` - Who's typing
- `read_receipts` - Read status

---

## 🎯 Component Overview

```
App
├── Sidebar (rooms, user menu)
├── ChatHeader (room info)
├── MessageList (messages display)
│   ├── MessageBubble
│   ├── AudioPlayer
│   └── Reactions
└── MessageInput (send messages)
    ├── VoiceRecorder
    ├── FileUploader
    └── EmojiPicker
```

---

## 🚀 Deployment Checklist

- [ ] Run `npm run build` locally
- [ ] Test production build
- [ ] Set environment variables
- [ ] Deploy to Vercel/Netlify
- [ ] Verify Supabase connection
- [ ] Test all features live

---

## 💡 Pro Tips

1. **Use voice** for quick updates
2. **Share images** instead of descriptions  
3. **Create rooms** for different topics
4. **React with emojis** for quick responses
5. **Edit messages** to fix typos

---

## 🔄 Update Process

New version available?
1. Pull latest code
2. Run `npm install`
3. Update schema in Supabase
4. Test locally
5. Deploy

---

## 📞 Get Help

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
3. Read component code
4. Open an issue

---

## ✅ Feature Checklist

After setup, test:
- [ ] Sign up works
- [ ] Can send messages
- [ ] Real-time updates
- [ ] Voice recording
- [ ] File upload
- [ ] Image preview
- [ ] Emoji reactions
- [ ] Message edit/delete
- [ ] Room creation
- [ ] User presence

---

## 🎓 Learn More

**APIs Used:**
- MediaRecorder (voice)
- Supabase Storage (files)
- Supabase Realtime (broadcast)
- Web Audio API (visualization)

**Key Patterns:**
- Custom hooks for logic
- Zustand for state
- Broadcast for real-time
- Storage for files

---

**Quick enough for you?** 😉

For detailed info, check the full documentation!
