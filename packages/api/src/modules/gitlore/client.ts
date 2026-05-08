import type { AppConfig } from "../../lib/config";
import type { ProgressCallback } from "../../lib/progress";
import { Errors } from "../../lib/errors";

/** The shape returned by Gitlore's /api/generate endpoint */
export interface GitloreOutput {
  title: string;
  one_liner: string;
  contributions: string;
  links: Array<{ icon: string; label: string; url: string }>;
  problem: string;
  goal: string;
  gallery: string[];
  key_features: Array<{ icon: string; text: string }>;
  architecture_diagram_code: string;
  tech_stack: Array<{ name: string; role: string }>;
  stack_reason: string;
  results: {
    performance: { icon: string; text: string };
    scale: { icon: string; text: string };
    utility: { icon: string; text: string };
  };
}

interface GitloreRequest {
  url: string;
  title: string;
  contributions: string;
  context?: string;
  gallery?: string[];
  links?: Array<{ label: string; url: string }>;
}

/**
 * Call the Gitlore API's non-streaming endpoint to get a GitloreOutput.
 * Uses the deterministic /api/generate (JSON) endpoint, not the SSE stream,
 * since we're consuming server-to-server and don't need progress events.
 */
export async function fetchGitloreOutput(
  request: GitloreRequest,
  config: AppConfig,
  onProgress: ProgressCallback
): Promise<GitloreOutput> {
  const endpoint = `${config.gitlore.apiUrl}/api/generate`;

  onProgress({
    phase: "gitlore",
    message: `Analyzing ${request.title} via Gitlore...`,
    detail: request.url,
  });

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch (err) {
    throw Errors.gitloreFailure(
      `Network error connecting to Gitlore: ${err}`,
      { url: request.url }
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw Errors.gitloreFailure(
      `Gitlore returned ${res.status} for ${request.url}: ${text}`,
      { status: res.status }
    );
  }

  const body = (await res.json()) as { data: GitloreOutput };

  onProgress({
    phase: "gitlore",
    message: `Gitlore analysis complete for ${request.title}`,
    detail: `${body.data.tech_stack?.length ?? 0} stack items, diagram: ${body.data.architecture_diagram_code ? "✓" : "✗"}`,
  });

  return body.data;
}
