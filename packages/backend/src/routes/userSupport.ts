import express from 'express';
import sgMail from '@sendgrid/mail'; // Import SendGrid correctly
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

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;

    const headers =
      toBoolean(data.isPremium) ? { 'X-Priority': '1 (Highest)' } : {};

    const msg = {
      to: process.env.SUPPORT,
      from: process.env.SMTP_USER,
      subject: toBoolean(data.isPremium)
        ? `[IMPORTANT] ${data.subject}` : data.subject,
      text: `Name: ${data.name}\nRequest: ${data.request}`,
      headers: headers,
    };

    await sgMail.send(msg);

    res.status(200)
      .send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500)
      .send('Error sending email');
  }
});
  
export default router;
