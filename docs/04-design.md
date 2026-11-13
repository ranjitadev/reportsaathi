# Design Direction & Screen Specifications: ReportSaathi

## Executive Overview
**ReportSaathi** is a vernacular health-literacy web application engineered to bridge the communication gap between complex diagnostic lab reports and everyday patients in India. 

This document defines:
1. **Screen-by-screen state specifications** (Default, Empty, Loading, and Error states) for all screens in the core flow.
2. **Comparative Reference Analysis** (what to borrow and what to avoid from existing diagnostic apps, aggregators, symptom checkers, WhatsApp, and national public health tools).
3. **Core Design Direction**: Layout, Typography, Colour, Spacing, and Tone tailored for:
   - **Elderly users** (presbyopia, reduced contrast sensitivity, physical motor tremors).
   - **Low-cost Android smartphones** (Android Go, 2GB–3GB RAM, 720p screens, variable 3G/4G bandwidth).
   - **Non-Latin scripts & long vernacular words** (Devanagari/Hindi, Kannada, Tamil, Telugu).

---

## 1. Core Flow Screen State Specifications

The single core flow consists of four primary screens:
1. **Screen 1: Upload & Privacy Screen (`/upload`)**
2. **Screen 2: Extraction & Verification Screen (`/verify`)**
3. **Screen 3: Vernacular Explanation & Context Screen (`/report`)**
4. **Screen 4: Pre-Consultation Doctor Question Checklist (`/doctor-prep`)**

---

### Screen 1: Upload & Privacy Screen (`/upload`)
*Purpose: Frictionless ingestion of digital laboratory PDFs with immediate reassurance regarding data privacy under the DPDP Act 2023.*

* **1.1 Default State**:
  - **Header**: Minimalist bar with ReportSaathi logo, and an immediate Language Switcher Pill (`English` | `हिंदी`).
  - **Hero Text**: Large 24px bold headline: *"Understand your blood test report in plain language"* (Hindi: *"अपनी ब्लड टेस्ट रिपोर्ट को आसान भाषा में समझें"*).
  - **Primary Action Zone**: A prominent 120px-tall dotted dropzone container with a large 56px high green button (`Upload Lab Report PDF` / `रिपोर्ट PDF चुनें`).
  - **Supported File Notice**: Subtext: *"Supports digital PDF from Dr. Lal, Apollo, 1mg, SRL, Metropolis & all local labs"*.
  - **Privacy Shield Card**: A reassuring card at the bottom with a shield icon: *"100% Private. No medical records or personal details are stored on our servers. Compliant with DPDP Act 2023."*
  - **Sample Report Link**: Under the dropzone: *"Don't have a report handy? Try a sample CBC/Lipid report"* for zero-friction trial.

* **1.2 Empty State**:
  - The default state *is* the empty state. Prior to file selection, the dropzone shows an empty cloud/PDF outline illustration and clear instructions on where to find the PDF (e.g. *"Look for the PDF downloaded from WhatsApp or lab SMS"*).

* **1.3 Loading State**:
  - **File Ingestion Progress**: Dropzone morphs into an enclosed progress bar showing percentage (`Uploading 64%...`).
  - **Local PII Stripping Animation**: Text status update: *"Securing your privacy: Redacting name, mobile number, and lab barcodes locally on your phone..."*
  - **Low-end device optimization**: Subtle CSS pulsing spinner; avoids heavy Lottie/canvas animations that cause frame drops on 2GB RAM phones.

* **1.4 Error State**:
  - **Password-Protected PDF (Recoverable Inline)**: Many Indian labs lock PDFs with the patient's DOB (`DDMMYYYY`) or 10-digit mobile number.
    - *UI*: An inline modal appears with an unlocked padlock icon: *"This PDF is password-protected by your lab."*
    - *Input*: Large numerical PIN box with helper text: *"Usually your 4-digit birth year (e.g. 1978) or mobile number."*
    - *Action*: `Unlock & Continue` button.
  - **Invalid File Type / Image Attempt**:
    - *Alert Card*: Amber warning banner: *"Please select a PDF file. Scanned photos or camera pictures are coming in the next update."*
  - **Corrupted / Unreadable File**:
    - *Alert Card*: Red banner with icon: *"We couldn't read this PDF. Please ensure it is the original file sent by your lab or try uploading again."*

---

