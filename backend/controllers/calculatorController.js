const supabase = require('../config/supabaseClient');
const { getBaseTemplate } = require('../services/emailTemplates');
const { sendMail } = require('../services/emailService');

exports.getRates = async (req, res) => {
  try {
    // According to requirements GET /api/calculator/rates
    const defaultRates = {
      monthlyRoiRate: 5.0, // default override
      referralLevels: [
        { level: 1, rate: 8.0, target: 0, lockStatus: false },
        { level: 2, rate: 4.0, target: 0, lockStatus: false },
        { level: 3, rate: 2.0, target: 0, lockStatus: false },
        { level: 4, rate: 1.0, target: 0, lockStatus: false },
        { level: 5, rate: 0.1, target: 10000, lockStatus: true },
        { level: 6, rate: 0.2, target: 25000, lockStatus: true },
        // ... dynamically pull these from database when populated
      ]
    };
    // Attempt real database fetch if needed here later
    res.status(200).json(defaultRates);
  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch platform rates' });
  }
};

exports.shareResults = async (req, res) => {
  try {
    const { email, message, payload } = req.body;
    if (!email) return res.status(400).json({ error: 'Recipient email is required' });

    let content = `
      <h2>Your Simulator Projection Results</h2>
      ${message ? `<p style="font-style: italic;">"${message}"</p>` : ''}
      <hr />
      <h3>Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;">Net Invested Amount</td><td style="padding: 8px; border: 1px solid #ddd;">${payload.netInvested} USDT</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;">Expected Daily ROI</td><td style="padding: 8px; border: 1px solid #ddd;">${payload.dailyRoi} USDT</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;">Total ROI Expected</td><td style="padding: 8px; border: 1px solid #ddd;">${payload.totalRoi} USDT</td></tr>
      </table>
      <br/>
      <p style="font-size: 11px; color:#999;">* These projections are estimates based on entered values and current commission rates.</p>
    `;

    const html = getBaseTemplate(content);
    await sendMail(email, 'Your App Projection Results', html);

    res.status(200).json({ message: 'Results shared via email successfully.' });
  } catch(err) {
    console.error('Error sharing simulation:', err);
    res.status(500).json({ error: 'Failed to send share email' });
  }
};
