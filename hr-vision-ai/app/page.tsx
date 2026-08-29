// 1. 在 Home 組件內替換 submitBooking 函數
const [isSubmitting, setIsSubmitting] = useState(false);

const submitBooking = async () => {
  if (!formData.name || !formData.email) {
    alert('請填寫姓名與公司信箱！');
    return;
  }

  setIsSubmitting(true);

  // 整理發送內容
  const emailSubject = encodeURIComponent(`【HR Vision AI 戰略諮詢預約】來自 ${formData.name} (${formData.company || '未填寫公司'})`);
  const emailBody = encodeURIComponent(
    `預約諮詢詳情：\n\n` +
    `姓名：${formData.name}\n` +
    `公司信箱：${formData.email}\n` +
    `公司名稱：${formData.company || '未填寫'}\n\n` +
    `【AI 診斷挑戰與議題】：\n${formData.challenge || '無特別備註'}`
  );

  try {
    // 透過 Formspree 免費轉發 API 發送至指定 Email
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
      alert(`預約已成功送出！\n\n系統已將資料通知發送至顧問信箱 (MSHAPPYJ@GMAIL.COM)，我們將盡快與您聯繫。`);
      setFormData({ name: '', email: '', company: '', challenge: '' });
    } else {
      // 若第三方 API 阻擋，自動觸發使用者本地 Email 軟體發信
      window.location.href = `mailto:MSHAPPYJ@GMAIL.COM?subject=${emailSubject}&body=${emailBody}`;
    }
  } catch (error) {
    // 備援：直接叫起使用者郵件客戶端
    window.location.href = `mailto:MSHAPPYJ@GMAIL.COM?subject=${emailSubject}&body=${emailBody}`;
  } finally {
    setIsSubmitting(false);
  }
};