### Screen 2: Extraction & Verification Screen (`/verify`)
*Purpose: Radical transparency. Displays all extracted biomarkers, numerical values, units, and reference ranges so the patient can verify them against their paper/PDF before generating explanations.*

* **2.1 Default State**:
  - **Header**: Sticky top bar showing progress indicator: `Step 2 of 3: Check Extracted Numbers`.
  - **Privacy Confirmation Badge**: Green pill banner: *"✓ Personal information removed. Only anonymous test values are processed."*
  - **Biomarker List Cards**: Large, vertically stacked cards (not cramped tables) grouping tests by panel:
    - *Card Title*: Biomarker Name (e.g., `Fasting Blood Sugar / फास्टिंग ब्लड शुगर`).
    - *Value & Unit Display*: High-contrast bold value (`138 mg/dL`).
    - *Lab Reference Range*: Gray baseline badge (`Normal range: 70 – 99 mg/dL`).
    - *Status Pill*: Neutral amber badge (`Above Standard Range`).
    - *Edit Trigger*: Small pencil icon next to each row allowing 1-tap manual adjustment if OCR misread a digit.
  - **Bottom Floating Action Bar**: 64px tall sticky bar with a primary action button: `Confirm & Explain in Plain Hindi` (or English).

* **2.2 Empty State**:
  - Occurs if an uploaded PDF contains no recognizable biochemical parameters (e.g. uploaded an invoice, a doctor prescription, or an imaging radiology scan without text).
  - *UI*: A clean empty card with an illustration of a magnifying glass over an empty sheet.
  - *Copy*: *"We couldn't find any blood or urine test numbers in this file. Please make sure you uploaded a diagnostic pathology report (like CBC, Thyroid, or Lipid Profile)."*
  - *CTA*: `Upload a Different PDF` button.

* **2.3 Loading State**:
  - Displayed if the user hits `Confirm & Explain`:
  - Fullscreen clean white overlay with a steady circular progress indicator.
  - Animated step messages:
    1. *"Translating medical terminology into everyday language..."*
    2. *"Finding contextual explanations for out-of-range markers..."*
    3. *"Preparing 3 smart questions for your doctor visit..."*

* **2.4 Error State**:
  - **Unit Mismatch / Unrecognized Biomarker**:
    - *Inline Warning Pill*: If a value has an ambiguous unit (e.g. `14.2` without unit specified), the row displays an amber outline with a dropdown: *"Select Unit: [g/dL | mg/dL | %]"*.
  - **Network Timeout on Extraction**:
    - *Bottom Sheet*: *"Network connection is slow. Don't worry, your extracted values are saved."* with a large `Retry` button.

---

### Screen 3: Vernacular Explanation & Context Screen (`/report`)
*Purpose: Eliminates anxiety by translating arcane medical jargon into calm, understandable language and putting out-of-range asterisks into physiological perspective.*

* **3.1 Default State**:
  - **Language Toggle**: Floating top pill to instantly switch between `English` and `हिंदी` without page reload.
  - **Calm Reassurance Summary Banner**:
    - Green/Amber summary card: *"Total 14 tests analyzed: 11 within standard range, 3 slightly outside standard range."*
    - Subtext: *"Remember: Slightly elevated or low numbers are very common and often temporary. Only your doctor can interpret what they mean for your overall health."*
  - **Section 1: Tests Outside Standard Range (Highlighted First)**:
    - Expandable card per abnormal test.
    - *Header*: Test name + Measured value + Lab Range (`Hemoglobin: 10.4 g/dL | Normal: 12.0 – 15.0 g/dL`).
    - *What this organ/marker does*: *"Hemoglobin is the protein in red blood cells that carries oxygen from your lungs to the rest of your body."* (Hindi: *"हीमोग्लोबिन आपके रक्त में वह प्रोटीन है जो शरीर के सभी अंगों तक ऑक्सीजन पहुंचाता है।"*)
    - *Common Non-Critical Reasons*: Bullets explaining harmless triggers: *"Mild variations can occur due to hydration levels, diet, or iron absorption."*
  - **Section 2: Tests Within Normal Range**:
    - Collapsible accordion with calm green checkmarks (`✓ Normal`). Keeps the screen decluttered for older readers.
  - **Statutory Safe-Harbor Footer**: Permanent non-dismissible card: *"This summary provides educational health information and does not constitute a medical diagnosis. Please discuss these findings with your doctor."*

