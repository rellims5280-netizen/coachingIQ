# CoachIQ 🎧

AI-powered phone rep coaching tool for managers. Paste a call transcript and get instant, structured coaching feedback — scores, strengths, areas to improve, talk tracks, a next-call prep plan, and an interactive Q&A with the AI.

## What It Does

- **Coaching Feedback** — scores the call 0–100 across rapport, objection handling, call structure, and closing. Surfaces specific strengths and actionable improvements
- **Talk Tracks** — generates rebuttals, openers, and script suggestions tailored to what happened on that specific call
- **Next Call Prep** — builds a focused prep plan for the rep's next call: focus areas, role-play scenarios, and a manager checklist
- **Ask AI** — managers can ask follow-up questions about the call ("Why did they lose the customer?" / "What should I role-play with this rep?")
- **Progress Tracking** — logs every session and visualizes score trends over time

## Tech Stack

- React (single `.jsx` file)
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- No backend required — runs entirely in the browser

## Getting Started

### Option 1 — Run in Claude.ai
Upload `coaching-agent.jsx` directly as an artifact in [Claude.ai](https://claude.ai) and it will render and run immediately.

### Option 2 — Run locally with Vite

1. **Install dependencies**
   ```bash
   npm create vite@latest coachiq -- --template react
   cd coachiq
   npm install
   ```

2. **Replace the default component**
   Copy `coaching-agent.jsx` into `src/` and update `src/main.jsx` to import it:
   ```jsx
   import CoachingAgent from './coaching-agent'
   ```

3. **Add your Anthropic API key**
   Create a `.env` file in the project root:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```
   Then update the fetch call in `coaching-agent.jsx` to use:
   ```js
   "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

## ⚠️ Important

- Never commit your Anthropic API key to this repo
- Add `.env` to your `.gitignore`
- This repo is intended as a prototype — add authentication before sharing with end users

## Roadmap

- [ ] Snowflake integration for bulk transcript ingestion
- [ ] FastAPI backend to replace direct browser API calls
- [ ] Rep profiles and multi-session history
- [ ] Export coaching reports to PDF

---

Built with [Claude](https://claude.ai) by Anthropic.
