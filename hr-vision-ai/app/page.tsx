'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [quota, setQuota] = useState(5);
  const [currentDay, setCurrentDay] = useState(1);
  const [customKey, setCustomKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '你好！我是你的 HRBP 14天躍升教練。今天 Day 1 的目標是【業務痛點真偽需求拆解】。\n\n請直接告訴我你目前卡關的業務難題（例如：「業務主管業績下滑怪罪招募」或「研發流失率高但主管要求加薪招募」），我們一步步推演出可落地的解決方案。'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const DEFAULT_KEY = "YOUR_FALLBACK_FREE_GEMINI_KEY";

  // 14 天主題規劃
  const dayPlans = [
    "D1 業務假需求拆解", "D2 六盒組織診斷", "D3 動態人才盤點", "D4 九宮格校準會",
    "D5 關鍵崗位繼任", "D6 激勵與績效改進", "D7 OKR 與業務對齊", "D8 跨部門衝突協商",
    "D9 招募漏斗與人效", "D10 核心文化落地", "D11 勞資法規防禦", "D12 主管教練式對話",
    "D13 戰略提案 Deck", "D14 落地執行閉環"
  ];

  // 快捷常見問題標籤
  const quickPrompts = [
    "業務業績落後 30% 卻怪招募不力",
    "研發骨幹離職率高但薪資無法調整",
    "即將召開人才盤點不知如何引導業務",
    "跨部門會議推諉責任缺乏明確 SLA",
    "團隊擴編快但人均產出持續下滑"
  ];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('hr_quota_date');
    const storedKey = localStorage.getItem('hr_custom_api_key') || '';
    const storedDay = parseInt(localStorage.getItem('hr_study_day') || '1', 10);
    
    setCustomKey(storedKey);
    setCurrentDay(storedDay);

    if (storedKey.length > 10) {
      setQuota(9999);
    } else {
      if (storedDate !== today) {
        localStorage.setItem('hr_quota_date', today);
        localStorage.setItem('hr_quota_count', '5');
        setQuota(5);
      } else {
        setQuota(parseInt(localStorage.getItem('hr_quota_count') || '5', 10));
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
    alert('已解鎖無限深度暢聊模式！');
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputMessage;
    if (!textToSend.trim()) return;

    if (quota <= 0) {
      alert('今日 5 次深度引導額度已完成！請明天再次回訪解鎖下一天修煉，或在右上角設定自備 Key 繼續推演。');
      return;
    }

    setInputMessage('');
    const newMessages = [...messages, { role: 'user', text: textToSend.trim() }];
    setMessages(newMessages);

    if (quota < 999) {
      const nextQuota = quota - 1;
      setQuota(nextQuota);
      localStorage.setItem('hr_quota_count', nextQuota.toString());
    }

    setIsLoading(true);
    const activeKey = customKey || DEFAULT_KEY;

    const systemPrompt = `你是一位資深的 HRVP / 首席人才官，目前擔任使用者的「14天 HRBP 實戰躍升教練」（當前為第 ${currentDay} 天：${dayPlans[currentDay - 1]}）。
對話原則：
1. 嚴禁給予生硬公式化模板。
2. 先進行 1-2 個業務關鍵數據追問（如人效比、流失週數、組織瓶頸）。
3. 逐步引導出【短線降火、中線賦能、長線機制】的可簽核落地對策。
4. 當輸出方案時，提示用戶思考沉澱，並鼓勵明日繼續推進。`;

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
        setMessages([...newMessages, { role: 'ai', text: '伺服器忙碌中，若額度已滿可於右上角設定免費自備 Key 繼續。' }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'ai', text: '網路連線異常，請稍後重試。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 頂部極簡導覽列 */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>HR Vision AI</span>
            <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 600 }}>14天實戰伴學</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: quota === 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>
              {quota >= 999 ? '✨ 無限模式' : `今日剩餘：${quota} / 5 次`}
            </span>
            <button 
              onClick={() => setShowKeyModal(!showKeyModal)}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#475569' }}>
              🔑 自備 Key
            </button>
          </div>
        </div>
      </header>

      {/* 主體置中容器 */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        
        {/* 14 天修煉進度膠囊條 */}
        <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>🎯 14 天 HRBP 修煉地圖</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>完成今日對話沉澱，明日解鎖下一關</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {dayPlans.map((plan, index) => {
              const isCurrent = index + 1 === currentDay;
              const isDone = index + 1 < currentDay;
              return (
                <div 
                  key={index} 
                  style={{
                    flex: '0 0 auto', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem',
                    background: isCurrent ? '#2563eb' : isDone ? '#dcfce7' : '#f1f5f9',
                    color: isCurrent ? '#ffffff' : isDone ? '#166534' : '#64748b',
                    fontWeight: isCurrent ? 700 : 500,
                    border: isCurrent ? 'none' : '1px solid #e2e8f0'
                  }}>
                  {plan}
                </div>
              );
            })}
          </div>
        </section>

        {/* 快捷常見業務挑戰標籤 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>快速帶入：</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              style={{
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '0.3rem 0.75rem',
                fontSize: '0.75rem', color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}>
              {prompt}
            </button>
          ))}
        </div>

        {/* 核心連續對話視窗 */}
        <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', height: '540px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
          
          {/* 對話歷史紀錄 */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{
                maxWidth: '85%', padding: '0.85rem 1.1rem', borderRadius: '10px', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#2563eb' : '#ffffff',
                color: m.role === 'user' ? '#ffffff' : '#1e293b',
                border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}>
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ maxWidth: '85%', padding: '0.85rem 1.1rem', borderRadius: '10px', fontSize: '0.9rem', background: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                AI 教練正在解析業務情境並組織提問...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 輸入區塊 */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={quota === 0 ? "今日額度已用完，請明日回訪或輸入自備 Key..." : "描述當前遇到的業務難題或回覆 AI 的追問..."} 
              disabled={quota === 0 && !customKey}
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.925rem' }}
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={isLoading || (quota === 0 && !customKey)}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
              發送
            </button>
          </div>
        </section>

        {/* 明日解鎖與回訪引導卡片 */}
        {quota === 0 && !customKey && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginTop: '1rem', textAlign: 'center' }}>
            <h4 style={{ color: '#1e40af', fontSize: '0.95rem', marginBottom: '0.25rem' }}>🎉 今日修煉思考已完成！</h4>
            <p style={{ color: '#1e3a8a', fontSize: '0.85rem' }}>
              將今天推導的行動方案在實際工作中測試看看。<strong>明天回來將解鎖 Day {currentDay + 1} 模組！</strong>
            </p>
          </div>
        )}

        {/* SEO & AdSense 合規方法論手冊（收斂至下方） */}
        <article style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.75rem' }}>HRBP 14 天段位躍升方法論架構</h2>
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

      {/* BYOK 自備 Key 彈窗 Modal */}
      {showKeyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
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

      {/* 簡潔頁尾 */}
      <footer style={{ borderTop: '1px solid #e2e8f0', marginTop: '3rem', padding: '1.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
        &copy; 2026 HR Vision AI. 專為 HRBP 打造的 14 天對話式實戰修煉室.
      </footer>
    </div>
  );
}
