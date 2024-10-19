import express from 'express';
import * as nodemailer from 'nodemailer';
import { Response, Request } from 'express';
import { ClientCredentials } from 'simple-oauth2';
import 'dotenv/config';

const { SMTP_USER, CLIENT_ID, CLIENT_SECRET, TENANT_ID } = process.env;

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

const oauth2Config = {
  client: {
    id: CLIENT_ID as string,
    secret: CLIENT_SECRET as string,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    tokenPath: `/${TENANT_ID}/oauth2/v2.0/token`, // Microsoft OAuth2 token endpoint
  },
};

// Create an OAuth2 client for client credentials flow
const oauth2Client = new ClientCredentials(oauth2Config);

// Function to get an access token using the client credentials flow
async function getAccessToken(): Promise<string> {
  const tokenConfig = {
    scope: 'https://outlook.office365.com/.default',  // Correct scope for SMTP
  };

  try {
    // Get the access token
    const accessTokenResponse = await oauth2Client.getToken(tokenConfig);
    return accessTokenResponse.token.access_token as string;
  } catch (error) {
    console.error('Error fetching access token:', error.message);
    throw new Error('Failed to obtain access token');
  }
}

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;

    const accessToken = await getAccessToken();

    const smtpConfig = {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: SMTP_USER,           // Email account from which the emails are sent
        accessToken: accessToken,  // Access token from OAuth2
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