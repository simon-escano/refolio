# Refolio Frontend Components & Data Flows (Styling-Free Bare Specification)

This document specifies the bare functional architecture, structural scaffolding, inputs, outputs, sequence ordering, and state orchestration logic of the **Refolio** web client interface. 

> [!IMPORTANT]
> This is a **purely functional specification**. All details regarding visual styling (e.g., CSS classes, fonts, borders, layouts, margins, grid structures, or theme customizations) are omitted. It describes the bare semantic HTML scaffolding, input elements, output text nodes, dynamic groupings, ordering sequences, and states.

---

## 1. Application Frame & Workspace Orchestrator (`App.tsx`)

The main workspace coordinates global states, initiates generation pipeline execution, and structures the viewport into two layout configurations depending on the presence of portfolio output.

### 1.1 Header Component (`Header.tsx`)
Rendered at the top of all viewports.
1. **Brand Scaffolding**:
   - Hexagon brand icon.
   - Brand name text: `"Refolio"`.
   - Beta Badge: uppercase text string `"BETA"`.
2. **Global Theme Toggle**:
   - Dropdown control button displaying current theme icon (Sun for Light, Moon for Dark, Monitor for System) and label text.
   - Menu Overlay (toggled on click, auto-dismisses when clicking outside the menu):
     - Sun icon + `"Light"` text button.
     - Moon icon + `"Dark"` text button.
     - Monitor icon + `"System"` text button.
     - Action: Updates global style theme provider context.

### 1.2 Footer Component (`Footer.tsx`)
Rendered at the bottom of all viewports.
- Contains copyright text nodes and reference links.

### 1.3 Global State Variables
- `profile`: Object matching `ProfileData` schema (starts with empty string defaults).
- `projects`: Dynamic array of `ProjectEntry` items. Defaults to a single empty template project.
- `achievements`: Dynamic array of `AchievementEntry` items (defaults to empty list).
- `credentials`: Dynamic array of `CredentialEntry` items (defaults to empty list).
- `experience`: Dynamic array of `ExperienceEntry` items (defaults to empty list).
- `tech`: Dynamic array of `SkillEntry` items (defaults to empty list).
- `languages`: Dynamic array of `LanguageEntry` items (defaults to empty list).
- `progress`: Array of `ProgressEvent` items (log entries streamed from the API).
- `isGenerating`: Boolean flag indicating pipeline execution status.
- `error`: String containing pipeline trace error or `null`.
- `activeTab`: Exclusive toggle: `"preview"` or `"json"`. Defaults to `"preview"`.

### 1.4 Layout State Transitions
Depending on whether an output has been stitched and validated (`hasOutput`), the frame switches layouts:

#### A. Bento Workspace Layout (Zero-Output State)
*Rendered when `hasOutput` is `false` and no error is present.*
The scaffolding groups and displays interactive input zones in the following sequence:
1. **Row 1 Group**:
   - `IdentityZone`
   - `GitloreQueue` (Projects)
2. **Row 2 Group**:
   - `ExperienceZone` (Work Experience)
   - `SkillsZone` (Tech & Languages)
3. **Row 3 Group**:
   - `AchievementsZone`
   - `CredentialsZone`
4. **Action Area**:
   - `GenerateButton` (CTA)
5. **Passive Log Area**:
   - `ProgressFeed` (Visible if historical progress events exist but generator is idle)

#### B. Split Workspace Layout (Output-Active State)
*Rendered when `hasOutput` is `true` (valid portfolio payload or terminal error exists).*
The scaffolding partitions the interface into two main panels:
1. **Left Control Column (Compact Inputs)**:
   - Contains a vertically stacked list of all input zones in the following order:
     1. `IdentityZone`
     2. `GitloreQueue`
     3. `ExperienceZone`
     4. `SkillsZone`
     5. `AchievementsZone`
     6. `CredentialsZone`
     7. `GenerateButton` (CTA)
     8. Docked `ProgressFeed` (if active)
