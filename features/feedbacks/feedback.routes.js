
import express from 'express';
import { FeedbackController } from './feedback.controller.js';


const feedbackRouter = express.Router();

const feedbackController = new FeedbackController();

feedbackRouter.get('/:userId/feedback/:feedbackUser/assign', (req, res, next) =>feedbackController.assignFeedback(req, res, next));

feedbackRouter.post('/:feedbackId/feedback/submit', (req, res, next)=> feedbackController.submitFeedback(req, res, next));

feedbackRouter.get('/:userId/feedbacks', (req, res, next)=> feedbackController.getFeedbacksOfUser(req, res, next));

feedbackRouter.post('/:feedbackId/feedback/edit', (req, res, next)=> feedbackController.editFeedback(req, res, next));

feedbackRouter.post('/:userId/:adminId/feedback/submit', (req, res, next)=> feedbackController.provideFeedbackByAdminToUser(req, res, next));

export default feedbackRouter;