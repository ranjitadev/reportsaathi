# API Contract Specification: ReportSaathi

## 1. Overview
This document specifies the REST API contracts, JSON schemas, headers, request/response models, and status codes for **ReportSaathi**. All payloads are stateless and strictly transmit anonymized tokens in compliance with India's DPDP Act, 2023.

---

## 2. Global Headers & Error Format

### 2.1 Standard Headers
* `Content-Type: application/json`
* `Accept: application/json`
* `X-Client-Language: en | hi` (Optional, defaults to `hi`)
* `X-Session-ID: <uuidv4>` (Client-generated ephemeral identifier, purged upon completion)

### 2.2 Standard Error Response Schema
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ApiErrorResponse",
  "type": "object",
  "required": ["success", "errorCode", "message", "timestamp"],
  "properties": {
    "success": { "type": "boolean", "const": false },
    "errorCode": { 
      "type": "string",
      "enum": [
        "INVALID_PAYLOAD",
        "NO_BIOMARKERS_FOUND",
        "RATE_LIMIT_EXCEEDED",
        "LLM_TIMEOUT",
        "SAFETY_VALIDATION_FAILED",
        "INTERNAL_SERVER_ERROR"
      ]
    },
    "message": { "type": "string" },
    "userFacingMessage": {
      "type": "object",
      "required": ["en", "hi"],
      "properties": {
        "en": { "type": "string" },
        "hi": { "type": "string" }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```

---

## 3. Endpoint Specifications

### 3.1 `POST /api/extract`
* **Purpose**: Ingests raw anonymized text extracted by the client-side `pdfjs-dist` worker, performs deterministic entity recognition and parameter extraction, normalizes units, runs reference interval calculations, and checks critical red-flag emergency limits.

#### Request Schema
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ExtractRequest",
  "type": "object",
  "required": ["anonymizedText"],
  "properties": {
    "anonymizedText": {
      "type": "string",
      "minLength": 10,
      "maxLength": 100000,
      "description": "Text scrubbed of patient name, phone, address, and UHID"
    },
    "targetLanguage": {
      "type": "string",
      "enum": ["en", "hi"],
      "default": "hi"
    }
  }
}
```

#### Response Schema (200 OK)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ExtractResponse",
  "type": "object",
  "required": ["success", "parameters", "totalExtracted", "hasCriticalAlert"],
  "properties": {
    "success": { "type": "boolean", "const": true },
    "totalExtracted": { "type": "integer", "minimum": 0 },
    "hasCriticalAlert": { "type": "boolean" },
    "criticalAlertMessage": {
      "type": "object",
      "properties": {
        "en": { "type": "string" },
        "hi": { "type": "string" }
      }
    },
    "parameters": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "canonicalName",
          "vernacularNameHindi",
          "measuredValue",
          "standardUnit",
          "referenceInterval",
          "status",
          "isCriticalRedFlag"
        ],
        "properties": {
          "id": { "type": "string" },
          "canonicalName": { "type": "string" },
          "vernacularNameHindi": { "type": "string" },
          "measuredValue": { "type": "number" },
          "standardUnit": { "type": "string" },
          "referenceInterval": {
            "type": "object",
            "required": ["formatted"],
            "properties": {
              "min": { "type": ["number", "null"] },
              "max": { "type": ["number", "null"] },
              "formatted": { "type": "string" }
            }
          },
          "status": {
            "type": "string",
            "enum": ["NORMAL", "ABOVE_RANGE", "BELOW_RANGE", "CRITICAL_EMERGENCY"]
          },
          "isCriticalRedFlag": { "type": "boolean" }
        }
      }
    }
  }
}
```

---

### 3.2 `POST /api/explain`
* **Purpose**: Accepts the user-verified parameter list, invokes the Gemini 1.5 Flash structured engine, validates the output with a deterministic safety filter, and returns empathetic, plain-language explanations and exactly 3 doctor consultation questions.

#### Request Schema
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ExplainRequest",
  "type": "object",
  "required": ["parameters"],
  "properties": {
    "parameters": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "id",
          "canonicalName",
          "measuredValue",
          "standardUnit",
          "referenceInterval",
          "status"
        ],
        "properties": {
          "id": { "type": "string" },
          "canonicalName": { "type": "string" },
          "measuredValue": { "type": "number" },
          "standardUnit": { "type": "string" },
          "referenceInterval": {
            "type": "object",
            "properties": {
              "min": { "type": ["number", "null"] },
              "max": { "type": ["number", "null"] },
              "formatted": { "type": "string" }
            }
          },
          "status": {
            "type": "string",
            "enum": ["NORMAL", "ABOVE_RANGE", "BELOW_RANGE", "CRITICAL_EMERGENCY"]
          }
        }
      }
    },
    "preferredLanguage": {
      "type": "string",
      "enum": ["en", "hi"],
      "default": "hi"
    }
  }
}
```

#### Response Schema (200 OK)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ExplainResponse",
  "type": "object",
  "required": [
    "success",
    "totalAnalyzed",
    "normalCount",
    "outOfRangeCount",
    "hasCriticalAlert",
    "biomarkers",
    "doctorPrep",
    "statutoryDisclaimer"
  ],
  "properties": {
    "success": { "type": "boolean", "const": true },
    "totalAnalyzed": { "type": "integer" },
    "normalCount": { "type": "integer" },
    "outOfRangeCount": { "type": "integer" },
    "hasCriticalAlert": { "type": "boolean" },
    "criticalAlertMessage": { "type": "string" },
    "biomarkers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "canonicalName",
          "vernacularNameHindi",
          "measuredValue",
          "standardUnit",
          "status",
          "explanation"
        ],
        "properties": {
          "id": { "type": "string" },
          "canonicalName": { "type": "string" },
          "vernacularNameHindi": { "type": "string" },
          "measuredValue": { "type": "number" },
          "standardUnit": { "type": "string" },
          "status": { "type": "string" },
          "explanation": {
            "type": "object",
            "required": [
              "organSystem",
              "plainExplanationEn",
              "plainExplanationHi",
              "commonNonCriticalReasonsEn",
              "commonNonCriticalReasonsHi"
            ],
            "properties": {
              "organSystem": { "type": "string" },
              "plainExplanationEn": { "type": "string" },
              "plainExplanationHi": { "type": "string" },
              "commonNonCriticalReasonsEn": {
                "type": "array",
                "items": { "type": "string" }
              },
              "commonNonCriticalReasonsHi": {
                "type": "array",
                "items": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "doctorPrep": {
      "type": "object",
      "required": ["questionsEn", "questionsHi", "disclosuresToCheck"],
      "properties": {
        "questionsEn": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "items": { "type": "string" }
        },
        "questionsHi": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "items": { "type": "string" }
        },
        "disclosuresToCheck": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "statutoryDisclaimer": { "type": "string" }
  }
}
```

---

### 3.3 `GET /api/health`
* **Purpose**: Healthcheck endpoint for monitoring uptime, deployment status, and rate-limit states.
* **Response (200 OK)**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "aiProvider": "gemini-1.5-flash",
    "timestamp": "2026-11-13T14:00:00Z"
  }
  ```
