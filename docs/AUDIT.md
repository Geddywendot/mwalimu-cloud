# Mwalimu Cloud Codebase Audit & Gap Analysis

**Date:** 2026-10-23  
**Status:** Audit Completed – Proceeding with Refactoring and Content Implementation

---

## 1. Executive Summary

The starting repository contains an initial prototype designed primarily around a live Supabase + Claude Edge Function backend. While the basic React routing, UI shell, and initial Leitner and readiness algorithms were in place, the application lacked the entire offline/static-first architecture, had zero pre-authored content files, and was missing several core features stipulated in the autonomous build brief.

---

## 2. Identified Gaps Against Brief Requirements

### Section 0: Content Mode & Provider Pattern
- **Current State:** `src/lib/api.ts` directly invoked Supabase Edge Functions (`explain`, `generate-quiz`, `followup`). There was no abstraction for static content.
- **Gap:**
  - Need a `ContentProvider` interface: `getExplanation(topicId, language, level)`, `getQuiz(topicIds, count, language)`, and `getFollowups(topicId, language)`.
  - Need two implementations: `staticProvider` (in-memory/bundled JSON from `src/content/`) and `liveProvider` (Supabase Edge Functions).
  - Need environment switch: `VITE_CONTENT_MODE=static|live` (default: `static`).
  - Need honesty badge: "Curated content" in static mode, "AI-generated" in live mode.

### Section 1 & 5: Content Authoring (`src/content/`)
- **Current State:** The directory `src/content/` did not exist. No hardcoded explanations, questions, or follow-ups existed.
- **Gap:**
  - `src/content/explanations.en.json`: All 15 topics, both `standard` and `simpler` levels (30 entries), conforming to word count limits (<= 120 words for simple explanation), with African analogies, analogy limits, key terms, exam tips, and common mistakes.
  - `src/content/explanations.sw.json`: All 15 topics in Kiswahili with English technical terms and `_review` disclaimer.
  - `src/content/questions.json`: 120+ questions (>= 8 per topic) covering single, multiple, and true/false types, difficulty levels (easy, medium, hard), 4 options (2 for T/F), detailed explanations for both correct and each wrong option, no banned phrases ("all of the above", "none of the above").
  - `src/content/followups.en.json`: 4 curated Q&As for each of the 15 topics (60 Q&As).
  - `src/content/followups.sw.json`: 4 curated Q&As per topic in Kiswahili with `_review` disclaimer.
  - Content validation script `npm run validate:content` enforcing all brief invariants via Zod and running in `npm test`.

### Section 2 & 8: Offline / PWA & Mobile-First UX
- **Current State:** Basic responsive design, but no service worker, no PWA manifest, and static mode fails if loaded without internet.
- **Gap:** Add `manifest.webmanifest` and a lightweight Service Worker caching app shell and static JSON content for reliable offline use on low-bandwidth mobile networks.

### Section 3: Hard Rules & Honesty
- **Current State:**
  - Footer in `src/components/DisclaimerFooter.tsx` translated the disclaimer in Kiswahili, violating the hard requirement: `Footer on EVERY page: "Unofficial study tool. Not affiliated with or endorsed by Microsoft."`.
  - No "Curated content" / "AI-generated" badge.
  - No "Translation under review" badge when Kiswahili is selected.
- **Gap:** Enforce exact footer text across all routes and views; add honesty badges in header or appropriate views.

### Section 6: Feature Implementation Gaps
1. **Onboarding & Home:**
   - If Supabase keys are absent, sign-in input should be completely hidden and guest-only mode emphasized.
2. **Explain Mode:**
   - In static mode, free-text chat must be replaced by tappable "common questions" follow-up chips that reveal the curated answers.
3. **Quiz Mode:**
   - In-session question drawing without repeats from the local bank in static mode.
   - Shuffled options on load to avoid bias.
   - "Report this question" should flag locally and show reported question IDs in a hidden `/about` debug route (syncing to Supabase only if live mode and backend available).
4. **Spaced Repetition:**
   - Integrate seamlessly with QuizRunner and Revision view; ensure pure Leitner functions are 100% test covered.
5. **Readiness Dashboard:**
   - Refine domain weights and gauge display; maintain disclaimer "This is an estimate, not a guarantee."
6. **Study Planner (`/planner`):**
   - New route `/planner`: Day-by-day study schedule calculated from exam date, hours per weekday, domain weights, and weak topics. Pure function in `src/lib/planner.ts` with comprehensive unit tests.
7. **Progress Export & Import:**
   - JSON file download ("Download my progress") and upload/validation ("Restore progress") with Zod schema validation.
   - Cloud sync and merge logic (latest timestamp wins) with unit tests for merge resolution.

### Section 7 & 9: Documentation & Live Mode
- **Current State:** Documentation was focused on the Claude-only model.
- **Gap:**
  - Update `docs/ARCHITECTURE.md` with ContentProvider pattern and offline-first data flows.
  - Create `docs/CONTENT_GENERATION.md` with reproducible prompt templates and review checklists.
  - Create `docs/PITCH_OUTLINE.md` aligned with hackathon pitch criteria.
  - Update `README.md` with 10-minute setup (zero keys needed), architecture, honesty statement, assumptions, and limitations.

---

## 3. Action Plan & Execution Milestones

1. **Phase 1: Architecture & Provider Foundation**
   - Define `ContentProvider` interface in `src/types/content.ts` / `src/lib/content/provider.ts`.
   - Implement `staticProvider` and `liveProvider`.
   - Wire provider into React Query hooks.
2. **Phase 2: Content Authoring (Explanations, Questions, Follow-ups)**
   - Author 15 topics in `src/content/explanations.en.json` (standard & simpler).
   - Author 15 topics in `src/content/explanations.sw.json`.
   - Author 120+ original questions in `src/content/questions.json` (>= 8 per topic).
   - Author 60 follow-ups in `src/content/followups.en.json` and `src/content/followups.sw.json`.
   - Write and integrate `scripts/validate-content.ts` and add `npm run validate:content`.
3. **Phase 3: Core Feature Completion & UI Enhancements**
   - Explain mode: Tappable follow-up chips in static mode; "Curated content" / "AI-generated" badge; "Translation under review" indicator.
   - Quiz mode: Local bank sampler with no duplicates per session; option shuffling; local question flagging; hidden `/about` debug route.
   - Hard rule footer enforcement on every route.
   - Progress export/import (JSON) and timestamp-based merge function in `src/lib/progress.ts`.
   - Study Planner (`/planner`) route and pure planning algorithm in `src/lib/planner.ts`.
4. **Phase 4: Offline PWA & Service Worker**
   - Add web app manifest and lightweight service worker in `public/sw.js` and register in `src/main.tsx`.
5. **Phase 5: Automated Testing & Verification Loop**
   - Unit tests for: ContentProvider (static), Quiz runner sampler, Leitner repetition, Readiness calculation, Study planner, Progress export/import/merge, and mock localStorage full flow.
   - Content validation script passing in `npm test`.
   - Production build check & secret scan on `dist/`.
6. **Phase 6: Documentation & Final Polish**
   - Complete `README.md`, `docs/ARCHITECTURE.md`, `docs/PROMPTS.md`, `docs/CONTENT_GENERATION.md`, `docs/DEMO_SCRIPT.md`, `docs/PITCH_OUTLINE.md`.
