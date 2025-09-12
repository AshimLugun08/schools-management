import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password
  },
});

export async function sendMail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}
