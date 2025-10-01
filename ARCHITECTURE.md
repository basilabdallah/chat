# System Architecture

Visual overview of the Creative Chat application architecture.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js 14 Frontend                        │ │
│  │  (React 18 + TypeScript + Tailwind CSS)                │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │   Auth   │  │   Chat   │  │ Message  │             │ │
│  │  │   Page   │  │   Page   │  │ Components│            │ │
│  │  └──────────┘  └──────────┘  └──────────┘             │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────┐        │ │
│  │  │        State Management (Zustand)           │        │ │
│  │  │  • Auth Store    • Chat Store               │        │ │
│  │  └────────────────────────────────────────────┘        │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────┐        │ │
│  │  │          Custom Hooks                       │        │ │
│  │  │  • useAuth()     • useChat()                │        │ │
│  │  └────────────────────────────────────────────┘        │ │
│  │                          │                              │ │
│  └──────────────────────────┼──────────────────────────────┘ │
│                             │                                │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              ▼
          ┌───────────────────────────────────┐
          │     Supabase Client Library       │
          └───────────────────────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ▼                         ▼                         ▼
┌────────┐              ┌──────────┐            ┌─────────┐
│ Auth   │              │ Database │            │Realtime │
│Service │              │PostgreSQL│            │ Engine  │
└────────┘              └──────────┘            └─────────┘
    │                         │                         │
    └─────────────────────────┴─────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │    Supabase      │
                    │  (Backend Cloud) │
                    └──────────────────┘
```

---

## 📊 Data Flow Architecture

### Message Sending Flow

```
User Types Message
        │
        ▼
┌───────────────────┐
│  MessageInput.tsx │
│  (Component)      │
└────────┬──────────┘
         │
         │ onChange event
         ▼
┌───────────────────┐
│  useChat.ts       │
│  (Hook)           │
│  • setTypingIndicator()
└────────┬──────────┘
         │
         │ User presses Enter
         ▼
┌───────────────────┐
│  sendMessage()    │
│  (Function)       │
└────────┬──────────┘
         │
         │ API call
         ▼
┌───────────────────┐
│  Supabase Client  │
│  lib/supabase.ts  │
└────────┬──────────┘
         │
         │ INSERT query
         ▼
┌───────────────────┐
│  messages table   │
│  (PostgreSQL)     │
└────────┬──────────┘
         │
         │ Real-time trigger
         ▼
┌───────────────────┐
│  Realtime Channel │
│  (Subscription)   │
└────────┬──────────┘
         │
         │ Broadcast event
         ▼
