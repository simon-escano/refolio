import type { MasterPortfolio, ProgressEvent } from "../types/portfolio";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

interface StreamCallbacks {
  onProgress: (event: ProgressEvent) => void;
  onResult: (data: MasterPortfolio) => void;
  onError: (error: string, details?: string) => void;
}

/**
 * Calls the SSE streaming endpoint and dispatches progress/result/error events.
 * Returns an AbortController so the caller can cancel the request.
 * Pattern ported from Gitlore's streamGenerate().
 */
export function streamGenerate(
  request: unknown,
  callbacks: StreamCallbacks
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_URL}/api/portfolio/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }));
        const msg = (body as { error?: { message?: string } }).error?.message ?? `Request failed with status ${res.status}`;
        const detailsObj = (body as { error?: { details?: unknown } }).error?.details;
        const details = detailsObj
          ? typeof detailsObj === "object"
            ? JSON.stringify(detailsObj, null, 2)
            : String(detailsObj)
          : undefined;

        callbacks.onError(msg, details);
        return;
      }

      if (!res.body) {
        callbacks.onError("No response body received");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (currentEvent === "progress") {
                callbacks.onProgress(parsed as ProgressEvent);
              } else if (currentEvent === "result") {
                callbacks.onResult((parsed as { data: MasterPortfolio }).data);
              } else if (currentEvent === "error") {
                const msg = (parsed as { error?: { message?: string } }).error?.message ?? "Unknown error";
                const detailsObj = (parsed as { error?: { details?: unknown } }).error?.details;
                const details = detailsObj
                  ? typeof detailsObj === "object"
                    ? JSON.stringify(detailsObj, null, 2)
                    : String(detailsObj)
                  : undefined;
                callbacks.onError(msg, details);
              }
            } catch {
              // Ignore malformed SSE data lines
            }
            currentEvent = "";
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        callbacks.onError((err as Error).message ?? "Network error");
      }
    }
  })();

  return controller;
}

/** Simple health check */
export async function fetchHealth(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_URL}/`);
  return res.json() as Promise<Record<string, unknown>>;
}
