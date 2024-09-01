import { FeedbackRepository } from "./feedback.repository.js";

export class FeedbackController{

    constructor(){
        this.feedBackRepository = new FeedbackRepository();
    }


    async assignFeedback(req, res, next){
        try{
          
            const {userId, feedbackUser} = req.params;

            const adminUser = req.userID;

            const data = await this.feedBackRepository.assignFeedback(adminUser, userId, feedbackUser);

            res.status(data.status).send(data.message);
        }catch(err){
            next(err);
        }
    }

    async submitFeedback(req, res, next){
        try{
           
            const {feedbackId} = req.params;

            const {feedback} = req.body;

            const loggedInUser = req.userID;

            const data = await this.feedBackRepository.submitFeedback(feedbackId, feedback, loggedInUser);

            res.status(data.status).send(data.message);
        }catch(err){
            next(err);
        }
    }

    async getFeedbacksOfUser(req, res, next){
        try{
           
            const {userId} = req.params;

            const data = await this.feedBackRepository.getFeedbacksOfUser(userId);

            res.status(data.status).send(data.message);
        }catch(err){
            next(err);
        }
    }

    async editFeedback(req, res, next){
        try{
           const {feedbackId} = req.params;

           const adminId = req.userID;

           const {feedback} = req.body;

           const data = await this.feedBackRepository.editFeedback(feedbackId, adminId, feedback);

           res.status(data.status).send(data.message);
        }catch(err){
            next(err);
        }
    }

    async provideFeedbackByAdminToUser(req, res, next){
        try{
          
            const {userId} = req.params;

            const adminId = req.userID;

            const {feedback} = req.body;

            const data = await this.feedBackRepository.provideFeedbackByAdminToUser(userId, adminId, feedback);

            res.status(data.status).send(data.message);
        }catch(err){
            next(err);
        }
    }
}