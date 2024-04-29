import { OAuth2Client } from 'google-auth-library';

declare module 'express-serve-static-core' {
  interface Request {
    oauth2Client?: OAuth2Client;
    accessToken?: string;
  }
}
