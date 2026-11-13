# Engineering Task List & Implementation Roadmap: ReportSaathi

## 1. Overview & Execution Strategy
* **Product**: ReportSaathi (रिपोर्ट साथी) - Version 1.0 (MVP)
* **Architecture**: Full-Stack Next.js 15 (TypeScript, React 19) + Client-Side `pdfjs-dist` Web Worker + Google Gemini 1.5 Flash Free Tier
* **State & Storage**: Strictly stateless (in-memory React state + serverless execution RAM; zero database storage for DPDP Act 2023 compliance)
* **Guiding Documents**:
  - PRD: [`docs/05-prd.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/05-prd.md)
  - Architecture: [`docs/06-architecture.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06-architecture.md)
  - API Contract: [`docs/06a-api-contract.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06a-api-contract.md)
  - Clinical Safety Rules: [`docs/06b-safety-rules.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06b-safety-rules.md)
  - QA Test Plan: [`docs/07-test-plan.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/07-test-plan.md)
  - Anonymised Test Fixtures: [`tests/fixtures/`](file:///c:/Users/Ranjitha/reportsaathi/tests/fixtures/)

---

## 2. Dependency Graph & Parallel Workstreams

```
[Phase 0: Setup, Types & Walking Skeleton]
  │
  ├────────────────────────────────────────┬────────────────────────────────────────┐
  ▼                                        ▼                                        ▼
[Workstream A: Extraction & Normalizer]  [Workstream B: AI Engine & Safety]       [Workstream C: Accessible UI System]
• Task 1.1: pdfjs-dist Web Worker         • Task 2.1: Gemini Client & Rate Limit   • Task 3.1: Tailwind & Theme Setup
• Task 1.2: Regex PII Scrubber            • Task 2.2: Bilingual Prompt Engineering • Task 3.2: Screen 1 (Upload/PIN)
• Task 1.3: Range & Unit Normalizer       • Task 2.3: Deterministic Safety Filter  • Task 3.3: Screen 2 (Verify Table)
• Task 1.4: Critical Red-Flag Engine      • Task 2.4: POST /api/explain API        • Task 3.4: Screen 3 (Explanation)
• Task 1.5: POST /api/extract API                                                  • Task 3.5: Screen 4 (Doctor Prep)
  │                                        │                                        │
  └────────────────────────────────────────┴────────────────────────────────────────┘
                                           │
                                           ▼
                    [Phase 4: Integration, Audits & Launch]
                    • Task 4.1: Playwright E2E Suite with 10 Fixtures
                    • Task 4.2: DPDP Privacy & Security Log Audit
                    • Task 4.3: Accessibility (WCAG AAA) & Low-RAM Android Audit
                    • Task 4.4: Production Release
```

---

## 3. Phase 0: Walking Skeleton & Contracts

### Task 0.1: Project Initialization & Build Infrastructure
* **Owner**: Backend / Fullstack
* **Requirements**: `NFR-1.2`, `NFR-1.3`
* **Tests**: `TC-PERF-02`
* **Dependencies**: None
* **Parallel Execution**: Standalone initial task
* **Human Approval**: No
* **Definition of Done**:
  1. Next.js 15 (App Router, TypeScript 5.x) initialized with Tailwind CSS.
  2. Vitest, React Testing Library, ESLint, and Prettier configured and passing.
  3. Strict zero-external-font configuration enforcing native system font stack.
  4. Git pre-commit hooks configured via Husky to run linting and type-checking.

### Task 0.2: Shared TypeScript Contracts & Zod Schemas
* **Owner**: Backend
* **Requirements**: `FR-1.4`, `FR-3.2`, `NFR-3.1`
* **Tests**: `TC-EXT-01`, `TC-DOC-01`
* **Dependencies**: Task 0.1
* **Parallel Execution**: Must complete before Phase 1, 2, and 3
* **Human Approval**: No
* **Definition of Done**:
  1. TypeScript interfaces and Zod schemas matching [`docs/06a-api-contract.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06a-api-contract.md) implemented in `@/types/api.ts` (`RawBiomarkerToken`, `NormalizedBiomarker`, `ReportSummaryResponse`, `ApiErrorResponse`).
  2. Zod validation schemas implemented for `ExtractRequest`, `ExplainRequest`, and runtime payload parsing.
  3. Unit test verifying Zod schema parses valid sample payloads and rejects malformed types.

