import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  _id: Number,
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: Date,
  base64: String,
});

export interface IImage {
    _id: number;
    filename: string;
    contentType: string;
    size: number;
    uploadDate: Date;
    base64: string;
}

const Image = mongoose.model('Image', imageSchema);
export default Image;
