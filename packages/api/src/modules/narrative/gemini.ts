import type { AppConfig } from "../../lib/config";
import type { ProgressCallback } from "../../lib/progress";
import { Errors } from "../../lib/errors";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import type { GenerateRequest } from "../../schemas/request";
import type { GitloreOutput } from "../gitlore/client";

/** Shape of Gemini's structured output */
export interface NarrativeOutput {
  philosophy: string;
  items: Array<{
    id: string;
    type: "solution" | "achievement" | "credential" | "experience";
    enhanced_contributions?: string;
    enhanced_description?: string;
    generated_title?: string;
    generated_institution?: string;
    generated_date?: string;
  }>;
  hobbies_enriched?: Array<{ title: string; icon: string; color: string }>;
  tech_skills_enriched?: Array<{ title: string; category: string; category_icon: string }>;
}

/**
 * Call Gemini 2.5 Flash to generate narrative enhancements.
 * Uses the generateContent API with JSON response mode.
 */
export async function generateNarrative(
  request: GenerateRequest,
  gitloreOutputs: Array<{ id: string; output: GitloreOutput }>,
  config: AppConfig,
  onProgress: ProgressCallback
): Promise<NarrativeOutput> {
  const startTime = Date.now();

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(request, gitloreOutputs);

  onProgress({
    phase: "narrative",
    message: `Sending to Gemini ${config.gemini.model}...`,
    detail: `${userPrompt.length.toLocaleString()} chars context`,
  });

  const endpoint = `${config.gemini.endpoint}/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: userPrompt }] },
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 4096,
    },
  };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw Errors.narrativeFailure(`Network error connecting to Gemini: ${err}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw Errors.narrativeFailure(`Gemini returned ${res.status}: ${text}`);
  }

  const responseBody = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
  };

  const candidate = responseBody.candidates?.[0];
  const finishReason = candidate?.finishReason;
  const rawText = candidate?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw Errors.narrativeFailure(
      `Gemini returned no content. Finish reason: ${finishReason || "UNKNOWN"}`
    );
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  onProgress({
    phase: "narrative",
    message: `Gemini inference complete in ${elapsed}s`,
    detail: `${rawText.length.toLocaleString()} chars returned (finishReason: ${finishReason || "STOP"})`,
  });

  // Robustly sanitize rawText from markdown code fences if they got returned by the model
  let cleanText = rawText.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```[a-zA-Z]*\n/, "");
    cleanText = cleanText.replace(/\n```$/, "");
    cleanText = cleanText.trim();
  }

  let parsed: NarrativeOutput;
  try {
    parsed = JSON.parse(cleanText) as NarrativeOutput;
  } catch (parseErr) {
    console.error("[Gemini JSON Parse Failure]", parseErr, "Raw Text:", rawText);
    throw Errors.narrativeFailure(
      "Gemini returned invalid JSON: " + cleanText.slice(0, 300),
      { rawText, finishReason, parseError: String(parseErr) }
    );
  }

  onProgress({ phase: "narrative", message: "Narrative JSON parsed successfully" });
  return parsed;
}
