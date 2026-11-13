import { describe, it, expect } from 'vitest';
import { ExtractRequestSchema, ExplainRequestSchema, ApiErrorCodes } from '../src/index.js';

describe('ExtractRequestSchema', () => {
  it('parses a valid payload', () => {
    const result = ExtractRequestSchema.safeParse({
      anonymizedText: 'Hemoglobin: 13.5 g/dL (12.0 - 15.0)',
      targetLanguage: 'hi',
    });
    expect(result.success).toBe(true);
  });

  it('defaults targetLanguage to hi', () => {
    const result = ExtractRequestSchema.safeParse({
      anonymizedText: 'Hemoglobin: 13.5 g/dL (12.0 - 15.0)',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetLanguage).toBe('hi');
    }
  });

  it('rejects text shorter than 10 chars', () => {
    const result = ExtractRequestSchema.safeParse({ anonymizedText: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects an unsupported language', () => {
    const result = ExtractRequestSchema.safeParse({
      anonymizedText: 'Hemoglobin: 13.5 g/dL (12.0 - 15.0)',
      targetLanguage: 'ta', // Tamil not yet supported
    });
    expect(result.success).toBe(false);
  });
});

describe('ExplainRequestSchema', () => {
  const validParameter = {
    id: 'hb-001',
    canonicalName: 'Hemoglobin',
    measuredValue: 13.5,
    standardUnit: 'g/dL',
    referenceInterval: { min: 12.0, max: 15.0, formatted: '12.0 - 15.0 g/dL' },
    status: 'NORMAL' as const,
  };

  it('parses a valid request with one parameter', () => {
    const result = ExplainRequestSchema.safeParse({ parameters: [validParameter] });
    expect(result.success).toBe(true);
  });

  it('rejects an empty parameters array', () => {
    const result = ExplainRequestSchema.safeParse({ parameters: [] });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid status value', () => {
    const result = ExplainRequestSchema.safeParse({
      parameters: [{ ...validParameter, status: 'UNKNOWN' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('ApiErrorCodes', () => {
  it('contains all expected codes', () => {
    expect(ApiErrorCodes).toContain('INVALID_PAYLOAD');
    expect(ApiErrorCodes).toContain('NO_BIOMARKERS_FOUND');
    expect(ApiErrorCodes).toContain('RATE_LIMIT_EXCEEDED');
    expect(ApiErrorCodes).toContain('LLM_TIMEOUT');
    expect(ApiErrorCodes).toContain('SAFETY_VALIDATION_FAILED');
    expect(ApiErrorCodes).toContain('INTERNAL_SERVER_ERROR');
  });
});
