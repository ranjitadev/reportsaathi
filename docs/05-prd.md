# Product Requirements Document (PRD): ReportSaathi

## 1. Document Overview
* **Product Name**: ReportSaathi (रिपोर्ट साथी)
* **Version**: 1.0 (MVP)
* **Status**: Ready for Engineering
* **Document Owner**: Product & Clinical Strategy Team
* **Referenced Documents**:
  - Problem Statement: [`docs/01-problem.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/01-problem.md)
  - Market Research & Legal Landscape: [`docs/02-research.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/02-research.md)
  - Scope & Feature Breakdown: [`docs/03-scope.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/03-scope.md)
  - Design Direction & Screen States: [`docs/04-design.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/04-design.md)
  - Architectural Blueprint: [`docs/06-architecture.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06-architecture.md)
  - Safety & Clinical Guardrails: [`docs/06b-safety-rules.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06b-safety-rules.md)

---

## 2. Product Goals & Vision

### 2.1 Primary Goals
1. **Eliminate Medical Jargon Panic**: Ingest a digital diagnostic lab PDF (e.g., CBC, Lipid, Thyroid, LFT, KFT) and translate confusing biochemical acronyms into clear, empathetic plain language in under 60 seconds.
2. **Contextualize Out-of-Range Markers**: Normalize harmless physiological fluctuations (fasting, hydration, temporary stress) and de-escalate the terror caused by red asterisks (`*`) without offering clinical diagnoses.
3. **Equip the Patient for the Doctor Visit**: Generate **3 targeted, high-yield questions** for the patient to ask their physician during a 3-to-5-minute Outpatient Department (OPD) consultation.
4. **Bilingual Parity**: Provide complete functional and linguistic equality across English and Hindi (Devanagari script), designed specifically for older citizens and low-cost Android smartphones.
5. **Radical Privacy-by-Design**: Operate with zero server-side storage of Personal Identifiable Information (PII) or Personal Health Information (PHI), ensuring strict compliance with India's Digital Personal Data Protection Act, 2023 (DPDP Act).

### 2.2 Non-Goals
1. **NOT an AI Doctor or Diagnostic Engine**: ReportSaathi will never diagnose diseases, predict clinical outcomes, or state conditions (e.g., *"You have diabetes"*).
2. **NOT a Treatment or Prescription Modifier**: Will never recommend starting, stopping, or altering any medication or dosage.
3. **NOT a Commercial Aggregator or Telehealth Funnel**: Will not sell medicines, push affiliate test packages, or trap users in commercial upsells.
4. **NOT a Paper-Scan OCR Engine for MVP**: Will not support camera photos of crumpled paper reports in Version 1.0 (restricted to native digital vector PDFs from labs).
5. **NOT a Persistent Longitudinal Health Locker in MVP**: Will not maintain permanent user accounts, logins, or multi-year historical tracking in MVP (stateless session architecture).

---

## 3. User Personas & User Stories

### 3.1 Target Personas
1. **Ramesh (58, Retired Teacher, Tier-2 City)**: Diagnosed with borderline hypertension; recently received a Lipid Profile PDF on WhatsApp from a local diagnostic lab. Cannot read dense English medical abbreviations. Anxious that slightly elevated triglycerides mean an imminent heart attack.
2. **Priya (29, Software Engineer, Bengaluru)**: Managing healthcare remotely for her elderly parents living in Kanpur. Receives raw lab PDFs from her father, spends hours searching Google/ChatGPT to decipher what her father should ask his physician.
3. **Dr. Arvind (42, General Physician, Busy Urban Clinic)**: Conducts 40–50 consultations every morning. Frustrated that 2–3 minutes of every 5-minute consultation are wasted calming patients down from panicked Google searches instead of discussing therapeutic care.

