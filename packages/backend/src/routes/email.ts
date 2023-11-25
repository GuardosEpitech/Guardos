// email.ts

import express from 'express';
import * as nodemailer from 'nodemailer';

import 'dotenv/config';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const smtpConfig = {
      host: 'smtp.office365.com',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS,
      },
    } as nodemailer.TransportOptions;

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `From: ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;
