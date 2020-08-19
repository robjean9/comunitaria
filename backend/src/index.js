require('dotenv/config');
import db from './db';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';

const app = express();


const allowLookAuthorizationHeader = (req,res,next) =>{
  res.header('Access-Control-Expose-Headers','Authorization');
  next();
}


const bootstrapExpress = () =>{

  const port = process.env.PORT || 3000;
  app.use(bodyParser.json())
  app.use(cors())
  app.use(bodyParser.urlencoded({extended:true}))
  app.use(allowLookAuthorizationHeader)
  app.use('/',routes)
  app.set('trust proxy', true)
  app.disable('x-powered-by')

  return app.listen(port, ()=>console.log(`App Running on Port ${port}`))
}




db.connect().then(bootstrapExpress).catch(exp=>console.log(exp))