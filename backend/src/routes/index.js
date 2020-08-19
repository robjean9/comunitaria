import express from 'express';

const router = express.Router()

// const version = procce


router.get('/', (req,res)=>{
  res.send(process.env)
})

export default router;