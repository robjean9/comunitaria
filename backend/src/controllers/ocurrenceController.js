import Ocurrence from './../models/ocurrence'


class OcurrenceController{


  async post(req,res) {
    req.body.user_id = req.user._id;
    req.body.ocurred_at = new Date(req.body.ocurred_at);
    Ocurrence.create(req.body)
    .then(data=>{
      res.send(data)
    })
    .catch(err=>{
      res.status(400).send(err);
    })
  }

  async get(req,res) {
    Ocurrence.find({},{__v:0},{lean:true})
    .sort({created_at:-1})
    .populate('user_id', {name:1, _id:1},'User')
    .then(async data=>{

      data = await data.map(item=>{
        if(item.anonymous){
          delete item.user_id;
        }else{
          item.user_name = item.user_id.name;
          item.user_id = item.user_id._id;
        }
        return item;
      })
      res.send(data);
    })
    .catch(err=> res.status(400).send(err))
  }

}

export default OcurrenceController