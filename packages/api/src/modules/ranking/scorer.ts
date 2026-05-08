import type { NarrativeOutput } from "../narrative/gemini";
import type { ProgressCallback } from "../../lib/progress";

/**
 * Post-process the LLM's relevance scores to ensure proper ordering.
 * The LLM provides raw scores; this module normalizes and sorts them.
 */
export function processRankings(
  narrative: NarrativeOutput,
  onProgress: ProgressCallback
): { orderedIds: string[]; scoreMap: Map<string, number> } {
  const scoreMap = new Map<string, number>();

  for (const item of narrative.items) {
    // Clamp scores to 0-100
    const clamped = Math.max(0, Math.min(100, Math.round(item.relevance_score)));
    scoreMap.set(item.id, clamped);
  }

  // Sort by score descending, breaking ties by original order
  const orderedIds = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  onProgress({
    phase: "ranking",
    message: `Ranked ${orderedIds.length} items`,
    detail: `Top: ${orderedIds[0] ?? "none"} (${scoreMap.get(orderedIds[0] ?? "") ?? 0}), Bottom: ${orderedIds[orderedIds.length - 1] ?? "none"} (${scoreMap.get(orderedIds[orderedIds.length - 1] ?? "") ?? 0})`,
  });

  return { orderedIds, scoreMap };
}
