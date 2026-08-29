'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [quota, setQuota] = useState(3);
  const [customKey, setCustomKey] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('mid'); // junior (1-3y), mid (3-6y), senior (6y+)
  const [inputMessage, setInputMessage] = useState('');
  const [sandboxInput, setSandboxInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  // 預約諮詢表單
  const [formData, setFormData] = useState({ name: '', email: '', company: '', challenge: '' });

  // 多輪對話歷史紀錄
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '你好！我是你的 HRBP 14天躍升教練。在對話中，系統將依據您的年資深度（初級/中級/高級）自適應推進，拆解業務偽需求並產出主管可簽核之落地方案。\n\n請在下方沙盒輸入您面臨的具體組織難題，或直接點選標籤開始診斷！'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const DEFAULT_KEY = "YOUR_FALLBACK_FREE_GEMINI_KEY"; // 請替換為您的免費 Gemini API Key

  // 快捷標籤清單
  const quickTags = [
    { icon: '🧭', title: '人才戰略配置規劃' },
    { icon: '🌐', title: '全球員工關係與合規' },
    { icon: '📈', title: '晉升與留才－人才盤點和人才梯隊' },
    { icon: '🌱', title: '組織文化建設' },
    { icon: '📊', title: '自動化招聘 Dashboard' },
    { icon: '📝', title: '合同處理自動化' },
    { icon: '🤝', title: 'HRBP 對業務主管的教練式領導與支持' },
    { icon: '🔄', title: '跨部門高效會議和衝突解決' },
    { icon: '🎯', title: 'OKR 和季獎金設計' }
  ];

  // 14 天修煉模組清單
  const curriculumDays = [
    "D1 業務痛點解構", "D2 六盒組織診斷", "D3 動態人才盤點", "D4 九宮格校準會",
    "D5 關鍵崗位繼任", "D6 激勵與績效改進", "D7 OKR 與業務對齊", "D8 跨部門衝突協商",
    "D9 招募漏斗與人效", "D10 核心文化落地", "D11 勞資法規防禦", "D12 主管教練式對話",
    "D13 戰略提案 Deck", "D14 落地執行閉環"
  ];

  // 配額與本地紀錄初始化（設置為 3 次）
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

  const submitBooking = async () => {
    if (!formData.name || !formData.email) {
      alert('請填寫姓名與公司信箱！');
      return;
    }

    setIsSubmitting(true);

    const emailSubject = encodeURIComponent(`【HR Vision AI 戰略諮詢預約】來自 ${formData.name} (${formData.company || '未填寫公司'})`);
    const emailBody = encodeURIComponent(
      `預約諮詢詳情：\n\n` +
      `姓名：${formData.name}\n` +
      `公司信箱：${formData.email}\n` +
      `公司名稱：${formData.company || '未填寫'}\n\n` +
      `【AI 診斷挑戰與議題】：\n${formData.challenge || '無特別備註'}`
    );

    try {
      const response = await fetch('https://formspree.io/f/mshappyj@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          challenge: formData.challenge,
          _replyto: formData.email,
          _subject: `【HR Vision AI】諮詢預約：${formData.name}`
        })
      });

      if (response.ok) {
        alert(`預約已成功送出！\n\n系統已將通知發送至 MSHAPPYJ@GMAIL.COM，我們將盡快與您聯繫。`);
        setFormData({ name: '', email: '', company: '', challenge: '' });
      } else {
        window.location.href = `mailto:MSHAPPYJ@GMAIL.COM?subject=${emailSubject}&body=${emailBody}`;
      }
    } catch {
      window.location.href = `mailto:MSHAPPYJ@GMAIL.COM?subject=${emailSubject}&body=${emailBody}`;
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Hero 區塊 */}
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
          即時輸入您的組織痛點，AI 戰略顧問將針對人才、合規、文化、招聘自動化等 HR 領域，提供深度剖析與可落地行動方案。
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="#diagnostics" style={{ background: '#2563eb', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            開始 AI 診斷
          </a>
          <a href="#booking" style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#334155', padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            預約戰略諮詢
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
              {quickTags.map((item, idx) => (
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

          {/* AdSense 合規文章庫 */}
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

        {/* 右側側邊欄：預約診斷諮詢表單（修復排版溢出） */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div id="booking" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', position: 'sticky', top: '5.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>預約診斷諮詢</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              留下您的聯絡資訊，我們將依據 AI 診斷結果，為您安排一對一戰略諮詢。
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="姓名" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
                <input 
                  type="email" 
                  placeholder="公司信箱" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
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
                disabled={isSubmitting}
                style={{ width: '100%', background: isSubmitting ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '0.25rem', transition: 'background 0.2s' }}>
                {isSubmitting ? '傳送中...' : '送出預約'}
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
            <a href="#booking" style={{ color: '#64748b', textDecoration: 'none' }}>預約諮詢</a>
            <a href="mailto:MSHAPPYJ@GMAIL.COM" style={{ color: '#64748b', textDecoration: 'none' }}>聯絡我們</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