┌───────────────────┐
│  All Connected    │
│  Clients          │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  MessageList.tsx  │
│  (Update UI)      │
└───────────────────┘
```

---

## 🗄️ Database Schema Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Supabase Database                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐              │
│  │   profiles   │         │    rooms     │              │
│  │─────────────│         │─────────────│              │
│  │ • id         │         │ • id         │              │
│  │ • username   │         │ • name       │              │
│  │ • avatar_url │         │ • type       │              │
│  │ • status     │         │ • created_by │──┐           │
│  │ • last_seen  │         │ • is_private │  │           │
│  └──────┬───────┘         └──────┬───────┘  │           │
│         │                        │          │           │
│         │                        │          │           │
│         └────────┬───────────────┘          │           │
│                  │                          │           │
│                  ▼                          │           │
│         ┌──────────────┐                   │           │
│         │ room_members │◄──────────────────┘           │
│         │─────────────│                                │
│         │ • room_id    │                                │
│         │ • user_id    │                                │
│         │ • role       │                                │
│         │ • last_read  │                                │
│         └──────┬───────┘                                │
│                │                                         │
│                │                                         │
│         ┌──────▼───────┐                                │
│         │   messages   │                                │
│         │─────────────│                                │
│         │ • id         │                                │
│         │ • room_id    │                                │
│         │ • user_id    │                                │
│         │ • content    │                                │
│         │ • type       │                                │
│         │ • created_at │                                │
│         │ • is_edited  │                                │
│         └──────┬───────┘                                │
│                │                                         │
│         ┌──────┴───────┬──────────────┐                │
│         │              │              │                │
│         ▼              ▼              ▼                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │reactions │  │ typing_  │  │  read_   │             │
│  │          │  │indicators│  │ receipts │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌────────────────────────────────────────────────┐
│           Row Level Security (RLS)             │
├────────────────────────────────────────────────┤
│                                                 │
│  User Request                                   │
│       │                                         │
│       ▼                                         │
│  ┌─────────────┐                               │
│  │  Auth Check │                                │
│  └──────┬──────┘                               │
│         │                                       │
│         ▼                                       │
│  ┌─────────────┐                               │
│  │RLS Policies │                                │
│  │────────────│                                │
│  │• Can view?  │                                │
│  │• Can edit?  │                                │
│  │• Can delete?│                                │
│  └──────┬──────┘                               │
│         │                                       │
│    ┌────┴────┐                                 │
│    │         │                                  │
│    ▼         ▼                                  │
│ ✅ Allow  ❌ Deny                              │
│    │                                            │
│    ▼                                            │
│ Execute Query                                   │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 🔄 Real-Time Architecture

```
┌──────────────────────────────────────────────────┐
│          Supabase Realtime Engine                 │
└───────────────────┬──────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Channel │ │Channel │ │Channel │
    │messages│ │reactions│ │typing  │
    └───┬────┘ └───┬────┘ └───┬────┘
        │          │          │
        │          │          │
        └──────────┼──────────┘
                   │
                   │ Broadcast
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    ┌──────┐  ┌──────┐  ┌──────┐
    │User 1│  │User 2│  │User 3│
    └──────┘  └──────┘  └──────┘
```

---

## 🎨 Component Hierarchy

```
App
│
├── Layout
│   ├── Toaster (notifications)
│   └── Children
│       │
│       ├── / (Home)
│       │   └── Redirect Logic
│       │
│       ├── /auth
│       │   └── AuthPage
│       │       ├── Sign In Form
│       │       └── Sign Up Form
│       │
│       └── /chat
│           └── ChatPage
│               ├── Sidebar
│               │   ├── Search
│               │   ├── Room List
│               │   │   └── Room Item (multiple)
│               │   └── User Menu
│               │       └── Profile Display
│               │
│               └── Main Area
│                   ├── ChatHeader
│                   │   ├── Room Info
│                   │   └── Member Count
│                   │
│                   ├── MessageList
│                   │   ├── MessageBubble (multiple)
│                   │   │   ├── Avatar
│                   │   │   ├── Content
│                   │   │   ├── Reactions
│                   │   │   └── Actions Menu
│                   │   │
│                   │   └── Typing Indicators
│                   │
│                   └── MessageInput
│                       ├── Emoji Picker
│                       ├── Text Area
│                       └── Send Button
```

---

## 📦 State Management Flow

```
┌─────────────────────────────────────────────┐
│           Zustand State Stores              │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐      ┌──────────────┐   │
│  │  Auth Store  │      │  Chat Store  │   │
│  │─────────────│      │─────────────│   │
│  │ • user       │      │ • rooms      │   │
│  │ • profile    │      │ • currentRoom│   │
│  │ • isLoading  │      │ • messages   │   │
│  │              │      │ • typingUsers│   │
│  │ Actions:     │      │              │   │
│  │ • setUser    │      │ Actions:     │   │
│  │ • setProfile │      │ • addMessage │   │
│  └──────────────┘      │ • setRoom    │   │
│                        │ • addReaction│   │
│                        └──────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
                     │
                     │ Subscribe
                     ▼
         ┌────────────────────┐
         │    React           │
         │    Components      │
         │    (Auto re-render)│
         └────────────────────┘
