import { useCallback, useRef, useState } from "react";
import type { MasterPortfolio } from "../../types/portfolio";

interface SyncState {
  portfolio: MasterPortfolio | null;
  jsonString: string;
  jsonError: string | null;
  generationId: number;
}

/**
 * Two-way sync engine between Monaco Editor (JSON string) and Live Preview (parsed object).
 *
 * Architecture:
 * - Single authoritative MasterPortfolio held in useRef (sync access) + useState (React render)
 * - Monaco → Preview: debounced JSON.parse → validate → update state
 * - Preview → Monaco: immediate setState → useEffect serializes to JSON string
 * - Conflict resolution: generationId counter, stale writes silently discarded
 */
export function usePortfolioSync() {
  const [state, setState] = useState<SyncState>({
    portfolio: null,
    jsonString: "",
    jsonError: null,
    generationId: 0,
  });

  const portfolioRef = useRef<MasterPortfolio | null>(null);
  const generationRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Called when a new portfolio is generated from the API pipeline.
   * Sets both the parsed object and the serialized JSON string.
   */
  const setFromPipeline = useCallback((portfolio: MasterPortfolio) => {
    const id = ++generationRef.current;
    const json = JSON.stringify(portfolio, null, 2);
    portfolioRef.current = portfolio;
    setState({
      portfolio,
      jsonString: json,
      jsonError: null,
      generationId: id,
    });
  }, []);

  /**
   * Called when the user types in the Monaco editor.
   * Debounces 300ms, then parses + validates.
   */
  const setFromEditor = useCallback((jsonString: string) => {
    // Update the raw string immediately so Monaco stays responsive
    setState((prev) => ({ ...prev, jsonString }));

    // Debounce the parse + validate
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const currentGenId = generationRef.current;

      try {
        const parsed = JSON.parse(jsonString) as MasterPortfolio;

        // Discard if a newer generation has arrived while we were debouncing
        if (generationRef.current !== currentGenId) return;

        const id = ++generationRef.current;
        portfolioRef.current = parsed;
        setState({
          portfolio: parsed,
          jsonString,
          jsonError: null,
          generationId: id,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          jsonError: err instanceof Error ? err.message : "Invalid JSON",
        }));
      }
    }, 300);
  }, []);

  /**
   * Called when the user edits a field in the Live Preview.
   * Updates immediately (no debounce) and re-serializes to JSON.
   */
  const setFromPreview = useCallback((updater: (prev: MasterPortfolio) => MasterPortfolio) => {
    setState((prev) => {
      if (!prev.portfolio) return prev;

      const updated = updater(prev.portfolio);
      const id = ++generationRef.current;
      const json = JSON.stringify(updated, null, 2);
      portfolioRef.current = updated;

      return {
        portfolio: updated,
        jsonString: json,
        jsonError: null,
        generationId: id,
      };
    });
  }, []);

  /**
   * Reset sync state completely.
   */
  const reset = useCallback(() => {
    generationRef.current = 0;
    portfolioRef.current = null;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setState({
      portfolio: null,
      jsonString: "",
      jsonError: null,
      generationId: 0,
    });
  }, []);

  return {
    portfolio: state.portfolio,
    jsonString: state.jsonString,
    jsonError: state.jsonError,
    generationId: state.generationId,
    setFromPipeline,
    setFromEditor,
    setFromPreview,
    reset,
  };
}
