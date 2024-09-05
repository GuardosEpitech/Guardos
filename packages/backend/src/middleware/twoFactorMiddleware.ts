import {addTwoFactorResto} from '../controllers/userRestoController';
import {sendEmail} from '../controllers/emailController';

type Language = 'fr' | 'de' | 'en';

interface Message {
  subject: string;
  message: string;
}

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

export async function generateAndSendCode(
  userID: number,
  email: string,
  name: string,
  language: Language
): Promise<void> {
  const code = generateRandomCode();
  const messages: Record<Language, Message> = {
    fr: {
      subject: 'Code de vérification',
      message: `Votre code de vérification est: ${code}\n\nMerci!`
    },
    de: {
      subject: 'Bestätigungscode',
      message: `Ihr Bestätigungscode lautet: ${code}\n\nDanke!`
    },
    en: {
      subject: 'Verification Code',
      message: `Your verification code is: ${code}\n\nThank you!`
    }
  };
  const { subject, message } = messages[language];
  await sendEmail(subject, name, message, email);
  await addTwoFactorResto(userID, code);
}
