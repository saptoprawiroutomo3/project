const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: `"Inter Medi-A" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Kode Verifikasi OTP - Inter Medi-A',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C62828, #D32F2F); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Inter Medi-A</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Halo ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Terima kasih telah mendaftar di Inter Medi-A. Gunakan kode OTP berikut untuk verifikasi akun Anda:
            </p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #C62828; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Kode ini akan kedaluwarsa dalam 10 menit. Jangan bagikan kode ini kepada siapa pun.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Jika Anda tidak merasa mendaftar, abaikan email ini.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sendOrderConfirmation = async (email, orderData) => {
  try {
    const mailOptions = {
      from: `"Inter Medi-A" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Konfirmasi Pesanan #${orderData.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #C62828, #D32F2F); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Inter Medi-A</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Pesanan Berhasil Dibuat!</h2>
            <p style="color: #666;">Nomor Pesanan: <strong>${orderData.orderNumber}</strong></p>
            <p style="color: #666;">Total: <strong>Rp ${orderData.total.toLocaleString('id-ID')}</strong></p>
            <p style="color: #666;">Status: <strong>Menunggu Pembayaran</strong></p>
            <p style="color: #666; margin-top: 20px;">
              Terima kasih telah berbelanja di Inter Medi-A. Kami akan segera memproses pesanan Anda.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendOrderConfirmation
};
