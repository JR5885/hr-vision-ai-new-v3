"use client";

import { useLanguage } from "./LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-40 sm:pt-48">
      <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[420px] bg-gradient-to-b from-google-blue/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 text-xs font-medium text-ink-soft shadow-elevate">
          <span className="h-1.5 w-1.5 rounded-full bg-google-green" />
          {t.hero.badge}
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          {t.hero.titleLine1}
          <span className="mx-2 text-ink-soft">{t.hero.titleX}</span>
          {t.hero.titleLine2}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-google-blue via-google-red to-google-green bg-clip-text text-transparent">
            {t.hero.titleHighlight}
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {t.hero.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#diagnostics"
            className="ripple-btn rounded-full bg-google-blue px-6 py-3 text-sm font-medium text-white shadow-elevate-lg transition-transform hover:-translate-y-0.5"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#services"
            className="ripple-btn rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
