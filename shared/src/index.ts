import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitive types
// ---------------------------------------------------------------------------

export type RangeStatus = 'NORMAL' | 'ABOVE_RANGE' | 'BELOW_RANGE' | 'CRITICAL_EMERGENCY';

export interface RawBiomarkerToken {
  rawName: string;
  rawValue: string;
  rawUnit: string;
  rawReferenceInterval: string;
}

export interface NormalizedBiomarker {
  id: string;
  canonicalName: string;
  vernacularNameHindi: string;
  measuredValue: number;
  standardUnit: string;
  referenceInterval: {
    min: number | null;
    max: number | null;
    formatted: string;
  };
  status: RangeStatus;
  isCriticalRedFlag: boolean;
}

export interface BiomarkerExplanation {
  biomarkerId: string;
  organSystem: string;
  plainExplanationEn: string;
  plainExplanationHi: string;
  commonNonCriticalReasonsEn: string[];
  commonNonCriticalReasonsHi: string[];
}

export interface DoctorConsultationPrep {
  questionsEn: [string, string, string];
  questionsHi: [string, string, string];
  disclosuresToCheck: string[];
}

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

// ---------------------------------------------------------------------------
// API error response
// ---------------------------------------------------------------------------

export const ApiErrorCodes = [
  'INVALID_PAYLOAD',
  'NO_BIOMARKERS_FOUND',
  'RATE_LIMIT_EXCEEDED',
  'LLM_TIMEOUT',
  'SAFETY_VALIDATION_FAILED',
  'INTERNAL_SERVER_ERROR',
] as const;

export type ApiErrorCode = (typeof ApiErrorCodes)[number];

export interface ApiErrorResponse {
  success: false;
  errorCode: ApiErrorCode;
  message: string;
  userFacingMessage?: {
    en: string;
    hi: string;
  };
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Health endpoint
// ---------------------------------------------------------------------------

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  version: string;
  aiProvider: string;
  timestamp: string;
  db: {
    connected: boolean;
    appName: string;
    seededAt: string;
  };
}

// ---------------------------------------------------------------------------
// Zod schemas for runtime validation
// ---------------------------------------------------------------------------

export const ExtractRequestSchema = z.object({
  anonymizedText: z.string().min(10).max(100_000),
  targetLanguage: z.enum(['en', 'hi']).default('hi'),
});
export type ExtractRequest = z.infer<typeof ExtractRequestSchema>;

export const ExplainRequestSchema = z.object({
  parameters: z
    .array(
      z.object({
        id: z.string(),
        canonicalName: z.string(),
        measuredValue: z.number(),
        standardUnit: z.string(),
        referenceInterval: z.object({
          min: z.number().nullable(),
          max: z.number().nullable(),
          formatted: z.string(),
        }),
        status: z.enum(['NORMAL', 'ABOVE_RANGE', 'BELOW_RANGE', 'CRITICAL_EMERGENCY']),
      })
    )
    .min(1),
  preferredLanguage: z.enum(['en', 'hi']).default('hi'),
});
export type ExplainRequest = z.infer<typeof ExplainRequestSchema>;
