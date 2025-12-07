```
                    ██████╗ ██████╗  ██████╗
                    ██╔══██╗██╔══██╗██╔════╝
█████╗█████╗█████╗  ██████╔╝██████╔╝██║  ███╗
╚════╝╚════╝╚════╝  ██╔══██╗██╔═══╝ ██║   ██║
                    ██║  ██║██║     ╚██████╔╝
                    ╚═╝  ╚═╝╚═╝      ╚═════╝
        ⚔️  Critical thinking as a blood sport  ⚔️
```

<div align="center">

[![Website](https://img.shields.io/badge/Website-xrpg.gg-8B5CF6?style=for-the-badge)](https://xrpg.gg)
[![X](https://img.shields.io/badge/Bot-@xRPGBot-000000?style=for-the-badge&logo=x)](https://x.com/xRPGBot)
[![Creator](https://img.shields.io/badge/Creator-@bukati-1DA1F2?style=for-the-badge&logo=x)](https://x.com/bukati)

**Web client for xRPG - The Grok-powered "what-if" simulation game on X**

[Website](https://xrpg.gg) · [Play on X](https://x.com/xRPGBot) · [Backend Repo](https://github.com/user/xrpg-server)

</div>

---

## ⚡ What is xRPG?

xRPG turns any spicy tweet into a branching "what-if" simulation powered by Grok AI and real historical context. Pick an ideology, watch history show you the receipts.

**The game doesn't lecture. It shows consequences.**

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Auth:** X OAuth 2.0 (via backend)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Running backend server ([xrpg-server](https://github.com/user/xrpg-server))

### Installation

```bash
# Clone the repo
git clone https://github.com/user/xrpg-client.git
cd xrpg-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your settings

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 📁 Project Structure

```
app/
├── page.tsx           # Homepage with active/finished games
├── about/             # How it works page
├── login/             # X OAuth login
├── s/[shortId]/       # Quest story viewer
│   ├── page.tsx       # Chapter display & voting
│   └── QuestSidebar.tsx
components/
├── ActiveGames.tsx    # Live games list
├── FinishedGames.tsx  # Completed games list
└── Header.tsx         # Navigation & user info
```

## ✨ Features

- **📖 Story Viewer** - Read branching narratives with historical context
- **🗳️ Live Voting** - Vote on choices directly from the web (posts to X)
- **⏱️ Real-time Countdown** - See voting deadlines tick down
- **📚 Source Links** - Every chapter backed by real historical sources
- **🔐 X Auth** - Login with your X account to vote

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ⚔️ by [@bukati](https://x.com/bukati)**

*History doesn't repeat — it rhymes, and Grok is the DJ.*

</div>
