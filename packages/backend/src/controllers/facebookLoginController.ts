import axios from 'axios';
import { Request, Response } from 'express';
import {addUser, loginUser} from './userController';

export async function handleFacebookLogin(req: Request, res: Response) {
  const accessToken = req.accessToken;
  if (!accessToken) {
    return res.status(500)
      .send('Access Token is missing');
  }

  try {
    const userInfo = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    const { email, id, name } = userInfo.data;
    const userLogin = await loginUser(email, id);

    let redirectUrl = process.env.allowedVW;
    if (redirectUrl.endsWith(':')) {
      redirectUrl = `${process.env.allowedVW}${process.env.PORTVW}`;
    }

    if (userLogin) {
      redirectUrl += `/login-success?token=${encodeURIComponent(userLogin)}`;
      return res.redirect(redirectUrl);
    }

    await addUser(name, email, id);
    const loggedIn = await loginUser(name, id);
    redirectUrl += `/login-success?token=${encodeURIComponent(loggedIn)}`;
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('Facebook user data error:', error);
    res.status(500)
      .send('Failed to handle Facebook user data');
  }
}
