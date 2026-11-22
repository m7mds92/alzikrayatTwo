import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
  dateTime: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);
