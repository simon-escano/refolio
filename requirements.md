Requirements Specification: Monofolio
Project Title: Monofolio

Tagline: The Headless Engineering Narrative Engine & Master Portfolio Orchestrator

Status: Architecture Phase (Antigrav-Ready)

Target Environment: Cloudflare Workers (API) & Cloudflare Pages (Web)

1. Project Overview
Monofolio is a high-performance, AI-driven portfolio generation platform. It acts as a "Master Orchestrator" that synthesizes raw human experience (text) into a structured, hire-ready JSON schema. By utilizing a hybrid logic approach—combining the existing Gitlore API for code analysis and Gemini 2.5 Flash for narrative synthesis—it produces a high-fidelity engineering narrative without token wastage.

2. System Architecture (Monorepo)
The project follows a standard monorepo structure with two primary directories:

packages/api: Hono-based backend deployed to Cloudflare Workers.

packages/web: Vite + React frontend deployed to Cloudflare Pages.

../gitlore: Sibling directory used by Antigravity for design language extraction.

3. Technical Stack
3.1. Backend (API)
Runtime: Node.js / Cloudflare Workers.

Framework: Hono (for Edge-native speed and RPC support).

LLM Provider: Gemini AI Studio (Gemini 2.5 Flash) for extraction, narrative writing, and ranking.

Validation: Zod (strict schema enforcement between AI and Frontend).

Integration: Gitlore API (for repository summarization and Mermaid architecture extraction).

3.2. Frontend (Web)
Framework: Vite + React 19 (TypeScript).

Styling: Tailwind CSS (Zero-runtime utility-first CSS).

UI Components: Shadcn/ui (Radix UI primitives).

State Management: Standard React Hooks + Hono RPC Client.

Animations: Framer Motion (for smooth re-sorting and layout transitions).

Code Editor: @monaco-editor/react (for interactive JSON editing).

4. Core Features & Functional Requirements
4.1. The "Antigrav" Analysis
Design Archeology: Antigravity must scan ../gitlore/packages/web to extract:

Tailwind configurations (color palettes, spacing).

Theme Provider logic (Dark, Light, System mode).

Component patterns (Buttons, Inputs, Cards).

Consistency: Monofolio must look like a "Pro" extension of Gitlore.

4.2. Hybrid Data Pipeline (The "Thrift" Strategy)
Gitlore Pass-through: Projects are analyzed via the Gitlore API. The results (Mermaid diagrams, tech stats) are stitched into the Monofolio JSON via pure logic, bypassing the LLM to save tokens.

Narrative Extraction: Gemini 2.5 Flash processes raw text inputs to generate professional summaries and engineering narratives.

Hirer-Centric Ranking:

The LLM assigns a relevance_score (0-100) based on technical complexity, impact, and verifiability.

Items (Projects, Certifications, Achievements) are automatically sorted by this score to intrigue recruiters.

4.3. Zonal UI/UX Design
Left Pane (Input Command Center):

Gitlore Queue: Input field for GitHub URLs with a batch-processing status indicator.

Narrative Zones: Scoped text areas grouped by:

Identity: Name, Role, Contact details.

Hustle: Work Experience, Research (e.g., SWIN-SNN Multimodal AI), Academic achievements (Top 1 in Batch).

Credentials: Education (CIT-U), Certifications (PhilNITS, TOPCIT).

Right Pane (Interactive Intelligence):

Live Preview:

Scannable State: Displays Title, One-liner, and Role.

Hover State (HoverCard): Reveals full description, role details, and architecture diagrams.

Interactive JSON: A live-syncing Monaco editor showing the Monofolio JSON.

Two-Way Data Binding: Manual changes in the JSON editor must reflect instantly in the Live Preview and vice-versa.

Sort Toggles: Buttons to re-sort items by Rank, Date, or Category using layout animations.

5. Non-Functional Requirements
5.1. Performance (The "Snappy" Metric)
Cold Starts: Must be sub-50ms via Cloudflare Workers.

Bundle Size: Optimized via Vite to keep initial load under 100KB Gzipped.

Reactivity: UI must feel local-first; LLM-streaming updates must update individual JSON nodes rather than re-rendering the entire state.

5.2. Token Efficiency
Max Quality, Min Waste: Use Gemini 2.5 Flash's 1M context window primarily for large narrative synthesis while offloading deterministic data (Gitlore) to the API logic.

Caching: Use Cloudflare KV to cache generated JSONs to prevent unnecessary LLM calls on page reload.

5.3. Design & Theme
Engineering Aesthetic: Dark mode by default, adhering to the "Terminal-inspired" look found in Gitlore.

Theme Support: Full support for Dark, Light, and System themes using next-themes logic extracted by Antigrav.

6. Data Schema (Zod-ready)
The system will enforce a MasterPortfolio schema:

profile: Contact info + Philosophy.

rankings: LLM-generated priority mapping.

achievements: Array of verified milestones (e.g., Rank #1).

solutions: Array of Gitlore-analyzed projects (Title, One-liner, Mermaid diagram, Hover-details).

credentials: Array of formal education and professional certs.

7. Development & Deployment
Local Dev: Use wrangler dev for API and pnpm dev for Web.

Deployment:

Push to main triggers Cloudflare Pages CI/CD.

pnpm deploy triggers Wrangler deployment for the Hono worker.

Environment: Dev Containers compatible for Arch Linux setups.