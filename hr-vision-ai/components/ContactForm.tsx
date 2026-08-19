"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

export default function ContactForm({ summary }: { summary: string }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (summary) setMessage(summary);
  }, [summary]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="px-4 py-20">
      <div className="mx-auto max-w-2xl rounded-4xl border border-gray-100 bg-white p-8 shadow-elevate sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t.contact.title}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t.contact.subtitle}</p>

        {submitted ? (
          <div className="mt-8 flex items-center gap-3 rounded-3xl bg-google-green/10 px-5 py-4 text-sm font-medium text-google-green">
            <span>✅</span>
            {t.contact.success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                placeholder={t.contact.name}
                className="rounded-2xl border border-gray-200 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
              />
              <input
                required
                type="email"
                placeholder={t.contact.email}
                className="rounded-2xl border border-gray-200 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
              />
            </div>
            <input
              placeholder={t.contact.company}
              className="w-full rounded-2xl border border-gray-200 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder={t.contact.message}
              className="w-full resize-none rounded-3xl border border-gray-200 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-google-blue focus:ring-2 focus:ring-google-blue/20"
            />
            <button
              type="submit"
              className="ripple-btn w-full rounded-full bg-google-blue px-6 py-3 text-sm font-medium text-white shadow-elevate transition-transform hover:-translate-y-0.5"
            >
              {t.contact.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
