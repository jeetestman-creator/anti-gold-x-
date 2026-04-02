const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  requireTLS: true,
  socketTimeout: 30000,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Re-initialize capability for admin smtp updates
const reinitializeTransporter = (host, port, user, pass) => {
  if (transporter) transporter.close();
  transporter = nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: parseInt(port) === 465,
    requireTLS: true,
    socketTimeout: 30000,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    auth: { user, pass },
  });
};

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Gold X Usdt" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
  reinitializeTransporter,
};
