import nodemailer from "nodemailer";

export const sendOTPEmail = async (userEmail, otpCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Task.ly Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Task.ly Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>Task.ly Authentication</h2>
          <p>Your One-Time Password (OTP) to log in is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 5px;">${otpCode}</h1>
          <p>This code will expire in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};
