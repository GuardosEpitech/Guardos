import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export async function authenticateFacebook(
  req: Request, res: Response, next: NextFunction) {
  const { code } = req.query;
  const clientId = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!code) {
    return res.status(400)
      .send('No code provided');
  }

  try {
    const tokenResponse = await axios.get(`https://graph.facebook.com/v10.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
    const accessToken = tokenResponse.data.access_token;
    req.accessToken = accessToken;
    next();
  } catch (error) {
    console.error('Error during Facebook authentication:', error);
    res.status(500)
      .send('Facebook authentication failed');
  }
}
