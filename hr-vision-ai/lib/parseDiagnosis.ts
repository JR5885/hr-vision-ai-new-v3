import { LANG_SPLIT } from "./systemPrompt";

export interface DiagnosisSection {
  title: string;
  body: string;
}

export interface DiagnosisResult {
  zh: DiagnosisSection[];
  en: DiagnosisSection[];
}

const SECTION_REGEX = /(?=(?:🎯|📊|🚀|🤖))/g;

function splitSections(text: string): DiagnosisSection[] {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return [];

  const parts = trimmed
    .split(SECTION_REGEX)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.map((part) => {
    const lines = part.split("\n");
    const title = lines[0]?.trim() ?? "";
    const body = lines.slice(1).join("\n").trim();
    return { title, body };
  });
}

export function parseDiagnosis(raw: string): DiagnosisResult {
  const [zhRaw, enRaw] = raw.split(LANG_SPLIT);
  return {
    zh: splitSections(zhRaw ?? ""),
    en: splitSections(enRaw ?? ""),
  };
}
