// Backend: handleGoogleLogin Funktion
import { Request, Response } from 'express';
import { google } from 'googleapis';
import {addUser, loginUser, updateUserVerificationStatusVisitor} from './userController';

export async function handleGoogleLogin(req: Request, res: Response) {
  const oauth2Client = req.oauth2Client;
  try {
    let url = process.env.allowedVW;
    if (url.endsWith(':')) {
      url = `${process.env.allowedVW}${process.env.PORTVW}`;
    }

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    let answer = await loginUser(userInfo.data.email, userInfo.data.id);
    if (answer === 'unverified') {
      await updateUserVerificationStatusVisitor(userInfo.data.email);
    }
    answer =  await loginUser(userInfo.data.email, userInfo.data.id);
    if (answer !== false) {
      const redirectUrl =
          `${url}/login-success?token=${encodeURIComponent(answer)}&user=${encodeURIComponent(JSON.stringify(userInfo.data))}`;
      return res.redirect(redirectUrl);
    }

    await addUser(userInfo.data.name, userInfo.data.email, userInfo.data.id);
    const loggedIn = await loginUser(userInfo.data.email, userInfo.data.id);

    const redirectUrl = `${url}/login-success?token=${encodeURIComponent(loggedIn)}&user=${encodeURIComponent(JSON.stringify(userInfo.data))}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    let url = process.env.allowedVW;
    if (url.endsWith(':')) {
      url = `${process.env.allowedVW}${process.env.PORTVW}`;
    }
    console.error('Error handling user data:', error);
    res.redirect(`${url}/login?error=auth_failed`);
  }
}
