import jwt from 'jsonwebtoken';

import User from '../models/user';

exports.middleware = (req,res,next) => {
  let token = req.headers['Authorization'] || req.headers['authorization'];
  if(token){
    jwt.verify(token, process.env.JWT_SECRET,async (err, data)=>{
      if(err){
       return res.status(401).send();
      }

      let user = await User.findOne({_id:data._id},{},{lean:true});
      if(user){
        req.user = user;
        next();
      }else{
        res.status(401).send()
      }
    })
  
  }else{
    res.status(401).send()
  }
}