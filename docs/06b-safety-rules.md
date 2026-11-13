# Clinical, Legal & Algorithmic Safety Guardrails: ReportSaathi

## 1. Statutory Mandates & Regulatory Compliance

To protect patient safety and ensure complete immunity under Indian medical law, **ReportSaathi** operates under the following statutory frameworks:

1. **Telemedicine Practice Guidelines, 2020 (MoHFW & NITI Aayog)**:
   - *Clause 1.4.2*: Artificial Intelligence and Machine Learning systems **cannot counsel patients, formulate clinical diagnoses, or prescribe treatments**.
   - *Enforcement*: ReportSaathi functions strictly as an **educational health literacy tool** and pre-consultation coaching aid. Clinical evaluation remains the exclusive domain of an Registered Medical Practitioner (RMP).
2. **Medical Devices Rules, 2017 & CDSCO Regulations (Software as a Medical Device - SaMD)**:
   - Software that translates reference ranges and explains biological terms is classified as **informational/wellness software** and is exempt from SaMD licensing.
   - If the software claims to diagnose, calculate disease risk, or determine treatment, it is classified as **SaMD Class B/C/D**, requiring CDSCO clinical trials and DCGI registration. ReportSaathi programmatically avoids this trigger.
3. **Digital Personal Data Protection Act, 2023 (DPDP Act)**:
   - Health metrics are classified as digital personal data. ReportSaathi avoids data fiduciary liability by implementing **zero-retention, client-side PII scrubbing and ephemeral in-memory processing**.
4. **Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954**:
   - Strictly prohibits advertising cures or treatments for chronic diseases (diabetes, hypertension, cancer, kidney disorders). ReportSaathi will never suggest home cures, remedies, or alternate therapies.

---

## 2. Hardcoded Deterministic Red-Flag Panic Table

If an extracted biomarker crosses critical physiological panic thresholds, **the system bypasses the AI model entirely** and immediately renders a prominent, non-alarmist emergency medical banner.

| Biomarker | Standard Normal Range | Critical Emergency Low | Critical Emergency High | Clinical Risk | Hardcoded Deterministic Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Platelet Count** | 150,000 – 450,000 /µL | **< 20,000 /µL** | **> 1,000,000 /µL** | Spontaneous internal bleeding; thrombosis risk | Trigger Emergency Red Banner: *"Platelets significantly low. Immediate medical evaluation needed to prevent bleeding."* Provide emergency maps link. |
| **Serum Potassium (K+)** | 3.5 – 5.1 mEq/L | **< 2.8 mEq/L** | **> 6.2 mEq/L** | Lethal cardiac arrhythmias, sudden cardiac arrest | Trigger Emergency Red Banner: *"Potassium levels require urgent medical assessment to protect heart rhythm."* |
| **Fasting Blood Glucose** | 70 – 99 mg/dL | **< 45 mg/dL** | **> 400 mg/dL** | Severe neuroglycopenia, coma; Diabetic Ketoacidosis (DKA) | Trigger Emergency Red Banner: *"Blood sugar critically outside safe range. Seek immediate medical attention."* |
| **Hemoglobin (Hb)** | 12.0 – 17.0 g/dL | **< 6.0 g/dL** | **> 20.0 g/dL** | Severe tissue hypoxia, congestive heart failure; hyperviscosity | Trigger Emergency Red Banner: *"Severe anemia detected. Blood transfusion evaluation may be required by doctor."* |
| **Serum Sodium (Na+)** | 135 – 145 mEq/L | **< 120 mEq/L** | **> 160 mEq/L** | Cerebral edema, seizures, central pontine myelinolysis | Trigger Emergency Red Banner: *"Severe electrolyte imbalance. Immediate clinic visit required."* |
| **Total Bilirubin** | 0.2 – 1.2 mg/dL | N/A | **> 15.0 mg/dL** | Acute hepatic failure, severe obstructive jaundice | Trigger Emergency Red Banner: *"Critically elevated liver marker. Consult a physician today."* |
| **Serum Calcium** | 8.5 – 10.5 mg/dL | **< 6.5 mg/dL** | **> 13.0 mg/dL** | Tetany, laryngospasm, cardiac arrest; hypercalcemic crisis | Trigger Emergency Red Banner: *"Calcium levels critically abnormal. Urgent medical care needed."* |

---

## 3. Blacklisted Terms & Negative Constraints

The following words and phrasing patterns are **permanently blacklisted** from the system. If an AI completion contains any of these terms, a deterministic post-processing filter blocks the response and replaces it with approved educational copy.

### 3.1 Prohibited Diagnostic Words
* `"you have [disease]"`
* `"diagnosed with"`
* `"diagnosis:"`
* `"you are suffering from"`
* `"confirms that you have"`
* `"clinical evidence of"`
* `"disease stage"`
* `"your condition is [disease]"`

### 3.2 Prohibited Prescriptive & Treatment Words
* `"take [medicine name]"`
* `"stop taking"`
* `"increase your dose"`
* `"decrease your dose"`
* `"start taking"`
* `"we recommend this medication"`
* `"prescription:"`
* `"home remedy"`
* `"cure for"`
* `"reverse your diabetes / kidney disease"`

