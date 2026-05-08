export class RefolioError extends Error {
  public code: string;
  public status: number;
  public details?: unknown;

  constructor(code: string, status: number, message: string, details?: unknown) {
    super(message);
    this.name = "RefolioError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const Errors = {
  invalidInput: (msg: string) =>
    new RefolioError("INVALID_INPUT", 400, msg),
  gitloreFailure: (msg: string, details?: unknown) =>
    new RefolioError("GITLORE_FAILED", 502, msg, details),
  narrativeFailure: (msg: string, details?: unknown) =>
    new RefolioError("NARRATIVE_FAILED", 502, msg, details),
  validationFailure: (msg: string) =>
    new RefolioError("VALIDATION_FAILED", 422, msg),
  cacheError: (msg: string) =>
    new RefolioError("CACHE_ERROR", 500, msg),
} as const;
