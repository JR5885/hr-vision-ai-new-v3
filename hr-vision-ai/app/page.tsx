'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [currentTier, setCurrentTier] = useState('junior');
  const [currentTierPrompt, setCurrentTierPrompt] = useState('初級 ➔ 中級 (1-3年)：建立業務體感，跳脫被動接單與事務性泥淖');
  const [quota, setQuota] = useState(3);
  const [customKey, setCustomKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '你好！我是你的 HRBP 實戰躍升教練。在 14 天的修煉中，我們不給死板模板，而是透過多輪引導幫你產出主管可簽核的落地方案。\n\n請告訴我你目前面臨的具體業務難題：例如「業務主管業績下滑卻怪罪招募不力」、「研發主管想提拔技術骨幹但對方缺乏領導意願」或「季度人才盤點不知道如何引導業務開口」？'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const DEFAULT_KEY = "YOUR_FALLBACK_FREE_GEMINI_KEY"; // 可填入你的免費 Gemini Key

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (quota <= 0) {
      alert('今日 3 次免費額度已用完！請於右側輸入個人免費 Gemini API Key 解鎖無限模式，或明日再次造訪。');
      return;
    }

    const userText = inputMessage.trim();
    setInputMessage('');
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);

    if (quota < 999) {
      const nextQuota = quota - 1;
      setQuota(nextQuota);
      localStorage.setItem('hr_quota_count', nextQuota.toString());
    }

    setIsLoading(true);
    const activeKey = customKey || DEFAULT_KEY;

    const systemPrompt = `你是一位資深的 HRVP / 首席人才官，目前擔任使用者的「14天 HRBP 實戰躍升教練」。
當前使用者設定的段位目標為：【${currentTierPrompt}】。
請遵守以下對話規範：
1. 嚴禁直接給予通篇死板的公版模板。
2. 採用「蘇格拉底式提問法」：針對使用者的情境，先指出其盲點，並提出 1-2 個關鍵追問以釐清數據。
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
            <a href="#frameworks" style={{ textDecoration: 'none', color: '#64748b' }}>方法論手冊</a>
            <a href="#about" style={{ textDecoration: 'none', color: '#64748b' }}>關於我們</a>
          </nav>
        </div>
      </header>

      {/* 頂部廣告位 */}
      <div style={{ maxWidth: '1200px', margin: '1rem auto 0', padding: '0 1rem' }}>
        <div style={{ background: '#e2e8f0', height: '90px', border: '1px dashed #94a3b8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
          Google AdSense 廣告展示區位（標準橫幅）
        </div>
      </div>

      {/* 核心雙欄佈局 */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        
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

          {/* 段位設定 */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.75rem' }}>設定您的當前目標（AI 將自適應深度）</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <button 
                onClick={() => { setCurrentTier('junior'); setCurrentTierPrompt('初級 ➔ 中級 (1-3年)：建立業務體感，跳脫被動接單與事務性泥淖'); }}
                style={{ padding: '0.75rem', textAlign: 'left', border: currentTier === 'junior' ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0', background: currentTier === 'junior' ? '#eff6ff' : '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>初級 ➔ 中級 (1–3年)</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>跳脫事務泥淖，建立業務同理心</span>
              </button>
              <button 
                onClick={() => { setCurrentTier('mid'); setCurrentTierPrompt('中級 ➔ 高級 (3-6年)：運用六盒模型/7S組織診斷，產出業務主管可簽核之閉環方案'); }}
                style={{ padding: '0.75rem', textAlign: 'left', border: currentTier === 'mid' ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0', background: currentTier === 'mid' ? '#eff6ff' : '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>中級 ➔ 高級 (3–6年)</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>組織診斷、動態人才盤點實戰</span>
              </button>
              <button 
                onClick={() => { setCurrentTier('senior'); setCurrentTierPrompt('高級 ➔ 戰略夥伴 (6年以上)：戰略解碼、組織變革管理與人效指標重構'); }}
                style={{ padding: '0.75rem', textAlign: 'left', border: currentTier === 'senior' ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0', background: currentTier === 'senior' ? '#eff6ff' : '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>高級 ➔ 戰略夥伴 (6年以上)</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>架構重塑、人效閉環管理</span>
              </button>
            </div>
          </div>

          {/* 連續對話視窗 */}
          <div id="simulator" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', height: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                onClick={handleSendMessage}
                disabled={isLoading}
                style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                發送推進
              </button>
            </div>
          </div>

          {/* AdSense 合規長文 */}
          <article id="frameworks" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '1rem' }}>HRBP 14 天段位躍升自我修煉方法論體系</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>許多人資轉型為 HRBP 後容易陷入事務性泥淖。本平台基於 Dave Ulrich 戰略人資模型與敏捷組織診斷法，協助學員在 14 天內完成思維升維。</p>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '1rem 0 0.5rem' }}>一、初級到中級：跳脫被動接單，建立業務同理心</h3>
            <p style={{ fontSize: '0.9rem' }}>學會看懂 P&L 損益表與人效指標，在承接業務主管需求時進行 3 層 Why 的深度剖析。</p>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '1rem 0 0.5rem' }}>二、中級到高級：六盒模型組織診斷與動態人才盤點</h3>
            <p style={{ fontSize: '0.9rem' }}>跳脫印象評分，將人才梯隊與未來 12 個月組織目標緊密對齊。</p>
          </article>
        </main>

        {/* 右側側邊欄 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#e2e8f0', height: '250px', border: '1px dashed #94a3b8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            Google AdSense 側邊矩形廣告位
          </div>
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
          </div>
          <div id="about" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.5rem' }}>關於 HR Vision AI</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
              專注於將管理諮詢方法論轉化為對話式伴學體驗，讓每位人資夥伴都能自主完成高品質的策略方案輸出。
            </p>
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
