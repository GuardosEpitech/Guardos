import express from 'express';
import * as nodemailer from 'nodemailer';
import { Response, Request } from 'express';
import 'dotenv/config';

const router = express.Router();

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body
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
      from: data.name,
      to: 'guardos-help@outlook.com',
      subject: data.subject,
      text: `Name: ${data.name}\nRequest:${data.request}`,
    };
  
    await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    }
  });
  
export default router;