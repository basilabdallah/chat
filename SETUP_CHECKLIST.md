# Setup Checklist

Use this checklist to track your setup progress. Check off each item as you complete it!

## 📦 Initial Setup

- [ ] Node.js 18+ installed
- [ ] Code downloaded/cloned
- [ ] Opened project in code editor
- [ ] Read QUICK_START.md

## 🔧 Dependencies

- [ ] Ran `npm install`
- [ ] No errors during installation
- [ ] `node_modules` folder created

## 🗄️ Supabase Setup

### Account & Project
- [ ] Created Supabase account at supabase.com
- [ ] Created new project
- [ ] Project finished initializing (~2 min wait)
- [ ] Can access Supabase dashboard

### Database Schema
- [ ] Opened SQL Editor in Supabase
- [ ] Copied entire `supabase-schema.sql` file
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" successfully
- [ ] Saw "Success. No rows returned" message

### Verify Tables
- [ ] Opened Table Editor in Supabase
- [ ] See `profiles` table
- [ ] See `rooms` table (with 1 "General" room)
- [ ] See `room_members` table
- [ ] See `messages` table
- [ ] See `reactions` table
- [ ] See `typing_indicators` table
- [ ] See `read_receipts` table

### Realtime Configuration
- [ ] Went to Database > Replication
- [ ] Enabled replication for `messages`
- [ ] Enabled replication for `reactions`
- [ ] Enabled replication for `typing_indicators`
- [ ] Enabled replication for `profiles`

### API Credentials
- [ ] Went to Settings > API
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Saved both values safely

## 🔐 Environment Variables

- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL=...`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- [ ] Pasted actual values (not placeholders)
- [ ] No extra quotes or spaces in file
- [ ] Saved the file

## 🚀 Running the App

- [ ] Ran `npm run dev`
- [ ] Server started successfully
- [ ] Opened http://localhost:3000
- [ ] See login/signup page
- [ ] No errors in terminal
- [ ] No errors in browser console (F12)

## 👤 First Account

- [ ] Clicked "Sign Up"
- [ ] Entered username
- [ ] Entered email
- [ ] Entered password (min 6 characters)
- [ ] Successfully created account
- [ ] Automatically logged in
- [ ] Redirected to chat page

## 💬 Test Basic Features

### UI Elements
- [ ] See sidebar with rooms
- [ ] See "General" room listed
- [ ] See my profile at bottom of sidebar
- [ ] See online status indicator

### Messaging
- [ ] Clicked on "General" room
- [ ] Room opened in main area
- [ ] See message input at bottom
- [ ] Typed a test message
- [ ] Pressed Enter to send
- [ ] Message appeared in chat
- [ ] See my avatar/username on message

### Real-time (Two Browser Test)
- [ ] Opened second browser window
- [ ] Signed up with different account
- [ ] Both users in "General" room
- [ ] Sent message from first account
- [ ] Message appeared instantly in second window
- [ ] Real-time confirmed working! 🎉

### Reactions
- [ ] Hovered over a message
- [ ] See action buttons appear
- [ ] Clicked emoji button
- [ ] Emoji picker opened
- [ ] Selected an emoji
- [ ] Emoji appeared on message
- [ ] Reaction count shows correctly

### Typing Indicators
- [ ] Started typing in first window
- [ ] "User is typing..." appeared in second window
- [ ] Stopped typing
- [ ] Indicator disappeared after ~3 seconds

### Message Actions (Own Messages)
- [ ] Hovered over my message
- [ ] See edit and delete buttons
- [ ] Clicked edit button
- [ ] Changed message text
- [ ] Saved edit
- [ ] See "(edited)" indicator
- [ ] Clicked delete button
- [ ] Message shows "Message deleted"

### Room Management
- [ ] Clicked "+" button in sidebar
- [ ] Create room modal opened
- [ ] Entered room name
- [ ] Entered description
- [ ] Created room successfully
- [ ] New room appears in sidebar
- [ ] Can switch between rooms

### User Menu
- [ ] Clicked on profile at bottom
- [ ] Menu opened
- [ ] See "Sign Out" option
- [ ] Clicked sign out
- [ ] Successfully logged out
- [ ] Redirected to auth page

## 🐛 Troubleshooting

If any check above fails, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

Common issues:
- [ ] Checked environment variables
- [ ] Restarted dev server
- [ ] Cleared browser cache
- [ ] Checked browser console for errors
- [ ] Verified Supabase project not paused
- [ ] Confirmed Realtime is enabled

## ✅ Setup Complete!

When all items above are checked:

- [ ] App runs locally without errors
- [ ] Can create accounts and log in
- [ ] Real-time messaging works
- [ ] Reactions work
- [ ] Typing indicators work
- [ ] Can edit/delete messages
- [ ] Can create and join rooms

## 🎯 Next Steps

Now that setup is complete, you can:

- [ ] Read [FEATURES.md](FEATURES.md) for all features
- [ ] Customize colors in `tailwind.config.ts`
- [ ] Invite team members to test
- [ ] Deploy to production ([DEPLOYMENT.md](DEPLOYMENT.md))
- [ ] Add custom features
- [ ] Explore the codebase

## 📝 Notes

Use this space for your own notes:

```
Project URL: _______________________________

Deployment URL: ____________________________

Team Members:
- _________________________________________
- _________________________________________
- _________________________________________

Custom Features to Add:
- _________________________________________
- _________________________________________
- _________________________________________

Known Issues:
- _________________________________________
- _________________________________________
```

---

**Congratulations on completing the setup! 🎉**

You now have a fully functional, professional chat application!

Need help? Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open an issue.
