export const runtime = "nodejs";

// 使用最新官方模型名稱
const MODEL = "gemini-3.6-flash";
const SYSTEM_PROMPT =
  "你是一位專業的 HR 戰略顧問，請針對使用者的組織挑戰提供專業、可落地的診斷與行動方案。";

export async function POST(req: Request) {
  let body: { message?: string; domains?: string[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return new Response("Missing `message`", { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("Server is missing GEMINI_API_KEY", { status: 500 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\n請分析以下 HR 議題並提供診斷建議：\n${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Gemini API Error: ${errorText}`, {
        status: response.status,
      });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "未能取得有效診斷建議。";

    return new Response(replyText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
