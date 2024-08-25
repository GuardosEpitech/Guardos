import {sendEmail} from "../controllers/emailController";
import {addTwoFactorResto} from "../controllers/userRestoController";

function generateRandomCode(): string {
  const length = 8;
  const characters
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export async function generateAndSendCode
(userID: number, email: string, name: string): Promise<void> {
  const code = generateRandomCode();
  const subject = 'Your Verification Code';
  const message = `Your verification code is: ${code}\n\nThank you!`;

  await sendEmail(subject, name, message, email);
  await addTwoFactorResto(userID, code);
}
