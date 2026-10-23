# Mwalimu Cloud (Unofficial AZ-900 Study Buddy)

> **Unofficial study tool. Not affiliated with or endorsed by Microsoft.**  
> No Microsoft or Azure logos are used. All questions are original scenarios derived strictly from the public Microsoft Learn AZ-900 skills outline.

Mwalimu Cloud helps beginners prepare for the **Microsoft Azure Fundamentals (AZ-900)** exam by explaining technical concepts in plain language with relatable African analogies (matatus, M-Pesa agents, prepaid electricity tokens, SACCOs, water boreholes), offering original practice questions with instant wrong-option feedback, tracking readiness per domain, and scheduling spaced repetition via the 5-box Leitner system.

Built for learners on phones and constrained networks: **works 100% offline with zero backend or API keys required**.

---

## Content Mode: Curated vs Live

Content mode is controlled by the environment variable `VITE_CONTENT_MODE=static|live` (default: `static`).

- **`static` (Default):** All explanations, 120+ original questions, and follow-up Q&A chips are bundled directly in `src/content/`. Exactly **zero network calls** or third-party API dependencies. The UI displays a **"Curated content"** badge.
- **`live` (Optional):** The same abstract `ContentProvider` interface is served by Supabase Edge Functions calling Claude for dynamic generation. The UI displays an **"AI-generated"** badge.

---

## Key Features

1. **Curated Explanations with African Analogies:**
   - Standard and "Explain it simpler" levels for all 15 AZ-900 topics.
   - Pairs analogies with official definitions and an explicit **"Where it breaks down"** limit note.
   - Key terminology definitions, exam tips, and common misconceptions.
   - Available in English and Kiswahili (marked with "Translation under review").
2. **120+ Original Practice Questions:**
   - At least 8 questions per topic covering single choice, multiple choice, and true/false.
   - In-session sampling without repeats and randomized option positions.
   - Deep explanations for why the correct option is right, plus detailed explanations for **every single wrong option**.
   - "Report this question" button (logs locally to `/about` debug section, syncs to Supabase only in live mode).
3. **Leitner Spaced Repetition (5 Boxes):**
   - Automatically schedules revision at 0, 1, 3, 7, and 14 days. Wrong answers reset to Box 1.
   - Dedicated "Today's revision" view.
4. **Readiness Dashboard:**
   - Tracks accuracy across the last 20 attempts per topic.
   - Weighted domain accuracy bars aligned with official Microsoft exam weightings (Cloud Concepts: 28%, Architecture & Services: 38%, Management & Governance: 34%).
   - Exam countdown with daily recommended question targets.
   - Overall score labels: *Keep building* (<50%), *Getting there* (50–74%), *Almost ready* (75–84%), *Exam ready* (85%+).
5. **Adaptive Study Planner (`/planner`):**
   - Calculates a day-by-day roadmap based on target exam date and daily available study hours.
   - Balances Spaced Revision, Focused Topic Deep-Dives, and Practice Quizzes, heavily weighting the learner's weakest topics.
6. **Progress Export & Restore:**
   - "Download my progress" and "Restore progress" via JSON backup files with Zod schema validation.
   - Automatic timestamp-based merge (`latest timestamp wins`) when moving between devices.
7. **Offline-First PWA:**
   - Service Worker caching app shell and static assets for mobile reliability in low-bandwidth regions.

---

## Tech Stack

- **Frontend:** React 18, Strict TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query v5, Recharts, Lucide Icons, Zod.
- **Testing:** Vitest (23 automated unit and integration tests).
- **Backend (Optional for Live Mode):** Supabase (Postgres, Row-Level Security, Edge Functions in Deno).
- **AI (Optional for Live Mode):** Claude API (server-side only via Edge Functions; never exposed to browser bundles).

---

## 10-Minute Setup (Zero Keys Needed)

You do **not** need a Supabase account or any paid AI API keys to run Mwalimu Cloud.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mwalimu-cloud.git
   cd mwalimu-cloud
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:** Navigate to `http://localhost:5173`. Click **Continue as guest** and begin learning immediately!
5. **Run test suite & content validation:**
   ```bash
   npm test
   ```

---

## Optional: Enable Live AI Mode

If you wish to deploy the Supabase Edge Functions with Claude:

1. Create a project at [supabase.com](https://supabase.com).
2. Execute `supabase/migrations/001_init.sql` and `supabase/seed.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_CONTENT_MODE=live
   ```
5. Deploy Edge Functions with the Supabase CLI:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-... ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
   supabase functions deploy explain generate-quiz followup
   ```

---

## Deploying to Vercel or Netlify

Mwalimu Cloud builds into a pure static SPA in `dist/`.

1. **Build Command:** `npm run build`
2. **Output Directory:** `dist`
3. **SPA Routing:** Ensure your platform redirects all routes (`/*`) to `/index.html` (Vercel and Netlify detect Vite SPAs automatically).
4. No environment variables are required for default curated mode.

---

## Project Structure

```
├── docs/                   # Architecture, prompts, content generation guide, pitch, demo script
├── public/                 # PWA manifest, service worker (sw.js), generic SVG icons
├── scripts/
│   ├── build-questions.ts  # Authoring compiler for question bank
│   └── validate-content.ts # Zod validator enforcing brief quality gates
├── src/
│   ├── components/         # TopicCard, ExplanationCard, QuizRunner, FeedbackPanel, etc.
│   ├── content/            # Curated JSON files (explanations, 120+ questions, followups)
│   ├── data/topics.ts      # 3 domains and 15 topics based on official AZ-900 outline
│   ├── hooks/              # useAuth, useSettings
│   ├── i18n/               # UI localization (English, Kiswahili)
│   ├── lib/
│   │   ├── content/        # ContentProvider interface, staticProvider, liveProvider
│   │   ├── planner.ts      # Pure study planner algorithm
│   │   ├── progress.ts     # LocalStorage persistence, export/import, and merge
│   │   ├── readiness.ts    # Domain weights, recent window accuracy, status badges
│   │   ├── schemas.ts      # Zod validation schemas
│   │   └── spacedRepetition.ts # Leitner 5-box logic
│   └── routes/             # Home, Onboarding, Topics, Explain, Quiz, Revision, Planner, Dashboard, About
├── supabase/               # Migrations, seed SQL, and Deno Edge Functions
└── tests/                  # Vitest unit test suites
```

---

## How AI Was Used to Create the Content

In accordance with our strict honesty policy:
1. Explanations and question blueprints were drafted using AI models based on the official public Microsoft Learn AZ-900 study guide.
2. Every analogy, definition, question, and option explanation was rigorously human-audited for factual accuracy, cultural respectfulness, and pedagogy.
3. Every file was passed through an automated Zod validator (`scripts/validate-content.ts`) enforcing:
   - Word count limits ($\le 120$ words).
   - Zero banned phrases ("all of the above", "none of the above").
   - Detailed explanations for every single wrong option.
   - Accurate option ID references.

---

## Assumptions & Limitations

- **Topic Alignment:** Topics are mapped against the 2026 AZ-900 study guide. Microsoft Learn outlines update periodically; review `src/data/topics.ts` against future revisions.
- **Readiness Estimation:** The Readiness score is an educational estimate based on historical accuracy, not a guarantee of passing the Pearson VUE exam.
- **Kiswahili Review:** Kiswahili translations were produced with care while keeping technical terms in English. All Kiswahili files contain `"_review": "Needs native-speaker review"` and display a banner in the UI.
- **Guest Mode Persistence:** Progress in guest mode is saved to browser `localStorage`. Use the "Download my progress" button on the Progress page before clearing browser storage.
