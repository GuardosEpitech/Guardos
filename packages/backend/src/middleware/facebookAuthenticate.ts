import axios from 'axios';
import {NextFunction, Request, Response} from 'express';

export async function authenticateFacebook(
  req: Request, res: Response, next: NextFunction) {
  const { code } = req.query;
  const clientId = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
  let url = process.env.allowedVW;
  if (url.endsWith(':')) {
    url = `${process.env.allowedVW}${process.env.PORTVW}`;
  }

  if (!code) {
    return res.redirect(`${url}/login?error=auth_failed`);
  }

  try {
    const tokenResponse = await axios.get(`https://graph.facebook.com/v10.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
    req.accessToken = tokenResponse.data.access_token;
    next();
  } catch (error) {
    let url = process.env.allowedVW;
    if (url.endsWith(':')) {
      url = `${process.env.allowedVW}${process.env.PORTVW}`;
    }
    console.error('Error during Facebook authentication:', error);
    return res.redirect(`${url}/login?error=auth_failed`);
  }
}
