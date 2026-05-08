export type Bindings = {
  GEMINI_API_KEY: string;
  GITLORE_API_URL?: string;
  PORTFOLIO_CACHE?: KVNamespace;
};

export interface AppConfig {
  gemini: {
    apiKey: string;
    model: string;
    endpoint: string;
  };
  gitlore: {
    apiUrl: string;
  };
}

export function getConfig(env: Bindings): AppConfig {
  if (!env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is required. Set it via `wrangler secret put GEMINI_API_KEY`."
    );
  }

  return Object.freeze({
    gemini: {
      apiKey: env.GEMINI_API_KEY,
      model: "gemini-2.5-flash",
      endpoint: "https://generativelanguage.googleapis.com/v1beta",
    },
    gitlore: {
      apiUrl: env.GITLORE_API_URL ?? "https://api.gitlore.workers.dev",
    },
  });
}
