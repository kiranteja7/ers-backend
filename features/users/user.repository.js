import { applicationError } from "../../error-handler/applicationError.js";
import { userModel } from "./user.schema.js";
import { ObjectId } from "mongodb";

export class UserRepository{


    async signUp(data){

        try{

         const newUser = new userModel({name: data.name, email : data.email, password: data.password, type: data.type});
         await newUser.save();

         return {status : 200, message : { status : 'success', user : newUser}}

        }catch(err){
          throw err;
        }
    }

    async signIn(data){
      
        try{
            const user = await userModel.findOne({email : data.email});

            if(user){
                return {status : 200 , message : { status : 'success', user }};
            }else{
                return {status : 404, message : { status : 'failure', message : 'User not found'}}
            }

        }catch(err){
           throw new applicationError('Something went wrong :)', 500);
        }
    }

    async makeAdmin(userId, loggedInUser){
       
        try{
           const adminUser = await userModel.findById(new ObjectId(loggedInUser));

           if(adminUser.type !== 'Admin'){
             return {status : 403, message : {status : 'failure', message : 'You are not a admin to make this employee as a admin'}};
           }

            const user = await userModel.findById(new ObjectId(userId));

            if(!user){
                return {status : 404, message: {status : 'failure', message : 'User not found'}}
            }else if(user.type === 'Admin'){
                return {status : 400, message : {status : 'failure', message : "The user is already a admin!"}};
            }

            user.type = 'Admin';

            await user.save();

            return {status : 200, message : { status : 'success', user}};

        }catch(err){
           throw err;
        }
    }

    async removeUser(deleteUser, loggedInUser){
        try{
          
            const loggedUser = await userModel.findById(new ObjectId(loggedInUser));

            if(loggedUser.type !=='Admin'){
              return {status : 403, message: {status: 'failure', message : 'You dont have access to delete this user!'}}
            }

            const user = await userModel.findById(new ObjectId(deleteUser));

            if(!user){
                return {status : 404, message : {status: 'failure', message: 'User not found'}}
            }
            
            await userModel.findByIdAndDelete(new ObjectId(deleteUser));

            return {status : 200, message : {status : 'success', message: 'User deleted successfully!'}};

        }catch(err){
            throw err;
        }
    }

    async updateUser(loggedInUser, updateUser, updateDetails){
        try{
          
            const loggedUser = await userModel.findById(new ObjectId(loggedInUser));

            if(loggedUser.type !=='Admin'){
              return {status : 403, message: {status: 'failure', message : 'You dont have access to delete this user!'}}
            }

            const user = await userModel.findById(new ObjectId(updateUser));

            if(!user){
                return {status : 404, message : {status: 'failure', message: 'User not found'}}
            }

            if(updateDetails.name){
                user.name = updateDetails.name;
            }

            if(updateDetails.email){
                user.email = updateDetails.email;
            }

            if(updateDetails.password){
                user.password = updateDetails.password;
            }

            await user.save();

            return {status : 200, message: {status : 'success', updatedUser : user}};

        }catch(err){
            throw err;
        }
    }

    async getAllUsers(){
        try{
          
            const users = await userModel.find({}).select('-password');

            return {status : 200, message :{status : 'success', users }};
        }catch(err){
            throw err
        }
    }
}