### Task 0.3: Walking Skeleton Deployment & Healthcheck
* **Owner**: Backend / DevOps
* **Requirements**: `NFR-1.1`, `NFR-3.2`
* **Tests**: `TC-PERF-01`, `TC-SEC-06`
* **Dependencies**: Task 0.1, Task 0.2
* **Parallel Execution**: Can run in parallel with Phase 1 design setup
* **Human Approval**: **YES (DevOps / Infrastructure Admin)** — Requires approval of Vercel/Cloudflare project connection, production domain settings, and environment secrets.
* **Definition of Done**:
  1. Minimal `GET /api/health` route deployed and returning `{ status: "healthy", version: "1.0.0" }`.
  2. Root page (`/`) deployed displaying a placeholder title and language toggle.
  3. GitHub Actions CI pipeline configured to build, typecheck, test, and deploy to Vercel/Cloudflare preview environments.

---

## 4. Phase 1: Deterministic Engine & Client-Side Extraction

### Task 1.1: Client-Side `pdfjs-dist` Web Worker Implementation
* **Owner**: Frontend
* **Requirements**: `FR-1.1`, `FR-1.2`
* **Tests**: `TC-ING-01`, `TC-ING-02`, `TC-ING-03`
* **Dependencies**: Task 0.2
* **Parallel Execution**: Can run in parallel with Task 2.1, Task 3.1
* **Human Approval**: No
* **Definition of Done**:
  1. Mozilla `pdfjs-dist` integrated into a dedicated Web Worker (`pdfWorker.ts`) to avoid main-thread UI jank.
  2. Extracts raw text streams from vector PDFs up to 10MB; rejects files > 10MB before processing.
  3. Catches `PasswordException` and exposes a callback to accept user-provided PIN/DOB (`DDMMYYYY`) to decrypt documents in memory.

### Task 1.2: Deterministic Client-Side PII Scrubbing Engine
* **Owner**: Frontend / Security
* **Requirements**: `FR-1.3`, `NFR-3.1`
* **Tests**: `TC-SEC-02`, `TC-SEC-03`
* **Dependencies**: Task 1.1
* **Parallel Execution**: Can run in parallel with Task 1.3, Task 2.1
* **Human Approval**: No
* **Definition of Done**:
  1. Regex engine implemented to strip Indian phone numbers (`[6-9]\d{9}`), Aadhaar references (`\d{4}\s\d{4}\s\d{4}`), email addresses, age/gender lines, and hospital barcode/accession IDs.
  2. Strips patient names from standard header blocks while preserving medical biomarker names (e.g., handles edge case in `TC-SEC-03`).
  3. Unit tests pass demonstrating 100% of PII tokens in sample reports are scrubbed before sending payloads to `/api/extract`.

### Task 1.3: Biomarker Normalization & Reference Range Engine
* **Owner**: Backend
* **Requirements**: `FR-1.4`, `FR-2.2`
* **Tests**: `TC-EXT-01`, `TC-EXP-02`
* **Dependencies**: Task 0.2
* **Parallel Execution**: Can run in parallel with Task 1.2, Task 2.1
* **Human Approval**: No
* **Definition of Done**:
  1. Dictionary mapping engine matching Indian lab biomarker aliases to canonical names (e.g. "S. Creat." $\rightarrow$ "Serum Creatinine", "SGOT" $\rightarrow$ "AST / SGOT").
  2. Standardizes units (`mg/dL`, `g/dL`, `µIU/mL`, `cells/cu.mm`, `fl`).
  3. Mathematical range evaluator: accurately computes `NORMAL`, `ABOVE_RANGE`, or `BELOW_RANGE` by comparing measured values against parsed min/max reference boundaries.

