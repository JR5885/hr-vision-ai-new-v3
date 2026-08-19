import { NextResponse } from "next/server";

const MODEL = "gemini-3.6-flash";
const SYSTEM_PROMPT =
  "你是一位專業的 HR 戰略顧問，請針對使用者的組織挑戰提供專業、可落地的診斷與行動方案。";

export async function POST(req: Request) {
  try {
    let body: { message?: string; domains?: string[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const message = (body.message ?? "").trim();
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Error: GEMINI_API_KEY is not set.");
      return NextResponse.json(
        { error: "Server missing GEMINI_API_KEY" },
        { status: 500 }
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
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\n請分析以下 HR 議題：\n${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API Remote Error:", errText);
      return NextResponse.json(
        { error: `Gemini API Error: ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "未能取得有效診斷建議。";

    // 回傳純文字 Response（使用 NextResponse.json 或純 Response 均可）
    return new NextResponse(replyText, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("Server Exception:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
