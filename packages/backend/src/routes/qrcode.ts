import express from 'express';
import { generateQRCode, getQRCodeByName, getQRCodeByNameBase64 } from
  '../controllers/qrcodeController';

const router = express.Router();

router.post('/', generateQRCode);
router.get('/base64/:name', getQRCodeByNameBase64);
router.get('/:name', getQRCodeByName);

export default router;
