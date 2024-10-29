import { Request, Response } from 'express';
import qrcode from 'qrcode';
import QR from '../models/qrcodeInterfaces';

export const generateQRCode = async (req: Request, res: Response) => {
  try {
    const { uid, url } = req.body;

    if (!uid || !url) {
      return res.status(400)
        .json({ message: 'Uid and URL are required' });
    }

    // Generate QR code from URL
    const qrData = url;
    const qrImageBuffer = await qrcode.toBuffer(qrData);

    // Save QR code image to MongoDB
    const qr = new QR({
      uid: uid,
      qrCodeImage: qrImageBuffer
    });
    await qr.save();

    res.status(201)
      .json({ message: 'QR code generated and saved successfully' });
  } catch (error) {
    console.error('Error generating and saving QR code:', error);
    res.status(500)
      .json({ message: 'Internal server error' });
  }
};

export const getQRCodeByNameBase64 = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400)
        .json({ message: 'Uid is required' });
    }
    // Find QR code by uid
    let qr = await QR.findOne({ uid });

    if (!qr) {
      qr = await QR.findOne({ uid: 1} );
    }
    // eslint-disable-next-line max-len
    res.send(`<img src="data:image/png;base64,${qr.qrCodeImage.toString('base64')}" alt="${qr.uid}" />`);
  } catch (error) {
    console.error('Error retrieving QR code:', error);
    res.status(500)
      .json({ message: 'Internal server error' });
  }
};

export const getQRCodeByName = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400)
        .json({ message: 'Uid is required' });
    }
    // Find QR code by uid
    let qr = await QR.findOne({ uid });

    if (!qr) {
      qr = await QR.findOne({ uid: 1} );
    }
    // eslint-disable-next-line max-len
    res.send(qr);
  } catch (error) {
    console.error('Error retrieving QR code:', error);
    res.status(500)
      .json({ message: 'Internal server error' });
  }
};
