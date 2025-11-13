import express from 'express';
import Bug from '../models/Bug.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateBug = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('status')
    .isIn(['open', 'in-progress', 'resolved'])
    .withMessage('Invalid status'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('reporter')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Reporter name must be at least 2 characters')
];

// Get all bugs
router.get('/', async (req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: bugs,
      count: bugs.length
    });
  } catch (error) {
    next(error);
  }
});

// Get single bug
router.get('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    next(error);
  }
});

// Create new bug
router.post('/', validateBug, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bug = new Bug(req.body);
    await bug.save();
    
    res.status(201).json({
      success: true,
      data: bug,
      message: 'Bug reported successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update bug
router.put('/:id', validateBug, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    res.json({
      success: true,
      data: bug,
      message: 'Bug updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete bug
router.delete('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    res.json({
      success: true,
      message: 'Bug deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;