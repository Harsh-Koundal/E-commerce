import express from 'express'
import { support, feedback } from '../controllers/support-feedback.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const SupportFeedbackrouter = express.Router();

SupportFeedbackrouter.post('/contact',authMiddleware, support);
SupportFeedbackrouter.post('/submit',authMiddleware, feedback);

export default SupportFeedbackrouter;