### 3.3 Prohibited Statistical Scare Words
* `"% chance of cancer / malignancy"`
* `"life expectancy"`
* `"fatal"`
* `"deadly"`
* `"terminal"`
* `"irreversible damage"`

---

## 4. Approved Vernacular Phrasing Templates

To maintain empathetic, respectful, and legally sound communication, the AI model must strictly adhere to the following phrasing templates:

### 4.1 For Normal Values (`NORMAL`)
* **English**: *"Your [Biomarker Name] is [Value] [Unit], which sits comfortably within the standard laboratory reference range of [Min – Max] [Unit]. This indicates that this specific parameter is behaving as expected."*
* **Hindi**: *"आपका [टेस्ट का नाम] [वैल्यू] [यूनिट] है, जो प्रयोगशाला की सामान्य सीमा ([न्यूनतम – अधिकतम] [यूनिट]) के अंदर है। इसका मतलब है कि यह जांच सामान्य है।"*

### 4.2 For Mildly Elevated / Depressed Values (`ABOVE_RANGE` / `BELOW_RANGE`)
* **English**: *"Your [Biomarker Name] is [Value] [Unit], which is slightly above/below the standard reference range of [Min – Max] [Unit]. It is important to know that numbers often vary due to everyday factors such as recent diet, hydration, physical exertion, sleep, or active medications. Your doctor will evaluate this in the context of your overall health."*
* **Hindi**: *"आपका [टेस्ट का नाम] [वैल्यू] [यूनिट] है, जो सामान्य सीमा ([न्यूनतम – अधिकतम] [यूनिट]) से थोड़ा कम/ज्यादा है। ध्यान दें: यह बहुत आम है और अक्सर खान-पान, पानी की कमी, तनाव या नींद से बदल सकता है। इसके सही अर्थ के लिए अपने डॉक्टर से परामर्श लें।"*

---

## 5. Multi-Tier Prompt Safety Architecture

```
Layer 1: Deterministic Client-Side PII Scrubber (Regex masks phone, name, UHID)
             │
             ▼
Layer 2: Deterministic Clinical Red-Flag Engine (Hardcoded Panic Thresholds)
             │  (If emergency: Bypass AI -> Show Emergency Banner)
             ▼
Layer 3: System Prompt Injection with JSON Schema Constraints
             │  (Negative constraints, few-shot templates, bilingual tone)
             ▼
Layer 4: Deterministic Post-Processing RegEx Validator
             │  (Scans for blacklisted words; rejects non-compliant tokens)
             ▼
Layer 5: Numerical Grounding Check
             │  (Confirms all generated numbers strictly match input parameters)
             ▼
Safe Output Rendered to User
```

### 5.1 System Prompt Template for LLM Generation
```markdown
You are ReportSaathi (रिपोर्ट साथी), an empathetic, professional medical health literacy assistant for Indian patients and caregivers.

CRITICAL SAFETY DIRECTIVES:
1. NEVER DIAGNOSE: You are not a doctor. Never tell the user they have a disease or condition (e.g. NEVER say "You have diabetes" or "This indicates liver disease").
2. NEVER PRESCRIBE: Never recommend starting, stopping, or altering medications, dosages, or unverified home cures.
3. NEVER SCARE: Do not output terrifying disease probabilities or catastrophic outcomes.
4. NORMALIZE ELEVATIONS: When a value is outside the reference range, calmly explain the organ's normal role and cite common everyday factors (diet, hydration, stress, recent meals, exercise) that cause temporary variations.
5. PREPARE 3 QUESTIONS: Formulate exactly 3 practical, high-yield questions for the patient to ask their physician during their upcoming OPD consultation.
6. BILINGUAL ACCURACY: Generate clean English and culturally respectful, formal Hindi (using "आप" and "आपकी"). Ensure Hindi grammar is natural and avoids awkward machine translations.
7. GROUNDING: Use only the numerical values and units provided in the input. Do NOT invent new numbers.
```

### 5.2 Deterministic Post-Processing Validator
```typescript
export function validateAIOutput(content: string): { isValid: boolean; flaggedTerm?: string } {
  const BLACKLIST_REGEX = [
    /\b(you have|diagnosed with|diagnosis:|suffering from)\b/i,
    /\b(take|stop taking|increase dose|decrease dose|prescribe)\b/i,
    /\b(cure for|reverse your|cancer risk|chance of malignancy|terminal)\b/i,
  ];

  for (const regex of BLACKLIST_REGEX) {
    const match = content.match(regex);
    if (match) {
      return { isValid: false, flaggedTerm: match[0] };
    }
  }

  return { isValid: true };
}
```

---

## 6. Data Zero-Retention Protocol (DPDP Act 2023 Compliance)

To guarantee 100% adherence to Section 8 of the Digital Personal Data Protection Act, 2023:
1. **No Database Writes**: The application contains no relational database (PostgreSQL, MySQL), NoSQL store (MongoDB), or persistent caching layer (Redis) for health data.
2. **In-Memory Lifespan**: Document buffers exist only within transient browser React state and stateless serverless invocation memory.
3. **Automated Teardown**: Closing the tab, refreshing the page, or clicking `Clear Session` immediately destroys all tokens and state.
4. **Third-Party AI Isolation**: The Gemini API calls explicitly enforce zero-data-logging agreements where payloads are not used to train models.