### Task 1.4: Deterministic Hardcoded Critical Red-Flag Emergency Engine
* **Owner**: Backend
* **Requirements**: `FR-3.1`, `SR-1`
* **Tests**: `TC-SAF-03`
* **Dependencies**: Task 1.3
* **Parallel Execution**: Can run in parallel with Task 1.5, Task 2.1
* **Human Approval**: **YES (Chief Medical Advisor / Clinical Lead)** — Must formally sign off on the exact panic threshold values for Platelets (< 20,000), Potassium (< 2.8 or > 6.2), Glucose (< 45 or > 400), Hemoglobin (< 6.0), and Sodium.
* **Definition of Done**:
  1. Hardcoded clinical panic lookup table implemented strictly as defined in [`docs/06b-safety-rules.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06b-safety-rules.md).
  2. If any parameter breaches panic thresholds, flags `isCriticalRedFlag: true` and injects deterministic emergency action banner.
  3. Unit test proves that critical red flags trigger immediately without calling any AI model.

### Task 1.5: `POST /api/extract` Endpoint Implementation
* **Owner**: Backend
* **Requirements**: `FR-1.4`, `NFR-1.1`
* **Tests**: `TC-EXT-01`, `TC-EXT-02`
* **Dependencies**: Task 1.2, Task 1.3, Task 1.4
* **Parallel Execution**: Dependent on completion of Phase 1 engine tasks
* **Human Approval**: No
* **Definition of Done**:
  1. `POST /api/extract` route handles inbound scrubbed text and executes Tasks 1.3 & 1.4.
  2. Returns structured `ExtractResponse` within 500ms.
  3. Returns HTTP 422 with `NO_BIOMARKERS_FOUND` when non-lab text is submitted (tested with [`10_unreadable_non_lab_invoice.txt`](file:///c:/Users/Ranjitha/reportsaathi/tests/fixtures/10_unreadable_non_lab_invoice.txt)).

---

## 5. Phase 2: AI Safety, Structured Prompting & Explanations

### Task 2.1: Gemini 1.5 Flash Client & Groq Fallback Wrapper
* **Owner**: AI / Backend
* **Requirements**: `NFR-1.1`, `NFR-3.1`
* **Tests**: `TC-PERF-01`
* **Dependencies**: Task 0.2
* **Parallel Execution**: Can run in parallel with Phase 1
* **Human Approval**: No
* **Definition of Done**:
  1. Service module wrapping `@google/genai` configured with `GEMINI_API_KEY`.
  2. Secondary fallback provider configured using Groq SDK (`llama-3.1-8b-instant`) if Gemini returns 429 or 503.
  3. Implements strict zero-retention flags preventing telemetry logging of prompt text.
  4. IP-based rate limiting enforced via middleware (max 10 requests/hour/IP).

### Task 2.2: Structured Bilingual Prompt & System Directives
* **Owner**: AI
* **Requirements**: `FR-2.1`, `FR-2.2`, `FR-2.3`, `FR-3.2`, `SR-1`, `SR-2`
* **Tests**: `TC-EXP-01`, `TC-EXP-02`, `TC-LANG-01`, `TC-DOC-01`, `TC-DOC-02`
* **Dependencies**: Task 2.1
* **Parallel Execution**: Can run in parallel with Task 1.5, Task 3.1
* **Human Approval**: **YES (Clinical & Linguistic Reviewers)** — Registered Medical Practitioner and Hindi linguistic specialist must review the system prompt, bilingual tone, and ensure no diagnostic advice is generated.
* **Definition of Done**:
  1. System prompt implemented containing negative constraints: strictly forbidden from diagnosing, prescribing, or recommending folk remedies.
  2. Enforces structured JSON output schema matching `ExplainResponse` (`organSystem`, `plainExplanationEn`, `plainExplanationHi`, `commonNonCriticalReasonsEn/Hi`, and exactly 3 `questionsEn/Hi`).
  3. Prompt evaluated against all 10 sample fixture files in [`tests/fixtures/`](file:///c:/Users/Ranjitha/reportsaathi/tests/fixtures/), verifying consistent empathetic tone.

### Task 2.3: Deterministic Post-Processing Safety & Grounding Validator
* **Owner**: AI / Backend
* **Requirements**: `SR-1`, `SR-2`
* **Tests**: `TC-SAF-01`, `TC-SAF-02`, `TC-SAF-04`, `TC-SAF-05`, `TC-SAF-06`
* **Dependencies**: Task 2.2
* **Parallel Execution**: Can run in parallel with Task 2.4
* **Human Approval**: No
* **Definition of Done**:
  1. `validateAIOutput(text)` function scans LLM responses for blacklisted diagnostic keywords (`"you have"`, `"diagnosed with"`, `"treatment:"`, `"dosage"`, `"cure for"`).
  2. Numerical grounding check ensures every number in the LLM response strictly exists in the user's input parameter list.
  3. If validation fails, drops the AI response and seamlessly injects approved deterministic fallback templates from [`docs/06b-safety-rules.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06b-safety-rules.md).

