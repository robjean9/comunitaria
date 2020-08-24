import express from 'express';
import userRoutes from './user';
import UserController from '../controllers/userController';
import middleware from '../middlewares/middleware';

const router = express.Router()

// const version = procce


router.get('/', (req,res)=>{
  res.send({})
})

router.use('/user',userRoutes);

router.post('/login', (req,res)=>{
  new UserController().auth(req,res)
})
router.get('/me', middleware.middleware, (req,res)=>  new UserController().me(req,res));
router.get('/forgotPassword', (req,res)=>  new UserController().forgotPassword(req,res));

export default router;