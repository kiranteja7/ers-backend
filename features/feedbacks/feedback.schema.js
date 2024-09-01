import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    feedbackUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    feedback : {
        type : String
    },
    status : {
        type : String,
        enum : ['Completed', 'Pending']
    },
    time : {
        type : String,
        default : new Date().getDate().toLocaleString()
    }
})

export const feedBackmodel = mongoose.model('feedback', feedbackSchema);