# 🎮 Financial Life Simulator

## 🚀 Published version
[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://handlefinancebyledneev.vercel.app/)

A dynamic, educational life simulation game where players manage their career, finances, investments, and life choices to achieve personal goals — all in a risk-free environment.

Built with **React**, **TypeScript**, and **Zustand**, this simulator blends gamification with financial literacy, helping players understand real-world economic decisions through immersive gameplay.

---

## 🚀 Current Status: Core Systems Complete

✅ **Game Foundation Live & Functional**
- Modular Zustand store with full type safety
- Player progression: career levels, skill development, aging
- Investment mechanics: stocks, crypto, real estate, education
- Dynamic events: random opportunities, crises, life choices
- Portfolio tracking with asset volatility and trends
- Expense & consumption system with upgradeable lifestyle

✅ **Onboarding & Game Flow**
- Interactive `StartScreen` with customizable settings
  - Name, starting balance, initial skills
  - Goal selection: wealth, career, lifestyle, skill mastery
  - Time limit for challenge mode
- Full game reset with clean state restoration
- Seamless flow: Start → Game → Result → Restart

✅ **Victory & Defeat System**
- Goal engine validates win/loss conditions:
  - 💰 **Wealth**: Reach target net worth
  - 🏢 **Career**: Achieve desired career level
  - 🛋️ **Lifestyle**: Max out all expenses and purchases
  - 🧠 **Skill**: Master a skill (e.g. programming)
- End-game modal with:
  - Clear result (victory/defeat)
  - Statistics: years played, final balance, net worth
  - Restart option that returns to `StartScreen`

✅ **Modern Tech Stack**
- **React 18** + **TypeScript** for robust type safety
- **Zustand** with **persist middleware** for state
- **Tailwind CSS** for fast, responsive UI
- **React Router** for navigation
- **localStorage**-backed persistence

---

## 🛠 Tech Stack

| Layer           | Technology               |
|----------------|--------------------------|
| **Framework**  | React 19, Vite           |
| **State**      | Zustand + Slices         |
| **Types**      | TypeScript               |
| **Styling**    | Tailwind CSS             |
| **Routing**    | React Router DOM         |
| **Storage**    | localStorage (persist)   |
| **Utilities**  | date-fns, nanoid, immer  |

---

## 🎯 Roadmap: What’s Coming Next

### 🔧 UI & UX Enhancements
- [ ] **Progress bar** for each goal type
- [ ] **Animated modal transitions** for immersive feedback
- [ ] **Sound effects** for key events (victory, crisis, purchase)
- [ ] **Tooltips** for assets, events, and skills

### 📊 Visualization & Feedback
- [ ] **Net worth & balance charts** (using Recharts or Chart.js)
- [ ] **Career path visualization**
- [ ] **Skill growth timeline**

### 🎮 Gameplay Expansion
- [ ] **Multiple save slots** for different playthroughs
- [ ] **Achievements & badges** system
- [ ] **Multiple difficulty levels**
- [ ] **Debt & loan mechanics**
- [ ] **Family & dependents system** (long-term)

### 🌐 Future Vision
- [ ] **Multiplayer mode**: compare progress with friends
- [ ] **Export results** (PDF, shareable image)
- [ ] **Localization** (Russian, English, others)
- [ ] **Open-source community contributions**

---

## 🚦 Getting Started

### Clone and run locally:

git clone https://github.com/ledneev/handleFinance.git

cd financial-simulator

npm install

npm run dev

Open http://localhost:3000 and start your financial journey!

📝 Commit Convention

We follow conventional commits:

feat: ... --- New features

fix: ... --- Bug fixes

docs: ... --- Documentation updates

refactor: ... --- Code restructuring

chore: ... --- Maintenance tasks

style: ... --- Formatting, no logic changes

test: ... --- Adding or correcting tests

📄 License

MIT License --- feel free to use, modify, and share.

💬 "The best time to plant a tree was 20 years ago. The second best time is now."

This game helps you plant your financial future --- one decision at a time.