* **3.2 Empty State**:
  - If all tests are within normal range:
  - *UI*: Uplifting calm green card with a checkmark badge.
  - *Copy*: *"All extracted parameters are within standard lab ranges. We still recommend keeping your regular follow-up with your doctor."*

* **3.3 Loading State**:
  - Skeleton screens mirroring card shapes (gray pulsating rounded rectangles) matching low-end CSS rendering budgets. Prevents layout shifts.

* **3.4 Error State (Critical Alert / Red-Flag Emergency)**:
  - If a biomarker exceeds critical panic thresholds (e.g. Platelets < 20,000/µL, Potassium > 6.5 mEq/L, or Glucose > 400 mg/dL):
  - *UI*: A prominent, high-contrast, non-blinking red banner pinned to the top:
    - *Alert Headline*: *"⚠️ High-Priority Marker Detected"*
    - *Copy*: *"Your [Platelet count of 18,000/µL] is significantly outside the safe range. Please consult your doctor or visit the nearest clinic today for evaluation."*
    - *Action*: Large button to `Find Local Hospital / Emergency Contacts`.

---

### Screen 4: Pre-Consultation Doctor Question Checklist (`/doctor-prep`)
*Purpose: Converts passive anxiety into active agency by providing the patient with 3 concise, high-yield questions to ask their doctor during a 3-minute OPD consultation.*

* **4.1 Default State**:
  - **Hero Card**: *"Make the most of your doctor visit"*.
  - **The 3 Smart Questions Card**:
    - Each question presented inside an oversized, high-contrast white card with an easy-to-read checkbox:
      1. *"Doctor, my HbA1c is 6.2%—does this need lifestyle and diet adjustments, or should we consider medication?"*
      2. *"Could my slightly elevated ALT/SGPT be related to the painkiller/statin I took last week?"*
      3. *"When should I repeat this blood panel to check if the levels have stabilized?"*
  - **"What to Tell Your Doctor" Quick Briefing**:
    - Brief reminder pills: *"Mention if you were fasting for 8+ hours"*, *"List any Ayurvedic/herbal supplements you take"*, *"Bring your previous prescription"*.
  - **Primary Action: 1-Click WhatsApp Share / Save Card**:
    - Large 56px green button with WhatsApp icon: `Share Summary Card via WhatsApp` (`व्हाट्सएप पर शेयर करें`).
    - Generates a lightweight, legible image summary card designed specifically for WhatsApp chat preview.

* **4.2 Empty State**:
  - If no out-of-range values were found:
  - *UI*: Standard routine wellness questions (e.g., *"Doctor, based on these normal results, when do you recommend my next annual preventive checkup?"*).

* **4.3 Loading State**:
  - Smooth spinner with label: *"Generating your doctor checklist card..."*

* **4.4 Error State**:
  - **Share Generation Failure**:
    - *Fallback Card*: If generating the image card fails due to browser canvas memory limits on a 2GB Android device:
    - *UI*: Fallback to a `Copy Questions as Text` button that copies the clean bullet points directly to clipboard with a toast notification: *"Questions copied! You can now paste them into WhatsApp."*

---

## 2. Comparative Reference Analysis

