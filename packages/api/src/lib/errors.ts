export class MonofolioError extends Error {
  public code: string;
  public status: number;
  public details?: unknown;

  constructor(code: string, status: number, message: string, details?: unknown) {
    super(message);
    this.name = "MonofolioError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const Errors = {
  invalidInput: (msg: string) =>
    new MonofolioError("INVALID_INPUT", 400, msg),
  gitloreFailure: (msg: string, details?: unknown) =>
    new MonofolioError("GITLORE_FAILED", 502, msg, details),
  narrativeFailure: (msg: string, details?: unknown) =>
    new MonofolioError("NARRATIVE_FAILED", 502, msg, details),
  validationFailure: (msg: string) =>
    new MonofolioError("VALIDATION_FAILED", 422, msg),
  cacheError: (msg: string) =>
    new MonofolioError("CACHE_ERROR", 500, msg),
} as const;
