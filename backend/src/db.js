import mongoose from 'mongoose';

mongoose.Promise = Promise;

const connect = () => mongoose.connect(process.env.DB_URI, { dbName: 'solidaria', useNewUrlParser:true, useFindAndModify:false, useUnifiedTopology:true,  useCreateIndex: true });

export default {  
  connect
}
  