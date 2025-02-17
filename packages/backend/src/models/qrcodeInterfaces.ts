import mongoose, { Schema, Document } from 'mongoose';

export interface IQR extends Document {
  uid: string;
  qrCodeImage: Buffer;
}

const QRSchema: Schema = new Schema({
  uid: { type: String, required: true },
  qrCodeImage: { type: Buffer, required: true }
});

export default mongoose.model<IQR>('QR', QRSchema);
