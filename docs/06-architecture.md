# System Architecture & Technical Specifications: ReportSaathi

## 1. Architectural Philosophy
The architectural design of **ReportSaathi** is driven by three foundational principles:
1. **Radical Privacy via Edge Processing**: Perform sensitive document parsing and PII redaction *directly on the user's browser* before any text touches a network endpoint.
2. **Deterministic Safety over Probabilistic AI**: Clinical thresholds, unit normalizations, and emergency alerts are handled strictly by **100% deterministic code**; AI models are quarantined solely to linguistic simplification and question synthesis.
3. **Zero-Cost & Open-Source Stack**: The entire architecture is built using open-source libraries and free-tier infrastructure, completely eliminating operating costs during the MVP validation phase.

---

## 2. Stack Evaluation & Recommendation

We evaluated two lightweight, free, and open-source architecture options:

| Evaluation Dimension | Option A: Full-Stack Next.js (TypeScript) + Edge Serverless (RECOMMENDED) | Option B: Python FastAPI Microservice + SvelteKit Frontend |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (React 19, App Router)** with Tailwind CSS | SvelteKit / Vanilla HTML + Tailwind CSS |
| **Backend Runtime** | **Next.js Edge / Serverless API Routes (Node.js)** | Python 3.11 + FastAPI + Uvicorn |
| **PDF Extraction Engine** | **`pdfjs-dist` (Mozilla Open-Source)** running in a Web Worker on the client browser | `pdfplumber` / `PyMuPDF` running on a Python backend |
| **PII Redaction Layer** | **Client-side Web Worker Regex engine** (PDF never leaves phone unredacted) | Server-side Python regex (requires uploading full unredacted PDF to server) |
| **LLM Inference** | **Google Gemini 1.5 Flash Free Tier** (15 RPM, 1,500 RPD, 1M TPM) via official `@google/genai` SDK | Groq Free API / Local Ollama (Llama 3.1 8B) |
| **Hosting & Deployment** | **Vercel Hobby Tier / Cloudflare Pages** (Free, zero maintenance, global edge CDN) | Render Free Web Service + Cloudflare Pages (Free, but suffers from **50s cold-start delays** on idle) |
| **Hardware Suitability (Low-Cost Android)** | High: Ultra-light DOM, SSR + client hydration, gzipped JS < 180 KB | High: Svelte compiles to small JS, but dual-server hops increase network latency |
| **Operational Complexity** | **Low**: Single unified TypeScript codebase, shared data contracts, zero cross-server CORS | **Medium**: Two separate repositories/services (Python + Svelte), dual CI/CD pipelines |

### Recommendation: **Option A (Full-Stack Next.js with Client-Side PDF Parsing)**
* **Why**: Option A enables **zero-server PDF handling**. By running Mozilla’s open-source `pdfjs-dist` inside an in-browser Web Worker, the raw PDF is decrypted and stripped of patient PII (name, phone, address, UHID) *before* any text packet is transmitted over the internet. Furthermore, Vercel/Cloudflare serverless edge routes have **zero cold starts**, unlike Render's free container tiers that sleep when idle.

---

## 3. Deterministic vs. AI Model Division

To prevent medical hallucinations, data leakage, and regulatory non-compliance, the codebase maintains a strict boundary between deterministic code and AI models:

```
[User Lab PDF]
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ 100% DETERMINISTIC CODE (Client-Side Browser Worker)        │
│ • Password Decryption (Numeric PIN / DOB)                   │
│ • PDF Text Token Extraction (pdfjs-dist)                    │
│ • PII Masking: Regex for Phone, Name, Aadhaar, UHID, Branch │
│ • Reference Interval Parsing (e.g. "70 - 99 mg/dL")         │
└─────────────────────────────────────────────────────────────┘
      │ (Anonymized Tokens Only)
      ▼
┌─────────────────────────────────────────────────────────────┐
│ 100% DETERMINISTIC CODE (Safety & Normalization Engine)     │
│ • Unit Standardization (Dictionary: mg/dL, g/dL, µIU/mL)    │
│ • Mathematical Range Check:                                 │
│     Measured < Min  -> Flag: "BELOW_RANGE"                  │
│     Measured > Max  -> Flag: "ABOVE_RANGE"                  │
│     Min <= Measured <= Max -> Flag: "NORMAL"                │
│ • Critical Red-Flag Emergency Lookup:                       │
│     Platelets < 20,000 -> Immediate Emergency Banner        │
│     Potassium > 6.5    -> Immediate Emergency Banner        │
│     (Bypasses AI completely!)                               │
└─────────────────────────────────────────────────────────────┘
      │ (Verified Parameters + Emergency Status)
      ▼
┌─────────────────────────────────────────────────────────────┐
│ AI MODEL (Google Gemini 1.5 Flash - Structured JSON Schema) │
│ • Layperson Biomarker Role Explanation (English & Hindi)    │
│ • Non-Critical Out-of-Range Normalization (Diet, Stress)    │
│ • Pre-Consultation 3-Question Synthesis for the Doctor      │
│ • STRICT CONSTRAINT: Never diagnose, never prescribe!     │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ 100% DETERMINISTIC CODE (Presentation & Safe-Harbor Layer)  │
│ • Statutory Disclaimer Injection (Telemedicine Rules 2020)  │
│ • WhatsApp Share Link Generation (URI Encoding)             │
│ • Memory Wipe & Session GC (Zero-Retention DPDP Compliance) │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Models & TypeScript Schemas

```typescript
// 1. Raw Extracted Parameter from Client Parser
export interface RawBiomarkerToken {
  rawName: string;
  rawValue: string;
  rawUnit: string;
  rawReferenceInterval: string;
}

// 2. Normalized Parameter following Deterministic Processing
export type RangeStatus = 'NORMAL' | 'ABOVE_RANGE' | 'BELOW_RANGE' | 'CRITICAL_EMERGENCY';

export interface NormalizedBiomarker {
  id: string;
  canonicalName: string;            // e.g. "Fasting Blood Sugar"
  vernacularNameHindi: string;      // e.g. "फास्टिंग ब्लड शुगर"
  measuredValue: number;            // e.g. 138
  standardUnit: string;             // e.g. "mg/dL"
  referenceInterval: {
    min: number | null;
    max: number | null;
    formatted: string;              // e.g. "70 - 99 mg/dL"
  };
  status: RangeStatus;
  isCriticalRedFlag: boolean;
}

// 3. AI Generated Plain-Language Explanation
export interface BiomarkerExplanation {
  biomarkerId: string;
  organSystem: string;              // e.g. "Pancreas & Metabolism"
  plainExplanationEn: string;       // e.g. "Measures blood sugar after overnight fast"
  plainExplanationHi: string;       // e.g. "रात भर भूखे रहने के बाद खून में शर्करा का स्तर"
  commonNonCriticalReasonsEn: string[]; // e.g. ["Heavy dinner previous night", "Dehydration", "Stress"]
  commonNonCriticalReasonsHi: string[];
}

// 4. Pre-Consultation Doctor Preparation
export interface DoctorConsultationPrep {
  questionsEn: [string, string, string]; // Exactly 3 questions
  questionsHi: [string, string, string];
  disclosuresToCheck: string[];     // e.g. ["Current prescriptions", "Fasting duration"]
}

