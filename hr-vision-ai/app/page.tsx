'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [quota, setQuota] = useState(3);
  const [customKey, setCustomKey] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('mid'); // junior (1-3y), mid (3-6y), senior (6y+)
  const [inputMessage, setInputMessage] = useState('');
  const [sandboxInput, setSandboxInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  // 預約諮詢表單
  const [formData, setFormData] = useState({ name: '', email: '', company: '', challenge: '' });

  // 多輪對話歷史紀錄
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '你好！我是你的 HRBP 14天躍升教練。在對話中，系統將依據您的年資深度（初級/中級/高級）自適應推進，拆解業務偽需求並產出主管可簽核之落地方案。\n\n請在下方沙盒輸入您面臨的具體組織難題，或直接選擇領域標籤開始診斷！'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const DEFAULT_KEY = "YOUR_FALLBACK_FREE_GEMINI_KEY";

  // 9 大 HR 戰略與自動化領域資料
  const domains = [
    {
      icon: '🧭',
      title: '人才戰略配置規劃',
      en: 'Strategic Workforce Planning',
      desc: '結合業務路線圖進行人才需求預測、職能缺口分析、產能模型建構。',
      detail: '包含 HC 編制動態測算、關鍵職位勝任力模型對齊、外部人才地圖繪製與 3 年期人效產出推演。'
    },
    {
      icon: '🌐',
      title: '全球員工關係與合規',
      en: 'Global Employee Relations & Compliance',
      desc: '多國勞動法規合規、遠距工作治理、跨國勞動合同風險管理、勞資爭議處理。',
      detail: '涵蓋跨境僱傭 EOR 模式評估、遠距工時監控合規、競業禁止與資遣解僱法務閉環設計。'
    },
    {
      icon: '📈',
      title: '晉升與留才－人才盤點和人才梯隊',
      en: 'Talent Review & Succession Planning',
      desc: '九宮格人才矩陣校準、關鍵職位繼任深度、高潛力人才留任與職涯路徑規劃。',
      detail: '避免主觀印象打分，引導業務主管將 High-Po 人才與關鍵業務戰略專案直接掛鉤。'
    },
    {
      icon: '🌱',
      title: '組織文化建設',
      en: 'Organizational Culture Building',
      desc: '核心價值觀落地、文化脈動調查、混合/遠距團隊凝聚力、行為指標設計。',
      detail: '將抽象價值觀具象化為日常考核行為項（Behavioral Anchors），並建立文化吹哨與認同機制。'
    },
    {
      icon: '📊',
      title: '自動化招聘 Dashboard',
      en: 'Automated Recruitment Dashboard',
      desc: 'ATS 數據指標追蹤、到職時間、獲客/招募成本、AI 篩選管道數據分析。',
      detail: '即時監控 Time-to-Hire、Offer 接受率、履歷漏斗轉換率與獵頭 ROI 成本效益比。'
    },
    {
      icon: '📝',
      title: '合同處理自動化',
      en: 'Contract Processing Automation',
      desc: '電子簽章工作流整合、聘僱合約自動生成、合約條款風險自動評估。',
      detail: '整合 DocuSign/Adobe Sign 工作流，自動校驗競業協議與保密協議（NDA）條款漏洞。'
    },
    {
      icon: '🤝',
      title: 'HRBP 對業務主管的教練式領導與支持',
      en: 'HRBP Executive Coaching',
      desc: 'HRBP 戰略賦能、一對一教練式引導框架、主管管理反饋機制。',
      detail: '運用 GROW 模型引導主管自覺管理瓶頸，建立三方會談與業務復盤（After Action Review）常態。'
    },
    {
      icon: '🔄',
      title: '跨部門高效會議和衝突解決',
      en: 'Cross-Departmental Efficiency & Conflict Resolution',
      desc: '會議節奏與 RACI 權責劃分、跨部門 SLA 建立、結構化衝突解決框架。',
      detail: '建立跨部門交付標準協議，導入雙贏談判協商法，排除灰色地帶推諉問題。'
    },
    {
      icon: '🎯',
      title: 'OKR 和季獎金設計',
      en: 'OKRs & Quarterly Bonus Design',
      desc: 'OKR 展階與層疊、變動薪酬公式設計、績效與獎金對齊機制。',
      detail: '設計非線性激勵階梯，將團隊 OKR 突破性目標與季獎金池聯動，兼顧合規與激勵力度。'
    }
  ];

  // 14 天修煉模組清單
  const curriculumDays = [
    "D1 業務痛點解構", "D2 六盒組織診斷", "D3 動態人才盤點", "D4 九宮格校準會",
    "D5 關鍵崗位繼任", "D6 激勵與績效改進", "D7 OKR 與業務對齊", "D8 跨部門衝突協商",
    "D9 招募漏斗與人效", "D10 核心文化落地", "D11 勞資法規防禦", "D12 主管教練式對話",
    "D13 戰略提案 Deck", "D14 落地執行閉環"
  ];

  // 配額與本地紀錄初始化
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('hr_quota_date');
    const storedKey = localStorage.getItem('hr_custom_api_key') || '';
    setCustomKey(storedKey);

    if (storedKey.length > 10) {
      setQuota(9999);
    } else {
      if (storedDate !== today) {
        localStorage.setItem('hr_quota_date', today);
        localStorage.setItem('hr_quota_count', '3');
        setQuota(3);
      } else {
        setQuota(parseInt(localStorage.getItem('hr_quota_count') || '3', 10));
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveKey = () => {
    if (!customKey.trim()) return;
    localStorage.setItem('hr_custom_api_key', customKey.trim());
    setQuota(9999);
    setShowKeyModal(false);
    alert('已成功儲存！已解鎖無限深度對話模式。');
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputMessage || sandboxInput;
    if (!textToSend.trim()) return;

    if (quota <= 0) {
      alert('今日 3 次免費深度對話額度已用完！請明天再次回訪解鎖下一天修煉，或點擊右上角「自備 Key」解鎖無限推演。');
      return;
    }

    setInputMessage('');
    setSandboxInput('');
    const newMessages = [...messages, { role: 'user', text: textToSend.trim() }];
    setMessages(newMessages);

    // 自動同步填入預約諮詢表單
    setFormData(prev => ({ ...prev, challenge: `【AI 診斷議題】\n${textToSend.trim()}` }));

    if (quota < 999) {
      const nextQuota = quota - 1;
      setQuota(nextQuota);
      localStorage.setItem('hr_quota_count', nextQuota.toString());
    }

    setIsLoading(true);
    const activeKey = customKey || DEFAULT_KEY;

    const tierPromptMap: Record<string, string> = {
      junior: '初級 HRBP (1-3年)：著重引導其看懂業務數據（P&L、人效、留存率），跳脫被動接單與行政思維。',
      mid: '中級 HRBP (3-6年)：著重組織診斷（六盒模型/7S）、人才盤點校準會引導與短中長落地策略。',
      senior: '高級/專家 HRBP (6年以上)：著重戰略解碼、變革管理（Change Management）與頂層激勵機制重塑。'
    };

    const systemPrompt = `你是一位擁有 15+ 年經驗的資深 HRVP / 戰略顧問，擔任使用者的「14天 HRBP 實戰修煉教練」。
目前使用者設定之 HR 年資維度：【${tierPromptMap[selectedExperience]}】。
對話與輸出規範：
1. 嚴禁直接給予通篇死板的公版模板。
2. 採用蘇格拉底式提問法：先指出業務痛點背後的真偽需求，並提出 1-2 個關鍵數據指標追問。
3. 循序漸進引導出可供業務主管直接簽核之【短線降火、中線賦能、長線機制】方案。
4. 結尾鼓勵用戶在實際工作中驗證，並提示明日繼續下一階段推演。`;

    try {
      const historyContents = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: historyContents
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0].content) {
        const reply = data.candidates[0].content.parts[0].text;
        setMessages([...newMessages, { role: 'ai', text: reply }]);
      } else {
        setMessages([...newMessages, { role: 'ai', text: '對話處理遇到問題。若您使用的是預設配額，可於右上角設定自備的免費 Gemini Key 獲得穩定連線。' }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'ai', text: '網路連線異常，請稍後重試。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitBooking = () => {
    if (!formData.name || !formData.email) {
      alert('請填寫姓名與信箱以便我們聯繫您！');
      return;
    }
    alert(`預約已送出！\n\n感謝 ${formData.name}，我們將根據本次 AI 診斷結果為您安排一對一戰略諮詢。`);
    setFormData({ name: '', email: '', company: '', challenge: '' });
  };

  return (
    <div style={{ backgroundColor: '#fcfcfd', minHeight: '100vh', color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 頂部導覽列 */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '0.85rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ✦ HR Vision AI
            </span>
            <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
              14天 HRBP 實戰工作台
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem' }}>
            <a href="#diagnostics" style={{ textDecoration: 'none', color: '#64748b' }}>AI 診斷</a>
            <a href="#domains" style={{ textDecoration: 'none', color: '#64748b' }}>服務領域</a>
            <a href="#booking" style={{ textDecoration: 'none', color: '#64748b' }}>預約諮詢</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: quota === 0 ? '#ef4444' : '#2563eb', fontWeight: 700 }}>
                {quota >= 999 ? '✨ 無限暢聊' : `今日額度：${quota} / 3`}
              </span>
              <button 
                onClick={() => setShowKeyModal(true)}
                style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                自備 Key
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* 原版 Hero 區塊 */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 2rem', maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', color: '#475569', marginBottom: '1.25rem' }}>
          <span style={{ color: '#16a34a' }}>●</span> Powered by Google Gemini
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.75rem' }}>
          15+ 年資深 HRBP 經驗 x 生成式 AI 賦能<br />
          <span style={{ background: 'linear-gradient(90deg, #2563eb, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            全方位組織升級
          </span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          即時輸入您的組織痛點，AI 戰略顧問將針對人才、合規、文化、招聘自動化等 9 大 HR 領域，提供深度剖析與可落地行動方案。
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="#diagnostics" style={{ background: '#2563eb', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            開始 AI 診斷
          </a>
          <a href="#domains" style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#334155', padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            了解服務內容
          </a>
        </div>
      </section>

      {/* 14 天修煉進度地圖 */}
      <div style={{ maxWidth: '1240px', margin: '0 auto 2rem', padding: '0 1rem' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>🎯 14天修煉地圖：</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {curriculumDays.map((day, idx) => (
              <span key={idx} style={{
                fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap',
                background: idx === 0 ? '#2563eb' : '#f1f5f9',
                color: idx === 0 ? '#fff' : '#64748b',
                fontWeight: idx === 0 ? 700 : 500
              }}>
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 核心雙欄：左側沙盒與對話 / 右側預約諮詢表單 */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* 左側主互動區 */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 動態 AI HR 戰略診斷沙盒 */}
          <section id="diagnostics" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>動態 AI HR 戰略診斷沙盒</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              描述您正面臨的組織挑戰，AI 將即時歸類、剖析並產出可落地的行動方案。
            </p>

            {/* HR 年資客製化切換器 */}
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', marginBottom: '1.5rem', gap: '0.25rem' }}>
              <button 
                onClick={() => setSelectedExperience('junior')}
                style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', background: selectedExperience === 'junior' ? '#fff' : 'transparent', color: selectedExperience === 'junior' ? '#2563eb' : '#64748b', fontWeight: selectedExperience === 'junior' ? 700 : 500 }}>
                初級 (1–3年)
              </button>
              <button 
                onClick={() => setSelectedExperience('mid')}
                style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', background: selectedExperience === 'mid' ? '#fff' : 'transparent', color: selectedExperience === 'mid' ? '#2563eb' : '#64748b', fontWeight: selectedExperience === 'mid' ? 700 : 500 }}>
                中級 (3–6年)
              </button>
              <button 
                onClick={() => setSelectedExperience('senior')}
                style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', background: selectedExperience === 'senior' ? '#fff' : 'transparent', color: selectedExperience === 'senior' ? '#2563eb' : '#64748b', fontWeight: selectedExperience === 'senior' ? 700 : 500 }}>
                高級/戰略夥伴 (6年以上)
              </button>
            </div>

            {/* 輸入搜尋欄 */}
            <div style={{ display: 'flex', maxWidth: '720px', margin: '0 auto', background: '#f8fafc', borderRadius: '50px', padding: '0.4rem 0.5rem 0.4rem 1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '1.1rem', marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>🔍</span>
              <input 
                type="text" 
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(sandboxInput)}
                placeholder="例如：團隊擴編快，但關鍵職位一直找不到合適的人選......"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem' }}
              />
              <button 
                onClick={() => handleSendMessage(sandboxInput)}
                disabled={!sandboxInput.trim() || isLoading}
                style={{ background: sandboxInput.trim() ? '#2563eb' : '#cbd5e1', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '50px', fontWeight: 600, cursor: sandboxInput.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                開始診斷
              </button>
            </div>

            {/* 快速問題標籤 */}
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '1.5rem 0 0.75rem' }}>點選下方標籤，快速帶入範例問題</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', maxWidth: '750px', margin: '0 auto' }}>
              {domains.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setSandboxInput(`我想探討關於【${item.title}】的挑戰，請協助分析。`);
                    handleSendMessage(`我想探討關於【${item.title}】的挑戰，請協助分析。`);
                  }}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '0.4rem 0.85rem', borderRadius: '50px', fontSize: '0.825rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <span>{item.icon}</span> {item.title}
                </button>
              ))}
            </div>
          </section>

          {/* 連續對話結果呈現區 */}
          <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', height: '480px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{
                  maxWidth: '85%', padding: '0.85rem 1.1rem', borderRadius: '10px', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#2563eb' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#1e293b',
                  border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div style={{ maxWidth: '85%', padding: '0.85rem 1.1rem', borderRadius: '10px', fontSize: '0.9rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  AI 教練正在結合年資段位推導中...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', background: '#fff' }}>
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="請補充更多情境或回覆 AI 的追問..." 
                style={{ flex: 1, padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                推進
              </button>
            </div>
          </section>

          {/* 9 大 HR 戰略與自動化領域（原版卡片） */}
          <section id="domains" style={{ marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>9 大 HR 戰略與自動化領域</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>從人才策略到薪酬設計，AI 診斷引擎覆蓋組織全生命週期的核心議題。</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {domains.map((item, index) => (
                <div key={index} style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                }}>
                  <div>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{item.en}</p>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>{item.desc}</p>
                    {selectedDomain === item.title && (
                      <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af', marginBottom: '1rem', borderLeft: '3px solid #2563eb' }}>
                        {item.detail}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setSelectedDomain(selectedDomain === item.title ? null : item.title)}
                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}>
                      {selectedDomain === item.title ? '收起詳情 ▲' : '查看詳情 ▼'}
                    </button>
                    <button 
                      onClick={() => {
                        setSandboxInput(`我想探討關於【${item.title}】的挑戰，請協助分析。`);
                        handleSendMessage(`我想探討關於【${item.title}】的挑戰，請協助分析。`);
                      }}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', background: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 600 }}>
                      帶入診斷
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AdSense 合規文章庫（長文豐富度確保） */}
          <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '0.75rem' }}>HRBP 14 天段位躍升方法論架構</h2>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              許多人資轉型為 HRBP（Human Resource Business Partner）後，容易陷入「高級行政」或被動接單的困局。本平台基於 Dave Ulrich 戰略人資模型與敏捷組織診斷法，協助學員在 14 天內透過多輪場景推演，將業務痛點轉化為高落地性的具體行動方案。
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
              <li><strong>業務真偽需求拆解：</strong>辨識業務主管是否將「業績下滑」單純歸因為「招募不力」。</li>
              <li><strong>數據化歸因推演：</strong>運用人效產出、離職週期分析取代主觀推論。</li>
              <li><strong>三層行動閉環：</strong>提供包含「短線降火、中線賦能、長線機制」的完整架構。</li>
            </ul>
          </article>
        </main>

        {/* 右側側邊欄：預約診斷諮詢表單 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div id="booking" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', position: 'sticky', top: '5.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>預約診斷諮詢</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              留下您的聯絡資訊，我們將依據 AI 診斷結果，為您安排一對一戰略諮詢。
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="姓名" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ flex: 1, padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                />
                <input 
                  type="email" 
                  placeholder="公司信箱" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ flex: 1, padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <input 
                type="text" 
                placeholder="公司名稱" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
              <textarea 
                placeholder="您的 HR 挑戰簡述（完成上方 AI 診斷後將自動帶入分析摘要）"
                value={formData.challenge}
                onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                style={{ width: '100%', height: '110px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button 
                onClick={submitBooking}
                style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.25rem', transition: 'background 0.2s' }}>
                送出預約
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* BYOK 自備 Key 彈窗 Modal */}
      {showKeyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', width: '90%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>🔑 設定個人 Gemini API Key</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.4 }}>
              輸入個人免費 API Key 可解鎖無限暢聊模式。金鑰僅儲存於本地瀏覽器，不會上傳伺服器。
            </p>
            <input 
              type="password" 
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="貼上 AI Studio 取得的 API Key"
              style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowKeyModal(false)} style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>取消</button>
              <button onClick={handleSaveKey} style={{ flex: 1, padding: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>儲存解鎖</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#2563eb' }}>點此 1 分鐘免費領取官方 Key</a>
            </div>
          </div>
        </div>
      )}

      {/* 頁尾 */}
      <footer style={{ borderTop: '1px solid #e2e8f0', marginTop: '4rem', padding: '2rem 1rem', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', background: '#fff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>&copy; 2026 HR Vision AI. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a href="#diagnostics" style={{ color: '#64748b', textDecoration: 'none' }}>AI 診斷</a>
            <a href="#domains" style={{ color: '#64748b', textDecoration: 'none' }}>服務領域</a>
            <a href="mailto:support@yourdomain.com" style={{ color: '#64748b', textDecoration: 'none' }}>聯絡我們</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
