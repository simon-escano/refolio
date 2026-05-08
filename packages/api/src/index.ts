import { Hono } from "hono";
import { cors } from "hono/cors";
import { portfolioRoute } from "./routes/portfolio";
import { RefolioError } from "./lib/errors";
import type { Bindings } from "./lib/config";

type Env = { Bindings: Bindings };

const app = new Hono<Env>();

// CORS — allow frontend to call the API
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check / info endpoint
app.get("/", (c) => {
  return c.json({
    name: "refolio",
    version: "1.0.0",
    status: "running",
    provider: "gemini",
    runtime: "cloudflare-workers",
  });
});

// Mount API routes
app.route("/api", portfolioRoute);

// Global error handler
app.onError((err, c) => {
  if (err instanceof RefolioError) {
    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
          ...(err.details ? { details: err.details } : {}),
        },
      },
      err.status as 400 | 404 | 422 | 502 | 503
    );
  }

  console.error("Unhandled error:", err);
  return c.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: err.message || "An unexpected error occurred",
      },
    },
    500
  );
});

export default app;