// 5. Complete Session Response Payload (Stateless)
export interface ReportSummaryResponse {
  sessionId: string;
  timestamp: string;
  totalAnalyzed: number;
  normalCount: number;
  outOfRangeCount: number;
  hasCriticalAlert: boolean;
  criticalAlertMessage?: string;
  biomarkers: (NormalizedBiomarker & { explanation: BiomarkerExplanation })[];
  doctorPrep: DoctorConsultationPrep;
  statutoryDisclaimer: string;
}
```

---

## 5. API Routes & Endpoints

### `POST /api/extract`
* **Purpose**: Accepts anonymized text extracted from the client-side `pdfjs-dist` worker, matches biomarkers against Indian standard laboratory dictionaries, and returns structured parameters for user review.
* **Request Body**:
  ```json
  {
    "anonymizedText": "COMPLETE BLOOD COUNT ... Hemoglobin: 13.5 g/dL (12.0 - 15.0) ... Fasting Glucose: 138 mg/dL (70 - 99)",
    "targetLanguage": "hi"
  }
  ```
* **Response**: `{ "parameters": [ NormalizedBiomarker, ... ] }`

### `POST /api/explain`
* **Purpose**: Accepts user-verified parameters, runs deterministic safety checks, and queries Gemini 1.5 Flash via structured JSON schema to generate plain-language explanations and 3 doctor questions.
* **Request Body**:
  ```json
  {
    "parameters": [ NormalizedBiomarker, ... ],
    "preferredLanguage": "hi"
  }
  ```
* **Response**: `ReportSummaryResponse`

### `GET /api/health`
* **Purpose**: Lightweight uptime and rate-limit probe.
* **Response**: `{ "status": "ok", "version": "1.0.0", "timestamp": "2026-11-13T12:30:00Z" }`

---

## 6. Authentication & Session Management
* **Authentication Method**: **None (Stateless Guest Session)**.
* **Rationale**: Requiring mobile OTP or accounts introduces severe friction for elderly users and triggers complex **Data Fiduciary** storage requirements under the DPDP Act 2023. By keeping sessions in browser memory (React state) and never writing to a database, ReportSaathi achieves complete compliance with zero security liability.
* **Rate Limiting**: IP-based rate limiting via free Vercel Edge Middleware or Cloudflare (max 10 report uploads per IP per hour to prevent API quota exhaustion).

---

## 7. Third-Party Services & Integrations (100% Free / Open-Source)

| Capability | Chosen Tool / Provider | Tier & License | Cost | Integration Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **PDF Extraction** | `pdfjs-dist` (Mozilla) | Open-Source (Apache 2.0) | **₹0 (Free)** | Client-side Web Worker (runs on device) |
| **LLM Inference** | **Google Gemini 1.5 Flash** | Google AI Studio Free Tier (15 RPM / 1M TPM) | **₹0 (Free)** | Backend API route with JSON Schema |
| **Alternative LLM** | Groq API (`llama-3.1-8b-instant`) | Groq Free Developer Tier | **₹0 (Free)** | Seamless drop-in fallback if Gemini limits hit |
| **Vernacular Translation** | In-prompt bilingual generation + deterministic medical terms dictionary | Built-in | **₹0 (Free)** | Gemini generates dual English & Hindi fields |
| **WhatsApp Sharing** | Native WhatsApp URI Deep-Link | Open Web Standard | **₹0 (Free)** | `https://api.whatsapp.com/send?text=${encodedText}` |
| **Emergency Maps** | Google Maps Web Search Intent | Open Web Standard | **₹0 (Free)** | `https://www.google.com/maps/search/hospital+near+me` |
| **Hosting & CDN** | Vercel Hobby / Cloudflare Pages | Free Tier (100 GB bandwidth, unlimited serverless) | **₹0 (Free)** | Git-backed automated deployment |

---

## 8. Environment Variables

```env
# Application Settings
APP_ENV=production
NEXT_PUBLIC_APP_URL=https://reportsaathi.in
NEXT_PUBLIC_DEFAULT_LOCALE=hi

# Primary AI Provider (Google Gemini Free Tier)
GEMINI_API_KEY=your_gemini_api_key_here

# Fallback AI Provider (Groq Free Tier)
GROQ_API_KEY=your_groq_api_key_here
AI_PROVIDER=gemini # 'gemini' | 'groq'

# Security & Rate Limiting
RATE_LIMIT_PER_IP_HOURLY=10
```

---

## 9. Open Questions & Technical Unknowns

Rather than guessing, the following architectural and clinical questions are flagged for real-world pilot validation:

1. **OCR Support for Password Encrypted Formats**: While standard lab PDFs use 4-digit birth years or 10-digit phone numbers, some regional lab chains (e.g. certain government hospitals) use proprietary PDF protection schemes. Will `pdfjs-dist` decrypt 100% of these passwords in-browser, or will a subset require server-side headless pdfium fallbacks?
2. **Indian Lab Layout Inconsistencies**: While major national chains (Dr. Lal, Metropolis, Apollo, 1mg, SRL) use structured text streams, some small standalone pathology clinics produce digital PDFs where numerical values and units are printed as unaligned free text or rasterized image stamps. What percentage of Tier-3 lab PDFs will fail pure text tokenization and require OCR?
3. **Vernacular Translation Clinical Nuance**: In Hindi, how should technical medical terms like *"Creatinine"* or *"Triglycerides"* be presented? Should they be phonetically transliterated (*"क्रिएटिनिन"*, *"ट्राइग्लिसराइड्स"*) or described purely by organ function (*"गुर्दे का अपशिष्ट"*)? This requires doctor-panel testing with elderly patients during user testing.
4. **Vercel Hobby Request Timeout on Low-Bandwidth Networks**: Vercel free serverless functions have a 10-second maximum execution timeout. While Gemini 1.5 Flash typically responds in 1.2–2.0 seconds, will slow network conditions on rural 3G connections cause client-side connection drops?
