export const runtime = "nodejs";

const MODEL = "gemini-3.6-flash";
const SYSTEM_PROMPT =
  "你是一位專業的 HR 戰略顧問，請針對使用者的組織挑戰提供專業、可落地的診斷與行動方案。";

export async function POST(req: Request) {
  try {
    let body: { message?: string; domains?: string[] };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const message = (body.message ?? "").trim();
    if (!message) {
      return new Response(JSON.stringify({ error: "Missing message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Error: GEMINI_API_KEY is not set in environment variables.");
      return new Response(
        JSON.stringify({ error: "Server error: GEMINI_API_KEY is missing." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\n請分析以下 HR 議題：\n${message}` }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API Remote Error:", errText);
      return new Response(
        JSON.stringify({ error: `Gemini API Error (${res.status}): ${errText}` }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "未能取得有效診斷建議。";

    return new Response(replyText, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("Server Internal Exception:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
