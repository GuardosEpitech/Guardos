import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  _id: Number,
  filename: String,
  contentType: String,
  size: Number,
  uploadDate: Date,
  base64: String,
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
