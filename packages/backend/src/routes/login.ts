import * as express from 'express';
import { Response, Request } from 'express';
import { getUserId, loginUser} from '../controllers/userController';
import {
  loginUserResto, getUserIdResto, getRestoProfileDetails,
  addTwoFactorResto
} from '../controllers/userRestoController';
import { authenticateGoogle } from '../middleware/googleAuthenticate';
import { handleGoogleLogin } from '../controllers/googleLoginController';
import { authenticateFacebook } from '../middleware/facebookAuthenticate';
import { handleFacebookLogin} from '../controllers/facebookLoginController';
import {generateAndSendCode} from '../middleware/twoFactorMiddleware';

const router = express.Router();

router.post('/', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await loginUser(data.username, data.password);

    if (answer !== false) {
      if (answer === 'unverified') {
        return res.status(404)
          .send(answer);
      }
      return res.status(200)
        .send(answer);
    } else {
      return res.status(403)
        .send('Invalid Access');
    }
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.get('/google/callback', authenticateGoogle, handleGoogleLogin);

router.get('/facebook/callback', authenticateFacebook, handleFacebookLogin);

router.get('/checkIn', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const answer = await getUserId(userToken);
    
    if (answer !== false) {
      return res.status(200)
        .send({uID: answer});
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/restoWeb', async function (req: Request, res: Response) {
  try {
    const data = req.body;
    const answer = await loginUserResto(data.username, data.password);

    if (answer === false) {
      return res.send('Invalid Access');
    }
    if (answer.isVerified !== true) {
      return res.send('Unverified email');
    }
    if (answer.twoFactor !== '' && answer.isVerified === true) {
      if (answer.twoFactor === 'false') {
        return res.status(200)
          .send({token: answer.token});
      }
      const userId = await getUserIdResto(answer.token);
      const userInfo = await getRestoProfileDetails(userId as number);
      if (userInfo.preferredLanguage === '' ||
          userInfo.preferredLanguage === null) {
        userInfo.preferredLanguage = 'en';
      }
      await generateAndSendCode(
          userId as number,
          userInfo.email,
          userInfo.username,
          userInfo.preferredLanguage as 'fr' | 'de' | 'en');
      return res.status(200)
        .send({twoFactor: true, userId: userId});
    } else {
      return res.status(200)
        .send({twoFactor: false, token: answer.token});
    }
  } catch (error) {
    return res.send('An error occurred while processing your request');
  }
});

router.get('/restoWeb/checkIn', async function (req: Request, res: Response) {
  try {
    const userToken = String(req.query.key);
    const answer = await getUserIdResto(userToken);
    if (answer !== false) {
      return res.status(200)
        .send({uID: answer});
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    return res.status(500)
      .send('An error occurred while processing your request');
  }
});

router.post('/restoWeb/TwoFactor', 
  async function (req: Request, res: Response) {
    try {
      const data = req.body;
      const userId = data.id;
      const userVerificationCode = data.code;
      const answer = await getRestoProfileDetails(userId);
      if (answer.twoFactor === userVerificationCode) {
        const token = await loginUserResto(data.username, data.password);

        if (token === false) {
          return res.status(400)
            .send('Invalid Access, user not found');
        }
        await addTwoFactorResto(userId, 'true');
        return res.status(200)
          .send(token.token);
      } else {
        return res.status(400)
          .send('Invalid Access, code is incorrect');
      }
    } catch (error) {
      return res.status(500)
        .send('An error occurred while processing your request');
    }
  });
export default router;