### 3.2 User Stories
* **US-1 (Report Ingestion)**: *As a patient*, I want to upload the digital PDF report I received from my lab on WhatsApp, so that I don't have to manually type dozens of confusing numbers.
* **US-2 (Password Unlocking)**: *As a user with a protected PDF*, I want an immediate prompt to enter my date of birth or phone number, so that I can open my encrypted lab report seamlessly.
* **US-3 (Privacy Reassurance)**: *As a privacy-conscious citizen*, I want proof that my name and personal phone number are stripped on my phone, so that my medical records are never leaked or sold.
* **US-4 (Transparency & Sanity Check)**: *As a patient*, I want to see a clear list of extracted numbers side-by-side with my report before explanations are generated, so that I can trust the software hasn't misread a digit.
* **US-5 (Plain-Language Explanation)**: *As a non-medical reader*, I want medical terms explained in simple Hindi or English with their organ functions, so that I understand what my body is doing.
* **US-6 (De-Escalating Panic)**: *As an anxious patient*, I want out-of-range numbers explained in context (diet, hydration, sleep), so that I don't panic before seeing my doctor.
* **US-7 (Consultation Preparation)**: *As a patient visiting a busy doctor*, I want 3 specific questions written down for me, so that I don't forget what to ask during my short appointment.
* **US-8 (Caregiver WhatsApp Sharing)**: *As a caregiver*, I want to share the 1-page summary card via WhatsApp with my family, so that everyone stays informed without forwarding unverified medical advice.

---

## 4. Numbered Functional Requirements (FR)

### Document Ingestion & Verification
* **FR-1.1 (PDF Format Support)**: The system shall accept standard digital vector PDFs generated by Indian diagnostic labs (Dr. Lal PathLabs, Apollo 24|7, Tata 1mg, Metropolis, Agilus/SRL, and standard LIS software) up to 10 MB.
* **FR-1.2 (Inline Password Decryption)**: If a PDF is encrypted with standard user passwords (DOB in `DDMMYYYY` or 10-digit mobile number), the system shall present an inline numeric input modal to decrypt the document entirely in client memory.
* **FR-1.3 (Client-Side PII Stripping)**: Before any document text or extracted token leaves the client browser, all PII patterns (patient name, age, gender, phone number, address, UHID, barcoded accession numbers, lab branch) shall be scrubbed and replaced with anonymous tokens (`[PATIENT_MASKED]`).
* **FR-1.4 (Biomarker Parameter Extraction)**: The system shall extract:
  1. Parameter / Biomarker Name (e.g., Fasting Blood Sugar, HbA1c, TSH, SGPT).
  2. Measured Value (numerical float/integer).
  3. Measurement Unit (e.g., `mg/dL`, `g/dL`, `µIU/mL`, `fl`, `cells/cu.mm`).
  4. Biological Reference Interval (lower limit, upper limit).
* **FR-1.5 (Sanity Check Review Screen)**: The system shall display all extracted parameters in an editable card list before generating explanations, allowing the user to tap `✏️ Edit` to correct any OCR misreads.

### Plain-Language Vernacular Explanation
* **FR-2.1 (Biomarker Demystification)**: The system shall translate extracted clinical acronyms into simple layperson terminology, detailing the organ involved and its everyday biological function.
* **FR-2.2 (Out-of-Range De-Stigmatization)**: For any parameter falling outside standard reference limits:
  1. The UI shall display a neutral warm-amber status badge (`▲ Above Standard Range` / `▼ Below Standard Range`).
  2. The text shall explain common benign physiological reasons for mild fluctuations (e.g., recent meals, dehydration, physical exertion, medication side effects, sleep disruption).
* **FR-2.3 (Bilingual Multi-Language Parity)**: The system shall support a zero-reload language toggle between English and Hindi (Devanagari script), maintaining complete parity of information.
* **FR-2.4 (Normal Test Collapse)**: Parameters falling strictly within reference intervals shall be grouped into a collapsible accordion (`✓ Within Standard Range`), keeping the screen uncluttered for elderly readers.

