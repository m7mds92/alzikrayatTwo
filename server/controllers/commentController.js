import Joi from 'joi';
import Comment from '../models/Comment.js';
import Photo from '../models/Photo.js';

const commentSchema = Joi.object({
  comment: Joi.string().trim().max(1000).required()
});

export const create = async (req, res, next) => {
  try {
    const { error, value } = commentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    const comment = await Comment.create({
      photoId: photo._id,
      userId: req.user._id,
      comment: value.comment
    });
    await comment.populate('userId', 'firstName lastName');
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};
