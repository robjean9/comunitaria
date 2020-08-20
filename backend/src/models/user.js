import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,

  zip_code: String,
  latitude: Number,
  longitude: Number,

  city: String,
  neighborhood: String,
  street: String,
  number: Number,
  complement: String,
  phone: String,
  role: {type: String, enum: ['user','admin'], default:'user'}
  
});

const User = mongoose.model('User', schema, 'user');

export default User;