2. **Right Intelligence Column (Outputs)**:
   - **Error Banner**: Rendered at the top of the column if `error` state is not null. Displays:
     - Error Title ("Pipeline Error")
     - Detailed monospaced error payload
   - **Viewport Toggle Bar**: Contains the `OutputTabs` control.
   - **Viewport Content**:
     - If `activeTab` is `"preview"`: Displays the `LivePreview` component.
     - If `activeTab` is `"json"`: Displays the `MonacoEditor` component.

---

## 2. Interactive Input Zones (Command Center)

Each Input Zone is implemented as an expandable/collapsible block. Each contains:
- **Header**: Icon, Zone Title text, Subtitle helper text, dynamic count badge (where applicable), and a Chevron button toggling the expanded/collapsed state.
- **Collapsible Container**: Wraps the sequence of inputs, expanding to full row-capacity or collapsing to `0px` height.

### 2.1 Identity Zone Component (`IdentityZone.tsx`)
Scaffolds personal details, contact coordinates, and hobbies.

- **Inputs Sequence**:
  1. **Full Name**:
     - Element: `<input type="text">`
     - Placeholder: `"Simon Escaño"`
     - Value: `profile.name`
  2. **Title / Role**:
     - Element: `<input type="text">`
     - Placeholder: `"Full-Stack Engineer"`
     - Value: `profile.role`
  3. **Email**:
     - Element: `<input type="text">` (Pre-pended with Mail icon)
     - Placeholder: `"hello@example.com"`
     - Value: `profile.email`
  4. **Mobile Phone (Grouped Input)**:
     - **Area Code Selector**:
       - Element: `<select>` (Pre-pended with Phone icon)
       - Options: `+1 (US)`, `+44 (UK)`, `+61 (AU)`, `+63 (PH)`, `+65 (SG)`, `+81 (JP)`, `+86 (CN)`, `+91 (IN)`
       - Default Value: `+63`
       - Value: `profile.mobileAreaCode`
     - **Number Field**:
       - Element: `<input type="text">`
       - Placeholder: `"912 345 6789"`
       - Value: `profile.mobile`
  5. **GitHub URL**:
     - Element: `<input type="text">` (Pre-pended with GitHub icon)
     - Placeholder: `"https://github.com/username"`
     - Value: `profile.github`
  6. **LinkedIn URL**:
     - Element: `<input type="text">` (Pre-pended with LinkedIn icon)
     - Placeholder: `"https://linkedin.com/in/username"`
     - Value: `profile.linkedin`
  7. **Website**:
     - Element: `<input type="text">` (Pre-pended with Globe icon)
     - Placeholder: `"https://yoursite.dev"`
     - Value: `profile.website`
  8. **Hobbies**:
     - Element: `<input type="text">` (Pre-pended with Heart icon)
     - Placeholder: `"Photography, Keyboards, Hiking"`
     - Helper text: comma-separated values to trigger dynamic icon tags.
     - Value: `profile.hobbies`

---

### 2.2 Projects Zone Component (`GitloreQueue.tsx`)
Coordinates GitHub repositories to feed into the Gitlore AST parsing pipeline. Displays a live project count badge in the header.

- **Dynamic Array Structure**: Repeats a sub-form block for each `ProjectEntry` in `projects`.
- **Each Project Record Sequence**:
  1. **Record Header**:
     - Label: `"Project XX"` (where `XX` is a 1-based, zero-padded index)
     - Remove Trigger: `<button type="button">` (Renders cross icon, visible only when `projects.length > 1`)
  2. **GitHub URL**:
     - Element: `<input type="text">` (Pre-pended with Link icon, monospaced font)
     - Placeholder: `"https://github.com/owner/repo"`
     - Value: `projects[index].url`
  3. **Project Title**:
     - Element: `<input type="text">`
     - Placeholder: `"Project title (e.g., Gitlore)"`
     - Value: `projects[index].title`
  4. **Contributions**:
     - Element: `<textarea rows={3}>`
     - Placeholder: `"What did you contribute?"`
     - Value: `projects[index].contributions`
  5. **Context (Optional)**:
     - Element: `<textarea rows={1}>`
     - Placeholder: `"Additional context (optional)"`
     - Value: `projects[index].context`
- **Global Control**:
  - **Add Project**: `<button type="button">` (Appends an empty project template record to the state array)

