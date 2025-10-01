# Creative Chat - Modern Real-Time Chat Application

A professional, modern web chat application built with Next.js, TypeScript, and Supabase. Features a beautiful, relaxing UI with rounded corners, no shadows, and a focus on excellent UX.

> 👋 **New here?** Start with **[START_HERE.md](START_HERE.md)** for a guided introduction!

> 🚀 **Just want to get started?** Check out the [QUICK_START.md](QUICK_START.md) guide!

> ⚠️ **Having issues?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions.

## Features

### Core Features
- 🔐 **User Authentication** - Secure sign up/sign in with Supabase Auth
- 💬 **Real-time Messaging** - Instant message delivery (works without replication!)
- 🏠 **Multiple Chat Rooms** - Create and join group channels
- 👥 **User Presence** - See who's online, away, or busy
- ⚡ **Typing Indicators** - Know when someone is typing
- 😊 **Emoji Reactions** - React to messages with emojis
- ✏️ **Message Editing** - Edit your sent messages
- 🗑️ **Message Deletion** - Delete messages you've sent
- 🎨 **Beautiful UI** - Modern, professional design with relaxing colors
- 📱 **Responsive Design** - Works on desktop and mobile devices

### 🚀 Advanced Features (NEW!)
- 🎙️ **Voice Messages** - Record and send voice messages with real-time visualization
- 📎 **File Sharing** - Drag & drop file upload with image preview (up to 50MB)
- 🖼️ **Rich Media Display** - Images show inline, files with custom cards
- 🎵 **Audio Playback** - Professional audio player with speed control
- ⚡ **Broadcast Realtime** - Works without Supabase Replication dashboard
- 🎬 **Smooth Animations** - Framer Motion powered interactions
- 📥 **Smart Upload** - Progress bars, file type detection, previews

> 📖 **See [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) for detailed documentation**

### Technical Features
- Real-time broadcast channels (no replication needed!)
- User profiles with avatars (auto-generated with DiceBear)
- Room member management with roles (owner, admin, member)
- Supabase Storage for files (50MB limit)
- Message reactions with emoji picker
- Typing indicators with broadcast events
- Message edit history tracking
- Online/offline status tracking
- Last seen timestamps
- Room creation and management
- Private and public rooms

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Emoji Picker**: emoji-picker-react
- **Date Formatting**: date-fns
- **Animations**: Framer Motion
- **Notifications**: react-hot-toast

## 📚 Documentation (19 Comprehensive Guides)

### 🚀 Getting Started
| Guide | Description |
|-------|-------------|
| **[START_HERE.md](START_HERE.md)** | 👋 Perfect entry point for new users |
| **[QUICK_START.md](QUICK_START.md)** | ⚡ 5-minute setup guide |
| **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** | ✅ Track your progress |

### 🔧 Setup & Configuration
| **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** | 🗄️ Detailed database setup |
| **[SETUP.md](SETUP.md)** | 📝 Alternative setup guide |

### 📖 Reference & Learning
| **[FEATURES.md](FEATURES.md)** | ✨ Complete feature list |
| **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** | 🚀 Voice, files, and advanced tools |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 🏗️ System architecture diagrams |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | 📊 What was built |
| **[FILE_MANIFEST.md](FILE_MANIFEST.md)** | 📁 Complete file listing |

### 🐛 Help & Support
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 Common issues solved |

### 🚀 Deployment
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🌐 Production deployment |

### 🤝 Contributing
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | 💡 How to contribute |

### 📋 Navigation & Summary
| **[DOCS_INDEX.md](DOCS_INDEX.md)** | 🗺️ Documentation map |
| **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** | 🎉 Project completion summary |
| **[WHATS_NEW.md](WHATS_NEW.md)** | 🆕 Recent updates and changes |
| **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** | 📋 Complete project overview |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | ⚡ Fast answers and tips |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd creative-chat-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

> **Detailed instructions**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for step-by-step guide

