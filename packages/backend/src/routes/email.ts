// email.ts

import express from 'express';
import * as nodemailer from 'nodemailer';

import 'dotenv/config';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Replace these values with your Outlook SMTP server information
    const smtpConfig = {
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // false for STARTTLS, true for TLS
      auth: {
        user: process.env.SMTP_USER,  // Your Outlook email address
        pass: process.env.SMTP_PASS,           // Your Outlook email password or app password
      },
    } as nodemailer.TransportOptions;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Define the email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `From: ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a success response to the client
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;
