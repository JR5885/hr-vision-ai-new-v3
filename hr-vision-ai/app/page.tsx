"use client";

import { useState } from "react";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIDiagnostics from "@/components/AIDiagnostics";
import ServicesGrid from "@/components/ServicesGrid";
import ContactForm from "@/components/ContactForm";

function HomeContent() {
  const [summary, setSummary] = useState("");
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-canvas">
      <Header />
      <Hero />
      <AIDiagnostics onResult={setSummary} />
      <ServicesGrid />
      <ContactForm summary={summary} />

      <footer className="px-4 py-10 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} HR Vision AI. {t.footer}
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