---

### 2.3 Work Experience Zone Component (`ExperienceZone.tsx`)
Captures corporate history. Displays experience count in the header.

- **Dynamic Array Structure**: Repeats a sub-form block for each `ExperienceEntry` in `experience`.
- **Each Experience Record Sequence**:
  1. **Record Header**:
     - Label: `"Role XX"` (1-based, zero-padded index)
     - Remove Trigger: `<button type="button">`
  2. **Role / Title**:
     - Element: `<input type="text">`
     - Placeholder: `"Role (e.g. Senior Backend Engineer)"`
     - Value: `experience[index].role`
  3. **Company**:
     - Element: `<input type="text">`
     - Placeholder: `"Company (e.g. Acme Corp)"`
     - Value: `experience[index].company`
  4. **Location**:
     - Element: `<input type="text">`
     - Placeholder: `"Location (e.g. San Francisco, Remote)"`
     - Value: `experience[index].location`
  5. **Dates (Grouped side-by-side)**:
     - **Start Date**:
       - Element: `<input type="date">` with a preceding small capital text label `"Start Date"`
       - Value: `experience[index].startDate`
     - **End Date**:
       - Element: `<input type="date">` with a preceding small capital text label `"End Date"`
       - Value: `experience[index].endDate`
  6. **Contributions details**:
     - Element: `<textarea rows={3}>`
     - Placeholder: `"What did you contribute?"`
     - Value: `experience[index].contributions`
- **Global Control**:
  - **Add Experience**: `<button type="button">` (Appends an empty experience record to the state array)

---

### 2.4 Skills Zone Component (`SkillsZone.tsx`)
Divided into two separate and distinct sub-form modules within the zone wrapper.

#### Module A: Tech Proficiency
- **Dynamic Array Structure**: List of technologies (`tech`).
- **Each Technology Skill Sequence**:
  1. **Skill Name**:
     - Element: `<input type="text">`
     - Placeholder: `"Skill (e.g. React)"`
     - Value: `tech[index].title`
  2. **Proficiency Value Rating**:
     - Element: Horizontal row containing **10 discrete buttons**
     - Value range: Integers `1` through `10`
     - Click behavior: Updates `tech[index].proficiency` to the selected index (`1` to `10`). The rating indicator fills up to the selected button.
  3. **Remove Trigger**: `<button type="button">` (cross button, indexed)
- **Control**:
  - **Add Tech Skill**: `<button type="button">` (Appends `{ title: "", proficiency: 5 }`)

#### Module B: Languages
- **Dynamic Array Structure**: List of spoken/written languages (`languages`).
- **Each Language Skill Sequence**:
  1. **Language Name**:
     - Element: `<input type="text">`
     - Placeholder: `"Language (e.g. Japanese)"`
     - Value: `languages[index].title`
  2. **Proficiency Value Rating**:
     - Element: Horizontal row containing **10 discrete buttons**
     - Value range: Integers `1` through `10`
     - Click behavior: Updates `languages[index].proficiency` to the selected index (`1` to `10`).
  3. **Remove Trigger**: `<button type="button">` (cross button, indexed)
- **Control**:
  - **Add Language**: `<button type="button">` (Appends `{ title: "", proficiency: 5 }`)

---

### 2.5 Achievements Zone Component (`HustleZone.tsx` - Achievements)
Gathers notable milestones. Displays milestone count in the header.

- **Dynamic Array Structure**: Repeats a sub-form block for each `AchievementEntry` in `achievements`.
- **Each Achievement Record Sequence**:
  1. **Record Header**:
     - Label: `"Achievement XX"` (1-based, zero-padded index)
     - Remove Trigger: `<button type="button">`
  2. **Accomplishment description**:
     - Element: `<textarea rows={2}>`
     - Placeholder: `"What did you accomplish? (e.g. Rank #1 in Batch, Published an article on dev.to)"`
     - Value: `achievements[index].accomplishment`
  3. **Evidence URL**:
     - Element: `<input type="text">`
     - Placeholder: `"Evidence URL (optional)"`
     - Value: `achievements[index].evidence_url`
