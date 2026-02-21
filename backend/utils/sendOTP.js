import nodemailer from "nodemailer";

const sendOTP = async (email, otp) => {

  // ← Move transporter INSIDE the function so env is already loaded
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Profile Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Registration",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>OTP Verification</h2>
        <p>Use the OTP below to complete your registration:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p style="color: gray;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

export default sendOTP;
