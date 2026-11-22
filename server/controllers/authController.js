import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User from '../models/User.js';

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  occupation: Joi.string().allow('').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const publicUser = (user) => {
  const value = user.toObject ? user.toObject() : { ...user };
  delete value.password;
  return value;
};

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation failed', details: error.details.map((item) => item.message) });
    const exists = await User.findOne({ email: value.email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already exists' });
    const password = await bcrypt.hash(value.password, 12);
    const user = await User.create({ ...value, email: value.email.toLowerCase(), password });
    res.status(201).json(publicUser(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const user = await User.findOne({ email: value.email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const matches = await bcrypt.compare(value.password, user.password);
    if (!matches) return res.status(401).json({ message: 'Invalid email or password' });
    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
};
