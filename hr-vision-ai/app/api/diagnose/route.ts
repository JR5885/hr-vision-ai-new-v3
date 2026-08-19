import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/systemPrompt";

export const runtime = "nodejs";

// Advanced-reasoning model — good fit for a long, structured, bilingual
// strategic analysis. Swap for a newer/faster Gemini model id as needed.
const MODEL = "gemini-2.5-pro";

export async function POST(req: Request) {
  let body: { message?: string; domains?: string[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const message = (body.message ?? "").trim();
  const domains = Array.isArray(body.domains) ? body.domains : [];

  if (!message) {
    return new Response("Missing `message`", { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      "Server is missing GEMINI_API_KEY. Set it in .env.local.",
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await ai.models.generateContentStream({
          model: MODEL,
          contents: buildUserPrompt(message, domains),
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 4096,
          },
        });

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
