import express from 'express';
import * as nodemailer from 'nodemailer';
import { Response, Request } from 'express';
import 'dotenv/config';

const router = express.Router();

function toBoolean(value: string | boolean): boolean {
  if (typeof value === 'boolean') {
      return value;
  }
  
  if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true') {
          return true;
      } else if (lowerValue === 'false') {
          return false;
      } else {
          throw new Error('Invalid boolean string');
      }
  }
  throw new Error('Invalid input type');
}

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
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

    const headers = toBoolean(data.isPremium) ? { 'X-Priority': '1 (Highest)' } : {};
  
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: toBoolean(data.isPremium) ? `[IMPORTANT] ${data.subject}` : data.subject,
      text: `Name: ${data.name}\nRequest: ${data.request}`,
      headers: headers,
    };
  
    await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    }
  });
  
export default router;