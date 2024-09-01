import "./env.js";

import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { connectToMongoose } from "./config/mongooseConfig.js";
import mongoose from "mongoose";
import { applicationError } from "./error-handler/applicationError.js";
import userRouter from "./features/users/user.routes.js";
import feedbackRouter from "./features/feedbacks/feedback.routes.js";
import { jwtAuth } from "./middlewares/jwtAuth.middleware.js";

const app = express();


app.use(bodyParser.json());

app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use('/api/users', userRouter);

app.use('/api', jwtAuth, feedbackRouter);

app.use('/', (req, res)=>{
    res.status(200).send('Welcome to ERS');
});

//HANDLING 404 ERRORS
app.use((req,res)=>{
    res.status(400).send('Resource not found!');
})

app.use((err, req, res, next)=>{

    if(err instanceof mongoose.Error.ValidationError){
       return  res.status(400).json({
        statusCode: 400,
        message: err.message
       })
    }

    if(err instanceof applicationError){
        return res.status(err.code).json({
            statusCode: err.code,
            message: err.message
           });
    }
   console.log(err);
    res.status(500).send('SOMETHING WENT WRONG :) PLEASE TRY AFTER SOME TIME!');
})

app.listen('3000', ()=>{
    console.log('APP IS LISTENING TO 3000');
    connectToMongoose();
});