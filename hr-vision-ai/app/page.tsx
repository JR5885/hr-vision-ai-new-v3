'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [quota, setQuota] = useState(3);
  const [customKey, setCustomKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [sandboxInput, setSandboxInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  
  // 預約表單狀態
  const [formData, setFormData] = useState({ name: '', email: '', company: '', challenge: '' });

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '你好！我是你的 HRBP 實戰躍升教練。在 14 天的修煉中，我們不給死板模板，而是透過多輪引導幫你產出主管可簽核的落地方案。\n\n請在上方沙盒輸入你目前面臨的具體業務難題，或直接在此告訴我：例如「業務主管業績下滑卻怪罪招募不力」？'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const DEFAULT_KEY = "YOUR_FALLBACK_FREE_GEMINI_KEY";

  // 9 大 HR 戰略領域資料
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
    if (!customKey.trim()) {
      alert('請輸入有效的 Gemini API Key');
      return;
    }
    localStorage.setItem('hr_custom_api_key', customKey.trim());
    setQuota(9999);
    alert('API Key 儲存成功！已解鎖無限深度對話模式。');
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputMessage || sandboxInput;
    if (!textToSend.trim()) return;
    if (quota <= 0) {
      alert('今日 3 次免費額度已用完！請於右側輸入個人免費 Gemini API Key 解鎖無限模式，或明日再次造訪。');
      return;
    }

    setInputMessage('');
    setSandboxInput('');
    const newMessages = [...messages, { role: 'user', text: textToSend.trim() }];
    setMessages(newMessages);

    // 將使用者問題自動帶入預約表單的挑戰簡述中
    setFormData(prev => ({ ...prev, challenge: `【AI 診斷議題】\n${textToSend.trim()}` }));

    if (quota < 999) {
      const nextQuota = quota - 1;
      setQuota(nextQuota);
      localStorage.setItem('hr_quota_count', nextQuota.toString());
    }

    setIsLoading(true);
    const activeKey = customKey || DEFAULT_KEY;

    const systemPrompt = `你是一位資深的 HRVP / 首席人才官，目前擔任使用者的「14天 HRBP 實戰躍升教練」。
請遵守以下對話規範：
1. 嚴禁直接給予通篇死板的公版模板。
2. 採用「蘇格拉底式提問法」：針對使用者的情境，先指出其盲點（例如：主管將業績問題偽裝成招募問題），並提出 1-2 個關鍵追問以釐清數據。
3. 循序漸進：引導使用者補足資訊後，在適當時機輸出包含「短線降火、中線賦能、長線機制」的結構化落地方案。
4. 語氣專業、務實、具備業務商業體感。`;

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
        setMessages([...newMessages, { role: 'ai', text: '對話處理遇到問題。建議於右側填入個人的免費 Gemini API Key 以獲得最穩定的體驗。' }]);
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
    alert(`預約已送出！\n\n感謝 ${formData.name} 的預約，我們的顧問會盡快透過 ${formData.email} 與您聯繫。`);
    setFormData({ name: '', email: '', company: '', challenge: '' });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#334155', fontFamily: 'sans-serif' }}>
      {/* 導覽列 */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.85rem 1.5rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>
            HR Vision AI <small style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>| 14天 HRBP 實戰修煉室</small>
          </span>
          <nav style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem' }}>
            <a href="#simulator" style={{ textDecoration: 'none', color: '#64748b' }}>實戰對話</a>
            <a href="#domains-section" style={{ textDecoration: 'none', color: '#64748b' }}>9 大 HR 領域</a>
            <a href="#frameworks" style={{ textDecoration: 'none', color: '#64748b' }}>方法論手冊</a>
            <a href="#about" style={{ textDecoration: 'none', color: '#64748b' }}>關於我們</a>
          </nav>
        </div>
      </header>

      {/* 核心雙欄佈局 */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        
        {/* 左側操作區 */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 進度與配額 */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>🎯 Day 1：業務痛點真偽需求辨識</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>今日目標：將主管抱怨轉化為具體業務數據指標</p>
            </div>
            <div style={{ background: quota >= 999 ? '#dcfce7' : '#fef3c7', color: quota >= 999 ? '#166534' : '#92400e', padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
              {quota >= 999 ? '✨ 已啟用自備 Key：無限暢聊模式' : `⚡ 今日免費對話額度：${quota} / 3`}
            </div>
          </div>

          {/* 動態 AI HR 戰略診斷沙盒 */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>動態 AI HR 戰略診斷沙盒</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>描述您正面臨的組織挑戰，AI 將即時歸類、剖析並產出可落地的行動方案。</p>
            
            <div style={{ display: 'flex', maxWidth: '700px', margin: '0 auto', background: '#f1f5f9', borderRadius: '50px', padding: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}>🔍</div>
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
                style={{ background: sandboxInput.trim() ? '#1d4ed8' : '#cbd5e1', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '50px', fontWeight: 600, cursor: sandboxInput.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
                開始診斷
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '1.5rem 0 0.75rem' }}>點選下方標籤，快速帶入範例問題</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', maxWidth: '750px', margin: '0 auto' }}>
              {domains.slice(0, 6).map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setSandboxInput(`我想探討關於【${item.title}】的挑戰，請協助分析。`);
                    handleSendMessage(`我想探討關於【${item.title}】的挑戰，請協助分析。`);
                  }}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span>{item.icon}</span> {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* 連續對話視窗 */}
          <div id="simulator" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', height: '480px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fafafa' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{
                  maxWidth: '85%', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.925rem', lineHeight: 1.55, whiteSpace: 'pre-wrap',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#1d4ed8' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#334155',
                  border: m.role === 'user' ? 'none' : '1px solid #e2e8f0'
                }}>
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div style={{ maxWidth: '85%', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.925rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  AI 教練正在結合業務場景推導中...
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
                placeholder="請描述業務情境或回覆 AI 的引導問題..." 
                style={{ flex: 1, padding: '0.65rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                發送推進
              </button>
            </div>
          </div>

          {/* 9 大 HR 戰略與自動化領域 */}
          <section id="domains-section" style={{ marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>9 大 HR 戰略與自動化領域</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>從人才策略到薪酬設計，AI 診斷引擎覆蓋組織全生命週期的核心議題。</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {domains.map((item, index) => (
                <div key={index} style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <div>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{item.en}</p>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>{item.desc}</p>
                    {selectedDomain === item.title && (
                      <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#1e40af', marginBottom: '1rem', borderLeft: '3px solid #1d4ed8' }}>
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
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', background: '#1d4ed8', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 600 }}>
                      帶入 AI 對話
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 右側側邊欄 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 預約診斷諮詢表單 (取代側邊廣告) */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>預約診斷諮詢</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>留下您的聯絡資訊，我們將依據 AI 診斷結果，為您安排一對一戰略諮詢。</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  placeholder="姓名" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ flex: 1, width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                />
                <input 
                  type="email" 
                  placeholder="公司信箱" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ flex: 1, width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <input 
                type="text" 
                placeholder="公司名稱" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
              />
              <textarea 
                placeholder="您的 HR 挑戰簡述（完成上方 AI 診斷後將自動帶入分析摘要）"
                value={formData.challenge}
                onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                style={{ width: '100%', height: '100px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem', resize: 'vertical' }}
              />
              <button 
                onClick={submitBooking}
                style={{ width: '100%', background: '#1d4ed8', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem', transition: 'background 0.2s' }}>
                送出預約
              </button>
            </div>
          </div>

          {/* BYOK 解鎖無限模式 */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.5rem' }}>🔑 解鎖無限對話模式 (BYOK)</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>輸入個人免費 Gemini API Key 即可永久無限制推演方案。</p>
            <input 
              type="password" 
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="貼上 Gemini API Key" 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', margin: '0.5rem 0', boxSizing: 'border-box' }}
            />
            <button onClick={handleSaveKey} style={{ width: '100%', background: '#0f172a', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
              儲存並解鎖無限模式
            </button>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.4 }}>
              * Key 僅儲存於本地瀏覽器。<br />
              * <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }}>點此 1 分鐘免費申請 Key</a>
            </div>
          </div>

        </aside>
      </div>

      {/* 頁尾 */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e2e8f0', marginTop: '3rem', padding: '2rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>&copy; 2026 HR Vision AI. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#about" style={{ color: '#64748b', textDecoration: 'none' }}>關於我們</a>
            <a href="#frameworks" style={{ color: '#64748b', textDecoration: 'none' }}>隱私權政策</a>
            <a href="mailto:support@yourdomain.com" style={{ color: '#64748b', textDecoration: 'none' }}>聯絡我們</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
