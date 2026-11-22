import fs from 'fs/promises';
import path from 'path';
import Joi from 'joi';
import Photo from '../models/Photo.js';
import Comment from '../models/Comment.js';

const photoSchema = Joi.object({
  title: Joi.string().trim().max(120).required(),
  description: Joi.string().allow('').max(2000).optional()
});

export const getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find().populate('userId', 'firstName lastName').sort({ dateTime: -1 });
    res.json(photos);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    const comments = await Comment.find({ photoId: photo._id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 });
    res.json({ photo, comments });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { error, value } = photoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    if (!req.file) return res.status(400).json({ message: 'Photo file is required' });
    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title: value.title,
      description: value.description || ''
    });
    await photo.populate('userId', 'firstName lastName');
    res.status(201).json(photo);
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own photos' });
    }
    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();
    await fs.unlink(path.join(process.cwd(), 'uploads', photo.fileName)).catch(() => {});
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
