import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
  },
  password: { type: String, required: true },
  location: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  occupation: { type: String, trim: true, default: '' }
});

export default mongoose.model('User', userSchema);
