import axios from 'axios';
import { Request, Response } from 'express';
import {
  addUser,
  loginUser,
  updateUserVerificationStatusVisitor
} from './userController';

export async function handleFacebookLogin(req: Request, res: Response) {
  try {
    let redirectUrl = process.env.allowedVW;
    if (redirectUrl.endsWith(':')) {
      redirectUrl = `${process.env.allowedVW}${process.env.PORTVW}`;
    }
    const accessToken = req.accessToken;
    if (!accessToken) {
      res.redirect(`${redirectUrl}/login?error=auth_failed`);
    }
    const userInfo = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    const { email, id, name } = userInfo.data;
    let userLogin = await loginUser(email, id);

    if (userLogin === 'unverified') {
      await updateUserVerificationStatusVisitor(email);
    }

    userLogin = await loginUser(email, id);
    if (userLogin) {
      redirectUrl += `/login-success?token=${encodeURIComponent(userLogin)}`;
      return res.redirect(redirectUrl);
    }

    await addUser(name, email, id);
    const loggedIn = await loginUser(name, id);
    redirectUrl += `/login-success?token=${encodeURIComponent(loggedIn)}`;
    return res.redirect(redirectUrl);

  } catch (error) {
    let url = process.env.allowedVW;
    if (url.endsWith(':')) {
      url = `${process.env.allowedVW}${process.env.PORTVW}`;
    }
    console.error('Facebook user data error:', error);
    res.redirect(`${url}/login?error=auth_failed`);
  }
}
