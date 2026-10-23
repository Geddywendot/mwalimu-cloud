# Product Roadmap: Mwalimu Cloud

## Phase 1: Curated-Content Edition (Completed)
- [x] **Zero-Key Offline Architecture:** Fully functional with pre-written, verified content and no backend requirement.
- [x] **ContentProvider Pattern:** Decoupled `staticProvider` and `liveProvider` implementations.
- [x] **120+ Question Bank:** 8+ original questions per topic with full wrong-option explanations.
- [x] **Curated Follow-ups:** Tappable Q&A chips replacing unreliable chat in static mode.
- [x] **Offline PWA & Service Worker:** Cache-first architecture enabling low-bandwidth mobile use.
- [x] **Leitner Spaced Repetition:** 5-box revision algorithm (0, 1, 3, 7, 14 days).
- [x] **Readiness Engine & Dashboard:** Official domain-weighted readiness scores, trends, and countdown.
- [x] **Study Planner (`/planner`):** Adaptive day-by-day study roadmap based on exam date, daily hours, and weak areas.
- [x] **Progress Backup & Restore:** JSON export and schema-validated import with latest-timestamp-wins merge.
- [x] **Question Flagging & Debug Route (`/about`):** Local flag storage and audit panel.

---

## Phase 2: Community & Expansion (Upcoming)
- [ ] **Community Native Review:** Crowdsourced review interface for Kiswahili and regional dialects.
- [ ] **Additional African Languages:** Hausa, Yoruba, Amharic, Oromo, Kinyarwanda, and French.
- [ ] **Additional Certification Packs:**
  - AI-900 (Azure AI Fundamentals)
  - SC-900 (Security, Compliance, and Identity)
  - AZ-104 (Azure Administrator Associate)
- [ ] **Voice Narration (Audio Mode):** Lightweight text-to-speech reading analogies aloud for audio learners on commutes.
- [ ] **Classroom & Mentor Mode:** Cohort leaderboards, mentor heatmaps of weak topics for coding bootcamps.
- [ ] **Live AI Fine-Tuning:** Optional self-hosted open-source model (Llama/Mistral) sidecar for fully private offline AI generation.
