import { Request, Response } from 'express';
import { google } from 'googleapis';
import {addUser, loginUser} from './userController';

export async function handleGoogleLogin(req: Request, res: Response) {
  const oauth2Client = req.oauth2Client;
  try {
    let url = process.env.allowedVW;
    if (url.endsWith(':')) {
      url = `${process.env.allowedVW}${process.env.PORTVW}`;
    }
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    const answer = await loginUser(userInfo.data.email, userInfo.data.id);
    if (answer !== false) {

      const redirectUrl =
          `${url}/login-success?token=${encodeURIComponent(answer)}`;
      return res.redirect(redirectUrl);
    }

    await addUser(userInfo.data.name, userInfo.data.email, userInfo.data.id);
    const loggedIn = await loginUser(userInfo.data.name, userInfo.data.id);
    const redirectUrl =
        `${url}/login-success?token=${encodeURIComponent(loggedIn)}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error handling user data:', error);
    res.status(500)
      .send('Failed to handle user data');
  }
}
