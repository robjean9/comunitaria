import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  description: String,

  zip_code: String,
  street: String,
  number: Number,
  complement: String,
  neighborhood: String,
  city: String,

  type: 
  {
    type: String, 
    enum: [
      'assalto',
      'agressao',
      'covid',
      'perturbacao',
      'homicidio',
      'atividade_suspeita',
      'acidente',
      'desaparecimento',
      'animal_perdido',
    ],
    default:'assalto'
  },
  ocurred_at: Date,
  user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  anonymous: Boolean,

  latitude: Number,
  longitude: Number,

  comments:[{
    text: String,
    _user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now}
  }],

  votes:[{
    _user:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    vote: Boolean
  }],

  hidden:{type:Boolean, default:false}

  
},
{timestamps:false});

const Ocurrence = mongoose.model('Ocurrence', schema, 'ocurrence');

export default Ocurrence;
