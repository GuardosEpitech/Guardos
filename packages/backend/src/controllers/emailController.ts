import sgMail from '@sendgrid/mail'; 
import 'dotenv/config';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail
(subject: string, name: string, request: string, emailAddress: string): Promise<void> {
  try {
    const msg = {
      to: emailAddress,
      from: process.env.SMTP_USER,
      subject: subject,
      text: `Hey: ${name},\n${request}`,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export { sendEmail };
