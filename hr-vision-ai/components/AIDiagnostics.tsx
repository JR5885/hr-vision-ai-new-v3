"use client";

import { useMemo, useRef, useState } from "react";
import { DOMAINS, DOMAIN_COLOR_CLASSES } from "@/lib/domains";
import { parseDiagnosis, type DiagnosisResult } from "@/lib/parseDiagnosis";
import { useLanguage } from "./LanguageContext";
import RainbowLoader from "./RainbowLoader";

const SECTION_ACCENTS = ["border-google-blue", "border-google-red", "border-google-yellow", "border-google-green"];

export default function AIDiagnostics({
  onResult,
}: {
  onResult?: (summary: string) => void;
}) {
  const { t, lang } = useLanguage();
  const [input, setInput] = useState("");
  const [activeDomain, setActiveDomain] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isStreamingRaw = loading && !result;

  function handlePillClick(domainId: number) {
    const domain = DOMAINS.find((d) => d.id === domainId);
    if (!domain) return;
    setInput(lang === "zh" ? domain.zhPrompt : domain.enPrompt);
    setActiveDomain(domainId);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setRawText("");

    const activeDomainLabel = DOMAINS.find((d) => d.id === activeDomain)?.zh;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          domains: activeDomainLabel ? [activeDomainLabel] : [],
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setRawText(full);
      }

      const parsed = parseDiagnosis(full);
      setResult(parsed);

      const zhCore = parsed.zh[0]?.body ?? full.slice(0, 400);
      onResult?.(`【AI 診斷摘要】\n${zhCore}`);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message || t.diagnostics.errorFallback);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function handleCopy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const activeSections = useMemo(() => result?.[lang] ?? [], [result, lang]);

  return (
    <section id="diagnostics" className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.diagnostics.title}
          </h2>
          <p className="mt-3 text-ink-soft">{t.diagnostics.subtitle}</p>
        </div>

        {/* Google search-box style input */}
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3.5 shadow-elevate transition-shadow focus-within:shadow-elevate-lg">
            <span aria-hidden className="text-lg text-ink-soft">🔍</span>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setActiveDomain(null);
              }}
              placeholder={t.diagnostics.placeholder}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-gray-400 sm:text-base"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="ripple-btn shrink-0 rounded-full bg-google-blue px-5 py-2 text-sm font-medium text-white shadow-elevate transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:translate-y-0"
            >
              {loading ? t.diagnostics.submitting : t.diagnostics.submit}
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-ink-soft">{t.diagnostics.tapHint}</p>

          {/* 9 domain rainbow pills — click to auto-fill the search box */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {DOMAINS.map((domain) => {
              const active = activeDomain === domain.id;
              const colors = DOMAIN_COLOR_CLASSES[domain.color];
              const label = lang === "zh" ? domain.zh : domain.en;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => handlePillClick(domain.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                    active
                      ? `border-transparent ${colors.bg} ${colors.text} ring-1 ${colors.ring}`
                      : "border-gray-200 bg-white text-ink-soft hover:border-gray-300"
                  }`}
                >
                  <span className="mr-1.5">{domain.icon}</span>
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <RainbowLoader active={loading} />
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-3xl border border-google-red/20 bg-google-red/5 px-5 py-4 text-sm text-google-red">
            {error}
          </div>
        )}

        {/* Live streaming preview before the response is fully parsed */}
        {isStreamingRaw && rawText && (
          <div className="mt-8 rounded-4xl border border-gray-100 bg-white p-6 shadow-elevate">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
              {t.diagnostics.streamingLabel}
            </p>
            <pre className="thin-scroll max-h-72 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
              {rawText}
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-blink bg-google-blue align-middle" />
            </pre>
          </div>
        )}

        {/* Final structured result — language follows the site-wide zh/en switch */}
        {result && (
          <div className="mt-8 animate-fade-in">
            <div className="grid grid-cols-1 gap-5">
              {activeSections.map((section, idx) => {
                const key = `${lang}-${idx}`;
                return (
                  <div
                    key={key}
                    className={`rounded-4xl border-l-4 border border-gray-100 bg-white p-6 shadow-elevate ${SECTION_ACCENTS[idx % SECTION_ACCENTS.length]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-ink sm:text-lg">{section.title}</h3>
                      <button
                        onClick={() => handleCopy(key, section.body)}
                        className="ripple-btn shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:text-ink"
                      >
                        {copiedKey === key ? t.diagnostics.copied : t.diagnostics.copy}
                      </button>
                    </div>
                    <div className="thin-scroll mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                      {section.body}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