### Safety, Red Flags & Doctor Preparation
* **FR-3.1 (Deterministic Critical Red-Flag Detection)**: The system shall run all extracted numerical values against a hardcoded, deterministic clinical emergency lookup table (see [`docs/06b-safety-rules.md`](file:///c:/Users/Ranjitha/reportsaathi/docs/06b-safety-rules.md)). If a value crosses panic thresholds (e.g. Platelets < 20,000/µL, Potassium > 6.5 mEq/L, Glucose > 400 mg/dL), the system shall immediately display an emergency medical evaluation banner.
* **FR-3.2 (Doctor Consultation Question Builder)**: The system shall synthesize the patient's out-of-range markers into exactly **3 high-yield questions** tailored for their doctor consultation.
* **FR-3.3 (Pre-Consultation Briefing Checklist)**: The system shall provide reminders of disclosures to make to the physician (fasting duration, current prescriptions, over-the-counter vitamins, Ayurvedic/herbal supplements).
* **FR-3.4 (1-Click WhatsApp Share Card)**: The system shall generate a lightweight, shareable visual card or copyable text summary containing the 3 questions and test summary, formatted for WhatsApp chat sharing.
* **FR-3.5 (Stateless Session Purge)**: Upon session completion, page refresh, or explicit exit, all extracted parameters, temporary buffers, and generated summaries shall be immediately purged from memory. Zero health data shall be persisted in any database.

---

## 5. Non-Functional Requirements (NFR)

### Performance & Hardware Efficiency
* **NFR-1.1 (Latency)**: End-to-end processing (from PDF upload to plain-language explanation) shall complete in **< 4.0 seconds** on a standard 4G mobile connection.
* **NFR-1.2 (Client Bundle Weight)**: Total initial JavaScript and CSS bundle weight shall not exceed **180 KB (gzipped)** to ensure instant execution on low-cost Android smartphones (e.g., 2GB RAM Android Go devices).
* **NFR-1.3 (Zero Web Font Downloads)**: The application shall rely exclusively on the native system font stack to prevent network stalls and FOIT (Flash of Invisible Text) on slow connections.

### Usability & Accessibility (Elder-First Design)
* **NFR-2.1 (Touch Target Ergonomics)**: All interactive buttons, checkboxes, language pills, and accordion headers shall possess a **minimum tap target of 56×56 dp**.
* **NFR-2.2 (Contrast & Readability)**: All body and heading text shall meet WCAG 2.1 AAA contrast guidelines (minimum 7:1 contrast ratio against the canvas).
* **NFR-2.3 (Non-Latin Script Line-Height)**: Devanagari text line-height shall be maintained at **1.6 to 1.7** to prevent clipping of top and bottom vowel marks (मात्राएं).
* **NFR-2.4 (Viewport Adaptation)**: The UI shall render cleanly without horizontal scrolling or layout breaks on screens as narrow as **320px**.

### Security & Privacy Compliance
* **NFR-3.1 (DPDP Act 2023 Conformance)**: The application shall act as a zero-retention processor. No personally identifiable medical records shall be stored, logged, or indexed.
* **NFR-3.2 (In-Transit Encryption)**: All client-server communication shall enforce TLS 1.3 encryption.
* **NFR-3.3 (Zero Third-Party Ad Trackers)**: The application shall contain zero third-party advertising SDKs, commercial tracking pixels, or analytics trackers that inspect health payloads.

---

## 6. Safety & Statutory Requirements

* **SR-1 (Prohibition of Disease Diagnosis)**: The system shall be structurally and programmatically prevented from stating or implying a diagnosis. Output shall never include phrases like *"You are suffering from"*, *"Diagnosis:"*, or *"You have diabetes"*.
* **SR-2 (Prohibition of Medication Modification)**: The system shall be strictly forbidden from advising changes to drug dosages, recommending prescription pharmaceuticals, or endorsing alternative folk remedies.
* **SR-3 (Prominent Telemedicine Safe-Harbor Notice)**: A persistent, non-dismissible statutory notice shall be displayed on all summary screens:
  > *"Notice: ReportSaathi provides educational health literacy and does not constitute a clinical diagnosis or medical advice. Always consult a Registered Medical Practitioner (RMP) before making any healthcare decisions."*

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

| Metric Category | Key Performance Indicator (KPI) | Target Goal (MVP) | Measurement Method |
| :--- | :--- | :--- | :--- |
| **Comprehension Speed** | Time from PDF upload to Doctor Questions view | **< 60 seconds** | Client timestamp analytics |
| **Extraction Accuracy** | Percentage of parameters extracted with correct value & unit | **≥ 98.0%** | Audit of sampled test reports |
| **Anxiety Reduction** | User self-reported anxiety reduction before vs. after reading | **≥ 75% positive feedback** | 1-tap post-summary sentiment poll (`Calmer` / `Same` / `Anxious`) |
| **Doctor Question Utility** | Percentage of users who save or share the 3 questions | **≥ 60% of active sessions** | Tap tracking on `Share on WhatsApp` or `Save Card` |
| **Data Privacy Integrity** | PII / PHI leakage or unauthorized server retention incidents | **0 incidents (100% clean)** | Automated continuous log audit |
| **Technical Reliability** | App crash or fatal render rate on 2GB Android devices | **< 0.5% of sessions** | Error telemetry logging |
