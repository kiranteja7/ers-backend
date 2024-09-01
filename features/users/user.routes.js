import express from 'express';
import { UserController } from './user.controller.js';
import {jwtAuth} from '../../middlewares/jwtAuth.middleware.js'

const userRouter = express.Router();

const userController = new UserController();


userRouter.post('/signin', (req, res, next)=> userController.signIn(req, res, next));

userRouter.post('/signup', (req, res, next)=> userController.signUp(req, res, next));

userRouter.get('/:userId/makeAdmin', jwtAuth , (req, res, next)=> userController.makeAdmin(req, res, next));

userRouter.delete(':/userId/delete', jwtAuth, (req,res, next)=> userController.removeUser(req,res, next));

userRouter.post(':/userId/update', jwtAuth, (req, res, next)=> userController.updateUser(req,res, next));

userRouter.get('/all', jwtAuth, (req, res, next)=> userController.getAllUsers(req, res, next));

export default userRouter;