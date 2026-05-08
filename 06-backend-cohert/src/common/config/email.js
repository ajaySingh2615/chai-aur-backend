import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

try {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: "alice@example.com",
    subject: "Test Email",
    text: "This is a test email.",
    html: "<p>This is a test email.</p>",
  });
} catch (error) {
  console.error("Error sending email:", error);
}
