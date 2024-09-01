import { UserRepository } from "./user.repository.js";
import bcrypt from 'bcrypt';
import jwt from'jsonwebtoken'


export class UserController{

    constructor(){
        this.userRepository = new UserRepository();
    }


    async signIn(req, res, next){
       
        try{

          const {email, password} = req.body;

          let data = await this.userRepository.signIn({email, password});

          data = data.message;

          if(data.user){
            const confirmPassword = await bcrypt.compare(password, data.user.password);
            if(confirmPassword){
              const secretCode = process.env.JWT_SEC;
              const token = jwt.sign({userID : data.user._id, email : data.user.email}, secretCode, {
                expiresIn: '1h'
              })

              res.status(200).json({
                status : 'success',
                token : token,
                userDetails : data.user
              })
            }else{
              res.status(400).json({
                status : 'failure',
                message: 'Bad credentials'
              })
            }
          }else{
              res.status(data.status).send(data.message)
          }
        }catch(err){
            next(err);
        }
    }

    async signUp(req, res, next){

        try{

            let {name, email, password, type}  = req.body;

            if(!type){
              type = "Employee"
            }

            password = await bcrypt.hash(password, 12);
    
            const data = await this.userRepository.signUp({name, email, password, type});

            res.status(data.status).send(data.message);

        }catch(err){
             next(err);
        }

    }


    async makeAdmin(req, res, next){
      
        try{
          
            const {userId} = req.params;

            const loggedInUser = req.userID;

            if(!loggedInUser){
              return res.status(400).json({
                status: 'failure',
                message: 'User not Logged In'
              })
            }

            const data = await this.userRepository.makeAdmin(userId, loggedInUser);

            res.status(data.status).send(data.message);
        }catch(err){
            next(err);
        }
    }


    async removeUser(req, res, next){

      try{

        const userID = req.userID;
        const deleteUser = req.params.userId;

        const data = await this.userRepository.removeUser(deleteUser, userID);

        res.status(data.status).send(data.message);

      }catch(err){
        next(err);
      }
    }

    async updateUser(req, res, next){

      try{
        const userID = req.userID;
        const updateUser = req.params.userId;

        const {name, email, password} = req.body;

        const data = await this.userRepository.updateUser(userID, updateUser, {name, email, password});

        res.status(data.status).send(data.message);
      }catch(err){
        next(err);
      }
    }

    async getAllUsers(req, res, next){
       
      try{
        
        const data = await this.userRepository.getAllUsers();
        res.status(data.status).send(data.message);
      }catch(err){
        next(err);
      }

    }
}