| Reference Product / Interface | What to Borrow (Best Practices) | What to Avoid (Anti-Patterns) |
| :--- | :--- | :--- |
| **Dr. Lal PathLabs & Metropolis Apps**<br>*(Traditional Indian Diagnostic Labs)* | • **Clinical Trust**: Standardized biomarker names, precise units (`mg/dL`, `µIU/mL`), and NABL-calibrated reference intervals.<br>• **Clear categorization**: Grouping tests by physiological panels (e.g. CBC, Liver Profile, Kidney Profile). | • **Aggressive Red Asterisks**: Alarming red bold fonts for trivial deviations that panic users.<br>• **Dense, unreadable tables**: Multi-column desktop tables that overflow or require horizontal scrolling on mobile.<br>• **Zero patient explanation**: Raw outputs without any layperson interpretation. |
| **Tata 1mg & PharmEasy**<br>*(Indian Health & Pharmacy Aggregators)* | • **Modern Mobile Cards**: Clean card containers, high-contrast status tags (`Normal`, `High`, `Low`).<br>• **Familiar Indian Icons**: Rupee symbols, WhatsApp share shortcuts, clear digital health locker metaphors. | • **Anxiety-Driven Upselling**: Pushing ₹499 checkup packages or supplements based on minor deviations.<br>• **Commercial Banner Clutter**: Overwhelming homepages packed with flash sales, discount coupons, and ads.<br>• **Aggressive Teleconsultation Funnels**: Forcing users into paid teleconsultations rather than educating them. |
| **Ada Health & WebMD**<br>*(Global Symptom Checkers)* | • **Empathetic Microcopy**: Calm, reassuring tone that reduces anxiety.<br>• **Progressive Disclosure**: High-level summaries first, with optional expandable cards for deep-dive biological details. | • **Cyberchondria Probability Scores**: Displaying terrifying condition lists (*"7% risk of Lymphoma"*).<br>• **Rigid Multi-Step Interrogations**: Forcing users through 25 branching questions before showing any value.<br>• **Defensive "Go to ER" Panic**: Defaulting to emergency room warnings for benign somatic complaints. |
| **WhatsApp**<br>*(The Universal Mental Model in India)* | • **Zero Cognitive Friction**: Clean card bubbles, familiar green action accents (`#25D366`), simple top app bar.<br>• **Elder-Friendly Design**: Recognizable share icons, prominent tap targets, instant vernacular readability. | • **Unstructured Chaos**: Cluttered, unthreaded chat forwards where verified medical data mixes with folklore.<br>• **Lack of Tabular Precision**: Difficulty comparing numbers without structured cards. |
| **Aarogya Setu & CoWIN / ABHA**<br>*(Indian Public Health Applications)* | • **Bilingual Parity**: Seamless side-by-side English and Hindi toggle with equal visual hierarchy.<br>• **High Accessibility**: High contrast, lightweight DOM engineered for budget Android phones (JioPhone, Redmi A-series).<br>• **Government-Grade Trust**: Prominent privacy seals that reassure wary citizens. | • **Sterile Bureaucratic Aesthetic**: Rigid, dry government copy that feels cold and intimidating.<br>• **Complex Multi-Step OTP Logins**: Forcing citizen verification before displaying basic health info. |

---

## 3. Design Direction

### 3.1 Layout & Visual Hierarchy
* **Single-Column Vertical Stack**: Strict prohibition of horizontal scrolling or multi-column data tables. All biomarker data is presented in full-width vertical cards that fit comfortably within a 360dp-wide viewport (standard budget Android screen).
* **Progressive Disclosure Architecture**:
  1. *Level 1 (Glance)*: Test Name, Your Value, Lab Range, Status Pill (Normal / Slightly Elevated).
  2. *Level 2 (Tap to Expand)*: What this organ/test does in plain language, common everyday reasons for variation.
  3. *Level 3 (Action)*: Suggested doctor questions.
* **Sticky Bottom Action Bar**: Primary actions (`Confirm & Explain`, `Share via WhatsApp`) are locked into a persistent 64px-tall bottom bar with safe-area padding, ensuring older thumbs can reach the main action without stretching to the top.

### 3.2 Typography & Vernacular Script Engineering
* **System-Native Font Stack**:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", "Noto Sans", sans-serif;
  ```
  *Rationale*: Avoids downloading 600KB+ custom web font files over slow 3G/4G connections on budget hardware.
* **Type Scale & Touch-Accessibility Standards**:
  * **Screen Titles / H1**: 24px (Bold, line-height 1.3)
  * **Section Headings / H2**: 20px (SemiBold, line-height 1.35)
  * **Biomarker Values**: 22px (Bold, tabular numerals for clear digit alignment)
  * **Body Text (English)**: 16px (Regular, line-height 1.5, minimum size across the app)
  * **Body Text (Devanagari / Hindi)**: **17px (Regular, line-height 1.6)**
* **The Non-Latin Script Golden Rule**: Devanagari and South Indian Dravidian scripts require **taller line-height (`1.6` to `1.7`)** to prevent top and bottom vowel matras (मात्राएं যেমন ि, ु, ू, ृ, ं) from being clipped by tight bounding boxes.
* **Elastic Text Containers**: Hindi and regional words are 25%–40% longer than English equivalents. All button labels and card titles must use `height: auto` and `flex-wrap: wrap` with zero fixed pixel widths or `text-overflow: ellipsis`.

### 3.3 Colour System (Calm, High-Contrast & De-Stigmatizing)
The colour palette is specifically tuned to eliminate the "Red Flag Panic" of traditional lab reports while meeting WCAG 2.1 AAA contrast guidelines (minimum 7:1 for normal text).

```
Primary Brand / Action:  #0F766E (Calm Deep Teal - Trust, Health & Clarity)
Success / Normal Range:  #15803D (Forest Green - Reassurance, 7.8:1 contrast)
Attention / Above Range: #B45309 (Warm Amber/Ochre - Caution without Panic)
Critical Alert Banner:   #B91C1C (Crimson Red - Reserved strictly for true physiological emergencies)
Background (Canvas):     #F8FAFC (Soft Slate White - Glare-free for aging eyes)
Card Surface:            #FFFFFF (Pure White with subtle 1px border #E2E8F0)
Primary Text:            #0F172A (Deep Slate Black - 14.2:1 contrast ratio)
Secondary / Muted Text:  #475569 (Slate Gray - 5.8:1 contrast ratio)
WhatsApp Accent:         #25D366 (Official WhatsApp Green for the share trigger)
```

* **No Alarming Red on Borderline Values**: Slightly elevated cholesterol, ALT, or TSH are rendered in **Warm Amber (`#B45309`)**, never in harsh crimson red. Red is strictly quarantined for the emergency red-flag safety banner.

