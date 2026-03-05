import { google } from 'googleapis';

export async function appendOrderToSheet(order: any) {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!sheetId || !clientEmail || !privateKey) {
    console.warn('Google Sheets credentials missing. Skipping sync.');
    return false;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Format items for the sheet
    const itemsString = order.items.map((i: any) => `${i.name} x${i.quantity}`).join(', ');
    const date = new Date(order.created_at).toLocaleString('vi-VN');

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:D', // Assumes Sheet1 exists
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [order.id, date, itemsString, order.total]
        ],
      },
    });

    return true;
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    return false;
  }
}