```

---

## 🔌 API Integration Points

```
Frontend (Next.js)
        │
        │ Supabase Client
        ▼
┌───────────────────┐
│  Supabase SDK     │
└────────┬──────────┘
         │
    ┌────┼────┬────────────┐
    │    │    │            │
    ▼    ▼    ▼            ▼
┌──────┐ │ ┌────────┐ ┌─────────┐
│ Auth │ │ │Database│ │Realtime │
└──────┘ │ └────────┘ └─────────┘
         │
         ▼
    ┌─────────┐
    │ Storage │
    │(Future) │
    └─────────┘
```

---

## 🌐 Deployment Architecture

```
┌──────────────────────────────────────────────┐
│              Vercel Edge Network              │
├──────────────────────────────────────────────┤
│                                               │
│  ┌────────────────────────────────────────┐  │
│  │        Next.js Application             │  │
│  │  (Server + Client Components)          │  │
│  └───────────────┬────────────────────────┘  │
│                  │                            │
└──────────────────┼────────────────────────────┘
                   │
                   │ API Calls
                   ▼
         ┌──────────────────┐
         │   Supabase       │
         │   (Hosted)       │
         ├──────────────────┤
         │ • PostgreSQL     │
         │ • Auth Service   │
         │ • Realtime       │
         │ • Storage        │
         └──────────────────┘
```

---

## 📱 User Flow Diagram

```
User Opens App
      │
      ▼
   Landing Page
      │
   ┌──┴──┐
   │     │
   ▼     ▼
Auth  Redirect
Page  to Chat
   │     │
   │  (if logged in)
   │
Sign Up/In
   │
   ▼
Chat Page
   │
   ├─► Select Room
   │      │
   │      ├─► View Messages
   │      │      │
   │      │      ├─► Send Message
   │      │      ├─► Add Reaction
   │      │      ├─► Edit Message
   │      │      └─► Delete Message
   │      │
   │      └─► Room Info
   │             │
   │             ├─► View Members
   │             └─► Leave Room
   │
   ├─► Create Room
   │      │
   │      └─► Join Room
   │
   └─► User Menu
          │
          ├─► Update Status
          └─► Sign Out
                 │
                 ▼
             Auth Page
```

---

## 🧩 Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  • React 18                             │
│  • Next.js 14 App Router                │
│  • Tailwind CSS                         │
│  • Framer Motion                        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Application Layer               │
│  • TypeScript 5                         │
│  • Custom Hooks (useAuth, useChat)      │
│  • Zustand State Management             │
│  • date-fns                             │
│  • emoji-picker-react                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Integration Layer               │
│  • Supabase Client                      │
│  • Auth Helpers                         │
│  • Real-time Subscriptions              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Data Layer                      │
│  • PostgreSQL (Supabase)                │
│  • Row Level Security                   │
│  • Realtime Engine                      │
│  • Auth Service                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Development Workflow

```
Developer Machine
        │
        │ npm run dev
        ▼
┌────────────────┐
│  Next.js Dev   │
│    Server      │
│   (Port 3000)  │
└────────┬───────┘
         │
         │ Hot Reload
         ▼
   Browser
         │
         │ API Calls
         ▼
┌────────────────┐
│   Supabase     │
│  (Development) │
└────────────────┘
```

---

## 📊 Performance Optimizations

```
Performance Layer
        │
    ┌───┴───┬─────────┬─────────┐
    │       │         │         │
    ▼       ▼         ▼         ▼
Database  State   Component  Network
Indexes   Mgmt    Memoization Caching
    │       │         │         │
    └───┬───┴─────────┴─────────┘
        │
        ▼
   Fast App ⚡
```

---

## 🎯 Summary

This architecture provides:
- ✅ Scalable real-time messaging
- ✅ Secure data access
- ✅ Efficient state management
- ✅ Clean component hierarchy
- ✅ Type-safe development
- ✅ Production-ready deployment

---

**Built with modern best practices and scalability in mind.**
