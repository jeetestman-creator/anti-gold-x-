const { sendMail } = require('./emailService');

const getBaseTemplate = (content, appName = 'Gold X Usdt', year = new Date().getFullYear()) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
    .header { background-color: #1a1a1a; padding: 20px; text-align: center; color: #d4af37; font-size: 24px; font-weight: bold; }
    .content { padding: 30px; color: #333333; line-height: 1.6; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #888888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">${appName}</div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${year} ${appName}. All rights reserved.<br>
      Need help? Contact support.
    </div>
  </div>
</body>
</html>
`;

const sendSignupOTP = async (email, userName, otpCode) => {
  const content = `
    <h2>Hello ${userName},</h2>
    <p>Thank you for registering. To verify your email address and activate your account, please enter the following One-Time Password (OTP):</p>
    <div style="background-color: #f4f4f7; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
      <span style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px; color: #1a1a1a;">${otpCode}</span>
    </div>
    <p><strong>This verification code will expire in 10 minutes.</strong></p>
    <p style="font-size: 12px; color: #666;">If you did not create an account or did not request this verification code, please ignore this message. Your email address will not be used without verification. No further action is required.</p>
    <p style="font-size: 12px; color: #666;"><strong>Do not share this code with anyone.</strong></p>
  `;
  const html = getBaseTemplate(content);
  return await sendMail(email, 'Your Verification Code — Gold X Usdt', html);
};

const sendPasswordReset = async (email, userName, resetLink) => {
  const content = `
    <h2>Hello ${userName},</h2>
    <p>We received a request to reset the password for your account. Please click the button below to continue:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background-color: #d4af37; color: #1a1a1a; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    <p style="font-size: 13px; color: #666; word-break: break-all;">If the button above does not work, copy and paste the following link into your browser:<br>${resetLink}</p>
    <p><strong>This password reset link will expire in 10-15 minutes.</strong></p>
    <p style="font-size: 12px; color: #666;">If you did not request a password reset, please ignore this email. Your password will not be changed. No further action is required.</p>
    <p style="font-size: 12px; color: #666;"><strong>Do not share this link with anyone. Our team will never ask for this link.</strong></p>
  `;
  const html = getBaseTemplate(content);
  return await sendMail(email, 'Reset Your Password — Gold X Usdt', html);
};

module.exports = {
  sendSignupOTP,
  sendPasswordReset,
  getBaseTemplate
};