### Task 2.4: `POST /api/explain` Endpoint Implementation
* **Owner**: Backend
* **Requirements**: `FR-2.1`, `FR-3.2`, `SR-3`
* **Tests**: `TC-DOC-01`, `TC-SAF-07`
* **Dependencies**: Task 2.1, Task 2.2, Task 2.3
* **Parallel Execution**: Dependent on completion of Phase 2 engine tasks
* **Human Approval**: No
* **Definition of Done**:
  1. `POST /api/explain` handles parameter arrays, invokes Task 2.2, runs Task 2.3 validator, and appends mandatory statutory disclaimer.
  2. Contract integration tests verify HTTP 200 payload matches `ExplainResponse` schema in [`docs/06a-api-contract.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06a-api-contract.md).
  3. Execution completes in < 2.5 seconds on average.

---

## 6. Phase 3: Frontend Screens & Component Implementation

### Task 3.1: Global Theme, Accessibility & Typography Configuration
* **Owner**: Frontend
* **Requirements**: `NFR-2.1`, `NFR-2.2`, `NFR-2.3`, `NFR-2.4`
* **Tests**: `TC-A11Y-01`, `TC-A11Y-02`, `TC-A11Y-03`, `TC-A11Y-04`
* **Dependencies**: Task 0.1
* **Parallel Execution**: Can run in parallel with Phase 1 & Phase 2
* **Human Approval**: No
* **Definition of Done**:
  1. Tailwind palette configured with Deep Teal (`#0F766E`), Warm Amber (`#B45309`), Forest Green (`#15803D`), Soft Canvas (`#F8FAFC`).
  2. Devanagari typography configured with mandatory `line-height: 1.6` to prevent vowel *matra* clipping.
  3. Custom UI components enforce minimum 56×56 dp touch targets and WCAG 2.1 AAA contrast ratios (> 7:1).
  4. Viewport styling verified responsive down to 320px width without horizontal overflow.

### Task 3.2: Screen 1 — PDF Upload, Password Decryption & Privacy Shield (`/upload`)
* **Owner**: Frontend
* **Requirements**: `FR-1.1`, `FR-1.2`, `FR-1.3`, `NFR-3.1`
* **Tests**: `TC-ING-01`, `TC-ING-03`, `TC-SEC-01`
* **Dependencies**: Task 1.1, Task 1.2, Task 3.1
* **Parallel Execution**: Can run in parallel with Task 3.3
* **Human Approval**: No
* **Definition of Done**:
  1. Upload screen matches [`01_upload_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/01_upload_screen.svg) and states defined in [`docs/04-design.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/04-design.md).
  2. Drag-and-drop / file selector connects to `pdfWorker.ts`.
  3. Password modal triggers seamlessly when encrypted PDF is uploaded.
  4. Privacy shield card prominently reassures zero server data storage.

### Task 3.3: Screen 2 — Extraction Review Screen with Inline Edit (`/verify`)
* **Owner**: Frontend
* **Requirements**: `FR-1.5`
* **Tests**: `TC-UI-01`, `TC-UI-02`, `TC-SEC-05`
* **Dependencies**: Task 1.5, Task 3.1
* **Parallel Execution**: Can run in parallel with Task 3.2
* **Human Approval**: No
* **Definition of Done**:
  1. Screen 2 matches [`02_verify_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/02_verify_screen.svg).
  2. Renders extracted parameters in clear vertical cards with Name, Value, Range, and Status Pill.
  3. Clicking `✏️ Edit` opens inline modal allowing user to adjust values/units before confirmation.
  4. Sticky bottom action bar (`Confirm & Explain`) submits confirmed array to `/api/explain`.

### Task 3.4: Screen 3 — Vernacular Explanation Screen & Red-Flag Alert (`/report`)
* **Owner**: Frontend
* **Requirements**: `FR-2.1`, `FR-2.2`, `FR-2.3`, `FR-2.4`, `FR-3.1`, `SR-3`
* **Tests**: `TC-EXP-01`, `TC-EXP-02`, `TC-LANG-01`, `TC-UI-03`, `TC-SAF-03`, `TC-SAF-07`
* **Dependencies**: Task 2.4, Task 3.1
* **Parallel Execution**: Can run in parallel with Task 3.5
* **Human Approval**: No
* **Definition of Done**:
  1. Screen 3 matches [`03_explanation_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/03_explanation_screen.svg).
  2. Elevated tests displayed first with plain-language organ role and everyday lifestyle causes.
  3. Normal tests collapsed in an accordion (`✓ Normal Tests`).
  4. Red-flag emergency alert banner renders pinned to the top if `hasCriticalAlert: true`.
  5. Permanent statutory safe-harbor notice displayed in footer.

### Task 3.5: Screen 4 — Doctor Consultation Checklist & WhatsApp Share (`/doctor-prep`)
* **Owner**: Frontend
* **Requirements**: `FR-3.2`, `FR-3.3`, `FR-3.4`
* **Tests**: `TC-DOC-01`, `TC-DOC-02`, `TC-DOC-03`, `TC-SHR-01`, `TC-SHR-02`
* **Dependencies**: Task 2.4, Task 3.1
* **Parallel Execution**: Can run in parallel with Task 3.4
* **Human Approval**: No
* **Definition of Done**:
  1. Screen 4 matches [`04_doctor_prep_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/04_doctor_prep_screen.svg).
  2. Displays the 3 consultation questions in high-contrast numbered cards with checkboxes.
  3. Pre-consultation briefing checklist highlights medications, fasting status, and supplements to disclose.
  4. `Share on WhatsApp` button opens `https://api.whatsapp.com/send?text=...` with formatted text; fallback clipboard copy executes if deep-link fails.

### Task 3.6: Bilingual Language Context & In-Memory Session Teardown
* **Owner**: Frontend
* **Requirements**: `FR-2.3`, `FR-3.5`, `NFR-3.1`
* **Tests**: `TC-LANG-01`, `TC-SEC-04`
* **Dependencies**: Tasks 3.2 – 3.5
* **Parallel Execution**: Dependent on completion of frontend screens
* **Human Approval**: No
* **Definition of Done**:
  1. React Language Context provides seamless instantaneous toggle between English and Hindi across all screens without page reload.
  2. Page unmount or clicking `Clear / Reset` triggers garbage collection of all patient data from React memory.

---

## 7. Phase 4: Integration, Audits & Production Release

### Task 4.1: Automated End-to-End Test Suite with 10 Fixtures
* **Owner**: QA / Fullstack
* **Requirements**: All FRs (`FR-1.1` to `FR-3.5`)
* **Tests**: All E2E test cases in [`docs/07-test-plan.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/07-test-plan.md)
* **Dependencies**: Phase 1, Phase 2, Phase 3
* **Parallel Execution**: Can run in parallel with Task 4.2, Task 4.3
* **Human Approval**: No
* **Definition of Done**:
  1. Playwright test suite executes full user flows using all 10 fixture files in [`tests/fixtures/`](file:///c:/Users/Ranjitha/reportsaathi/tests/fixtures/).
  2. Validates normal CBC, diabetic, lipid, thyroid, liver, kidney, fever, critical emergency, and non-lab invoice fixtures.
  3. 100% test pass rate in CI pipeline.

### Task 4.2: Privacy, Security & Regulatory Compliance Audit
* **Owner**: Security / Legal
* **Requirements**: `NFR-3.1`, `NFR-3.2`, `NFR-3.3`, `SR-1`, `SR-2`, `SR-3`
* **Tests**: `TC-SEC-02`, `TC-SEC-04`, `TC-SEC-07`, `TC-SAF-04`, `TC-SAF-07`
* **Dependencies**: Task 4.1
* **Parallel Execution**: Can run in parallel with Task 4.3
* **Human Approval**: **YES (Legal & Compliance Counsel)** — Final verification that data flows comply with India's DPDP Act 2023, zero health data is persisted, and statutory safe-harbor notices meet Telemedicine Practice Guidelines 2020.
* **Definition of Done**:
  1. Network payload inspection confirms zero PII leaves the browser.
  2. Server audit proves zero database connections or log files containing health records exist.
  3. Legal sign-off documented and committed.

### Task 4.3: Accessibility (WCAG AAA) & Low-End Android Device Audit
* **Owner**: Frontend / QA
* **Requirements**: `NFR-1.1`, `NFR-1.2`, `NFR-2.1`, `NFR-2.2`, `NFR-2.3`, `NFR-2.4`
* **Tests**: `TC-A11Y-01`, `TC-A11Y-02`, `TC-A11Y-03`, `TC-A11Y-04`, `TC-PERF-02`
* **Dependencies**: Task 4.1
* **Parallel Execution**: Can run in parallel with Task 4.2
* **Human Approval**: No
* **Definition of Done**:
  1. Google Lighthouse score $\ge 95$ across Performance, Accessibility, and Best Practices.
  2. Tested on physical budget Android device (e.g. Redmi A2 / 2GB RAM) under 3G/4G throttling: smooth 60fps scrolling, zero frame drops.
  3. Verified Devanagari vowel marks (*matras*) show zero vertical clipping across all screens.
  4. Production gzipped bundle verified < 180 KB.

### Task 4.4: Production Deployment & Smoke Verification
* **Owner**: Fullstack / DevOps
* **Requirements**: All PRD Requirements
* **Tests**: Full suite
* **Dependencies**: Tasks 4.1, 4.2, 4.3
* **Parallel Execution**: Final gate
* **Human Approval**: **YES (Product Lead / Project Sponsor)** — Final Go/No-Go operational approval before pointing production DNS (`reportsaathi.in`) live.
* **Definition of Done**:
  1. Production DNS and SSL configured on Vercel/Cloudflare Pages.
  2. Production environment variables (`GEMINI_API_KEY`, `RATE_LIMIT_PER_IP_HOURLY`) verified active.
  3. Production smoke test passes on mobile browser with sample report.