- **Global Control**:
  - **Add Achievement**: `<button type="button">` (Appends `{ accomplishment: "", evidence_url: "" }`)

---

### 2.6 Credentials Zone Component (`HustleZone.tsx` - Credentials)
Collects formal degrees, academic institutions, and professional certifications. Displays total count in header.

- **Dynamic Array Structure**: Repeats a sub-form block for each `CredentialEntry` in `credentials`.
- **Each Credential Record Sequence**:
  1. **Record Header**:
     - Label: Dynamic text displaying `"education"` or `"certification"` based on active type selection.
     - Type Icon: GraduationCap icon (for education) or Award icon (for certification).
     - Remove Trigger: `<button type="button">`
  2. **Credential Type Selector (Radio Toggle)**:
     - Element: Button pair acting as a toggle with choices `"education"` and `"certification"`.
     - Value: `credentials[index].type`
  3. **Dynamic Form Fields Switch**:
     - **If `type === "education"`**:
       1. **Degree / Major**:
          - Element: `<input type="text">`
          - Placeholder: `"Degree/Major (e.g., BS in Computer Science)"`
          - Value: `credentials[index].title`
       2. **Institution**:
          - Element: `<input type="text">`
          - Placeholder: `"Institution"`
          - Value: `credentials[index].institution`
       3. **Dates (Grouped side-by-side)**:
          - **Start Date**:
            - Element: `<input type="date">` labeled `"Start Date"`
            - Value: `credentials[index].startDate`
          - **End Date**:
            - Element: `<input type="date">` labeled `"End Date"`
            - Value: `credentials[index].endDate`
     - **If `type === "certification"`**:
       1. **Certification Description**:
          - Element: `<textarea rows={3}>`
          - Placeholder: `"Explain your certification (e.g., AWS Certified Solutions Architect - May 2024)"`
          - Value: `credentials[index].certification`
- **Global Control**:
  - **Add Credential**: `<button type="button">` (Appends default template `{ type: "education", title: "", institution: "", startDate: "", endDate: "", certification: "" }`)

---

## 3. Action Trigger & Pipeline Control

The workflow execution is triggered by a single strategic control button:

### 3.1 Generate CTA Button (`GenerateButton`)
- **Element**: `<button type="button">`
- **Inputs (Props)**:
  - `canGenerate`: Boolean evaluated on parent:
    ```typescript
    canGenerate = profile.name.trim() !== "" && 
                  profile.role.trim() !== "" && 
                  projects.some(p => p.url.trim() !== "" && p.title.trim() !== "")
    ```
  - `isGenerating`: Boolean flag mirroring the active network/web socket stream.
- **Interactivity Rules**:
  - State is `disabled` if `canGenerate` is `false` or `isGenerating` is `true`.
  - Icon: Displays Rocket icon.
  - Text label changes dynamically:
    - If `isGenerating === true`: `"Generating..."`
    - If `isGenerating === false`: `"Generate Portfolio"`

---

## 4. LLM Generation Popup & Progress Feed (`ProgressFeed.tsx`)

When generation is activated (`isGenerating === true`), a dark workspace modal backdrop is overlaid, locking all other text, selector dropdowns, and buttons in the parent application workspace. It hosts a highly interactive progress dialogue window displaying real-time trace events.

