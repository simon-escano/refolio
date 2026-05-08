import { MasterPortfolioSchema } from "../../schemas/response";
import type { MasterPortfolio } from "../../schemas/response";

interface ValidationSuccess {
  success: true;
  data: MasterPortfolio;
}

interface ValidationFailure {
  success: false;
  error: string;
}

/**
 * Validate the stitched MasterPortfolio against the Zod schema.
 * This is the final gate before the portfolio is returned to the client.
 */
export function validatePortfolio(
  raw: unknown
): ValidationSuccess | ValidationFailure {
  const result = MasterPortfolioSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      error: `Schema validation failed: ${result.error.message}`,
    };
  }

  return { success: true, data: result.data };
}
