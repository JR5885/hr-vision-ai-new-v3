# HR Vision AI

Interactive AI HR strategy diagnostics platform (Next.js App Router + Tailwind, Material Design 3 / Googlyness style).

## Setup

```bash
npm install
cp .env.local.example .env.local   # set GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000

## Structure

- `app/api/diagnose/route.ts` — streams the CHRO/AI-automation system prompt against `gemini-2.5-pro` via `@google/genai`.
- `components/AIDiagnostics.tsx` — Google-search-style input, 9 domain pill chips, rainbow streaming bar, bilingual (繁中/English) 4-block result cards with copy buttons.
- `lib/domains.ts` — the 9 HR strategy domains (id, zh/en labels, color, icon).
- `lib/systemPrompt.ts` — the CHRO system prompt (bilingual, 4-section, prompt-toolbox output contract).
- `lib/parseDiagnosis.ts` — splits the streamed raw text into `{ zh, en }` sections for rendering.