**Quick steps:**
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy and paste the entire `supabase-schema.sql` file
4. Click "Run" to execute the schema
5. Create storage bucket named `chat-files` (or schema creates it)
6. Go to Project Settings > API to get your credentials

> ✅ **Real-time works automatically!** No need to enable Replication dashboard!

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Account

1. Navigate to the auth page
2. Click "Sign Up"
3. Enter your username, email, and password
4. You'll be automatically logged in and redirected to the chat

### Joining Rooms

1. The "General" room is created by default
2. Click on any room in the sidebar to join
3. Create new rooms using the "+" button

### Sending Messages

1. Select a room from the sidebar
2. Type your message in the input field at the bottom
3. Press Enter to send, or Shift+Enter for a new line
4. Use the emoji button to add emojis

### Message Features

- **React**: Hover over a message and click the emoji button
- **Edit**: Hover over your message and click the edit icon
- **Delete**: Hover over your message and click the delete icon
- **Reply**: Click the reply button on any message (future feature)

### Room Management

1. Click the info button in the chat header to view room details
2. See all members and their online status
3. Leave a room by clicking "Leave Room" in the room info modal

## Project Structure

```
creative-chat-app/
├── app/
│   ├── auth/           # Authentication pages
│   ├── chat/           # Main chat interface
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (redirects)
├── components/
│   ├── ChatHeader.tsx  # Chat room header
│   ├── MessageInput.tsx # Message composition
│   ├── MessageList.tsx  # Message display
│   └── Sidebar.tsx      # Room list & user menu
├── hooks/
│   ├── useAuth.ts      # Authentication logic
│   └── useChat.ts      # Chat functionality
├── lib/
│   └── supabase.ts     # Supabase client
├── store/
│   ├── useAuthStore.ts # Auth state management
│   └── useChatStore.ts # Chat state management
├── types/
│   ├── database.ts     # Database types
│   └── index.ts        # Shared types
├── supabase-schema.sql # Database schema
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Database Schema

The application uses the following main tables:

- **profiles** - User profiles and status
- **rooms** - Chat rooms/channels
- **room_members** - Room membership with roles
- **messages** - Chat messages
- **reactions** - Emoji reactions to messages
- **typing_indicators** - Real-time typing status
- **read_receipts** - Message read tracking (future feature)

See `supabase-schema.sql` for the complete schema with indexes and RLS policies.

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { /* your colors */ },
  neutral: { /* your colors */ },
  // ...
}
```

### UI Components

All components are in the `components/` directory and use Tailwind CSS for styling. The design system uses:

- Rounded corners (rounded-xl, rounded-2xl)
- No shadows
- Relaxing color palette
- Smooth transitions
- Professional typography

## Security

The application implements Row Level Security (RLS) policies to ensure:

- Users can only see rooms they're members of
- Users can only edit/delete their own messages
- Users can only update their own profile
- Room admins have appropriate permissions

## Performance

Optimizations include:

- Real-time subscriptions only for active rooms
- Automatic cleanup of typing indicators
- Indexed database queries
- Efficient state management with Zustand
- Lazy loading of components

## Future Enhancements

Potential features to add:

- [ ] File and image uploads
- [ ] Voice messages
- [ ] Video calls
- [ ] Message search
- [ ] Message threads
- [ ] Read receipts
- [ ] Push notifications
- [ ] Dark mode
- [ ] Custom themes
- [ ] Message formatting (markdown)
- [ ] User blocking
- [ ] Direct messages
- [ ] Message pinning
- [ ] Room categories

## Troubleshooting

### Messages not appearing

1. Check your Supabase credentials in `.env.local`
2. Verify the database schema is properly set up
3. Check browser console for errors
4. Ensure you're a member of the room

### Authentication issues

1. Verify your Supabase URL and anon key
2. Check if email confirmations are required in Supabase settings
3. Clear browser storage and try again

### Real-time not working

1. Ensure Realtime is enabled in your Supabase project
2. Check if RLS policies allow realtime access
3. Verify network connection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Supabase
