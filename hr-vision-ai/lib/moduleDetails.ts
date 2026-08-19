export interface MethodologyPoint {
  label: string;
  text: string;
}

export interface SubPage {
  title: string;
  overview: string;
  methodology: MethodologyPoint[];
  deliverables: string[];
  metric: string;
}

export interface ModuleDetail {
  subpages: [SubPage, SubPage];
}

type Lang = "zh" | "en";

export const MODULE_DETAILS: Record<number, Record<Lang, ModuleDetail>> = {
  1: {
    en: {
      subpages: [
        {
          title: "Talent Supply-Demand Forecasting & Gap Analysis",
          overview:
            "Align organizational growth trajectories with future headcount needs by translating strategic business roadmaps into precise workforce requirements.",
          methodology: [
            { label: "Business Roadmap Integration", text: "Align 1–3 year revenue and expansion projections with team capacity metrics." },
            { label: "Demand Forecasting Models", text: "Utilize trend analysis, workload driver analysis, and historical attrition rates to forecast required FTEs by department." },
            { label: "Competency & Skill Gap Identification", text: "Evaluate existing workforce capabilities against required future skill sets (e.g., AI adoption, cross-border sales)." },
            { label: "Gap Mitigation Strategy", text: "Categorize findings into Buy (recruit), Build (upskill/reskill), Borrow (contractors/consultants), or Bot (automation)." },
          ],
          deliverables: [
            "Rolling 12-Month Headcount & Skill Capacity Matrix.",
            "Skill Gap Analysis Report with prioritized hiring and training roadmaps.",
          ],
          metric: "Forecast Accuracy Rate (Target: >90%)",
        },
        {
          title: "Productivity Modeling & Workload Capacity",
          overview:
            "Establish scalable capacity models to optimize organizational efficiency and determine exact staffing triggers based on operational volume.",
          methodology: [
            { label: "Capacity Driver Mapping", text: "Identify core business metrics driving workload (e.g., active clients per CSM, tickets per support agent, ARR per AE)." },
            { label: "Process Efficiency Benchmarking", text: "Measure current baseline throughput per FTE across critical workflows." },
            { label: "Scenario Planning & Modeling", text: "Build dynamic financial and headcount models for aggressive growth, steady-state, and lean operating scenarios." },
            { label: "Role Redundancy & Automation Identification", text: "Pinpoint operational bottlenecks that can be streamlined before expanding headcount." },
          ],
          deliverables: [
            "Interactive Workload Capacity & Headcount Calculator.",
            "Strategic Productivity Benchmarking Framework.",
          ],
          metric: "Revenue per Employee (Target: Annual growth of +15%)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "人才供需預測與缺口分析",
          overview: "將策略性業務路線圖轉化為精準的人力需求，使組織成長軌跡與未來編制需求緊密對齊。",
          methodology: [
            { label: "業務路線圖整合", text: "將 1–3 年營收與擴張預測，對應到團隊產能指標。" },
            { label: "需求預測模型", text: "運用趨勢分析、工作量驅動因子分析與歷史離職率，預測各部門所需全職員工人數（FTE）。" },
            { label: "職能與技能缺口辨識", text: "評估現有人力能力與未來所需技能（如 AI 導入、跨境銷售）之間的落差。" },
            { label: "缺口因應策略", text: "將發現的缺口歸類為「Buy 招募」、「Build 培育／再培訓」、「Borrow 外部承包商／顧問」或「Bot 自動化」。" },
          ],
          deliverables: [
            "滾動式 12 個月編制與技能產能矩陣。",
            "附優先招募與培訓路線圖的技能缺口分析報告。",
          ],
          metric: "預測準確率（目標：>90%）",
        },
        {
          title: "生產力建模與工作量產能規劃",
          overview: "建立可擴展的產能模型，依實際營運量精準判定招募時機，優化組織效率。",
          methodology: [
            { label: "產能驅動因子對應", text: "辨識驅動工作量的核心業務指標（如每位客戶成功經理服務的活躍客戶數、每位客服人員處理的工單數、每位業務代表的年度經常性收入 ARR）。" },
            { label: "流程效率基準測試", text: "衡量各關鍵流程目前每位員工的基準產出。" },
            { label: "情境規劃與建模", text: "建立涵蓋積極擴張、穩定維持與精簡營運等情境的動態財務與編制模型。" },
            { label: "角色重疊與自動化辨識", text: "在擴編前，先找出可透過流程優化解決的營運瓶頸。" },
          ],
          deliverables: [
            "互動式工作量產能與編制計算器。",
            "策略性生產力基準框架。",
          ],
          metric: "人均產值（目標：年成長 +15%）",
        },
      ],
    },
  },
  2: {
    en: {
      subpages: [
        {
          title: "Multi-Jurisdictional Labor Compliance & Remote Governance",
          overview:
            "Mitigate legal risk across international entities and remote teams while maintaining a unified, fair global employment standard.",
          methodology: [
            { label: "Global Labor Law Audit", text: "Continuous tracking of employment regulations, minimum wage adjustments, mandatory benefits, and severance rules across operating regions." },
            { label: "Remote & Distributed Work Governance", text: "Policy creation covering dynamic work hours, intellectual property (IP) protection, data privacy (GDPR/CCPA), and home-office safety." },
            { label: "Employer of Record (EOR) & Entity Management", text: "Standardized criteria for choosing between direct entity setup vs. PEO/EOR providers during international expansion." },
          ],
          deliverables: [
            "Global Employee Handbook & Remote Work Policy Manual.",
            "Multi-Country Labor Risk Audit Scorecard.",
          ],
          metric: "Compliance Audit Pass Rate (Target: 100%)",
        },
        {
          title: "Cross-Border Contracts & Labor Dispute Management",
          overview: "Framework for structuring cross-border employment contracts and resolving labor disputes constructively and legally.",
          methodology: [
            { label: "Localized Employment Contracts", text: "Standardized template library for multi-country offer letters, non-disclosure agreements (NDAs), non-compete clauses, and IP assignment clauses." },
            { label: "Risk-Based Dispute Resolution Framework", text: "Early-intervention protocols for grievances, workplace investigations, and performance termination procedures." },
            { label: "Labor Union & Works Council Management", text: "Guidelines for constructive negotiation and compliance with local collective bargaining agreements." },
          ],
          deliverables: [
            "Cross-Border Contract Template & Risk Matrix.",
            "Standard Operating Procedure (SOP) for Workplace Investigations & Grievances.",
          ],
          metric: "Resolution Rate of Internal Grievances Prior to Legal Escalation (Target: >95%)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "多國勞動合規與遠距治理",
          overview: "降低跨國實體與遠距團隊的法律風險，同時維持統一、公平的全球僱用標準。",
          methodology: [
            { label: "全球勞動法規稽核", text: "持續追蹤各營運地區的僱用法規、最低薪資調整、法定福利與資遣規則。" },
            { label: "遠距與分散式工作治理", text: "制定涵蓋彈性工時、智慧財產權保護、資料隱私（GDPR／CCPA）與居家辦公安全的政策。" },
            { label: "名義雇主（EOR）與實體管理", text: "針對國際擴張時「自設實體」或「PEO／EOR 服務商」的選擇，建立標準化評估準則。" },
          ],
          deliverables: [
            "全球員工手冊與遠距工作政策指南。",
            "多國勞動風險稽核計分卡。",
          ],
          metric: "合規稽核通過率（目標：100%）",
        },
        {
          title: "跨境合約與勞資爭議管理",
          overview: "建立跨境僱用合約的架構框架，並以合法、建設性的方式處理勞資爭議。",
          methodology: [
            { label: "在地化僱用合約", text: "建立多國聘僱通知書、保密協議（NDA）、競業禁止條款與智財權轉讓條款的標準範本庫。" },
            { label: "風險導向爭議解決框架", text: "針對申訴、職場調查與績效資遣程序，訂定早期介入機制。" },
            { label: "工會與勞資會議管理", text: "提供與當地團體協約合規、進行建設性協商的指引。" },
          ],
          deliverables: [
            "跨境合約範本與風險矩陣。",
            "職場調查與申訴標準作業程序（SOP）。",
          ],
          metric: "法律升級前內部申訴解決率（目標：>95%）",
        },
      ],
    },
  },
  3: {
    en: {
      subpages: [
        {
          title: "9-Box Grid Calibration & Talent Assessment",
          overview:
            "Standardize performance and potential evaluations across all departments to identify key contributors and future leaders objectively and bias-free.",
          methodology: [
            { label: "Performance vs. Potential Matrix", text: "Framework for defining axis parameters—evaluating past performance deliverables against future leadership agility." },
            { label: "Calibration Workshop Facilitation", text: "Structured guidelines for HR and leadership to review ratings, minimize central tendency and recency bias, and align standards across units." },
            { label: "High-Potential (HiPo) Identification", text: "Specific criteria for mapping top talent into targeted accelerated growth programs." },
          ],
          deliverables: [
            "Company-Wide 9-Box Calibration Guide & Rating Rubric.",
            "Post-Calibration Talent Distribution Report.",
          ],
          metric: "Percentage of Calibration Consistency across Business Units (Target: >90%)",
        },
        {
          title: "Critical Position Succession Depth & Career Pathways",
          overview:
            "Build robust talent pipelines for mission-critical roles to safeguard business continuity and enhance retention through clear career progression.",
          methodology: [
            { label: "Critical Role Identification", text: "Mapping roles whose immediate vacancy would disrupt business operations or revenue." },
            { label: "Succession Pipeline Depth Analysis", text: "Assessing readiness levels for successors (Ready Now, Ready in 1–2 Years, Ready in 3+ Years)." },
            { label: "Retention & Career Development Plans (IDPs)", text: "Tailored development roadmaps, executive sponsorship, and retention packages for key talent." },
          ],
          deliverables: [
            "Executive & Key Position Succession Plan Dashboard.",
            "Individual Development Plan (IDP) Framework for High-Potentials.",
          ],
          metric: "Succession Bench Depth (Target: 2+ qualified candidates per critical role)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "九宮格人才矩陣校準與評估",
          overview: "統一各部門的績效與潛力評估標準，客觀、公正地辨識關鍵貢獻者與未來領導人才。",
          methodology: [
            { label: "績效與潛力矩陣", text: "建立座標軸定義框架——以過去績效產出評估對照未來領導敏捷度。" },
            { label: "校準工作坊引導", text: "提供 HR 與主管審視評分、降低集中趨勢與近因偏誤、統一各單位標準的結構化指引。" },
            { label: "高潛力人才（HiPo）辨識", text: "建立將頂尖人才導入加速成長計畫的具體篩選準則。" },
          ],
          deliverables: [
            "全公司九宮格校準指南與評分準則。",
            "校準後人才分布報告。",
          ],
          metric: "跨事業單位校準一致性比例（目標：>90%）",
        },
        {
          title: "關鍵職位繼任深度與職涯路徑",
          overview: "為關鍵任務職位建立穩健的人才梯隊，透過明確的職涯發展保障營運延續性並提升留任率。",
          methodology: [
            { label: "關鍵職位辨識", text: "找出一旦立即出缺將衝擊營運或營收的職位。" },
            { label: "繼任管線深度分析", text: "評估接班人選的準備程度（現在即可接任／1–2 年內可接任／3 年以上可接任）。" },
            { label: "留任與職涯發展計畫（IDP）", text: "為關鍵人才量身打造發展路線圖、高層贊助與留任方案。" },
          ],
          deliverables: [
            "高階與關鍵職位繼任計畫儀表板。",
            "高潛力人才個人發展計畫（IDP）框架。",
          ],
          metric: "繼任梯隊深度（目標：每個關鍵職位至少 2 位合格候選人）",
        },
      ],
    },
  },
  4: {
    en: {
      subpages: [
        {
          title: "Core Values Activation & Behavioral Indicators",
          overview: "Transform abstract cultural values into concrete daily behaviors, performance expectations, and decision-making criteria.",
          methodology: [
            { label: "Behavioral Indicator Definition", text: "Defining explicit \"What it looks like\" vs. \"What it doesn't look like\" behaviors for each core corporate value." },
            { label: "Performance Management Integration", text: "Embedding cultural behaviors into hiring rubrics, peer reviews, and performance evaluations." },
            { label: "Culture Recognition Framework", text: "Implementing peer-to-peer appreciation systems and leadership awards tied to organizational values." },
          ],
          deliverables: [
            "Organizational Core Values & Behavioral Rubric Manual.",
            "Culture Alignment Assessment Tool for Recruitment and Reviews.",
          ],
          metric: "Values Alignment Score on Annual Employee Survey (Target: >85%)",
        },
        {
          title: "Cultural Pulse Surveys & Hybrid/Remote Team Cohesion",
          overview: "Monitor organizational sentiment continuously and build engagement, trust, and alignment across distributed and hybrid teams.",
          methodology: [
            { label: "Pulse Survey Architecture", text: "Designing short, high-frequency pulse surveys to track eNPS (Employee Net Promoter Score) and team health." },
            { label: "Hybrid Team Engagement Protocols", text: "Best practices for asynchronous communication, virtual rituals, and quarterly team retreats." },
            { label: "Feedback Loop & Action Planning", text: "Standardized workflow for managers to review team pulse results and co-create action plans within 14 days." },
          ],
          deliverables: [
            "Quarterly Culture Pulse Survey Framework & Toolkit.",
            "Remote/Hybrid Team Engagement Playbook.",
          ],
          metric: "Employee Net Promoter Score (eNPS) (Target: +40 or higher)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "核心價值觀落地與行為指標",
          overview: "將抽象的文化價值觀轉化為具體的日常行為、績效期望與決策準則。",
          methodology: [
            { label: "行為指標定義", text: "為每項核心價值明確定義「符合的行為樣貌」與「不符合的行為樣貌」。" },
            { label: "績效管理整合", text: "將文化行為嵌入招募評分準則、同儕評核與績效考核中。" },
            { label: "文化表揚機制", text: "建立同儕互相肯定的機制，以及與組織價值觀掛鉤的主管表揚獎項。" },
          ],
          deliverables: [
            "組織核心價值與行為準則手冊。",
            "用於招募與考核的文化契合度評估工具。",
          ],
          metric: "年度員工調查文化契合度分數（目標：>85%）",
        },
        {
          title: "文化脈動調查與混合／遠距團隊凝聚力",
          overview: "持續監測組織氛圍，在分散式與混合辦公團隊中建立投入感、信任與一致性。",
          methodology: [
            { label: "脈動調查架構", text: "設計簡短、高頻率的脈動調查，追蹤員工淨推薦值（eNPS）與團隊健康度。" },
            { label: "混合團隊投入機制", text: "建立非同步溝通、虛擬儀式與季度團隊聚會的最佳實踐。" },
            { label: "回饋循環與行動規劃", text: "建立主管於 14 天內檢視團隊脈動結果並共同制定行動計畫的標準流程。" },
          ],
          deliverables: [
            "季度文化脈動調查框架與工具包。",
            "遠距／混合團隊投入行動手冊。",
          ],
          metric: "員工淨推薦值 eNPS（目標：+40 以上）",
        },
      ],
    },
  },
  5: {
    en: {
      subpages: [
        {
          title: "ATS Data Integration & Recruitment Pipeline Analytics",
          overview: "Centralize recruitment data streams into a single real-time dashboard to optimize sourcing efficiency and pipeline health.",
          methodology: [
            { label: "ATS Data Pipeline Integration", text: "Connecting Applicant Tracking System (ATS) data to measure candidate stage progression and drop-off rates." },
            { label: "Funnel Efficiency Tracking", text: "Monitoring conversion rates from Application → Screen → Technical Interview → Offer → Hire." },
            { label: "Role-Based Views", text: "Tailored dashboards for Recruiters, Hiring Managers, and Executives summarizing active requisitions." },
          ],
          deliverables: [
            "Automated Recruitment Funnel Dashboard Specification.",
            "Weekly Hiring Velocity & Pipeline Report Template.",
          ],
          metric: "Candidate Pass-Through Efficiency Rate & Offer Acceptance Rate (Target: >85%)",
        },
        {
          title: "Time-to-Hire, CAC, & AI Sourcing Channel Optimization",
          overview: "Apply data science and AI evaluation to lower Candidate Acquisition Costs (CAC), shorten hiring velocity, and boost channel ROI.",
          methodology: [
            { label: "Time-to-Hire & Time-to-Fill Analysis", text: "Tracking bottlenecks in candidate scheduling, assessment, and offer approval cycles." },
            { label: "Cost-Per-Hire & CAC Calculation", text: "Aggregating job board spending, agency fees, internal referral payouts, and recruitment tooling costs." },
            { label: "AI Channel Performance Evaluation", text: "Leveraging AI algorithms to score candidate quality by acquisition source (e.g., LinkedIn, inbound, referrals)." },
          ],
          deliverables: [
            "Recruitment Channel ROI & CAC Analysis Model.",
            "AI Sourcing Effectiveness Matrix.",
          ],
          metric: "Average Time-to-Hire (Target: <30 Days)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "ATS 數據整合與招聘管道分析",
          overview: "將招聘數據集中至單一即時儀表板，優化尋才效率與招聘管道健康度。",
          methodology: [
            { label: "ATS 數據管線整合", text: "串接應徵者追蹤系統（ATS）數據，衡量候選人各階段進展與流失率。" },
            { label: "漏斗轉換效率追蹤", text: "監測從「應徵→篩選→技術面試→發放 Offer→到職」各階段的轉換率。" },
            { label: "依角色客製化視圖", text: "為招募人員、用人主管與高階主管打造摘要現行職缺的專屬儀表板。" },
          ],
          deliverables: [
            "自動化招聘漏斗儀表板規格書。",
            "每週招募速度與管道週報範本。",
          ],
          metric: "候選人通過效率與 Offer 接受率（目標：>85%）",
        },
        {
          title: "到職時間、獲客成本與 AI 招募管道優化",
          overview: "運用數據科學與 AI 評估，降低候選人獲取成本（CAC）、縮短招募週期並提升管道投資報酬率。",
          methodology: [
            { label: "到職時間與職缺填補時間分析", text: "追蹤候選人排程、評估與 Offer 核准流程中的瓶頸。" },
            { label: "單位招募成本與 CAC 計算", text: "彙整職缺刊登費用、獵頭費用、內部推薦獎金與招募工具成本。" },
            { label: "AI 管道成效評估", text: "運用 AI 演算法依來源（如 LinkedIn、自然流量、內部推薦）評分候選人品質。" },
          ],
          deliverables: [
            "招募管道投資報酬率與 CAC 分析模型。",
            "AI 尋才成效矩陣。",
          ],
          metric: "平均到職時間（目標：<30 天）",
        },
      ],
    },
  },
  6: {
    en: {
      subpages: [
        {
          title: "E-Signature Workflow Integration & Offer Generation",
          overview: "Automate the end-to-end contract generation and signature lifecycle to drastically reduce administrative overhead and accelerate onboarding.",
          methodology: [
            { label: "Dynamic Offer Letter Generation", text: "Auto-populating employment terms from the ATS/HRIS into legally compliant document templates." },
            { label: "E-Signature Workflow Orchestration", text: "Seamless integration with e-signature platforms (e.g., DocuSign, HelloSign) with automated tracking and reminders." },
            { label: "Candidate Onboarding Handoff", text: "Automatic trigger for IT provisioning and payroll setup upon digital signature completion." },
          ],
          deliverables: [
            "Automated Contract Generation & E-Signature Architecture.",
            "Standard Offer Letter & Employment Agreement Template Engine.",
          ],
          metric: "Contract Turnaround Time (Target: <24 Hours from approval)",
        },
        {
          title: "Automated Clause Risk Assessment & Compliance Guardrails",
          overview: "Embed automated compliance logic and legal risk indicators into contract templates to maintain audit readiness and manage non-standard terms.",
          methodology: [
            { label: "Clause Risk Engine", text: "Automatic flagging of non-standard contract modifications (e.g., non-compete duration, IP modifications, custom bonus terms)." },
            { label: "Approval Routing Matrix", text: "Rule-based routing of custom clauses to legal, finance, or HR leadership based on risk level." },
            { label: "Audit Trail & Contract Repository", text: "Centralized, encrypted storage of all executed contracts with expiration/renewal tracking." },
          ],
          deliverables: [
            "Contract Risk Matrix & Approval Escalation Hierarchy.",
            "Centralized Contract Repository Management Protocol.",
          ],
          metric: "Non-Standard Clause Exception Approval Time (Target: <12 Hours)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "電子簽章工作流整合與 Offer 產生",
          overview: "自動化合約產生與簽署全流程，大幅降低行政負擔並加速到職流程。",
          methodology: [
            { label: "動態聘僱通知書產生", text: "自動將 ATS／HRIS 中的聘僱條件套入合法合規的文件範本。" },
            { label: "電子簽章工作流編排", text: "無縫整合電子簽章平台（如 DocuSign、HelloSign），並自動追蹤與提醒。" },
            { label: "候選人到職交接", text: "於電子簽署完成後，自動觸發 IT 設備準備與薪資系統設定。" },
          ],
          deliverables: [
            "自動化合約產生與電子簽章架構。",
            "標準聘僱通知書與聘僱合約範本引擎。",
          ],
          metric: "合約產出時間（目標：核准後 <24 小時）",
        },
        {
          title: "自動化條款風險評估與合規防護",
          overview: "在合約範本中嵌入自動化合規邏輯與法律風險指標，維持稽核就緒狀態並管理非標準條款。",
          methodology: [
            { label: "條款風險引擎", text: "自動標記非標準合約修改內容（如競業禁止期限、智財權異動、客製化獎金條款）。" },
            { label: "核准路由矩陣", text: "依風險等級，以規則為基礎將客製條款導向法務、財務或 HR 主管審核。" },
            { label: "稽核軌跡與合約庫", text: "集中、加密儲存所有已簽署合約，並追蹤到期／續約狀態。" },
          ],
          deliverables: [
            "合約風險矩陣與核准升級層級。",
            "集中式合約庫管理規範。",
          ],
          metric: "非標準條款例外核准時間（目標：<12 小時）",
        },
      ],
    },
  },
  7: {
    en: {
      subpages: [
        {
          title: "Coaching Framework for Business Leaders",
          overview: "Empower HR Business Partners (HRBPs) to serve as strategic coaches to business managers, boosting team leadership capability and execution.",
          methodology: [
            { label: "Coaching Framework (GROW Model)", text: "Implementing Goal, Reality, Options, and Will structured coaching sessions for leadership development." },
            { label: "1-on-1 Leadership Enablement", text: "Equipping managers with tools for constructive 1-on-1s, performance feedback, and goal alignment." },
            { label: "Manager Capability Development", text: "Training business leads on empathetic leadership, change management, and team motivation." },
          ],
          deliverables: [
            "HRBP Coaching Toolkit & GROW Model Guide.",
            "Business Manager 1-on-1 & Feedback Playbook.",
          ],
          metric: "Manager Effectiveness Rating (Target: >85% favorable on 180-degree reviews)",
        },
        {
          title: "Upward & Peer Feedback Mechanisms",
          overview: "Build a continuous, psychological safety-oriented feedback loop for executives to improve manager-employee trust and organizational transparency.",
          methodology: [
            { label: "Structured Upward Feedback Surveys", text: "Bi-annual, anonymous upward feedback loops evaluating managers on support, clarity, and leadership." },
            { label: "Peer-to-Peer Review Architecture", text: "Cross-functional peer review mechanisms integrated into quarterly review cycles." },
            { label: "Leadership Debrief & Action Planning", text: "HRBP-guided debrief sessions to help managers act on feedback constructively." },
          ],
          deliverables: [
            "360/Upward Feedback Survey Protocol & Question Library.",
            "Leadership Feedback Action Planning Template.",
          ],
          metric: "Feedback Participation Rate & Manager Action Plan Completion (Target: 100%)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "業務主管教練式引導框架",
          overview: "賦能 HRBP 成為業務主管的策略教練，提升團隊領導能力與執行力。",
          methodology: [
            { label: "教練框架（GROW 模型）", text: "以目標（Goal）、現況（Reality）、選項（Options）、意願（Will）建構結構化的領導力發展教練對談。" },
            { label: "一對一領導賦能", text: "為主管提供建設性一對一會談、績效回饋與目標對齊的工具。" },
            { label: "主管能力發展", text: "培訓業務主管的同理式領導、變革管理與團隊激勵能力。" },
          ],
          deliverables: [
            "HRBP 教練工具包與 GROW 模型指南。",
            "業務主管一對一會談與回饋行動手冊。",
          ],
          metric: "主管效能評分（目標：180 度評核正向比例 >85%）",
        },
        {
          title: "向上與同儕回饋機制",
          overview: "為主管建立持續、具心理安全感的回饋循環，提升主管與員工間的信任與組織透明度。",
          methodology: [
            { label: "結構化向上回饋調查", text: "每半年進行一次匿名向上回饋，評估主管在支持度、清晰度與領導力上的表現。" },
            { label: "同儕互評架構", text: "將跨職能同儕互評機制納入季度考核循環。" },
            { label: "領導力回饋會談與行動規劃", text: "由 HRBP 引導的回饋會談，協助主管建設性地將回饋轉化為行動。" },
          ],
          deliverables: [
            "360 度／向上回饋調查流程與題庫。",
            "領導力回饋行動規劃範本。",
          ],
          metric: "回饋參與率與主管行動計畫完成率（目標：100%）",
        },
      ],
    },
  },
  8: {
    en: {
      subpages: [
        {
          title: "Cadence Design, RACI Matrix, & Cross-Functional SLAs",
          overview: "Streamline cross-departmental collaboration, eliminate operational ambiguity, and establish clear service level agreements between teams.",
          methodology: [
            { label: "Meeting Cadence Optimization", text: "Eliminating low-value meetings by establishing clear operational sync rhythms (Daily Standup, Weekly Ops, Monthly Business Review)." },
            { label: "RACI Framework Deployment", text: "Defining Responsible, Accountable, Consulted, and Informed roles for all cross-departmental projects." },
            { label: "Cross-Functional SLAs", text: "Setting explicit turn-around times and service expectations between departments (e.g., Tech vs. Sales, HR vs. Finance)." },
          ],
          deliverables: [
            "Cross-Departmental Meeting & Communication Governance Matrix.",
            "Departmental RACI & SLA Specification Document.",
          ],
          metric: "SLA Compliance Rate across Departments (Target: >90%)",
        },
        {
          title: "Structured Conflict Resolution & Escalation Framework",
          overview: "Construct a systematic, objective path for resolving cross-departmental friction and resource alignment deadlocks without damaging morale.",
          methodology: [
            { label: "Conflict Mapping & Root-Cause Analysis", text: "Tools for categorizing conflicts (process vs. priority vs. interpersonal) and identifying core blockages." },
            { label: "Tiered Escalation Matrix", text: "Clear step-by-step resolution pathway (Peer-to-Peer → Manager Alignment → Executive Steering Committee)." },
            { label: "Inter-departmental Retrospectives", text: "Facilitated post-mortem workshops following cross-functional conflicts or project delays." },
          ],
          deliverables: [
            "Cross-Functional Conflict Escalation SOP.",
            "Inter-Departmental Alignment & Post-Mortem Template.",
          ],
          metric: "Average Time to Resolve Escalated Cross-Departmental Blockers (Target: <48 Hours)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "會議節奏設計、RACI 矩陣與跨部門 SLA",
          overview: "簡化跨部門協作、消除營運模糊地帶，並在團隊之間建立明確的服務水準協議。",
          methodology: [
            { label: "會議節奏優化", text: "建立清楚的營運同步節奏（每日站會、每週營運會議、每月業務回顧），淘汰低價值會議。" },
            { label: "RACI 框架導入", text: "為所有跨部門專案定義負責（Responsible）、當責（Accountable）、諮詢（Consulted）、告知（Informed）角色。" },
            { label: "跨部門 SLA", text: "明確訂定部門間（如技術 vs. 業務、HR vs. 財務）的回應時效與服務期望。" },
          ],
          deliverables: [
            "跨部門會議與溝通治理矩陣。",
            "部門 RACI 與 SLA 規範文件。",
          ],
          metric: "各部門 SLA 達成率（目標：>90%）",
        },
        {
          title: "結構化衝突解決與升級框架",
          overview: "建立系統化、客觀的路徑，在不損及士氣的前提下化解跨部門摩擦與資源分配僵局。",
          methodology: [
            { label: "衝突對應與根因分析", text: "提供工具將衝突分類（流程面 vs. 優先順序面 vs. 人際面），並找出核心癥結。" },
            { label: "分級升級矩陣", text: "明確逐層解決路徑（同儕協商 → 主管對齊 → 高階督導委員會）。" },
            { label: "跨部門檢討會", text: "於跨部門衝突或專案延遲後，主持事後檢討工作坊。" },
          ],
          deliverables: [
            "跨部門衝突升級標準作業程序（SOP）。",
            "跨部門對齊與事後檢討範本。",
          ],
          metric: "升級案件平均解決時間（目標：<48 小時）",
        },
      ],
    },
  },
  9: {
    en: {
      subpages: [
        {
          title: "OKR Cascading & Alignment Framework",
          overview: "Cascade top-level strategic objectives into actionable department and individual Key Results, driving cross-company goal alignment.",
          methodology: [
            { label: "Strategic Objective Alignment", text: "Translating annual corporate vision into quarterly departmental Objectives and Key Results (OKRs)." },
            { label: "Cross-Functional OKR Dependency Mapping", text: "Ensuring dependent initiatives (e.g., Product launch dependencies on Marketing) are linked." },
            { label: "Weekly/Monthly OKR Check-In Cadence", text: "Standardizing sprint-based tracking to keep teams focused on measurable outcome metrics." },
          ],
          deliverables: [
            "Company-Wide OKR Cascading Playbook & Alignment Matrix.",
            "Quarterly OKR Check-In & Scoring Template.",
          ],
          metric: "OKR Achievement Rate (Target: 70–80% target attainment for stretch goals)",
        },
        {
          title: "Variable Compensation Formulas & Performance Alignment",
          overview: "Design fair, transparent variable bonus structures directly tied to individual, team, and company-wide OKR/KPI performance outcomes.",
          methodology: [
            { label: "Variable Compensation Formula Design", text: "Structuring dynamic bonus pools based on Company Multiplier × Team Weight × Individual Performance Score." },
            { label: "Performance-to-Reward Alignment", text: "Decoupling baseline compensation from OKRs while mapping exceptional OKR execution to variable bonus payouts." },
            { label: "Payout Thresholds & Cap Governance", text: "Establishing clear baseline triggers for bonus activation and financial upper bounds." },
          ],
          deliverables: [
            "Quarterly Bonus Formula & Variable Pay Calculation Model.",
            "Performance-to-Bonus Allocation Matrix.",
          ],
          metric: "Correlation between High Performers and Bonus Allocation (Target: >0.9 correlation coefficient)",
        },
      ],
    },
    zh: {
      subpages: [
        {
          title: "OKR 展開與對齊框架",
          overview: "將高層策略目標逐層展開為可執行的部門與個人關鍵成果，驅動全公司目標一致性。",
          methodology: [
            { label: "策略目標對齊", text: "將年度企業願景轉化為季度部門目標與關鍵成果（OKR）。" },
            { label: "跨部門 OKR 依存關係對應", text: "確保相互依存的專案（如產品上市對行銷的依賴）彼此連結。" },
            { label: "每週／每月 OKR 檢核節奏", text: "建立以衝刺週期為基礎的標準化追蹤機制，讓團隊聚焦可衡量的成果指標。" },
          ],
          deliverables: [
            "全公司 OKR 展開手冊與對齊矩陣。",
            "季度 OKR 檢核與評分範本。",
          ],
          metric: "OKR 達成率（目標：挑戰性目標達成 70–80%）",
        },
        {
          title: "變動薪酬公式與績效對齊",
          overview: "設計公平、透明的變動獎金結構，直接連結個人、團隊與全公司的 OKR／KPI 績效成果。",
          methodology: [
            { label: "變動薪酬公式設計", text: "以「公司乘數 × 團隊權重 × 個人績效分數」建構動態獎金池。" },
            { label: "績效與獎酬對齊", text: "將基本薪酬與 OKR 脫鉤，同時將卓越的 OKR 執行成果對應到變動獎金發放。" },
            { label: "發放門檻與上限治理", text: "建立獎金啟動的明確基準門檻與財務上限。" },
          ],
          deliverables: [
            "季度獎金公式與變動薪酬計算模型。",
            "績效與獎金分配矩陣。",
          ],
          metric: "高績效者與獎金分配之相關性（目標：相關係數 >0.9）",
        },
      ],
    },
  },
};
