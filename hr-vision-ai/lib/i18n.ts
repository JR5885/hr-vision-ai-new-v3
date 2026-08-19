export type Lang = "zh" | "en";

export interface Strings {
  brand: string;
  nav: {
    diagnostics: string;
    services: string;
    contact: string;
    cta: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleX: string;
    titleLine2: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  diagnostics: {
    title: string;
    subtitle: string;
    placeholder: string;
    submit: string;
    submitting: string;
    streamingLabel: string;
    copy: string;
    copied: string;
    errorFallback: string;
    tapHint: string;
  };
  services: {
    title: string;
    subtitle: string;
    learnMore: string;
    collapse: string;
    methodologyHeading: string;
    deliverablesHeading: string;
    metricLabel: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    company: string;
    message: string;
    submit: string;
    success: string;
  };
  footer: string;
  langToggleLabel: string;
}

export const STRINGS: Record<Lang, Strings> = {
  zh: {
    brand: "HR Vision AI",
    nav: {
      diagnostics: "AI 診斷",
      services: "服務領域",
      contact: "預約諮詢",
      cta: "預約診斷",
    },
    hero: {
      badge: "Powered by Google Gemini",
      titleLine1: "15+ 年資深 HRBP 經驗",
      titleX: "x",
      titleLine2: "生成式 AI 賦能",
      titleHighlight: "全方位組織升級",
      subtitle:
        "即時輸入您的組織痛點，AI 戰略顧問將針對人才、合規、文化、招聘自動化等 9 大 HR 領域，提供深度剖析與可落地行動方案。",
      ctaPrimary: "開始 AI 診斷",
      ctaSecondary: "了解服務內容",
    },
    diagnostics: {
      title: "動態 AI HR 戰略診斷沙盒",
      subtitle: "描述您正面臨的組織挑戰，AI 將即時歸類、剖析並產出可落地的行動方案。",
      placeholder: "例如：團隊擴編快，但關鍵職位一直找不到合適的人選……",
      submit: "開始診斷",
      submitting: "分析中…",
      streamingLabel: "AI 正在即時分析中…",
      copy: "一鍵複製",
      copied: "已複製 ✓",
      errorFallback: "發生未知錯誤，請稍後再試。",
      tapHint: "點選下方標籤，快速帶入範例問題",
    },
    services: {
      title: "9 大 HR 戰略與自動化領域",
      subtitle: "從人才策略到薪酬設計，AI 診斷引擎覆蓋組織全生命週期的核心議題。",
      learnMore: "查看詳情",
      collapse: "收起詳情",
      methodologyHeading: "重點作法",
      deliverablesHeading: "交付成果",
      metricLabel: "關鍵指標",
    },
    contact: {
      title: "預約診斷諮詢",
      subtitle: "留下您的聯絡資訊，我們將依據 AI 診斷結果，為您安排一對一戰略諮詢。",
      name: "姓名",
      email: "公司信箱",
      company: "公司名稱",
      message: "您的 HR 挑戰簡述（完成上方 AI 診斷後將自動帶入分析摘要）",
      submit: "送出預約",
      success: "已收到您的預約需求，我們將盡快與您聯繫。",
    },
    footer: "Powered by Google Gemini.",
    langToggleLabel: "切換語言",
  },
  en: {
    brand: "HR Vision AI",
    nav: {
      diagnostics: "AI Diagnostics",
      services: "Services",
      contact: "Book a Call",
      cta: "Book a Call",
    },
    hero: {
      badge: "Powered by Google Gemini",
      titleLine1: "15+ Years of Senior HRBP Experience",
      titleX: "x",
      titleLine2: "Generative AI",
      titleHighlight: "Full-Spectrum Org Upgrade",
      subtitle:
        "Describe your organizational pain point and get an instant AI strategy deep-dive across 9 core HR domains — talent, compliance, culture, recruiting automation, and more.",
      ctaPrimary: "Start AI Diagnosis",
      ctaSecondary: "See Our Services",
    },
    diagnostics: {
      title: "Live AI HR Strategy Diagnostic Sandbox",
      subtitle: "Describe the organizational challenge you're facing — AI will classify, analyze, and produce an actionable plan in real time.",
      placeholder: "e.g. We're scaling fast, but can't fill key roles with the right people...",
      submit: "Run Diagnosis",
      submitting: "Analyzing…",
      streamingLabel: "AI is analyzing in real time…",
      copy: "Copy",
      copied: "Copied ✓",
      errorFallback: "Something went wrong. Please try again.",
      tapHint: "Tap a tag below to auto-fill an example question",
    },
    services: {
      title: "9 HR Strategy & Automation Domains",
      subtitle: "From workforce strategy to compensation design, the AI diagnostic engine covers the full organizational lifecycle.",
      learnMore: "Learn More",
      collapse: "Collapse",
      methodologyHeading: "Key Components & Methodology",
      deliverablesHeading: "Deliverables",
      metricLabel: "Metric",
    },
    contact: {
      title: "Book a Strategy Consultation",
      subtitle: "Leave your contact details and we'll follow up with a 1:1 strategy session based on your AI diagnosis.",
      name: "Name",
      email: "Work Email",
      company: "Company",
      message: "Brief description of your HR challenge (auto-filled after running the AI diagnosis above)",
      submit: "Submit Request",
      success: "Thanks — we've received your request and will be in touch shortly.",
    },
    footer: "Powered by Google Gemini.",
    langToggleLabel: "Switch language",
  },
};