### 3.4 Spacing, Touch Ergonomics & Budget Hardware Constraints
* **Touch Target Size**: Every interactive button, pill, checkbox, and accordion header has a **minimum tap target of 56×56 dp** (exceeding standard 48dp to accommodate tremors and larger finger pads in elderly users).
* **Generous Card Padding**: 16px to 20px internal padding on all cards, with a minimum 16px vertical gap between stacked cards to prevent accidental mis-taps.
* **Low-Memory & Battery Optimization**:
  - Zero heavy CSS blur filters (`backdrop-filter`) or box shadows with large blur radiuses that strain low-end Mali/Adreno GPUs.
  - Zero auto-playing video, sound, or heavy JS physics libraries.
  - Page weight capped under **180 KB** gzipped for lightning-fast loads on 512MB–2GB RAM Android Go devices.

### 3.5 Tone of Voice & Microcopy Rules
* **Empathetic & De-Escalating**: The copy must sound like a wise, compassionate family physician, not an algorithmic calculator.
  - *Bad*: *"Your Fasting Blood Sugar is ABNORMAL. High risk of Type 2 Diabetes."*
  - *Good*: *"Your Fasting Blood Sugar is 138 mg/dL, which is above the standard range (70–99 mg/dL). This measures sugar levels after overnight fasting. Numbers often fluctuate with diet and stress. Here are 3 questions to ask your doctor about what this means for you."*
* **Honorary Respectful Vernacular (Hindi)**: Use respectful formal pronouns (*"आप"* and *"आपकी"*, never informal *"तुम"*).
* **Zero Technical Jargon in Summaries**: Replace *"Hepatic transaminases"* with *"Liver proteins"*; replace *"Erythrocytes"* with *"Red blood cells"*.

---

## 4. UI Reference Screenshots & Visual Assets

Visual design mockups reflecting the four core screens have been generated and archived in [`docs/references/`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/):

* **Screen 1 (Upload & Privacy)**:
  - High-Fidelity UI Screenshot: [`01_upload_screen.jpg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/01_upload_screen.jpg)
  - Vector Layout Mockup: [`01_upload_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/01_upload_screen.svg)
* **Screen 2 (Extraction & Verification)**:
  - High-Fidelity UI Screenshot: [`02_verify_screen.jpg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/02_verify_screen.jpg)
  - Vector Layout Mockup: [`02_verify_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/02_verify_screen.svg)
* **Screen 3 (Vernacular Explanation & Context)**:
  - High-Fidelity UI Screenshot: [`03_explanation_screen.jpg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/03_explanation_screen.jpg)
  - Vector Layout Mockup: [`03_explanation_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/03_explanation_screen.svg)
* **Screen 4 (Doctor Prep & WhatsApp Share)**:
  - High-Fidelity UI Screenshot: [`04_doctor_prep_screen.jpg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/04_doctor_prep_screen.jpg)
  - Vector Layout Mockup: [`04_doctor_prep_screen.svg`](file:///c:/Users/Ranjitha/reportsaathi/docs/references/04_doctor_prep_screen.svg)

