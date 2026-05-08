import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { GenerateRequestSchema } from "../schemas/request";
import { fetchGitloreOutput } from "../modules/gitlore/client";
import { generateNarrative } from "../modules/narrative/gemini";
import { processRankings } from "../modules/ranking/scorer";
import { stitchPortfolio } from "../modules/stitcher/merge";
import { validatePortfolio } from "../modules/validation/schema";
import { MonofolioError, Errors } from "../lib/errors";
import { getConfig, type Bindings } from "../lib/config";
import { getCached, setCached } from "../lib/cache";
import { noopProgress, type ProgressCallback } from "../lib/progress";
import type { GitloreOutput } from "../modules/gitlore/client";

type Env = { Bindings: Bindings };

export const portfolioRoute = new Hono<Env>();

/**
 * Full pipeline: Gitlore pass-through → Gemini narrative → Ranking → Stitch → Validate
 */
async function runPipeline(
  env: Bindings,
  body: unknown,
  onProgress: ProgressCallback = noopProgress
) {
  const requestStart = Date.now();
  const config = getConfig(env);

  // Step 1: Validate request
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    throw Errors.invalidInput(
      `Invalid request: ${parsed.error.issues.map((i) => i.message).join(", ")}`
    );
  }

  const request = parsed.data;

  // Step 2: Cache check
  const cacheKey = JSON.stringify(request);
  onProgress({ phase: "cache", message: "Checking cache..." });

  const cached = await getCached(env, cacheKey);
  if (cached) {
    onProgress({ phase: "cache", message: "Cache hit — returning cached portfolio" });
    return JSON.parse(cached);
  }
  onProgress({ phase: "cache", message: "Cache miss — running full pipeline" });

  // Step 3: Gitlore pass-through for each project
  const gitloreOutputs: Array<{ id: string; output: GitloreOutput }> = [];

  for (let i = 0; i < request.projects.length; i++) {
    const project = request.projects[i];
    const id = `solution-${i}`;

    onProgress({
      phase: "gitlore",
      message: `Processing project ${i + 1}/${request.projects.length}...`,
    });

    const output = await fetchGitloreOutput(
      {
        url: project.url,
        title: project.title,
        contributions: project.contributions,
        context: project.context,
        gallery: project.gallery,
        links: project.links,
      },
      config,
      onProgress
    );

    gitloreOutputs.push({ id, output });
  }

  onProgress({
    phase: "gitlore",
    message: `All ${gitloreOutputs.length} projects analyzed`,
  });

  // Step 4: Gemini narrative synthesis
  onProgress({ phase: "narrative", message: "Starting narrative synthesis..." });
  const narrative = await generateNarrative(
    request,
    gitloreOutputs,
    config,
    onProgress
  );

  // Step 5: Process rankings
  onProgress({ phase: "ranking", message: "Computing relevance rankings..." });
  const { orderedIds, scoreMap } = processRankings(narrative, onProgress);

  // Step 6: Stitch final portfolio
  const portfolio = stitchPortfolio(
    request,
    gitloreOutputs,
    narrative,
    orderedIds,
    scoreMap,
    onProgress
  );

  // Step 7: Validate
  onProgress({ phase: "validation", message: "Running schema validation..." });
  const validation = validatePortfolio(portfolio);
  if (!validation.success) {
    throw Errors.validationFailure(validation.error);
  }
  onProgress({ phase: "validation", message: "Schema validation passed ✓" });

  // Step 8: Cache result
  await setCached(env, cacheKey, JSON.stringify(validation.data));

  const totalElapsed = ((Date.now() - requestStart) / 1000).toFixed(1);
  console.log(`✅ Portfolio generated in ${totalElapsed}s`);

  return validation.data;
}

/** SSE streaming endpoint with progress events */
portfolioRoute.post("/portfolio/generate", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw Errors.invalidInput("Request body must be valid JSON");
  }

  // Prevent Wrangler/CF buffering
  c.header("Content-Encoding", "Identity");

  return streamSSE(c, async (stream) => {
    let eventId = 0;

    const onProgress: ProgressCallback = (event) => {
      stream.writeSSE({
        event: "progress",
        data: JSON.stringify(event),
        id: String(++eventId),
      });
    };

    try {
      const data = await runPipeline(c.env, body, onProgress);

      await stream.writeSSE({
        event: "result",
        data: JSON.stringify({ data }),
        id: String(++eventId),
      });
    } catch (err) {
      console.error("[Pipeline Streaming Error]", err);

      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      const code =
        err instanceof MonofolioError ? err.code : "INTERNAL_ERROR";
      const details =
        err instanceof MonofolioError
          ? err.details
          : err instanceof Error
            ? err.stack
            : undefined;

      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({
          error: { code, message, ...(details ? { details } : {}) },
        }),
        id: String(++eventId),
      });
    }
  });
});
