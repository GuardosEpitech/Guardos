import * as nodemailer from 'nodemailer';

async function sendEmail
(subject: string, name: string, request: string, emailAddress: string): Promise<void> {
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
    to: emailAddress,
    subject: subject,
    text: `Dear: ${name},\n${request}`,
  };

  await transporter.sendMail(mailOptions);
}

export { sendEmail };
