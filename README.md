# 🏆 Draftino

**Draftino** is a web app for managing fantasy football auctions, designed for both **Classic** and **Mantra** modes.  
It helps you manage teams, credits, players, and formations quickly and easily, even during the most hectic auctions.

---

## ✨ Main Features

- 📥 **Import players from JSON** to populate the local database
- 📝 **Team management** with name, starting budget, and user’s team flag
- 💰 **Dynamic credits**: each purchase is automatically deducted from the team’s budget
- 📊 **Spreadsheet-like table** with team columns and rows for purchased players
- ⚡ **Classic and Mantra modes**:
  - Classic → Goalkeepers, Defenders, Midfielders, Forwards
  - Mantra → Detailed roles (P, DS, DC, DD, B, E, M, C, W, T, A, PC)
- 📐 **Formation coverage (Mantra)**: automatic calculation of playable modules based on purchased players
- 🔔 **Custom alerts** for the user’s team, so you don’t overspend the budget
- 💾 **Local persistence**: progress remains even after a refresh
- 📤📥 **Export/Import auction state** in JSON for backup or quick resume

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/) for linting and formatting
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- LocalStorage for persistence

---

## 🚀 Project Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/draftino.git
cd draftino
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

---

## 📂 Project Structure

```
draftino/
├─ src/
│  ├─ components/     # UI Components (Table, Input, Alert…)
│  ├─ pages/          # Main pages (Home, Auction, Teams…)
│  ├─ hooks/          # Custom hooks (e.g., credits management, formations…)
│  ├─ store/          # Global state (Zustand/Context)
│  ├─ types/          # TypeScript types for players, teams, roles
│  └─ main.tsx        # React entry point
├─ public/            # Static assets
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 📥 Player Import

The players JSON must follow a structure like this:

```json
[
  {
    "name": "Mario Rossi",
    "team": "Juventus",
    "role": ["PC"]
  },
  {
    "name": "Luca Bianchi",
    "team": "Milan",
    "role": ["C", "E"]
  }
]
```

---

## 📤 Auction Export/Import

- **Export**: generates a JSON file with the current auction state (teams, remaining credits, purchased players).
- **Import**: reloads a JSON file to resume an interrupted auction.

---

Made with ❤️ for all fantasy managers – _Draftino_ is your auction companion!
