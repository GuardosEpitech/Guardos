import * as express from 'express';
import { Response, Request } from 'express';
import { 
  addUser, 
  updateUserVerificationStatusVisitor, 
  checkIfEmailExistsVisitor 
} from '../controllers/userController';
import { 
  addUserResto, 
  updateUserVerificationStatusResto, 
  checkIfEmailExistsResto 
} from '../controllers/userRestoController';
import sgMail from '@sendgrid/mail'; 
import jwt from 'jsonwebtoken';

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

router.post('/', async function (req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    
    const errArray = await addUser(username, email, password);
    if (errArray.includes(true)) {
      return res.status(200).send(errArray);
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const msg = {
      to: email,
      from: process.env.SMTP_USER,
      subject: 'Email Verification',
      html: `<p>Welcome to our service! Please click the following link to verify your email:</p>
             <a href="${process.env.USER_SITE}/verify-email?token=${token}">Verify Email</a>`,
    };

    await sgMail.send(msg);

    return res.status(200).send(errArray);
  } catch (error) {
    return res.status(500).send('An error occurred while processing your request');
  }
});

router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as { email: string };

    await updateUserVerificationStatusVisitor(decoded.email);

    return res.status(200).send('Email successfully verified!');
  } catch (error) {
    return res.status(400).send('Invalid or expired token');
  }
});

router.post('/resend-verification', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const validUser = await checkIfEmailExistsVisitor(email);
    
    if (!validUser) {
      return res.status(404).send('User not found');
    }

    const token = jwt.sign({ email: validUser }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const msg = {
      to: validUser,
      from: process.env.SMTP_USER,
      subject: 'Resend Email Verification',
      html: `<p>Please click the following link to verify your email:</p>
             <a href="${process.env.USER_SITE}/verify-email?token=${token}">Verify Email</a>`,
    };

    await sgMail.send(msg);

    return res.status(200).send('Verification link resent. Please check your email.');
  } catch (error) {
    console.error('Error resending verification link:', error);
    return res.status(500).send('An error occurred while resending the verification link.');
  }
});


router.post('/restoWeb', async function (req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const errArray =
        await addUserResto(username, email, password);
    if (errArray.includes(true)) {
      return res.status(200).send(errArray);
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const msg = {
      to: email,
      from: process.env.SMTP_USER,
      subject: 'Email Verification',
      html: `<p>Welcome to our service! Please click the following link to verify your email:</p>
            <a href="${process.env.RESTO_SITE}/verify-email?token=${token}">Verify Email</a>`,
    };
    
    await sgMail.send(msg);
    console.log('send mail');
    return res.status(200)
      .send(errArray);
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/restoWeb/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as { email: string };

    await updateUserVerificationStatusResto(decoded.email);

    return res.status(200).send('Email successfully verified!');
  } catch (error) {
    return res.status(400).send('Invalid or expired token');
  }
});

router.post('/restoWeb/resend-verification', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const validUser = await checkIfEmailExistsResto(email);

    if (!validUser) {
      return res.status(404).send('User not found');
    }

    const token = jwt.sign({ email: validUser }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const msg = {
      to: validUser as string,
      from: process.env.SMTP_USER,
      subject: 'Resend Email Verification',
      html: `<p>Please click the following link to verify your email:</p>
             <a href="${process.env.RESTO_SITE}/verify-email?token=${token}">Verify Email</a>`,
    };

    await sgMail.send(msg);

    return res.status(200).send('Verification link resent. Please check your email.');
  } catch (error) {
    console.error('Error resending verification link:', error);
    return res.status(500).send('An error occurred while resending the verification link.');
  }
});

export default router;

