import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';

export async function authenticateGoogle(req: Request, res: Response,
  next: NextFunction) {
  const { code } = req.query;
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Client ID or Client Secret is not set.');
    return res.status(500)
      .send('Server configuration error.');
  }

  try {
    const oauth2Client =
        new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    if (typeof code === 'string') {
      const { tokens } = await oauth2Client.getToken(code);
      if (!tokens) {
        console.error('No tokens received.');
        return res.status(500)
          .send('Failed to retrieve tokens');
      }
      oauth2Client.setCredentials(tokens);
      req.oauth2Client = oauth2Client;
      next();
    } else {
      console.error('Code is not a string.');
      return res.status(400)
        .send('Invalid request: No code provided');
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500)
      .send('Authentication failed');
  }
}
