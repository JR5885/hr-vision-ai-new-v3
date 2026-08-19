"use client";

import { useState } from "react";
import { DOMAINS, DOMAIN_COLOR_CLASSES } from "@/lib/domains";
import { MODULE_DETAILS } from "@/lib/moduleDetails";
import { useLanguage } from "./LanguageContext";

export default function ServicesGrid() {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="services" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.services.title}
          </h2>
          <p className="mt-3 text-ink-soft">{t.services.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => {
            const colors = DOMAIN_COLOR_CLASSES[domain.color];
            const title = lang === "zh" ? domain.zh : domain.en;
            const subtitle = lang === "zh" ? domain.en : domain.zh;
            const desc = lang === "zh" ? domain.zhDesc : domain.enDesc;
            const isOpen = expanded.has(domain.id);
            const detail = MODULE_DETAILS[domain.id]?.[lang];

            return (
              <div
                key={domain.id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-elevate transition-shadow duration-200 hover:shadow-elevate-lg"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${colors.bg}`}
                >
                  {domain.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
                <p className="text-xs font-medium text-ink-soft">{subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{desc}</p>

                {detail && (
                  <button
                    type="button"
                    onClick={() => toggle(domain.id)}
                    aria-expanded={isOpen}
                    className={`ripple-btn mt-4 flex w-full items-center justify-between rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      isOpen
                        ? `border-transparent ${colors.bg} ${colors.text}`
                        : "border-gray-200 text-ink-soft hover:border-gray-300"
                    }`}
                  >
                    {isOpen ? t.services.collapse : t.services.learnMore}
                    <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                  </button>
                )}

                {detail && isOpen && (
                  <div className="mt-4 space-y-5 border-t border-gray-100 pt-4 animate-fade-in">
                    {detail.subpages.map((sub, i) => (
                      <div key={i}>
                        <h4 className="text-sm font-semibold text-ink">{sub.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{sub.overview}</p>

                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                          {t.services.methodologyHeading}
                        </p>
                        <ul className="mt-1.5 space-y-1.5">
                          {sub.methodology.map((m, j) => (
                            <li key={j} className="text-xs leading-relaxed text-ink-soft">
                              <span className="font-semibold text-ink">{m.label}: </span>
                              {m.text}
                            </li>
                          ))}
                        </ul>

                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                          {t.services.deliverablesHeading}
                        </p>
                        <ul className="mt-1.5 space-y-1 list-disc pl-4">
                          {sub.deliverables.map((d, j) => (
                            <li key={j} className="text-xs leading-relaxed text-ink-soft">
                              {d}
                            </li>
                          ))}
                        </ul>

                        <p className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                          {t.services.metricLabel}: {sub.metric}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