```
┌────────────────────────────────────────────────────────┐
│ [Loader] Generating Portfolio...           (O)(O)(•)(o) [Cancel] │
├────────────────────────────────────────────────────────┤
│ ┌─ Cache Lookup ─────────────────────────────────────┐ │
│ │  • Hashing request coordinates...                  │ │
│ │  • No matching cache found, executing pipeline...  │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌─ Gitlore Analysis [Processing...] ──────────────────┐ │
│ │  • Analyzing gitlore repo repository details...     │ │
│ │  • Retrieved structured component specs             │ │
│ │    detail: { "diagram": "graph TD...", ... }       │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 4.1 Header Control Scaffolding
1. **Activity Spinner**: An animated loading spinner showing real-time background computation.
2. **Dynamic Dialogue Title**:
   - Displays `"Generating Portfolio..."` when the stream is actively loading.
   - Displays `"Generation Log"` when displaying passive logs after compilation has halted.
3. **Sequence Step Indicator Bar**: 
   A horizontal chain of 5 circular nodes mapping the pipeline phases in execution sequence order:
   `cache` → `gitlore` → `narrative` → `stitching` → `validation`.
   - **Inactive State**: Grayed-out dot icon.
   - **Active State**: Node expands into a wide, colored, pulsing pill bar showing processing progress.
   - **Completed State**: Highlighted static circle node.
4. **Cancel Transaction Button**:
   - Element: `<button type="button">`
   - Active: Rendered only when `isGenerating === true` and an abort handler exists.
   - Interactive Logic: Triggers Abort Signal (`abortRef.current.abort()`), aborts HTTP connection, resets `isGenerating` to `false`, terminates active background generation, closes the overlay popup, and appends a `"Cancelled by user"` termination trace log line.

### 4.2 Segmented Logging Console Canvas
Incorporates a scrollable inner pane containing dynamic trace blocks grouped chronologically by their execution segment:

#### Block Categories (Progress Phases)
- **Phase 1: Cache Lookup (`cache`)**
  - Scrapes local and CDN KV caches for exact request coordinate hashes to skip redundant AST/LLM workloads.
- **Phase 2: Gitlore Analysis (`gitlore`)**
  - Connects to sibling services to perform deterministic static AST analysis on user-submitted GitHub projects, returning raw architecture diagrams, stack items, and performance metrics.
- **Phase 3: Narrative Synthesis (`narrative`)**
  - Dispatches profiles and credentials text blocks to the Gemini 2.5 Flash LLM, triggering narrative polishing and categorization logic.
- **Phase 4: Portfolio Assembly (`stitching`)**
  - Combines AST diagrams (deterministic zones) and raw AI written summaries (probabilistic zones) into unified schemas.
- **Phase 5: Schema Validation (`validation`)**
  - Parses compiled items against standard JSON Zod validators.

#### Phase Block Structure
If a phase contains at least one log trace line, it renders a bounded group block:
- **Phase Block Header**:
  - Icon representation: Database (for cache), GitBranch (for gitlore), Sparkles (for narrative), Puzzle (for stitching), CheckCircle (for validation).
  - Uppercase phase label.
  - Active Indicator (rendered if active): Pulsing `"Processing"` text tag next to an inline micro spinning icon.
  - Finished Badge (rendered if complete): Text bubble listing total parsed events inside the block (e.g. `"3 events"`).
- **Phase Log Lines (Chronological Bullet List)**:
  - Bullet node icon.
  - Core event message string (`event.message`).
  - **Monospaced Details Area (`event.detail`)**: 
    Rendered when optional trace diagnostic detail is appended to the stream packet. Outputs an indented monospace field beneath the parent log message displaying debug stack, JSON metadata strings, AST files, or LLM token expenditure statistics.

### 4.3 Container Auto-Scrolling behavior
A invisible tracking element (`bottomRef`) anchors the end of the dynamic logs. When the length of the global `progress` state changes, an automated effect triggers `bottomRef.current.scrollIntoView({ behavior: "smooth" })` to force scroll offsets to the bottom, ensuring the most recent log statements are visible to the user.

### 4.4 Termination States & Popup Exit Handling
The modal popup terminates and exits through one of two terminal conditions:

#### Terminal Case A: Success Event (`result` SSE event)
1. Stream transmits a finalized, valid `MasterPortfolio` schema string.
2. The sync engine writes results to state.
3. State `isGenerating` is set to `false`.
4. Popup overlay automatically unmounts, revealing the dashboard.
5. Workspace transitions from Bento (input setup) to Split Panels (compact inputs side-by-side with preview).
6. Viewport switches `activeTab` to `"preview"`, loading parsed output blocks directly in the graphical Live Preview renderer.

#### Terminal Case B: Stream Errors (`error` SSE event or Fetch crash)
1. Connection drops or returns a validation error payload.
2. State `isGenerating` is set to `false`.
3. Popup overlay automatically unmounts.
4. Error message is stored in global state `error`.
5. Split Panel dashboard layout displays a prominent **Red Error Banner** at the top of the outputs column containing:
   - Header text: `"Pipeline Error"`.
   - Code body displaying diagnostic error message strings and debug stack trace.

---

## 5. Output View & Two-Way Sync Panel

The generated payload compiles into the standardized `MasterPortfolio` JSON payload. It is viewed and managed on the right pane using a two-view setup.

### 5.1 Output Tabs Control (`OutputTabs.tsx`)
- **Scaffolding**: Group of two toggle buttons.
- **Value**: `activeTab` (`"preview"` or `"json"`).
- **Tab Option 1**: Eye Icon + `"Preview"` label.
- **Tab Option 2**: Code Icon + `"JSON"` label.

---

### 5.2 Live Preview View (`LivePreview.tsx` & `Mermaid.tsx`)
Displays a finalized representation of the portfolio. It enforces a strict, hierarchical sequence of semantic sections:

#### Section 1: Profile Header
Displays primary branding and identity parameters.
1. **Avatar Icon**: Extracted first letter of `profile.name` mapped inside a circle block.
2. **Name**: `<h2>` text element.
3. **Role / Title**: `<p>` text element.
4. **Engineering Philosophy**: `<p>` text in italics, rendered only if `profile.philosophy` exists.
5. **Contact Coordinates**: Horizontal list of tags:
   - Email: Mail icon + email text value.
   - Mobile: Phone icon + mobile phone text value.
6. **Quick Statistics Badge**: Star icon + text string showing the total calculated project count (e.g., `"3 Projects"`).
7. **Hobbies List**: Horizontal tag row. Renders only if `profile.hobbies` has item values. Each hobby card contains:
   - Dynamic Lucide Icon (resolved by name key, e.g. "Camera", "Keyboard", "MapPin").
   - Hobby title text label.

#### Section 2: Projects List
- **Header**: Capitalized section heading `"Projects"`.
- **Card List**: Iterates through `projects` in exact array order. Each card renders:
  1. **Title**: `<h4>` element with a adjacent provenance tag string `"gitlore"`.
  2. **One-liner Pitch**: `<p>` element.
  3. **Contributions Summary**: Highlighted text row detailing specific contributions.
  4. **Categorized Tech Stack List**: Loops through tech items and maps them into three role category groups:
     - **Primary Role List**: Primary label tag + dot-separated string listing primary tech names (e.g. `React • TypeScript`).
     - **Infrastructure Role List**: Infrastructure label tag + dot-separated string listing infra tech names (e.g. `Cloudflare Workers • Docker`).
     - **Supporting Role List**: Supporting label tag + dot-separated string listing auxiliary tech names.
  5. **Results Metrics Box**: Row containing three structured columns:
     - **Performance Column**: Zap icon + uppercase title label `"Perf"` + performance text value.
     - **Scale Column**: Layers icon + uppercase title label `"Scale"` + scale text value.
     - **Utility Column**: Shield icon + uppercase title label `"Utility"` + utility text value.
  6. **Architecture Diagram Block**: Invokes the `Mermaid` renderer component, outputting an interactive SVG diagram calculated from the Mermaid script payload (`architecture_diagram_code`).
  7. **External Links**: Row of anchor buttons. Icons are resolved based on target:
     - GitHub icon for URLs containing `github.com`.
     - ExternalLink icon for general web addresses.
     - Text value: custom labels (e.g. `"Source Code"`, `"Live Demo"`).

#### Section 3: Work Experience
- **Header**: Capitalized section heading `"Work Experience"`.
- **Card List**: Iterates through `experience` in chronological/array order. Each card renders:
  - Briefcase icon.
  - Role Title: `<h4>` element.
  - Company Metadata Row: Company Name, Location (if present), and Date Range (if present), separated by center-aligned bullets.
  - Contributions List: An HTML unordered list (`<ul>` and `<li>` items) displaying bullet points of accomplishments.

#### Section 4: Tech Proficiency Grid
- **Header**: Capitalized section heading `"Tech Proficiency"`.
- **Grid Layout**: Iterates through categorized tech clusters from `tech` record. Each category block renders:
  - Code icon + Category Title (e.g. `"Backend Frameworks"`, `"Databases"`).
  - Skill Items (sorted descending based on proficiency score). Each item renders:
    - Row: Skill title + score label formatted as `"XX/10"` (e.g., `"9/10"`).
    - Visual Score Meter: Full horizontal bar scaffolding a percentage-filled inner indicator reflecting `(proficiency / 10) * 100` width.

#### Section 5: Achievements
- **Header**: Capitalized section heading `"Achievements"`.
- **Card List**: Iterates through achievements in sequence order. Each card renders:
  - Trophy icon.
  - Achievement Title.
  - Achievement polished description.
  - Date (if present).

#### Section 6: Credentials
- **Header**: Capitalized section heading `"Credentials"`.
- **Card List**: Iterates through credentials. Each card renders:
  - Type-specific icon: GraduationCap for educational credentials, Award for professional certifications.
  - Credential Title (degree title or certification name).
  - Institution / Certifying Body name, optionally appended with date.
  - Description text details (if present).

#### Section 7: Language Proficiency
- **Header**: Capitalized section heading `"Language Proficiency"`.
- **Languages Box**:
  - Globe icon + `"Languages"` title.
  - Languages list sorted descending by proficiency. Each language element renders:
    - Language name text.
    - Horizontal percentage-filled progress meter.

---

### 5.3 Monaco JSON Editor Component (`MonacoEditor.tsx`)
A plain-text JSON editing console.

- **Inputs (Props)**:
  - `value`: Serialized string representing `MasterPortfolio` payload.
  - `onChange`: Trigger fired on editor input.
  - `error`: JSON validation or schema-parse error string or `null`.
  - `readOnly`: Boolean lock flag.
- **Scaffolding**:
  - **Header Bar**:
    - File icon + label `"MasterPortfolio.json"`.
    - Dynamic Status Widgets:
      - **Error Tag**: Renders alert icon + parsed error message snippet if `error` is present.
      - **Read-Only Tag**: Small uppercase tag `"READ ONLY"` when `readOnly` is `true`.
  - **Code Editor Canvas**: Embeds the Monaco instance matching theme values (`vs-dark` or `vs` corresponding to dark/light mode context), rendering standard row numbers, word wrapping, bracket pairs, and custom font options.

---

## 6. Two-Way State Sync Engine (`sync.ts`)

Ensures simultaneous coordination between raw JSON editing (Monaco text) and graphical preview updates (Live Preview data nodes).

```
 ┌──────────────────────┐             300ms Debounce             ┌──────────────────────┐
 │                      ├───────────────────────────────────────>│                      │
 │    Monaco Editor     │                                        │     Live Preview     │
 │ (Raw JSON text input)│<───────────────────────────────────────┤ (Parsed Object View) │
 └──────────────────────┘       Immediate Serialization          └──────────────────────┘
```

### 6.1 Monaco-to-Preview Propagation
1. User modifies text inside the Monaco Editor.
2. The raw text state updates immediately.
3. An internal **300ms debounce timer** is scheduled.
4. On debounce completion, the text string is sent to:
   - `JSON.parse()`
   - Zod validation (`MasterPortfolioSchema.safeParse()`)
5. If parsing and schema checks succeed:
   - The authoritative `MasterPortfolio` React state is updated.
   - The Live Preview updates to reflect structural additions/changes.
6. If any step fails:
   - The last valid React state is retained in the Live Preview.
   - An inline error banner is rendered in the Monaco Header with the trace details.

### 6.2 Preview-to-Monaco Propagation
1. User triggers direct edits inside the Live Preview elements.
2. React state updates immediately with the modified data payload.
3. An effect instantly captures the state update, translates the raw object into serialized format (`JSON.stringify(updated, null, 2)`), and pushes the text string back to the Monaco controlled input.

### 6.3 Conflict Resolution Rules
- To resolve race conditions between asynchronous editor inputs and immediate preview clicks, a sequential integer counter (`generationId`) is incremented on every transaction.
- If a newer state update has been recorded during a debounce wait time, older pending editor modifications are discarded.
