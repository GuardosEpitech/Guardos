import express from 'express';
import sgMail from '@sendgrid/mail'; 
import { getUserToken } from '../controllers/userController';
import { getUserTokenResto } from '../controllers/userRestoController';

import 'dotenv/config';

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const msg = {
      to: process.env.SUPPORT,
      from: process.env.SMTP_USER,
      subject: `From: ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await sgMail.send(msg);

    res.status(200)
      .json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500)
      .json({ message: 'Failed to send email' });
  }
});

router.post('/userVisitor/sendPasswordRecovery', async (req, res) => {
  try {
    const { email, username } = req.body;

    const timeToken = Date.now();
    let userToken = await getUserToken(email);

    if (userToken === false) {
      res.status(500)
        .json({ message: 'failed to fetch user' });
    }
    userToken = encodeURIComponent(userToken);

    // Construct the recovery link with userToken and timeToken
    const recoveryLink = `${process.env.USER_SITE}/change-password?email=${email}&userToken=${userToken}&timeToken=${timeToken}`;

    const msg = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Guardos User Recovery Link',
      text: `Name: ${username}\nEmail: ${email}\nYour specific password recovery link: \n${recoveryLink}`,
      html: `<p>Name: ${username}</p>
         <p>Email: ${email}</p>
         <p>Your password recovery link: <a href="${recoveryLink}">Reset your Password.</a></p>`,
    };

    await sgMail.send(msg);

    res.status(200)
      .json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500)
      .json({ message: 'Failed to send email' });
  }
});

router.post('/userResto/sendPasswordRecovery', async (req, res) => {
  try {
    const { email, username } = req.body;

    const timeToken = Date.now();
    let userToken = await getUserTokenResto(email);

    if (userToken === false) {
      res.status(500)
        .json({ message: 'failed to fetch user' });
    }
    userToken = encodeURIComponent(userToken);

    // Construct the recovery link with userToken and timeToken
    const recoveryLink = `${process.env.RESTO_SITE}/change-password?email=${email}&userToken=${userToken}&timeToken=${timeToken}`;

    const msg = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Guardos Restaurant User Recovery Link',
      text: `Name: ${username}\nEmail: ${email}\nYour specific password recovery link: \n${recoveryLink}`,
      html: `<p>Name: ${username}</p>
         <p>Email: ${email}</p>
         <p>Your password recovery link: <a href="${recoveryLink}">Reset your Password.</a></p>`,
    };

    await sgMail.send(msg);

    res.status(200)
      .json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500)
      .json({ message: 'Failed to send email' });
  }
});

export default router;
