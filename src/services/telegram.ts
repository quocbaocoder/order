import https from 'https';

export async function sendOrderToTelegram(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram credentials missing. Skipping sync.');
    return false;
  }

  const itemsList = order.items
    .map((item: any) => `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString('vi-VN')}đ)`)
    .join('\n');

  const total = order.total.toLocaleString('vi-VN');
  const date = new Date(order.created_at).toLocaleString('vi-VN');

  const message = `
🔔 *ĐƠN HÀNG MỚI #${order.id}*
📅 Thời gian: ${date}

*Chi tiết món:*
${itemsList}

💰 *Tổng cộng: ${total}đ*
  `.trim();

  const data = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        console.error(`Telegram API Error: Status Code ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.error('Telegram Network Error:', error);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}
