import { userModel } from "../users/user.schema.js";
import { ObjectId } from "mongodb";
import { feedBackmodel } from "./feedback.schema.js";


export class FeedbackRepository{

    async assignFeedback(adminUser, employeeUser, feedbackUser){

        try{
       
        const checkAdmin = await userModel.findById(new ObjectId(adminUser));

        if(checkAdmin.type !== 'Admin'){
            return {status : 403, message : {status: 'failure', message : `You don't have access to assign feedback`}};
        }
        
        //EMPLOYEE USER SHOULD BE FEEDBACK GIVER 
        //FEEDBACK USER SHOULD BE FEEDBACK RECIEVER
        //ADMIN USER WILL DECIDE THEM BOTH
        const feedback = new feedBackmodel({admin : adminUser, user : employeeUser, feedbackUser: feedbackUser, status : 'Pending'});

        await feedback.save();

        return {status : 200, message : {status : 'success', details : feedback}};

      }catch(err){
        throw err;
      }
    }

    async submitFeedback(feedbackId, feedback, loggedInUser){
        try{
            const checkEmployee = await feedBackmodel.findById(new ObjectId(feedbackId));

            if(!checkEmployee){
                return { status : 404, message : {status : 'failure', message : 'There are no requests for you to submit feedback'}};
            }

            const validSubmitUser = await feedBackmodel.findOne({_id : new ObjectId(feedbackId), user: loggedInUser});

            if(!validSubmitUser){
                return {status : 403, message : {status : 'failure', message : 'You dont have access to submit feedback to this user!'}};
            }

            checkEmployee.feedback = feedback;

            checkEmployee.status = "Completed";

            await checkEmployee.save();

            return {status : 200, message : {status : 'success', details : checkEmployee}};
        }catch(err){
          throw err;
        }
    }

    async getFeedbacksOfUser(user){

        try{       
            const feedbacks = await feedBackmodel.find({feedbackUser : new ObjectId(user)});

            if(!feedbacks){
                return {status : 404, message : {status : 'failure', message : 'Feedbacks not found for this user'}};
            }else{
                return {status : 200, message : {status : 'success', feedbacks}};
            }
        }catch(err){
            throw err;
        }
    }

    async editFeedback(feedbackId, adminId, feedback){
        try{

         const checkAdmin = await userModel.findById(new ObjectId(adminId));

        if(checkAdmin.type !== 'Admin'){
            return {status : 403, message : {status: 'failure', message : `You don't have access to edit feedback, because you are not a admin!`}};
        }

          const getFeedback = await feedBackmodel.findById(new ObjectId(feedbackId));

          getFeedback.feedback = feedback;

          await getFeedback.save();

          return {status : 200, message : {status : 'success', feedback : getFeedback}};
        }catch(err){
           throw err;
        }
    }

    async provideFeedbackByAdminToUser(employeeUser, adminUser, feedback){
        try{
          
         const checkAdmin = await userModel.findById(new ObjectId(adminUser));

        if(checkAdmin.type !== 'Admin'){
            return {status : 403, message : {status: 'failure', message : `You don't have access to provide feedback, because you are not a admin!`}};
        }

        const newFeedback = new feedBackmodel({admin: adminUser, user: adminUser, feedbackUser: employeeUser, feedback: feedback, status: 'Completed'});

        await newFeedback.save();

        return {status : 200, message : {status: 'success', feedback : newFeedback}};
        }catch(err){
          throw err;
        }
    }
}