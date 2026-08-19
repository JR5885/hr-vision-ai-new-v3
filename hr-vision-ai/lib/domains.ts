export type DomainColor = "blue" | "red" | "yellow" | "green";

export interface Domain {
  id: number;
  zh: string;
  en: string;
  zhDesc: string;
  enDesc: string;
  zhPrompt: string;
  enPrompt: string;
  icon: string;
  color: DomainColor;
}

export const DOMAINS: Domain[] = [
  {
    id: 1,
    zh: "人才戰略配置規劃",
    en: "Strategic Workforce Planning",
    zhDesc: "結合業務路線圖進行人才供需預測、職能缺口分析、產能模型建構。",
    enDesc: "Demand/supply forecasting, skills-gap analysis, and capacity modeling tied to the business roadmap.",
    zhPrompt: "我們計畫明年擴編 30%，但不確定該如何依據業務路線圖規劃人才配置與預算。",
    enPrompt: "We're planning to grow headcount by 30% next year, but aren't sure how to align workforce planning with the business roadmap and budget.",
    icon: "🧭",
    color: "blue",
  },
  {
    id: 2,
    zh: "全球員工關係與合規",
    en: "Global Employee Relations & Compliance",
    zhDesc: "多國勞動法規合規、遠距工作治理、跨國勞動合同風險管理、勞資爭議處理。",
    enDesc: "Multi-country labor compliance, remote-work governance, cross-border contract risk, and dispute resolution.",
    zhPrompt: "我們正在多個國家擴展團隊，但對當地勞動法規和遠距工作合規不太確定，擔心踩雷。",
    enPrompt: "We're expanding into multiple countries and aren't confident we're compliant with local labor law and remote-work regulations.",
    icon: "🌐",
    color: "red",
  },
  {
    id: 3,
    zh: "晉升與留才－人才盤點和人才梯隊",
    en: "Talent Review & Succession Planning",
    zhDesc: "九宮格人才矩陣校準、關鍵職位繼任深度、高潛力人才留任與職涯路徑規劃。",
    enDesc: "9-box calibration, critical-role succession depth, and HiPo retention & career pathing.",
    zhPrompt: "幾位關鍵職位的員工最近考慮離職，我們的人才梯隊和繼任計畫幾乎是空白。",
    enPrompt: "Several employees in critical roles are considering leaving, and we barely have a succession plan in place.",
    icon: "📈",
    color: "yellow",
  },
  {
    id: 4,
    zh: "組織文化建設",
    en: "Organizational Culture Building",
    zhDesc: "核心價值觀落地、文化脈動調查、混合/遠距團隊凝聚力、行為指標設計。",
    enDesc: "Values activation, culture pulse surveys, hybrid-team cohesion, and behavioral competency design.",
    zhPrompt: "混合辦公之後，團隊向心力明顯下降，價值觀也感覺越來越難落地。",
    enPrompt: "Since moving to hybrid work, team cohesion has dropped and our values feel harder to reinforce.",
    icon: "🌱",
    color: "green",
  },
  {
    id: 5,
    zh: "自動化招聘 Dashboard",
    en: "Automated Recruitment Dashboard",
    zhDesc: "ATS 數據指標追蹤、到職時間、獲客/招募成本、AI 篩選管道數據分析。",
    enDesc: "ATS metric tracking, time-to-hire, cost-per-hire, and AI sourcing-funnel analytics.",
    zhPrompt: "招聘數據分散在好幾個系統裡，我們很難追蹤到職時間和招募成本。",
    enPrompt: "Our recruiting data is scattered across systems, making it hard to track time-to-hire and cost-per-hire.",
    icon: "📊",
    color: "blue",
  },
  {
    id: 6,
    zh: "合同處理自動化",
    en: "Contract Processing Automation",
    zhDesc: "電子簽章工作流整合、聘僱合約自動生成、合約條款風險自動評估。",
    enDesc: "E-signature workflow integration, auto-generated offer contracts, and automated clause risk review.",
    zhPrompt: "合約都是人工處理，簽核流程慢，條款風險也常常到很後期才發現。",
    enPrompt: "Contracts are all handled manually — signing is slow and clause risks often surface too late.",
    icon: "📝",
    color: "red",
  },
  {
    id: 7,
    zh: "HRBP 對業務主管的教練式領導與支持",
    en: "HRBP Executive Coaching",
    zhDesc: "HRBP 戰略賦能、一對一教練式引導框架、主管管理反饋機制。",
    enDesc: "HRBP strategic enablement, 1:1 coaching frameworks, and manager feedback loops.",
    zhPrompt: "HRBP 團隊常常被業務主管當作行政窗口，很難真正發揮策略教練的角色。",
    enPrompt: "Our HRBPs keep getting treated as administrative support instead of strategic coaches for business leaders.",
    icon: "🤝",
    color: "yellow",
  },
  {
    id: 8,
    zh: "跨部門高效會議和衝突解決",
    en: "Cross-Departmental Efficiency & Conflict Resolution",
    zhDesc: "會議節奏與 RACI 權責劃分、跨部門 SLA 建立、結構化衝突解決框架。",
    enDesc: "Meeting cadence & RACI, cross-functional SLAs, and structured conflict-resolution frameworks.",
    zhPrompt: "跨部門會議又多又沒結論，部門之間常常互相踢皮球。",
    enPrompt: "Cross-department meetings pile up without resolution, and teams keep passing the blame.",
    icon: "🔄",
    color: "green",
  },
  {
    id: 9,
    zh: "OKR 和季獎金設計",
    en: "OKRs & Quarterly Bonus Design",
    zhDesc: "OKR 展陸與層疊、變動薪酬公式設計、績效與獎金對齊機制。",
    enDesc: "OKR cascading, variable-pay formula design, and performance-to-reward alignment.",
    zhPrompt: "OKR 每季都在補作業，也很難跟獎金掛勾，激勵效果不明顯。",
    enPrompt: "Our OKRs turn into last-minute paperwork each quarter and barely connect to bonus payouts.",
    icon: "🎯",
    color: "blue",
  },
];

export const DOMAIN_COLOR_CLASSES: Record<DomainColor, { bg: string; text: string; ring: string; dot: string }> = {
  blue: { bg: "bg-google-blue/10", text: "text-google-blue", ring: "ring-google-blue", dot: "bg-google-blue" },
  red: { bg: "bg-google-red/10", text: "text-google-red", ring: "ring-google-red", dot: "bg-google-red" },
  yellow: { bg: "bg-google-yellow/10", text: "text-[#B06000]", ring: "ring-google-yellow", dot: "bg-google-yellow" },
  green: { bg: "bg-google-green/10", text: "text-google-green", ring: "ring-google-green", dot: "bg-google-green" },
};
